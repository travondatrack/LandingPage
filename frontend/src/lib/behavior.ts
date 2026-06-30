"use client";

export type BehaviorEventName =
  | "favorite_product"
  | "cart_product"
  | "view_product"
  | "page_click"
  | "scroll_depth"
  | "newsletter_submit"
  | "chatbot_open"
  | "chatbot_message"
  | "search_products"
  | "filter_products"
  | "sort_products"
  | "compare_product"
  | "open_compare_drawer"
  | "view_product_details"
  | "view_product_detail"
  | "switch_tab";

export function trackBehavior(event: BehaviorEventName, detail: Record<string, unknown> = {}) {
  const payload = JSON.stringify({
    event,
    detail,
    page: window.location.pathname,
    timestamp: new Date().toISOString()
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/behavior", blob);
    return;
  }

  void fetch("/api/behavior", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true
  });
}
