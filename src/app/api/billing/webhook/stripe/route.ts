import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe isn't configured." }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const userId = checkoutSession.metadata?.userId;
    if (userId) {
      await prisma.user.update({ where: { id: userId }, data: { plan: "PRO" } });
      await prisma.subscription.create({
        data: {
          userId,
          provider: "stripe",
          plan: "PRO",
          active: true,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    // This simplified schema doesn't store the Stripe customer/subscription
    // ID on Subscription, so cancellation can't be matched back to a row
    // yet. Add a providerCustomerId field to Subscription to wire this up.
    const userId = (event.data.object as Stripe.Subscription).metadata?.userId;
    if (userId) {
      await prisma.subscription.updateMany({ where: { userId, provider: "stripe" }, data: { active: false } });
      await prisma.user.update({ where: { id: userId }, data: { plan: "FREE" } });
    }
  }

  return NextResponse.json({ received: true });
}
