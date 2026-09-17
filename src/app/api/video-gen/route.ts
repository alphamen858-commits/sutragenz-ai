import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { canAccessFeature } from "@/lib/plan-access";
import { createVideoTask } from "@/lib/video/runway";

// Kicks off an async video generation task and returns its id immediately.
// The client polls GET /api/video-gen/[id] until it's done — video
// generation routinely takes 30s-a few minutes, too long for one request.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const plan = session.user.plan ?? "FREE";
  if (!canAccessFeature(plan, "video-gen")) {
    return NextResponse.json(
      { error: "Video Generator needs the Premium plan. Upgrade to unlock it." },
      { status: 403 }
    );
  }

  if (!process.env.RUNWAY_API_KEY) {
    return NextResponse.json(
      { error: "Video generation isn't configured yet (missing RUNWAY_API_KEY)." },
      { status: 503 }
    );
  }

  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
  }

  const rl = await checkRateLimit(session.user.id, plan);
  if (!rl.success) {
    return NextResponse.json({ error: "Hourly AI limit reached. Try again later or upgrade." }, { status: 429 });
  }

  try {
    const taskId = await createVideoTask(prompt);
    await prisma.usageEvent.create({ data: { userId: session.user.id, feature: "video-gen", provider: "runway" } });
    return NextResponse.json({ taskId });
  } catch (err) {
    console.error("VIDEO GEN ERROR:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Video generation failed to start." },
      { status: 502 }
    );
  }
}
