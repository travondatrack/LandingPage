import { NextRequest, NextResponse } from "next/server";
import { telemetryStore } from "../events/store";

type StoredBehaviorEvent = {
  event: string;
  detail: Record<string, string | number | boolean | null>;
  page?: string;
  timestamp: string;
  userAgent?: string;
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
    .slice(0, 12)
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
    const payload = (await request.json()) as Partial<StoredBehaviorEvent>;
    const eventName =
      typeof payload.event === "string" && payload.event.trim()
        ? payload.event.trim().slice(0, 80)
        : "unknown";

    if (!ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json(
        { ok: false, message: "Unsupported behavior event.", field: "event" },
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

    // Mirror to main telemetry store so UI dashboard sees behavior tracking
    telemetryStore.addEvent({
      id: `beh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: eventName,
      label: `Behavior: ${eventName}`,
      metadata: storedEvent.detail,
      timestamp
    });

    const webhookUrl = getWebhookUrl();
    let webhookDelivery: { ok: boolean; status: number | null; endpoint: string; error?: string };

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

    return NextResponse.json({
      ok: true,
      validated: true,
      stored: behaviorEvents.length,
      webhook: webhookDelivery
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid behavior payload." }, { status: 400 });
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
