import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chatMessageSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { canAccessFeature, requiredPlanFor } from "@/lib/plan-access";
import { runChat, FEATURE_PROVIDER, FEATURE_SYSTEM_PROMPTS } from "@/lib/ai/router";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { feature, chatId, message } = parsed.data;

  const plan = session.user.plan ?? "FREE";
  if (!canAccessFeature(plan, feature)) {
    return NextResponse.json(
      { error: `This tool needs the ${requiredPlanFor(feature)} plan. Upgrade to unlock it.` },
      { status: 403 }
    );
  }

  const rl = await checkRateLimit(session.user.id, plan);
  if (!rl.success) {
    return NextResponse.json(
      { error: "You've hit your hourly AI request limit. Upgrade to Pro for a higher limit." },
      { status: 429 }
    );
  }

  // Find or create the chat thread
  const chat = chatId
    ? await prisma.chat.findFirst({ where: { id: chatId, userId: session.user.id } })
    : await prisma.chat.create({
        data: { userId: session.user.id, title: message.slice(0, 60) },
      });

  if (!chat) {
    return NextResponse.json({ error: "Chat not found." }, { status: 404 });
  }

  await prisma.message.create({
    data: { chatId: chat.id, role: "user", content: message },
  });

  const history = await prisma.message.findMany({
    where: { chatId: chat.id },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const provider = FEATURE_PROVIDER[feature] ?? "openai";
  const system = FEATURE_SYSTEM_PROMPTS[feature] ?? "You are a helpful assistant for Sutragenz.ai.";

  let reply: string;
  try {
    reply = await runChat({
      provider,
      system,
      messages: history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    });
  } catch (err) {
    // Always log the real reason — this is what shows up in your
    // terminal (the "next-server" tab) when an AI call fails.
    console.error("CHAT ERROR:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? `The AI service failed: ${err.message}`
            : "The AI service is unavailable right now. Please try again shortly.",
      },
      { status: 502 }
    );
  }

  await prisma.message.create({
    data: { chatId: chat.id, role: "assistant", content: reply },
  });

  // Usage tracking — feeds the admin usage dashboard and, later, any
  // per-user credit limits beyond the hourly rate limit above.
  await prisma.usageEvent.create({
    data: { userId: session.user.id, feature, provider },
  });

  // Gamification: small XP for every completed exchange + daily streak bump
  const today = new Date().toDateString();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const lastActive = user?.updatedAt ? new Date(user.updatedAt).toDateString() : null;
  const streakInc = lastActive !== today ? 1 : 0;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { xp: { increment: 5 }, streak: { increment: streakInc } },
  });

  return NextResponse.json({ chatId: chat.id, reply });
}
