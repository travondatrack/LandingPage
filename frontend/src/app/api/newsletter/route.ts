import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_NEWSLETTER_WEBHOOK_URL =
  "https://webhook.site/85604a13-d533-4852-9e7b-9bcc8379661e";

const NewsletterSchema = z.object({
  email: z.string().email().max(120),
  source: z.string().max(80).optional(),
  updates: z.boolean().optional()
});

type NewsletterSubscription = {
  email: string;
  source: string;
  updates: boolean;
  timestamp: string;
  delivery: "telegram" | "webhook" | "local";
};

type WebhookDelivery = {
  ok: boolean;
  status: number | null;
  endpoint: string;
  error?: string;
};

type TelegramDelivery = {
  ok: boolean;
  status: number | null;
  endpoint: string;
  chatId?: string | number;
  error?: string;
};

const subscriptions: NewsletterSubscription[] = [];

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    const parseResult = NewsletterSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          validated: false,
          message: "Invalid subscription data structure.",
          errors: parseResult.error.flatten()
        },
        { status: 422 }
      );
    }

    const body = parseResult.data;
    const email = body.email.trim().toLowerCase();
    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().replace(/[^\w .:-]/g, "").slice(0, 80)
        : "smartphone-landing-page";
    const updates = typeof body.updates === "boolean" ? body.updates : true;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { ok: false, validated: false, message: "Invalid email address.", field: "email" },
        { status: 422 }
      );
    }

    const subscription: NewsletterSubscription = {
      email,
      source,
      updates,
      timestamp: new Date().toISOString(),
      delivery: "local"
    };

    let webhookDelivery: WebhookDelivery | undefined;
    let telegramDelivery: TelegramDelivery | undefined;

    // 1. Check Telegram Bot Delivery
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    let telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken) {
      if (!telegramChatId) {
        // Auto-discover chat ID from bot getUpdates if user messaged the bot
        try {
          const updRes = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getUpdates`);
          if (updRes.ok) {
            const updData = await updRes.json();
            if (updData.ok && Array.isArray(updData.result) && updData.result.length > 0) {
              const latest = updData.result[updData.result.length - 1];
              telegramChatId = latest.message?.chat?.id || latest.my_chat_member?.chat?.id || latest.channel_post?.chat?.id;
            }
          }
        } catch {
          // ignore getUpdates network error
        }
      }

      if (telegramChatId) {
        try {
          const tgMsg = `🚀 *New QTPhone Pre-order Subscriber!*\n\n📧 *Email:* \`${email}\`\n🌐 *Source:* \`${source}\`\n⏰ *Time:* \`${subscription.timestamp}\``;
          const tgRes = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: tgMsg,
              parse_mode: "Markdown"
            })
          });
          const tgJson = await tgRes.json().catch(() => ({}));
          telegramDelivery = {
            ok: tgRes.ok && tgJson.ok,
            status: tgRes.status,
            endpoint: `Telegram Bot (@qtphone_bot)`,
            chatId: telegramChatId,
            error: !tgRes.ok ? (tgJson.description || "Failed to send Telegram message") : undefined
          };
          if (telegramDelivery.ok) {
            subscription.delivery = "telegram";
          }
        } catch (e: unknown) {
          telegramDelivery = {
            ok: false,
            status: null,
            endpoint: `Telegram Bot (@qtphone_bot)`,
            error: e instanceof Error ? e.message : "Network error reaching Telegram API"
          };
        }
      } else {
        telegramDelivery = {
          ok: false,
          status: null,
          endpoint: `Telegram Bot (@qtphone_bot)`,
          error: "Chat ID not found yet. Please send /start to @qtphone_bot on Telegram so it can discover your chat ID."
        };
      }
    }

    // 2. Fallback to Webhook if configured and not the expired default URL
    const webhookUrl =
      process.env.NEWSLETTER_WEBHOOK_URL ??
      process.env.WEBHOOK_URL ??
      process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK_URL;

    if (webhookUrl && webhookUrl !== DEFAULT_NEWSLETTER_WEBHOOK_URL && subscription.delivery !== "telegram") {
      const webhookSecret = process.env.NEWSLETTER_WEBHOOK_SECRET;
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(webhookSecret ? { "X-QTPhone-Webhook-Secret": webhookSecret } : {})
          },
          body: JSON.stringify({ ...subscription, validated: true })
        });
        webhookDelivery = {
          ok: response.ok,
          status: response.status,
          endpoint: sanitizeWebhookEndpoint(webhookUrl)
        };
        if (webhookDelivery.ok) {
          subscription.delivery = "webhook";
        }
      } catch {
        webhookDelivery = {
          ok: false,
          status: null,
          endpoint: sanitizeWebhookEndpoint(webhookUrl),
          error: "Webhook delivery failed."
        };
      }
    }

    subscriptions.push(subscription);

    if (subscriptions.length > 100) {
      subscriptions.splice(0, subscriptions.length - 100);
    }

    let customMessage = "Successfully subscribed to pre-order alerts.";
    if (subscription.delivery === "telegram") {
      customMessage = "Subscribed! Alert sent to your Telegram (@qtphone_bot).";
    } else if (telegramDelivery && !telegramDelivery.ok && telegramDelivery.error) {
      customMessage = `Subscribed successfully! (${telegramDelivery.error})`;
    }

    return NextResponse.json({
      ok: true,
      validated: true,
      delivery: subscription.delivery,
      message: customMessage,
      webhookTriggered: webhookDelivery?.ok ?? false,
      telegramTriggered: telegramDelivery?.ok ?? false,
      telegram: telegramDelivery,
      webhook: webhookDelivery,
      metadata: {
        timestamp: subscription.timestamp
      },
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
