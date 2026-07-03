"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Code2, Sparkles, Star, Zap } from "lucide-react";
import { trackTelemetryEvent } from "../api";
import type { Product } from "../types";

interface HeroProps {
  onRefreshTelemetry: () => void;
  products: Product[];
}

const marqueeLabels = [
  "TITANIUM ALLOY",
  "NEURAL ENGINE 2.0",
  "ADVANCED AI",
  "PRO CAMERA",
  "120HZ PROMOTION",
  "ALL-DAY BATTERY"
];

const fallbackSlides: Product[] = [
  {
    id: 0,
    title: "QTPhone 16 Ultra Titanium",
    name: "QTPhone 16 Ultra Titanium",
    brand: "QTPhone",
    price: 1174,
    discountPercentage: 7,
    rating: 4.8,
    stock: 20,
    thumbnail: "/qtphone-icon-transparent-512.png",
    images: ["/qtphone-icon-transparent-512.png"],
    description: "Flagship smart device engineered for performance and premium mobility.",
    specs: {
      screenSize: "6.8 inch",
      displayType: "LTPO OLED",
      refreshRate: "120Hz",
      processor: "Neural Engine 2.0",
      rearCamera: "Pro camera array",
      frontCamera: "AI selfie camera",
      battery: "All-day battery",
      charging: "Fast charging",
      os: "QTOS",
      ram: "12GB",
      storage: "256GB"
    }
  }
];

function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easedProgress * value);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <span>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function Hero({ onRefreshTelemetry, products }: HeroProps) {
  const deviceSlides = products.filter((product) => product.thumbnail).slice(0, 6);
  const slides = deviceSlides.length > 0 ? deviceSlides : fallbackSlides;
  const featured = slides[0];

  const handleScrollToGrid = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackTelemetryEvent("click", "Hero CTA: Explore flagship series", { anchor: "#smartphone-catalog" });
    onRefreshTelemetry();
    const element = document.getElementById("smartphone-catalog");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToCompare = () => {
    trackTelemetryEvent("click", "Hero Secondary CTA: Compare Models");
    onRefreshTelemetry();
    const element = document.getElementById("specs-compare");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero-showcase"
      className="story-panel relative bg-[#f8fafc] dark:bg-[#171b26] pt-12 pb-20 px-6 md:px-12 overflow-hidden border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300"
      data-reveal
    >
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/[0.03] blur-[140px] pointer-events-none select-none" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left gap-6" data-reveal>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-slate-200/70 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full text-[10px] uppercase tracking-widest text-slate-600 dark:text-zinc-400 mb-5">
              <Sparkles className="w-3 h-3 text-blue-500 dark:text-blue-400 animate-pulse" />
              <span>Flagship Series X Showcase</span>
            </span>
            <h1 className="font-display font-light text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[1.08] text-slate-900 dark:text-slate-50">
              QTPhone changes <br />
              <span className="font-serif italic text-slate-500 dark:text-zinc-400">
                how flagships perform<span className="text-sky-400 animate-pulse">|</span>
              </span>
            </h1>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed font-sans font-light">
            Designed for next-gen mobility, premium materials, and intelligence. Crafted to redefine what a smartphone can achieve every single day.
          </p>

          <div className="flex flex-wrap gap-3.5 w-full sm:w-auto my-2">
            <a
              href="#smartphone-catalog"
              onClick={handleScrollToGrid}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-full transition text-center shrink-0 flex items-center gap-2.5 shadow-lg shadow-blue-600/25"
            >
              <span>Explore Flagship Series</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#specs-compare"
              onClick={handleScrollToCompare}
              className="px-6 py-4 bg-slate-200/70 hover:bg-slate-300/70 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold uppercase tracking-widest rounded-full border border-slate-300 dark:border-white/10 transition text-center shrink-0 flex items-center justify-center gap-2"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" />
              <span>Compare Models</span>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-white/10 w-full max-w-lg">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-mono text-slate-900 dark:text-white font-bold">
                <AnimatedNumber value={20} suffix="+" />
              </span>
              <span className="text-[9px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest font-mono mt-1">Models Available</span>
            </div>
            <div className="flex flex-col border-l border-slate-200 dark:border-white/10 pl-6">
              <span className="text-2xl sm:text-3xl font-mono text-slate-900 dark:text-white font-bold">
                <AnimatedNumber value={63.6} decimals={1} suffix="%" />
              </span>
              <span className="text-[9px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest font-mono mt-1">Performance Gain</span>
            </div>
            <div className="flex flex-col border-l border-slate-200 dark:border-white/10 pl-6">
              <span className="text-2xl sm:text-3xl font-mono text-slate-900 dark:text-white font-bold">
                <AnimatedNumber value={3} suffix=" Years" />
              </span>
              <span className="text-[9px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest font-mono mt-1">OS Warranty</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center relative mt-8 lg:mt-0 py-6 select-none parallax-layer" data-reveal data-parallax="0.06">
          <div className="w-full max-w-md rounded-[28px] bg-white/95 dark:bg-[#202838] border border-slate-200 dark:border-slate-500/25 p-5 sm:p-7 flex flex-col justify-between relative shadow-[0_28px_70px_rgba(15,23,42,0.14)] dark:shadow-[0_28px_70px_rgba(0,0,0,0.24)] overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_12%,rgba(56,189,248,0.16),transparent_36%),radial-gradient(circle_at_24%_48%,rgba(59,130,246,0.11),transparent_34%)] pointer-events-none" />

            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/20 dark:border-sky-500/30 text-sm font-mono text-sky-600 dark:text-sky-300 font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  {Math.round(featured.discountPercentage)}% off
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-500/30 text-sm font-mono text-slate-800 dark:text-slate-100">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {featured.rating.toFixed(1)} / 5
                </span>
              </div>
              <span className="hidden sm:inline text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase">New lineup</span>
            </div>

            <div className="relative z-10 mt-7 rounded-[24px] border border-slate-200 dark:border-slate-500/25 bg-sky-50/45 dark:bg-[#253145] overflow-hidden">
              <div className="hero-device-stage relative h-[330px] sm:h-[360px] flex items-center justify-center">
                <div className="absolute inset-8 rounded-full bg-sky-300/20 blur-3xl" />
                {slides.map((product, index) => (
                  <div
                    key={`${product.id}-${product.title}`}
                    className="hero-device-slide absolute inset-0 flex items-center justify-center"
                    style={{ animationDelay: `${index * (18 / slides.length)}s` }}
                  >
                    <Image
                      src={product.thumbnail}
                      alt={`${product.title} product render`}
                      width={520}
                      height={520}
                      sizes="(min-width: 1024px) 360px, 76vw"
                      className="h-[76%] w-[76%] object-contain drop-shadow-[0_28px_36px_rgba(15,23,42,0.22)] transition duration-500 group-hover:scale-[1.04]"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}

                <span className="absolute right-5 bottom-5 rounded-full bg-white/90 dark:bg-[#1b2230]/95 px-4 py-2 text-sm font-mono text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-500/30 shadow-sm">
                  1 / {slides.length}
                </span>
              </div>

              <div className="relative border-t border-slate-200 dark:border-slate-500/25 bg-white/75 dark:bg-[#1b2230]/85 py-3 overflow-hidden">
                <div className="hero-spec-marquee flex w-max items-center gap-4">
                  {[0, 1].map((group) => (
                    <div key={group} className="hero-spec-marquee-group flex shrink-0 items-center gap-4 pr-4">
                      {marqueeLabels.map((label) => (
                        <span
                          key={`${group}-${label}`}
                          className="inline-flex items-center gap-3 text-[11px] font-mono font-bold uppercase tracking-widest text-sky-600 dark:text-sky-300"
                        >
                          {label}
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-500/60" />
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="z-10 pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[9px] font-mono tracking-wider text-blue-600 dark:text-blue-400 uppercase font-semibold block">
                  QTPHONE &bull; {featured.specs.processor} &bull; {featured.specs.refreshRate}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-light text-slate-900 dark:text-slate-50 mt-1">
                  {featured.title}
                </h3>
              </div>
              <div className="sm:text-right shrink-0 rounded-2xl border border-slate-200 dark:border-slate-500/25 bg-white/85 dark:bg-slate-800/70 px-5 py-4">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase block">Launch deal</span>
                <span className="text-2xl font-mono text-sky-600 dark:text-sky-300 font-bold">${featured.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
