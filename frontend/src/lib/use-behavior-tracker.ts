"use client";

import { useEffect, useState } from "react";
import { trackBehavior } from "@/lib/behavior";

const depthMarks = [25, 50, 75, 100];

export function useBehaviorTracker() {
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const sentDepths = new Set<number>();

    function announce(message: string) {
      setNotice(message);
      window.setTimeout(() => setNotice(""), 2600);
    }

    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest("a, button") : null;
      if (!target) {
        return;
      }

      const label =
        target.getAttribute("aria-label") ??
        target.textContent?.trim().slice(0, 48) ??
        "interaction";
      trackBehavior("page_click", { label });
      announce(`Tracked click: ${label}`);
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
      announce(`Tracked scroll depth: ${mark}%`);
    }

    window.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return notice;
}
