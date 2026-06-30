import { NextRequest, NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const subscriptions: Array<{ email: string; source: string; timestamp: string }> = [];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; source?: string };
    const email = body.email?.trim().toLowerCase() ?? "";

    if (!emailPattern.test(email)) {
      return NextResponse.json({ ok: false, message: "Invalid email address." }, { status: 422 });
    }

    const subscription = {
      email,
      source: body.source ?? "smartphone-landing-page",
      timestamp: new Date().toISOString()
    };
    subscriptions.push(subscription);

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
          { ok: false, message: "Webhook rejected the newsletter submission." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ ok: true, stored: subscriptions.length });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid newsletter payload." },
      { status: 400 }
    );
  }
}
