import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { runChat } from "@/lib/ai/router";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { idea } = await req.json();
  if (!idea) return NextResponse.json({ error: "Describe your project idea." }, { status: 400 });

  const rl = await checkRateLimit(session.user.id, session.user.plan ?? "FREE");
  if (!rl.success) {
    return NextResponse.json({ error: "Hourly AI limit reached. Try again later or upgrade." }, { status: 429 });
  }

  const content = await runChat({
    provider: "anthropic",
    system:
      "You scaffold beginner-friendly starter projects. Respond with: a suggested tech stack (1-2 lines), a file list, and starter code for the most important file, in markdown.",
    messages: [{ role: "user", content: `Project idea: ${idea}` }],
  });

  const project = await prisma.project.create({
    data: { userId: session.user.id, title: idea.slice(0, 80), description: content, techStack: "AI-scaffolded" },
  });

  await prisma.user.update({ where: { id: session.user.id }, data: { xp: { increment: 10 } } });

  return NextResponse.json({ project });
}
