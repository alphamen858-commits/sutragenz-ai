import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { runChat } from "@/lib/ai/router";

// Study plans are stored as Notes (title-prefixed "Study Plan — ...").
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { subjects, examDate } = await req.json();
  if (!subjects || !examDate) {
    return NextResponse.json({ error: "Subjects and an exam date are required." }, { status: 400 });
  }

  const rl = await checkRateLimit(session.user.id, session.user.plan ?? "FREE");
  if (!rl.success) {
    return NextResponse.json({ error: "Hourly AI limit reached. Try again later or upgrade." }, { status: 429 });
  }

  const content = await runChat({
    provider: "openai",
    system:
      "You build realistic day-by-day study plans in markdown, grouped by week, with lighter days near the exam for review rather than new material.",
    messages: [
      { role: "user", content: `Subjects: ${subjects}\nExam date: ${examDate}\nToday: ${new Date().toDateString()}` },
    ],
  });

  const plan = await prisma.note.create({
    data: { userId: session.user.id, title: `Study Plan — ${subjects}`.slice(0, 80), content },
  });

  await prisma.user.update({ where: { id: session.user.id }, data: { xp: { increment: 8 } } });

  return NextResponse.json({ plan });
}
