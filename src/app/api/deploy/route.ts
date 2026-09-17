import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deployToVercel } from "@/lib/deploy/vercel";

// Deploys using the signed-in user's OWN Vercel token (never a shared
// platform-wide one) — set per-user in Settings, stored... for now this
// reads a single env var since there's no per-user secrets table yet.
// See README for the honest limitation this implies.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  if (!process.env.VERCEL_API_TOKEN) {
    return NextResponse.json(
      { error: "Deployment isn't configured yet — add your own VERCEL_API_TOKEN to enable this." },
      { status: 503 }
    );
  }

  const { projectId } = await req.json();
  if (!projectId) return NextResponse.json({ error: "projectId is required." }, { status: 400 });

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: session.user.id } });
  if (!project?.filesJson) {
    return NextResponse.json({ error: "Project not found or has no generated files." }, { status: 404 });
  }

  try {
    const files = JSON.parse(project.filesJson);
    const slug = project.title.toLowerCase().replace(/[^a-z0-9-]+/g, "-").slice(0, 50) || "sutragenz-project";
    const deployment = await deployToVercel(files, slug, process.env.VERCEL_API_TOKEN);
    return NextResponse.json(deployment);
  } catch (err) {
    console.error("DEPLOY ERROR:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Deployment failed." },
      { status: 502 }
    );
  }
}
