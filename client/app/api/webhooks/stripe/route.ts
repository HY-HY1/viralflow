import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { MongooseConnect } from "@/lib/dbConnect";
import User from "@/models/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("[STRIPE_WEBHOOK]", error);
      return new NextResponse("Webhook signature verification failed", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
      case "checkout.session.completed":
        await MongooseConnect();
        await User.findOneAndUpdate(
          { _id: session.metadata?.userId },
          { role: "premium" }
        );
        break;

      case "customer.subscription.deleted":
        await MongooseConnect();
        await User.findOneAndUpdate(
          { _id: session.metadata?.userId },
          { role: "free" }
        );
        break;

      case "customer.subscription.updated":
        const subscription = event.data.object as Stripe.Subscription;
        await MongooseConnect();
        await User.findOneAndUpdate(
          { _id: session.metadata?.userId },
          { role: subscription.status === "active" ? "premium" : "free" }
        );
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[STRIPE_WEBHOOK]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 