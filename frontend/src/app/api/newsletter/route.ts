import { NextRequest, NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type NewsletterSubscription = {
  email: string;
  source: string;
  updates: boolean;
  timestamp: string;
  delivery: "webhook" | "local";
};

const subscriptions: NewsletterSubscription[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; source?: string; updates?: boolean };
    const email = body.email?.trim().toLowerCase() ?? "";
    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 80)
        : "smartphone-landing-page";
    const updates = typeof body.updates === "boolean" ? body.updates : true;

    if (!emailPattern.test(email)) {
      return NextResponse.json({ ok: false, message: "Invalid email address." }, { status: 422 });
    }

    const subscription: NewsletterSubscription = {
      email,
      source,
      updates,
      timestamp: new Date().toISOString(),
      delivery: "local"
    };

    const webhookUrl =
      process.env.NEWSLETTER_WEBHOOK_URL ?? process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK_URL;

    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        return NextResponse.json(
          {
            ok: false,
            delivery: "webhook",
            message: "Webhook rejected the newsletter submission."
          },
          { status: 502 }
        );
      }

      subscription.delivery = "webhook";
    }

    subscriptions.push(subscription);

    if (subscriptions.length > 100) {
      subscriptions.splice(0, subscriptions.length - 100);
    }

    return NextResponse.json({
      ok: true,
      delivery: subscription.delivery,
      stored: subscriptions.length
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid newsletter payload." },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    stored: subscriptions.length,
    recent: subscriptions.slice(-10).reverse()
  });
}
