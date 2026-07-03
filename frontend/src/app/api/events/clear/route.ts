import { NextResponse } from "next/server";
import { telemetryStore } from "../store";

export async function POST() {
  telemetryStore.clearEvents();
  return NextResponse.json({ events: [] });
}
