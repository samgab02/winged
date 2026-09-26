import { NextResponse } from "next/server";

/**
 * Stripe Checkout for Date Pass / Wing payouts.
 * Requires STRIPE_SECRET_KEY. Without it, returns 503 with exact env needed.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Set STRIPE_SECRET_KEY (and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) for Checkout + Connect.",
        missingEnv: [
          "STRIPE_SECRET_KEY",
          "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        ],
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    amountIls?: number;
    label?: string;
  };
  const amount = Math.max(10, Math.round((body.amountIls ?? 50) * 100));
  const origin = new URL(request.url).origin;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${origin}/wing/me/earnings?paid=1`);
  params.set("cancel_url", `${origin}/wing/me/earnings?cancelled=1`);
  params.set("line_items[0][price_data][currency]", "ils");
  params.set(
    "line_items[0][price_data][product_data][name]",
    body.label || "Winged Date Pass"
  );
  params.set("line_items[0][price_data][unit_amount]", String(amount));
  params.set("line_items[0][quantity]", "1");

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = (await res.json()) as { id?: string; url?: string; error?: { message: string } };
  if (!res.ok || !data.url) {
    return NextResponse.json(
      { error: data.error?.message || "Stripe Checkout failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ url: data.url, id: data.id });
}
