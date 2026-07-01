import { NextRequest, NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type NewsletterSubscription = {
  email: string;
  source: string;
  updates: boolean;
  timestamp: string;
  delivery: "webhook" | "local";
};

type WebhookDelivery = {
  ok: boolean;
  status: number;
  endpoint: string;
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
    let webhookDelivery: WebhookDelivery | undefined;

    const webhookUrl =
      process.env.NEWSLETTER_WEBHOOK_URL ??
      process.env.WEBHOOK_URL ??
      process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK_URL;

    if (webhookUrl) {
      const webhookSecret = process.env.NEWSLETTER_WEBHOOK_SECRET;
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookSecret ? { "X-QTPhone-Webhook-Secret": webhookSecret } : {})
        },
        body: JSON.stringify(subscription)
      });
      webhookDelivery = {
        ok: response.ok,
        status: response.status,
        endpoint: sanitizeWebhookEndpoint(webhookUrl)
      };

      if (!response.ok) {
        return NextResponse.json(
          {
            ok: false,
            delivery: "webhook",
            webhook: webhookDelivery,
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
      webhook: webhookDelivery,
      stored: subscriptions.length
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid newsletter payload." },
      { status: 400 }
    );
  }
}

function sanitizeWebhookEndpoint(webhookUrl: string) {
  try {
    const url = new URL(webhookUrl);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "configured";
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    stored: subscriptions.length,
    recent: subscriptions.slice(-10).reverse()
  });
}
