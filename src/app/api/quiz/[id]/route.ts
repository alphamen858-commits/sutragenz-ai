import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Submit a score for a completed quiz attempt.
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { score } = await req.json();
  const quiz = await prisma.quiz.update({
    where: { id: params.id, userId: session.user.id },
    data: { score },
  });

  await prisma.user.update({ where: { id: session.user.id }, data: { xp: { increment: 10 } } });

  return NextResponse.json({ quiz });
}
