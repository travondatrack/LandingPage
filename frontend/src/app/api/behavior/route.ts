import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { telemetryStore } from "../events/store";

type StoredBehaviorEvent = {
  event: string;
  detail: Record<string, string | number | boolean | null>;
  page?: string;
  timestamp: string;
  userAgent?: string;
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

const behaviorEvents: StoredBehaviorEvent[] = [];
const DEFAULT_BEHAVIOR_WEBHOOK_URL = "https://webhook.site/85604a13-d533-4852-9e7b-9bcc8379661e";
const ALLOWED_EVENTS = new Set([
  "favorite_product",
  "cart_product",
  "view_product",
  "page_click",
  "scroll_depth",
  "newsletter_submit",
  "chatbot_open",
  "chatbot_message",
  "search_products",
  "filter_products",
  "sort_products",
  "compare_product",
  "open_compare_drawer",
  "view_product_details",
  "view_product_detail",
  "switch_tab"
]);

const BehaviorEventSchema = z.object({
  event: z.string().min(1).max(80),
  detail: z.record(z.string(), z.unknown()).optional().default({}),
  page: z.string().optional().default("/"),
  timestamp: z.string().optional()
});

function getWebhookUrl() {
  return (
    process.env.BEHAVIOR_WEBHOOK_URL ??
    process.env.NEWSLETTER_WEBHOOK_URL ??
    process.env.WEBHOOK_URL ??
    process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK_URL ??
    DEFAULT_BEHAVIOR_WEBHOOK_URL
  );
}

function sanitizeWebhookEndpoint(endpoint: string) {
  try {
    const url = new URL(endpoint);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "invalid-endpoint";
  }
}

function sanitizeDetail(detail: unknown): StoredBehaviorEvent["detail"] {
  if (!detail || typeof detail !== "object" || Array.isArray(detail)) {
    return {};
  }

  return Object.entries(detail as Record<string, unknown>)
    .slice(0, 15)
    .reduce<StoredBehaviorEvent["detail"]>((acc, [rawKey, rawValue]) => {
      const key = rawKey.trim().replace(/[^\w.-]/g, "").slice(0, 40);

      if (!key) {
        return acc;
      }

      if (typeof rawValue === "string") {
        acc[key] = rawValue.trim().slice(0, 180);
      } else if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
        acc[key] = rawValue;
      } else if (typeof rawValue === "boolean" || rawValue === null) {
        acc[key] = rawValue;
      } else {
        acc[key] = String(rawValue).slice(0, 120);
      }

      return acc;
    }, {});
}

function normalizeTimestamp(value: unknown) {
  if (typeof value !== "string") {
    return new Date().toISOString();
  }

  const time = Date.parse(value);
  return Number.isNaN(time) ? new Date().toISOString() : new Date(time).toISOString();
}

function normalizePage(value: unknown) {
  if (typeof value !== "string") {
    return "/";
  }

  const page = value.trim().slice(0, 160);
  return page.startsWith("/") ? page : "/";
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    const parseResult = BehaviorEventSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          validated: false,
          message: "Invalid behavior event data structure.",
          errors: parseResult.error.flatten()
        },
        { status: 422 }
      );
    }

    const payload = parseResult.data;
    const eventName = payload.event.trim().slice(0, 80);

    if (!ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json(
        { ok: false, validated: false, message: "Unsupported behavior event.", field: "event" },
        { status: 422 }
      );
    }

    const timestamp = normalizeTimestamp(payload.timestamp);
    const storedEvent: StoredBehaviorEvent = {
      event: eventName,
      detail: sanitizeDetail(payload.detail),
      page: normalizePage(payload.page),
      timestamp,
      userAgent: request.headers.get("user-agent")?.slice(0, 180)
    };

    behaviorEvents.push(storedEvent);

    if (behaviorEvents.length > 100) {
      behaviorEvents.splice(0, behaviorEvents.length - 100);
    }

    // Mirror to main telemetry store so UI developer dashboard sees behavior tracking
    telemetryStore.addEvent({
      id: `beh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: eventName,
      label: `Behavior: ${eventName}`,
      metadata: storedEvent.detail,
      timestamp
    });

    const webhookUrl = getWebhookUrl();
    let webhookDelivery: WebhookDelivery;

    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.WEBHOOK_SECRET } : {})
        },
        body: JSON.stringify({
          source: "qtphone-behavior-tracker",
          type: "user_behavior",
          validated: true,
          event: storedEvent
        })
      });

      webhookDelivery = {
        ok: webhookResponse.ok,
        status: webhookResponse.status,
        endpoint: sanitizeWebhookEndpoint(webhookUrl)
      };
    } catch {
      webhookDelivery = {
        ok: false,
        status: null,
        endpoint: sanitizeWebhookEndpoint(webhookUrl),
        error: "Webhook delivery failed."
      };
    }

    // Deliver notification to Telegram Webhook / Bot API (invisible to frontend UI / landing page)
    let telegramDelivery: TelegramDelivery | undefined;
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    let telegramChatId = process.env.TELEGRAM_CHAT_ID;
    const telegramWebhookUrl =
      process.env.TELEGRAM_WEBHOOK_URL ?? process.env.BEHAVIOR_TELEGRAM_WEBHOOK_URL;

    if (telegramBotToken || telegramWebhookUrl) {
      let tgMsg = `📊 *User Behavior Tracked*\n\n`;
      tgMsg += `⚡ *Event:* \`${storedEvent.event}\`\n`;
      tgMsg += `🌐 *Page:* \`${storedEvent.page}\`\n`;

      if (storedEvent.event === "page_click") {
        const label = storedEvent.detail.label || storedEvent.detail.tag || "Interactive Element";
        const section = storedEvent.detail.section || "global";
        tgMsg += `🖱️ *Click Action:* \`${label}\`\n📍 *Section:* \`${section}\`\n`;
      } else if (storedEvent.event === "scroll_depth") {
        tgMsg += `📜 *Scroll Depth:* \`${storedEvent.detail.depth}%\`\n`;
      } else {
        const detailStr = JSON.stringify(storedEvent.detail);
        if (detailStr && detailStr !== "{}") {
          tgMsg += `📋 *Detail:* \`${detailStr.slice(0, 300)}\`\n`;
        }
      }
      tgMsg += `⏰ *Timestamp:* \`${storedEvent.timestamp}\``;

      if (telegramWebhookUrl) {
        try {
          const tgRes = await fetch(telegramWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: tgMsg,
              parse_mode: "Markdown",
              source: "qtphone-behavior-tracker",
              event: storedEvent
            })
          });
          telegramDelivery = {
            ok: tgRes.ok,
            status: tgRes.status,
            endpoint: sanitizeWebhookEndpoint(telegramWebhookUrl)
          };
        } catch (e: unknown) {
          telegramDelivery = {
            ok: false,
            status: null,
            endpoint: sanitizeWebhookEndpoint(telegramWebhookUrl),
            error: e instanceof Error ? e.message : "Network error reaching Telegram webhook"
          };
        }
      } else if (telegramBotToken) {
        if (!telegramChatId) {
          try {
            const updRes = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getUpdates`);
            if (updRes.ok) {
              const updData = await updRes.json();
              if (updData.ok && Array.isArray(updData.result) && updData.result.length > 0) {
                const latest = updData.result[updData.result.length - 1];
                telegramChatId =
                  latest.message?.chat?.id ||
                  latest.my_chat_member?.chat?.id ||
                  latest.channel_post?.chat?.id;
              }
            }
          } catch {
            // ignore getUpdates network error
          }
        }

        if (telegramChatId) {
          try {
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
              ok: tgRes.ok && Boolean(tgJson.ok),
              status: tgRes.status,
              endpoint: `Telegram Bot (@qtphone_bot)`,
              chatId: telegramChatId,
              error: !tgRes.ok ? (tgJson.description || "Failed to send Telegram message") : undefined
            };
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
            error: "Chat ID not found yet. Please send /start to @qtphone_bot on Telegram."
          };
        }
      }
    }

    return NextResponse.json({
      ok: true,
      validated: true,
      stored: behaviorEvents.length,
      webhook: webhookDelivery,
      telegram: telegramDelivery
    });
  } catch {
    return NextResponse.json({ ok: false, validated: false, message: "Invalid behavior payload." }, { status: 400 });
  }
}

export async function GET() {
  const byEvent = behaviorEvents.reduce<Record<string, number>>((summary, item) => {
    summary[item.event] = (summary[item.event] ?? 0) + 1;
    return summary;
  }, {});

  return NextResponse.json({
    ok: true,
    stored: behaviorEvents.length,
    byEvent,
    recent: behaviorEvents.slice(-10).reverse()
  });
}
