"use client";

import { useEffect, useRef, useState } from "react";
import { trackBehavior } from "@/lib/behavior";

const depthMarks = [25, 50, 75, 100];

export function useBehaviorTracker() {
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const sentDepths = new Set<number>();

    function showToast(message: string) {
      setToastMessage(message);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToastMessage(""), 2400);
    }

    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const depth = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 100;
      const mark = depthMarks.find((item) => depth >= item && !sentDepths.has(item));

      if (!mark) {
        return;
      }

      sentDepths.add(mark);
      trackBehavior("scroll_depth", { depth: mark });
      showToast(`Scroll depth tracked: ${mark}%`);
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

      trackBehavior("page_click", {
        label,
        tag: interactive.tagName.toLowerCase(),
        section: interactive.closest("section")?.id ?? "global"
      });
      showToast(`Interaction tracked: ${label}`);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);
    handleScroll();

    return () => {
      window.clearTimeout(toastTimer.current);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return toastMessage;
}
