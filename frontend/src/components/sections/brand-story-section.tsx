"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ProductLoadState } from "@/lib/products";

type BrandStorySectionProps = {
  productState: ProductLoadState;
};

const storySteps = [
  {
    title: "Start with the hero phone",
    copy: "A product-backed hero gives buyers a clear first signal instead of a generic marketing visual."
  },
  {
    title: "Compare what matters",
    copy: "Ratings, discounts, stock, dimensions, shipping, and warranty stay visible while the page flows."
  },
  {
    title: "Act without friction",
    copy: "Favorites, cart preview, recently viewed products, newsletter, and chatbot support sit in the same journey."
  }
];

export function BrandStorySection({ productState }: BrandStorySectionProps) {
  const [offset, setOffset] = useState(0);
  const product =
    productState.status === "success"
      ? (productState.products[1] ?? productState.products[0])
      : undefined;
  const parallaxStyle = useMemo(
    () => ({ transform: `translate3d(0, ${offset * -0.06}px, 0)` }),
    [offset]
  );

  useEffect(() => {
    let frame = 0;

    function handleScroll() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setOffset(window.scrollY));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="story" className="bg-surface py-16 sm:py-20" aria-labelledby="story-title">
      <div className="mx-auto grid max-w-content gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Scrollytelling
          </p>
          <h2 id="story-title" className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            A premium buying story from first glance to saved product.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted">
            The page now feels more like a product narrative: visual first, specs second, actions
            last, with motion kept light for PageSpeed and accessibility.
          </p>
        </div>

        <div className="grid gap-5">
          <div className="relative overflow-hidden rounded-lg border border-line bg-elevated p-5 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
            <div className="grid items-center gap-6 sm:grid-cols-[180px_1fr]">
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface"
                style={parallaxStyle}
              >
                {product ? (
                  <Image
                    src={product.image}
                    alt={`${product.name} story product image`}
                    fill
                    sizes="180px"
                    className="object-contain p-5"
                  />
                ) : (
                  <div className="h-full w-full animate-pulse bg-line/40" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-accent">Product-led narrative</p>
                <h3 className="mt-2 break-words text-2xl font-semibold text-ink">
                  {product?.name ?? "Live smartphone visual"}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  A restrained parallax product frame adds premium movement without heavy animation
                  libraries or layout instability.
                </p>
              </div>
            </div>
          </div>

          {storySteps.map((step, index) => (
            <article
              key={step.title}
              className="soft-reveal rounded-lg border border-line bg-elevated p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-accent">0{index + 1}</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
