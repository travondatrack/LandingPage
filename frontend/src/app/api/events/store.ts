import { TelemetryEvent } from "@/types";

class TelemetryStore {
  public events: TelemetryEvent[] = [
    {
      id: "evt-init-001",
      type: "navigation",
      label: "Landing Page Loaded",
      metadata: { status: "ready", deviceCount: 30 },
      timestamp: new Date().toISOString()
    }
  ];

  public addEvent(event: TelemetryEvent) {
    this.events.unshift(event);
    if (this.events.length > 100) {
      this.events.length = 100;
    }
  }

  public clearEvents() {
    this.events.length = 0;
    return this.events;
  }
}

// Global singleton instance across route handlers
export const telemetryStore = new TelemetryStore();
