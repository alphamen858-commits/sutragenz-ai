import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
  }
  if (!openai) {
    return NextResponse.json({ error: "Image generation isn't configured yet (missing OPENAI_API_KEY)." }, { status: 503 });
  }

  const rl = await checkRateLimit(session.user.id, session.user.plan ?? "FREE");
  if (!rl.success) {
    return NextResponse.json({ error: "Hourly AI limit reached. Try again later or upgrade." }, { status: 429 });
  }

  const result = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    size: "1024x1024",
    n: 1,
  });

  await prisma.user.update({ where: { id: session.user.id }, data: { xp: { increment: 5 } } });

  return NextResponse.json({ url: result.data[0]?.url });
}
