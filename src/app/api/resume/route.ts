import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { canAccessFeature } from "@/lib/plan-access";
import { runChat } from "@/lib/ai/router";

// Resumes are stored as Notes (title-prefixed "Resume — ...") since the
// schema doesn't define a dedicated Resume table.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const resumes = await prisma.note.findMany({
    where: { userId: session.user.id, title: { startsWith: "Resume — " } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ resumes });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const plan = session.user.plan ?? "FREE";
  if (!canAccessFeature(plan, "resume-builder")) {
    return NextResponse.json({ error: "Resume Builder needs the Pro plan. Upgrade to unlock it." }, { status: 403 });
  }

  const { role, experience } = await req.json();
  if (!role || !experience) {
    return NextResponse.json({ error: "Target role and experience details are required." }, { status: 400 });
  }

  const rl = await checkRateLimit(session.user.id, plan);
  if (!rl.success) {
    return NextResponse.json({ error: "Hourly AI limit reached. Try again later or upgrade." }, { status: 429 });
  }

  let content: string;
  try {
    content = await runChat({
      provider: "openai",
      system:
        "You write ATS-friendly resumes in clean markdown, then add a '## Feedback' section with specific, section-by-section improvement notes.",
      messages: [
        {
          role: "user",
          content: `Target role: ${role}\n\nExperience / background:\n${experience}\n\nWrite the resume, then feedback.`,
        },
      ],
    });
  } catch (err) {
    console.error("RESUME ERROR:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? `Resume generation failed: ${err.message}` : "Resume generation failed." },
      { status: 502 }
    );
  }

  const resume = await prisma.note.create({
    data: { userId: session.user.id, title: `Resume — ${role}`.slice(0, 80), content },
  });

  await prisma.usageEvent.create({ data: { userId: session.user.id, feature: "resume-builder" } });
  await prisma.user.update({ where: { id: session.user.id }, data: { xp: { increment: 8 } } });

  return NextResponse.json({ resume });
}
