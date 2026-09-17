import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Creates a Stripe Checkout session for the Pro plan.
// For Razorpay, swap this for razorpay.orders.create() and handle the
// payment confirmation client-side with Razorpay Checkout.js.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!stripe) return NextResponse.json({ error: "Billing isn't configured yet." }, { status: 503 });

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email ?? undefined,
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID ?? "", quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    metadata: { userId: session.user.id },
  });

  return NextResponse.json({ url: checkout.url });
}
