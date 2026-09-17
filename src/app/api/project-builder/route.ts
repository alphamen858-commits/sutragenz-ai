import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { canAccessFeature } from "@/lib/plan-access";
import { runChat } from "@/lib/ai/router";

const SYSTEM_PROMPT = `You are a code generator that outputs complete, working React projects.
Respond with ONLY a JSON object (no markdown fences, no commentary) shaped exactly like:

{
  "title": "short project name",
  "files": {
    "/App.js": "...",
    "/styles.css": "..."
  }
}

Rules:
- "/App.js" is required and must have a default export.
- Use only React + plain CSS — no external UI libraries, no imports that aren't "react".
- Write complete, runnable code for every file — no "// rest of component" placeholders.
- Keep it to 1-4 files. Make it visually reasonable with inline styles or the CSS file.`;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const plan = session.user.plan ?? "FREE";
  if (!canAccessFeature(plan, "project-builder")) {
    return NextResponse.json({ error: "AI Project Builder needs the Premium plan. Upgrade to unlock it." }, { status: 403 });
  }

  const { idea } = await req.json();
  if (!idea) return NextResponse.json({ error: "Describe your project idea." }, { status: 400 });

  const rl = await checkRateLimit(session.user.id, plan);
  if (!rl.success) {
    return NextResponse.json({ error: "Hourly AI limit reached. Try again later or upgrade." }, { status: 429 });
  }

  let raw: string;
  try {
    raw = await runChat({
      provider: "anthropic",
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Build: ${idea}` }],
    });
  } catch (err) {
    console.error("PROJECT BUILDER ERROR:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? `Generation failed: ${err.message}` : "Generation failed." },
      { status: 502 }
    );
  }

  let parsed: { title?: string; files?: Record<string, string> };
  try {
    parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return NextResponse.json(
      { error: "The AI's response wasn't valid project JSON — try rephrasing your idea." },
      { status: 502 }
    );
  }

  if (!parsed.files || !parsed.files["/App.js"]) {
    return NextResponse.json({ error: "Generated project was incomplete — try again." }, { status: 502 });
  }

  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      title: (parsed.title ?? idea).slice(0, 80),
      description: idea,
      techStack: "React (AI-generated)",
      filesJson: JSON.stringify(parsed.files),
    },
  });

  await prisma.usageEvent.create({ data: { userId: session.user.id, feature: "project-builder" } });
  await prisma.user.update({ where: { id: session.user.id }, data: { xp: { increment: 10 } } });

  return NextResponse.json({ project: { ...project, files: parsed.files } });
}
