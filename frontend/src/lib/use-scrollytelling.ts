"use client";

import { useEffect } from "react";

export function useScrollytelling() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observedRevealItems = new Set<HTMLElement>();
    const parallaxItems = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16
      }
    );

    function registerAnimatedItems(root: ParentNode = document) {
      const revealItems = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
      const nextParallaxItems = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));

      revealItems.forEach((item) => {
        if (observedRevealItems.has(item)) {
          return;
        }

        item.style.setProperty("--reveal-delay", `${Math.min(observedRevealItems.size % 6, 5) * 70}ms`);
        observedRevealItems.add(item);
        observer.observe(item);
      });

      nextParallaxItems.forEach((item) => parallaxItems.add(item));
    }

    registerAnimatedItems();

    let animationFrame = 0;

    function updateParallax() {
      if (prefersReducedMotion || parallaxItems.size === 0) {
        animationFrame = 0;
        return;
      }

      const viewportHeight = window.innerHeight || 1;

      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const speed = Number(item.dataset.parallax || "0.08");
        const centerOffset = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        const y = Math.max(-42, Math.min(42, -centerOffset * speed * 120));
        item.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      });

      animationFrame = 0;
    }

    function requestUpdate() {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(updateParallax);
    }

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            registerAnimatedItems(node);
          }
        });
      });
      requestUpdate();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    updateParallax();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);
}
