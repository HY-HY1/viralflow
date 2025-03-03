import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the customer ID from Stripe
    const customers = await stripe.customers.list({
      email: session.user.email,
    });

    if (!customers.data.length) {
      return new NextResponse("No customer found", { status: 404 });
    }

    const customer = customers.data[0];

    // Create a portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${DOMAIN}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("[CUSTOMER_PORTAL]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 