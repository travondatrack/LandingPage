"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Zap } from "lucide-react";
import type { ProductLoadState } from "@/lib/products";
import { formatDiscount, formatPrice, formatRating, getDiscountedPrice } from "@/lib/format";

type HeroSectionProps = {
  productState: ProductLoadState;
};

const trustStats = [
  { label: "Products", value: "20+" },
  { label: "Satisfaction", value: "99.8%" },
  { label: "VIP Warranty", value: "2 Years" }
];
const heroHeadline = "QTPhone changes how flagship feels.";

export function HeroSection({ productState }: HeroSectionProps) {
  const products = productState.status === "success" ? productState.products.slice(0, 6) : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedHeadline, setTypedHeadline] = useState(heroHeadline);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 3800);
    return () => window.clearInterval(interval);
  }, [products.length]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setTypedHeadline(heroHeadline);
      return;
    }

    let index = 0;
    let timeout: number;

    function typeNextCharacter() {
      index += 1;
      setTypedHeadline(heroHeadline.slice(0, index));

      if (index < heroHeadline.length) {
        timeout = window.setTimeout(typeNextCharacter, index < 10 ? 80 : 42);
      }
    }

    setTypedHeadline("");
    timeout = window.setTimeout(typeNextCharacter, 280);

    return () => window.clearTimeout(timeout);
  }, []);

  const featured =
    products[activeIndex] ??
    (productState.status === "success" ? productState.products[0] : undefined);

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_58%,#EAF6FF_100%)] py-14 sm:py-18 lg:min-h-[calc(92vh-4rem)] lg:py-20">
      <div className="absolute right-[-8rem] top-12 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto grid max-w-content items-center gap-10 px-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="soft-reveal">
          <h1
            className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-7xl"
            aria-label={heroHeadline}
          >
            <span aria-hidden="true">{typedHeadline}</span>
            <span
              className="typing-cursor ml-1 inline-block h-[0.82em] w-[0.08em] translate-y-[0.08em] rounded-full bg-accent"
              aria-hidden="true"
            />
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Experience next-generation titanium engineering, studio optics, and neural architecture.
            Curated for creators, executives, and power users who expect more from every tap.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-white shadow-[0_16px_36px_rgb(var(--color-accent)/0.22)] transition hover:scale-105"
              href="#products"
            >
              Explore Flagship Series
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          </div>

          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {trustStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line/70 bg-white p-3 shadow-sm transition hover:border-accent/40 sm:p-4"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {stat.label}
                </dt>
                <dd className="mt-1.5 text-xl font-bold tracking-tight text-ink sm:text-2xl text-accent">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="soft-reveal relative">
          <div className="premium-panel product-sheen relative overflow-hidden rounded-2xl bg-white/86 p-4 shadow-[0_28px_80px_rgb(15_23_42/0.12)] sm:p-5">
            {featured ? (
              <article>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-accent sm:text-sm">
                      <Zap aria-hidden="true" size={14} />
                      {formatDiscount(featured.discountPercentage)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink sm:text-sm">
                      <Star
                        aria-hidden="true"
                        size={14}
                        className="fill-amber-400 text-amber-400"
                      />
                      {formatRating(featured.rating)}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={featured.id}
                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.97 }}
                    transition={{ duration: 0.38, ease: "easeOut" }}
                  >
                    <a
                      href={`#product-${featured.id}`}
                      aria-label={`View ${featured.name} in the product collection`}
                      className="group relative mt-4 block aspect-[16/10] overflow-hidden rounded-2xl border border-line/70 bg-[linear-gradient(135deg,#FFFFFF,#EAF6FF)] transition hover:border-accent/45 hover:shadow-[0_18px_50px_rgb(var(--color-accent)/0.14)] sm:aspect-[16/11]"
                    >
                      <Image
                        src={featured.image}
                        alt={`${featured.name} smartphone product spotlight`}
                        fill
                        priority
                        sizes="(min-width: 1024px) 520px, 92vw"
                        className="object-contain p-5 drop-shadow-[0_18px_30px_rgb(15_23_42/0.16)] transition duration-500 group-hover:scale-[1.05] sm:p-7"
                      />
                      {products.length > 1 ? (
                        <div className="absolute bottom-3 right-3 rounded-full bg-surface/90 border border-line/60 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur">
                          {activeIndex + 1} / {products.length}
                        </div>
                      ) : null}
                    </a>

                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-accent">
                          {featured.brand} • {featured.processor}
                        </p>
                        <h2 className="mt-1 break-words text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                          {featured.name}
                        </h2>
                      </div>
                      <div className="rounded-2xl border border-line bg-white px-4 py-2.5 text-right shadow-sm sm:py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                          Launch Deal
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-muted line-through">
                          {formatPrice(featured.price)}
                        </p>
                        <p className="text-xl font-black tracking-tight text-accent sm:text-2xl">
                          {formatPrice(
                            getDiscountedPrice(featured.price, featured.discountPercentage)
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {products.length > 1 ? (
                  <div className="mt-4 flex items-center justify-center gap-1.5 pt-1">
                    {products.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`h-2 rounded-full transition-all duration-500 ${
                          idx === activeIndex ? "w-8 bg-accent shadow-cyan" : "w-2 bg-line/60"
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
