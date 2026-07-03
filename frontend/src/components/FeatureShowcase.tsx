"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  BatteryCharging,
  Cpu,
  Layers,
  Sparkles,
  Smartphone,
  Video
} from "lucide-react";
import type { Product } from "../types";

interface FeatureShowcaseProps {
  products?: Product[];
}

const specHighlights = [
  { label: "TITANIUM ALLOY", icon: Layers },
  { label: "NEURAL ENGINE 2.0", icon: Cpu },
  { label: "ADVANCED AI", icon: Sparkles },
  { label: "PRO CAMERA", icon: Video },
  { label: "120HZ PROMOTION", icon: Smartphone },
  { label: "ALL-DAY BATTERY", icon: BatteryCharging }
];

export default function FeatureShowcase({ products = [] }: FeatureShowcaseProps) {
  const productImages = products.filter((product) => product.thumbnail).slice(0, 3);
  const philosophyTabs = [
    {
      id: "origin",
      label: "01 Origin",
      badge: "PURE ARCHITECTURE",
      chip: "Pure Architecture",
      title: "Designed for modern mobility.",
      description:
        "Born from a relentless pursuit of precision, QTPhone reimagines how technology integrates into your daily workflow and lifestyle.",
      detail: "7.8mm Ultra-Slim Profile / Zero-Gravity Balance",
      image: productImages[0]?.thumbnail || "/qtphone-icon-transparent-512.png",
      imageAlt: productImages[0]?.title || "QTPhone pure architecture product detail"
    },
    {
      id: "craft",
      label: "02 Craft",
      badge: "EXTREME DURABILITY",
      chip: "Extreme Durability",
      title: "Built with aerospace-grade materials and precision engineering.",
      description:
        "Forged from grade-5 titanium and shielded by Corning Gorilla Armor, combining extreme thermal conductivity with featherweight durability.",
      detail: "Grade-5 Titanium / Gorilla Armor / Thermal Core",
      image: productImages[1]?.thumbnail || productImages[0]?.thumbnail || "/qtphone-icon-transparent-512.png",
      imageAlt: productImages[1]?.title || "QTPhone extreme durability product detail"
    },
    {
      id: "experience",
      label: "03 Experience",
      badge: "DAILY INTELLIGENCE",
      chip: "Daily Intelligence",
      title: "Optimized for camera, battery, and intelligent daily performance.",
      description:
        "Powered by on-device neural processing and multi-aperture computational optics, capturing cinematic reality while enduring multi-day workflows.",
      detail: "Neural ISP / Multi-Aperture Optics / Multi-Day Workflow",
      image: productImages[2]?.thumbnail || productImages[0]?.thumbnail || "/qtphone-icon-transparent-512.png",
      imageAlt: productImages[2]?.title || "QTPhone intelligent experience product detail"
    }
  ];
  const [activeTabId, setActiveTabId] = useState(philosophyTabs[0].id);
  const activeTab = philosophyTabs.find((tab) => tab.id === activeTabId) || philosophyTabs[0];

  return (
    <div id="explore-engineering" className="story-panel bg-[#f8fafc] dark:bg-[#171b26] text-slate-900 dark:text-zinc-100 scroll-mt-20 transition-colors duration-300">
      <div className="border-y border-slate-200 dark:border-white/10 py-5 bg-slate-100/60 dark:bg-[#1d2432] overflow-hidden">
        <div className="feature-spec-marquee-track flex w-max items-center">
          {[0, 1].map((group) => (
            <div key={group} className="feature-spec-marquee-group flex shrink-0 items-center gap-10 px-5">
              {specHighlights.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={`${group}-${item.label}`} className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 dark:text-slate-300 tracking-wider">
                    <IconComponent className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <section className="py-20 px-6 md:px-12 border-b border-slate-200 dark:border-white/5 relative overflow-hidden" data-reveal>
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/[0.03] blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between gap-8" data-reveal>
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100/80 dark:bg-sky-400/10 border border-sky-200 dark:border-sky-300/20 rounded-full text-xs font-mono uppercase tracking-widest text-sky-700 dark:text-sky-300 mb-8 shadow-sm">
                <Sparkles className="w-4 h-4" />
                QTPHONE PHILOSOPHY
              </span>

              <h2 className="font-display text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight text-slate-950 dark:text-slate-50 leading-[0.98] text-balance">
                Where pure engineering meets visionary intelligence.
              </h2>

              <p className="mt-7 text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-sans max-w-2xl">
                Every element of QTPhone is crafted not as a mere device, but as a natural extension of human potential, balanced, enduring, and remarkably intuitive.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3" data-reveal>
              {philosophyTabs.map((tab) => {
                const isActive = tab.id === activeTab.id;
                return (
                  <button
                    key={tab.id}
                    className={
                      isActive
                        ? "px-6 py-4 rounded-full bg-sky-600 text-white text-base font-bold shadow-lg shadow-sky-600/20 transition hover:bg-sky-500"
                        : "px-6 py-4 rounded-full bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-500/25 text-slate-600 dark:text-slate-300 text-base font-bold transition hover:border-sky-300 hover:text-sky-700 dark:hover:text-sky-300"
                    }
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="micro-lift rounded-[24px] bg-white/90 dark:bg-[#202838] border border-slate-200 dark:border-slate-500/25 p-7 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]" data-reveal>
              <span className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-sky-600 dark:text-sky-300 font-bold">
                <Layers className="w-5 h-5" />
                {activeTab.badge}
              </span>
              <h3 className="mt-6 text-2xl md:text-3xl font-black tracking-tight text-slate-950 dark:text-slate-50">
                {activeTab.title}
              </h3>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {activeTab.description}
              </p>
            </div>
          </div>

          <div className="parallax-layer lg:col-span-6 xl:col-span-6 rounded-[28px] bg-white/90 dark:bg-[#202838] border border-slate-200 dark:border-slate-500/25 p-6 md:p-8 relative overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.10)]" data-reveal data-parallax="0.05">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_28%,rgba(14,165,233,0.12),transparent_38%)] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between gap-4 pb-7 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-sky-600" />
                <span className="font-mono text-sm font-bold tracking-widest text-slate-500 dark:text-slate-300 uppercase">Product Detail</span>
              </div>
              <span className="rounded-full bg-sky-100 dark:bg-sky-400/10 border border-sky-200 dark:border-sky-300/20 px-4 py-2 text-sm font-bold text-sky-700 dark:text-sky-300">
                {activeTab.chip}
              </span>
            </div>

            <div className="relative z-10 mt-7 rounded-[24px] border border-slate-200 dark:border-slate-500/25 bg-sky-50/55 dark:bg-[#253145] h-[340px] md:h-[390px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-10 rounded-full bg-sky-300/20 blur-3xl" />
              <Image
                key={activeTab.id}
                src={activeTab.image}
                alt={activeTab.imageAlt}
                width={520}
                height={520}
                sizes="(min-width: 1024px) 420px, 80vw"
                className="relative z-10 h-[74%] w-[74%] object-contain drop-shadow-[0_26px_36px_rgba(15,23,42,0.22)] soft-reveal"
              />
            </div>

            <div className="relative z-10 mt-7 rounded-[20px] bg-sky-50/80 dark:bg-[#253145] border border-sky-100 dark:border-slate-500/25 p-6">
              <span className="font-mono text-sm font-bold tracking-widest text-sky-600 dark:text-sky-300 uppercase">Form factor & ergonomics</span>
              <p className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-slate-50">
                {activeTab.detail}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
