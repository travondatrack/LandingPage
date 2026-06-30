import { NextRequest, NextResponse } from "next/server";

type StoredBehaviorEvent = {
  event: string;
  detail: unknown;
  page?: string;
  timestamp: string;
};

const behaviorEvents: StoredBehaviorEvent[] = [];

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Partial<StoredBehaviorEvent>;
    const event = typeof payload.event === "string" ? payload.event : "unknown";

    behaviorEvents.push({
      event,
      detail: payload.detail ?? {},
      page: typeof payload.page === "string" ? payload.page : undefined,
      timestamp:
        typeof payload.timestamp === "string" ? payload.timestamp : new Date().toISOString()
    });

    if (behaviorEvents.length > 100) {
      behaviorEvents.splice(0, behaviorEvents.length - 100);
    }

    return NextResponse.json({ ok: true, stored: behaviorEvents.length });
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid behavior payload." }, { status: 400 });
  }
}
