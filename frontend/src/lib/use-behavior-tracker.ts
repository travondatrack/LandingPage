"use client";

import { useEffect, useRef } from "react";
import { trackBehavior } from "@/lib/behavior";

const depthMarks = [25, 50, 75, 100];

export function useBehaviorTracker() {
  const lastClickLabel = useRef("");
  const lastClickTime = useRef(0);

  useEffect(() => {
    const sentDepths = new Set<number>();

    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const depth = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 100;
      const mark = depthMarks.find((item) => depth >= item && !sentDepths.has(item));

      if (!mark) {
        return;
      }

      sentDepths.add(mark);
      trackBehavior("scroll_depth", { depth: mark });
    }

    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const interactive = target?.closest("a, button, input, [data-track]");

      if (!(interactive instanceof HTMLElement)) {
        return;
      }

      const label =
        interactive.dataset.track ??
        interactive.getAttribute("aria-label") ??
        interactive.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) ??
        interactive.tagName.toLowerCase();
      const now = Date.now();

      if (label === lastClickLabel.current && now - lastClickTime.current < 900) {
        return;
      }

      lastClickLabel.current = label;
      lastClickTime.current = now;

      trackBehavior("page_click", {
        label,
        tag: interactive.tagName.toLowerCase(),
        section: interactive.closest("section")?.id ?? "global"
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
    };
  }, []);
}
