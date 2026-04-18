import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const OnrampSessionResource = Stripe.StripeResource.extend({
  create: Stripe.StripeResource.method({
    method: "POST",
    path: "crypto/onramp_sessions",
  }),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  const stripeKey = process.env.STRIPE_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Onramp is not configured" },
      { status: 503 },
    );
  }

  const stripe = new Stripe(stripeKey);

  const { transaction_details } = await req.json();

  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  // x-forwarded-for can contain a comma-separated list of IPs.
  // The first one is the original client IP.
  const ip = forwardedFor?.split(",")[0] ?? realIp ?? "127.0.0.1";

  // Create an OnrampSession with the order amount and currency
  const session = new OnrampSessionResource(stripe) as any;
  const onrampSession = await session.create({
    transaction_details: {
      destination_currency: "sol",
      destination_network: "solana",
      wallet_address: transaction_details["wallet_address"],
    },
    customer_ip_address: ip,
  });

  return NextResponse.json({
    clientSecret: onrampSession.client_secret,
  });
}
