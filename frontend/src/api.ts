import { Product, ProductSpecs, TelemetryEvent } from "./types";
import { fetchSmartphones as fetchSmartphonesFromLib } from "@/lib/products";

// Helper to enrich DummyJSON product models with custom high-fidelity specification details
export function enrichSpecs(product: Record<string, unknown>): ProductSpecs {
  const title = (typeof product.title === "string" ? product.title : "").toLowerCase();
  const brand = (typeof product.brand === "string" ? product.brand : "").toLowerCase();

  if (title.includes("iphone 9")) {
    return {
      screenSize: "4.7 inches",
      displayType: "Retina HD LCD",
      refreshRate: "60Hz",
      processor: "Apple A13 Bionic (7nm)",
      rearCamera: "12MP Single Cam (f/1.8) with Smart HDR",
      frontCamera: "7MP FaceTime HD",
      battery: "1,821 mAh",
      charging: "18W Fast Charging",
      os: "iOS 15 (Upgradable to iOS 17)",
      ram: "3 GB LPDDR4X",
      storage: "64 GB / 128 GB NVMe",
      colors: ["Charcoal Slate", "Mercury Silver", "Helio Red"],
    };
  } else if (title.includes("iphone x")) {
    return {
      screenSize: "5.8 inches",
      displayType: "Super Retina OLED HDR",
      refreshRate: "60Hz",
      processor: "Apple A11 Bionic with Neural Engine",
      rearCamera: "12MP Dual Cam (Wide & Telephoto) with dual OIS",
      frontCamera: "7MP TrueDepth (Face ID)",
      battery: "2,716 mAh",
      charging: "15W Qi Wireless / Wired",
      os: "iOS 16",
      ram: "3 GB LPDDR4X",
      storage: "64 GB / 256 GB NVMe",
      colors: ["Space Gray", "Starlight Silver"],
    };
  } else if (brand.includes("samsung") || title.includes("universe")) {
    return {
      screenSize: "6.8 inches",
      displayType: "Dynamic AMOLED 2X (120Hz LTPO)",
      refreshRate: "120Hz Dynamic",
      processor: "Qualcomm Snapdragon 8 Gen 1 (4nm)",
      rearCamera: "108MP Main + 12MP Ultra-Wide + 10MP Periscope (100x Zoom)",
      frontCamera: "40MP High-Res Selfie",
      battery: "5,000 mAh",
      charging: "45W Super Fast Charge / 15W Wireless",
      os: "Android 13 with One UI 5.1",
      ram: "12 GB LPDDR5",
      storage: "256 GB / 512 GB UFS 3.1",
      colors: ["Phantom Graphite", "Titanium Green", "Satin Burgundy"],
    };
  } else if (brand.includes("huawei") || title.includes("p30")) {
    return {
      screenSize: "6.1 inches",
      displayType: "OLED HDR10",
      refreshRate: "60Hz",
      processor: "HUAWEI Kirin 980 Octa-Core",
      rearCamera: "40MP Leica Triple Camera (Wide, Ultra-Wide, Telephoto)",
      frontCamera: "32MP AI Camera",
      battery: "3,650 mAh",
      charging: "22.5W Huawei SuperCharge",
      os: "EMUI 10 (Android 10 Core)",
      ram: "8 GB",
      storage: "128 GB (Expandable via NM Card)",
      colors: ["Aurora Blue", "Breathing Crystal", "Midnight Obsidian"],
    };
  } else {
    // Default to OPPO F19 / other budget smartphone specifications
    return {
      screenSize: "6.43 inches",
      displayType: "AMOLED FHD+",
      refreshRate: "60Hz",
      processor: "Qualcomm Snapdragon 662",
      rearCamera: "48MP Main + 2MP Macro + 2MP Depth Triple Lens",
      frontCamera: "16MP Punch-Hole Selfie",
      battery: "5,000 mAh",
      charging: "33W Flash Charge (VOOC 4.0)",
      os: "ColorOS 11.1 (Android 11)",
      ram: "6 GB LPDDR4X",
      storage: "128 GB (MicroSD support)",
      colors: ["Prism Black", "Aurora Blue"],
    };
  }
}

// Fetch smartphone products from canonical delegate
export async function fetchSmartphones(): Promise<Product[]> {
  return fetchSmartphonesFromLib();
}

// Send user telemetry metrics to backend (non-blocking)
export async function trackTelemetryEvent(
  type: TelemetryEvent["type"],
  label: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, label, metadata }),
    });
  } catch (err: unknown) {
    // Fail silently in telemetry to avoid blocking core UI
    console.warn("Could not submit telemetry event", err);
  }
}

// Fetch telemetry event list (for live developer console display)
export async function fetchTelemetryEvents(): Promise<TelemetryEvent[]> {
  try {
    const res = await fetch("/api/events");
    if (res.ok) {
      const data = await res.json();
      return data.events || [];
    }
  } catch (err: unknown) {
    console.error("Error fetching telemetry events", err);
  }
  return [];
}

// Reset telemetry events list
export async function clearTelemetryEvents(): Promise<TelemetryEvent[]> {
  try {
    const res = await fetch("/api/events/clear", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      return data.events || [];
    }
  } catch (err: unknown) {
    console.error("Error clearing telemetry events", err);
  }
  return [];
}

// Submit newsletter subscription
export async function subscribeNewsletter(email: string): Promise<{
  success: boolean;
  message: string;
  webhookTriggered: boolean;
  metadata?: Record<string, unknown>;
}> {
  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || data.error || "Subscription request failed.");
  }
  const isTriggered = data.delivery === "webhook" || Boolean(data.webhook?.delivered);
  return {
    success: true,
    message: data.message || "Successfully subscribed to pre-order alerts.",
    webhookTriggered: isTriggered,
    metadata: {
      delivery: data.delivery,
      webhook: data.webhook,
      stored: data.stored,
      timestamp: new Date().toISOString()
    }
  };
}

// Send message to assistant chatbot endpoint
export async function sendChatbotMessage(
  message: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<{ reply: string; mode: "AI" | "Demo"; provider?: string }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) {
    throw new Error("Failed to receive response from shopping assistant.");
  }
  const data = await res.json();
  const provider = data.provider || "demo";
  const mode = provider === "demo" ? "Demo" : "AI";
  return { reply: data.reply, mode, provider };
}
