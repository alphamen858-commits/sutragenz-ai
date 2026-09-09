import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { createVideoTask } from "@/lib/video/runway";

// Kicks off an async video generation task and returns its id immediately.
// The client polls GET /api/video-gen/[id] until it's done — video
// generation routinely takes 30s-a few minutes, too long for one request.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

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

  // Video generation is expensive — hold it to the same per-plan limiter as
  // everything else rather than giving it its own, more generous budget.
  const rl = await checkRateLimit(session.user.id, session.user.plan ?? "FREE");
  if (!rl.success) {
    return NextResponse.json({ error: "Hourly AI limit reached. Try again later or upgrade." }, { status: 429 });
  }

  try {
    const taskId = await createVideoTask(prompt);
    return NextResponse.json({ taskId });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Video generation failed to start." },
      { status: 502 }
    );
  }
}
