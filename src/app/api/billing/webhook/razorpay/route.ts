import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: "Razorpay isn't configured." }, { status: 503 });

  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "subscription.activated") {
    const userId = event.payload.subscription.entity.notes?.userId;
    if (userId) {
      await prisma.user.update({ where: { id: userId }, data: { plan: "PRO" } });
      await prisma.subscription.create({
        data: { userId, provider: "razorpay", plan: "PRO", active: true },
      });
    }
  }

  return NextResponse.json({ received: true });
}
