"use client";

import { useEffect } from "react";
import { trackBehavior } from "@/lib/behavior";

const depthMarks = [25, 50, 75, 100];

export function useBehaviorTracker() {
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
}
