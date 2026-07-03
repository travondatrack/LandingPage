import { NextRequest, NextResponse } from "next/server";
import { TelemetryEvent } from "@/types";
import { telemetryStore } from "./store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event: TelemetryEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: body.type || "unknown",
      label: body.label || "",
      metadata: body.metadata || {},
      timestamp: new Date().toISOString()
    };
    telemetryStore.addEvent(event);
    return NextResponse.json({ success: true, event });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ events: telemetryStore.events });
}
