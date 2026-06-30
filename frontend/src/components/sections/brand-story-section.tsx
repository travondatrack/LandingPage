"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { CheckCircle2 } from "lucide-react";
import type { ProductLoadState, SmartphoneProduct } from "@/lib/products";
import { formatDiscount, formatPrice, formatRating } from "@/lib/format";

type BrandStorySectionProps = {
  productState: ProductLoadState;
};

const storySteps = [
  {
    title: "Start with the hero phone",
    copy: "Lead with a large, inspectable product image and live pricing signals so visitors understand the offer instantly."
  },
  {
    title: "Compare what matters",
    copy: "Bring ratings, discounts, stock, warranty, and shipping together so the page feels useful, not just decorative."
  },
  {
    title: "Save, track, and decide",
    copy: "Favorites, cart preview, recently viewed products, chatbot support, and newsletter updates keep momentum inside the landing page."
  }
];

export function BrandStorySection({ productState }: BrandStorySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [offset, setOffset] = useState(0);
  const products = productState.status === "success" ? productState.products : [];
  const product = products[activeStep % Math.max(products.length, 1)];
  const progressHeight = `${((activeStep + 1) / storySteps.length) * 100}%`;
  const parallaxStyle = useMemo(
    () => ({ transform: `translate3d(0, ${offset * -0.04}px, 0)` }),
    [offset]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target instanceof HTMLElement) {
          setActiveStep(Number(visible.target.dataset.step ?? 0));
        }
      },
      { rootMargin: "-25% 0px -35% 0px", threshold: [0.35, 0.6, 0.85] }
    );

    section.querySelectorAll("[data-step]").forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

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
    <section
      id="story"
      ref={sectionRef}
      className="bg-surface py-16 sm:py-20 lg:py-24"
      aria-labelledby="story-title"
    >
      <div className="mx-auto grid max-w-content gap-12 px-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Scrollytelling
          </p>
          <h2
            id="story-title"
            className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
          >
            A guided buying story with product context at every step.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
            The page moves from brand promise to product proof, then into comparison and saved
            actions. It feels premium without relying on heavy video or animation libraries.
          </p>

          <div className="relative mt-10 grid gap-4">
            <div className="absolute left-4 top-0 hidden h-full w-px bg-line sm:block">
              <div
                className="w-px bg-accent transition-all duration-500"
                style={{ height: progressHeight }}
              />
            </div>
            {storySteps.map((step, index) => (
              <button
                key={step.title}
                data-step={index}
                className={`soft-reveal grid gap-2 rounded-2xl border p-5 text-left transition sm:ml-10 ${
                  activeStep === index
                    ? "border-accent bg-accent/10 shadow-soft"
                    : "border-line bg-elevated hover:border-accent/60"
                }`}
                type="button"
                onClick={() => setActiveStep(index)}
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  <CheckCircle2 aria-hidden="true" size={17} />
                  Step 0{index + 1}
                </span>
                <span className="text-2xl font-semibold tracking-tight text-ink">{step.title}</span>
                <span className="text-sm leading-6 text-muted">{step.copy}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <StoryPreview
            product={product}
            loading={productState.status === "loading"}
            style={parallaxStyle}
          />
        </div>
      </div>
    </section>
  );
}

function StoryPreview({
  product,
  loading,
  style
}: {
  product?: SmartphoneProduct;
  loading: boolean;
  style: CSSProperties;
}) {
  return (
    <div className="premium-panel overflow-hidden rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Live preview</p>
        {product ? (
          <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
            {formatDiscount(product.discountPercentage)}
          </span>
        ) : null}
      </div>

      <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(135deg,rgb(var(--color-surface)),rgb(var(--color-accent)/0.10))]">
        {product ? (
          <div className="absolute inset-0" style={style}>
            <Image
              src={product.image}
              alt={`${product.name} story product image`}
              fill
              sizes="(min-width: 1024px) 520px, 92vw"
              className="object-contain p-8"
            />
          </div>
        ) : (
          <div className={`h-full w-full ${loading ? "animate-pulse bg-line/40" : "bg-line/20"}`} />
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-sm text-muted">{product?.brand ?? "Smartphone"}</p>
          <h3 className="mt-1 break-words text-3xl font-semibold tracking-tight text-ink">
            {product?.name ?? "Product preview"}
          </h3>
        </div>
        <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-right">
          <p className="text-sm font-semibold text-muted">
            {product ? formatRating(product.rating) : "Rating"}
          </p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            {product ? formatPrice(product.price) : "$ -"}
          </p>
        </div>
      </div>
    </div>
  );
}
