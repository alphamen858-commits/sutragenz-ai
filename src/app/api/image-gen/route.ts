import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { canAccessFeature } from "@/lib/plan-access";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const plan = session.user.plan ?? "FREE";
  if (!canAccessFeature(plan, "image-gen")) {
    return NextResponse.json(
      { error: "Image Generator needs the Pro plan. Upgrade to unlock it." },
      { status: 403 }
    );
  }

  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
  }
  if (!openai) {
    return NextResponse.json({ error: "Image generation isn't configured yet (missing OPENAI_API_KEY)." }, { status: 503 });
  }

  const rl = await checkRateLimit(session.user.id, plan);
  if (!rl.success) {
    return NextResponse.json({ error: "Hourly AI limit reached. Try again later or upgrade." }, { status: 429 });
  }

  let result;
  try {
    // DALL-E 3 was removed from OpenAI's API on May 12, 2026 — using the
    // cheapest current model (GPT Image 1 Mini) by default to keep this
    // affordable for a student project. Swap to "gpt-image-1.5" or
    // "gpt-image-2" for noticeably better quality at higher per-image cost.
    result = await openai.images.generate({
      model: "gpt-image-1-mini",
      prompt,
      size: "1024x1024",
      quality: "low",
      n: 1,
    });
  } catch (err) {
    console.error("IMAGE GEN ERROR:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? `Image generation failed: ${err.message}` : "Image generation failed." },
      { status: 502 }
    );
  }

  await prisma.usageEvent.create({ data: { userId: session.user.id, feature: "image-gen", provider: "openai" } });
  await prisma.user.update({ where: { id: session.user.id }, data: { xp: { increment: 5 } } });

  // GPT Image models always return base64 data, never a hosted URL
  // (that's a DALL-E-2/3-only behavior that no longer applies) — convert
  // it to a data URL so the frontend can display it exactly the same way.
  const b64 = result.data[0]?.b64_json;
  if (!b64) {
    return NextResponse.json({ error: "Image generation returned no image data." }, { status: 502 });
  }

  return NextResponse.json({ url: `data:image/png;base64,${b64}` });
}
