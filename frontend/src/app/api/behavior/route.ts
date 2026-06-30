import { NextRequest, NextResponse } from "next/server";

type StoredBehaviorEvent = {
  event: string;
  detail: unknown;
  page?: string;
  timestamp: string;
  userAgent?: string;
};

const behaviorEvents: StoredBehaviorEvent[] = [];

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<StoredBehaviorEvent>;
    const event =
      typeof payload.event === "string" && payload.event.trim()
        ? payload.event.trim().slice(0, 80)
        : "unknown";

    behaviorEvents.push({
      event,
      detail: payload.detail ?? {},
      page: typeof payload.page === "string" ? payload.page.slice(0, 160) : undefined,
      timestamp:
        typeof payload.timestamp === "string" ? payload.timestamp : new Date().toISOString(),
      userAgent: request.headers.get("user-agent")?.slice(0, 180)
    });

    if (behaviorEvents.length > 100) {
      behaviorEvents.splice(0, behaviorEvents.length - 100);
    }

    return NextResponse.json({ ok: true, stored: behaviorEvents.length });
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
