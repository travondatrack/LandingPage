"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Zap
} from "lucide-react";
import type { ProductLoadState } from "@/lib/products";
import { formatDiscount, formatPrice, formatRating } from "@/lib/format";

type HeroSectionProps = {
  productState: ProductLoadState;
};

const trustStats = [
  { label: "Products", value: "20+" },
  { label: "Satisfaction", value: "99.4%" },
  { label: "Warranty", value: "2 Years" }
];

export function HeroSection({ productState }: HeroSectionProps) {
  const products = productState.status === "success" ? productState.products.slice(0, 6) : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (products.length <= 1 || isPaused) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, [products.length, isPaused]);

  const featured = products[activeIndex] ?? (productState.status === "success" ? productState.products[0] : undefined);

  function handlePrev() {
    if (products.length === 0) return;
    setActiveIndex((current) => (current - 1 + products.length) % products.length);
  }

  function handleNext() {
    if (products.length === 0) return;
    setActiveIndex((current) => (current + 1) % products.length);
  }

  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,119,182,0.15),transparent)] bg-canvas py-14 sm:py-20 lg:min-h-[calc(100vh-4rem)] lg:py-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,transparent_0%,rgb(var(--color-accent)/0.12)_44%,transparent_70%)]" />
      <div className="mx-auto grid max-w-content items-center gap-10 px-5 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="soft-reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/78 px-3 py-2 text-sm font-semibold text-accent shadow-sm backdrop-blur">
            <Sparkles aria-hidden="true" size={16} />
            Premium Smart Device Commerce
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Experience next-generation smartphone innovation.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Discover flagship smartphones engineered for pro-grade optical clarity, extreme battery endurance, and lightning-fast connectivity. Compare specifications and shop the latest models seamlessly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white"
              href="#products"
            >
              Explore phones
              <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a
              className="premium-button inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface/86 px-6 text-sm font-semibold text-ink backdrop-blur hover:border-accent"
              href="#specs"
            >
              Compare products
            </a>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {trustStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-surface/78 p-4 backdrop-blur"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="soft-reveal relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="premium-panel product-sheen relative overflow-hidden rounded-[1.75rem] p-4 sm:p-6">
            {featured ? (
              <article className="transition-all duration-500 ease-out">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent sm:text-sm sm:py-1.5">
                      <Zap aria-hidden="true" size={14} />
                      {formatDiscount(featured.discountPercentage)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted sm:text-sm sm:py-1.5">
                      <Star aria-hidden="true" size={14} className="fill-accent text-accent" />
                      {formatRating(featured.rating)}
                    </span>
                  </div>

                  {products.length > 1 ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsPaused(!isPaused)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-ink"
                        title={isPaused ? "Resume auto slide" : "Pause auto slide"}
                        aria-label={isPaused ? "Resume auto slide" : "Pause auto slide"}
                      >
                        {isPaused ? <Play size={14} /> : <Pause size={14} />}
                      </button>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-ink"
                        title="Previous product"
                        aria-label="Previous product"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-ink"
                        title="Next product"
                        aria-label="Next product"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="relative mt-4 aspect-[16/11] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(140deg,rgb(var(--color-surface)),rgb(var(--color-accent)/0.10))] sm:aspect-[4/3]">
                  <Image
                    key={featured.id}
                    src={featured.image}
                    alt={`${featured.name} smartphone product spotlight`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 520px, 92vw"
                    className="animate-in fade-in zoom-in-95 duration-500 object-contain p-6 transition hover:scale-[1.035] sm:p-8"
                  />
                  {products.length > 1 ? (
                    <div className="absolute bottom-3 right-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium text-ink shadow-sm backdrop-blur">
                      {activeIndex + 1} / {products.length}
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div key={`info-${featured.id}`} className="animate-in fade-in duration-300">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">{featured.brand}</p>
                    <h2 className="mt-1 break-words text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                      {featured.name}
                    </h2>
                  </div>
                  <div className="rounded-2xl border border-line bg-surface px-4 py-2.5 text-right sm:py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Price</p>
                    <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-accent sm:text-3xl">
                      {formatPrice(featured.price)}
                    </p>
                  </div>
                </div>

                {products.length > 1 ? (
                  <div className="mt-4 flex items-center justify-center gap-1.5 pt-1">
                    {products.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Show ${item.name}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === activeIndex
                            ? "w-7 bg-accent"
                            : "w-2 bg-line hover:bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                ) : null}
              </article>
            ) : (
              <HeroSkeleton />
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-content border-t border-line/60 px-5 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm font-semibold text-muted">
          {[
            { icon: BadgeCheck, label: "Official Warranty" },
            { icon: ShieldCheck, label: "Secure Checkout" },
            { icon: Zap, label: "Express Delivery" }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-line/60 bg-surface/50 px-4 py-2 text-ink/90 backdrop-blur shadow-2xs transition hover:border-accent/40 hover:text-accent"
              >
                <Icon aria-hidden="true" size={18} className="text-accent" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between">
        <div className="h-8 w-32 rounded-full bg-line/50" />
        <div className="h-8 w-24 rounded-full bg-line/50" />
      </div>
      <div className="mt-5 aspect-[16/11] rounded-[1.25rem] bg-line/40 sm:aspect-[4/3]" />
      <div className="mt-6 h-8 w-3/4 rounded bg-line/50" />
      <div className="mt-3 h-4 w-full rounded bg-line/40" />
    </div>
  );
}
