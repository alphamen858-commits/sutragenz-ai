import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { canAccessFeature } from "@/lib/plan-access";
import { runChat } from "@/lib/ai/router";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const notes = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ notes });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const plan = session.user.plan ?? "FREE";
  if (!canAccessFeature(plan, "notes-gen")) {
    return NextResponse.json({ error: "Notes Generator needs the Pro plan. Upgrade to unlock it." }, { status: 403 });
  }

  const { topic } = await req.json();
  if (!topic || typeof topic !== "string") {
    return NextResponse.json({ error: "A topic is required." }, { status: 400 });
  }

  const rl = await checkRateLimit(session.user.id, plan);
  if (!rl.success) {
    return NextResponse.json({ error: "Hourly AI limit reached. Try again later or upgrade." }, { status: 429 });
  }

  let content: string;
  try {
    content = await runChat({
      provider: "anthropic",
      system:
        "You write clean, well-structured study notes in markdown: headings, bullet points, bolded key terms, and a short summary at the end. No filler.",
      messages: [{ role: "user", content: `Write study notes on: ${topic}` }],
    });
  } catch (err) {
    console.error("NOTES ERROR:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? `Note generation failed: ${err.message}` : "Note generation failed." },
      { status: 502 }
    );
  }

  const note = await prisma.note.create({
    data: { userId: session.user.id, title: topic.slice(0, 80), content },
  });

  await prisma.usageEvent.create({ data: { userId: session.user.id, feature: "notes-gen" } });
  await prisma.user.update({ where: { id: session.user.id }, data: { xp: { increment: 5 } } });

  return NextResponse.json({ note });
}
