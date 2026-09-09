import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { runChat } from "@/lib/ai/router";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const quizzes = await prisma.quiz.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ quizzes });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { topic, count = 5 } = await req.json();
  if (!topic || typeof topic !== "string") {
    return NextResponse.json({ error: "A topic is required." }, { status: 400 });
  }

  const rl = await checkRateLimit(session.user.id, session.user.plan ?? "FREE");
  if (!rl.success) {
    return NextResponse.json({ error: "Hourly AI limit reached. Try again later or upgrade." }, { status: 429 });
  }

  const raw = await runChat({
    provider: "openai",
    system:
      "You generate multiple-choice quizzes. Respond ONLY with valid JSON — an array of objects shaped like " +
      '{"question": string, "options": string[4], "answer": number (index 0-3), "explanation": string}. ' +
      "No markdown fences, no preamble.",
    messages: [{ role: "user", content: `Create a ${count}-question quiz on: ${topic}` }],
  });

  let questions;
  try {
    questions = JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return NextResponse.json({ error: "Couldn't generate a valid quiz — try again." }, { status: 502 });
  }

  const quiz = await prisma.quiz.create({
    data: {
      userId: session.user.id,
      title: topic.slice(0, 80),
      questions: JSON.stringify(questions),
      totalMarks: questions.length,
    },
  });

  await prisma.user.update({ where: { id: session.user.id }, data: { xp: { increment: 5 } } });

  return NextResponse.json({ quiz: { ...quiz, questions } });
}
