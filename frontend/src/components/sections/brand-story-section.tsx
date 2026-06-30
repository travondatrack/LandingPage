"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Layers, ShieldCheck, Cpu } from "lucide-react";
import type { ProductLoadState } from "@/lib/products";

type BrandStorySectionProps = {
  productState: ProductLoadState;
};

const storySteps = [
  {
    tabLabel: "01 Origin",
    title: "Designed for modern mobility.",
    copy: "Born from a relentless pursuit of perfection, QTPhone reimagines how technology seamlessly integrates into your daily workflow and lifestyle.",
    highlightLabel: "Form Factor & Ergonomics",
    highlightValue: "7.8mm Ultra-Slim Profile • Zero-Gravity Balance",
    badge: "Pure Architecture",
    icon: Layers
  },
  {
    tabLabel: "02 Craft",
    title: "Built with aerospace-grade materials and precision engineering.",
    copy: "Forged from grade-5 titanium and shielded by Corning Gorilla Armor, combining extreme thermal conductivity with featherweight durability.",
    highlightLabel: "Material Metallurgy",
    highlightValue: "Grade-5 Aerospace Titanium • Sub-Micron Precision",
    badge: "Extreme Durability",
    icon: ShieldCheck
  },
  {
    tabLabel: "03 Experience",
    title: "Optimized for camera, battery, and intelligent daily performance.",
    copy: "Powered by on-device neural processing and multi-aperture computational optics, capturing cinematic reality while enduring multi-day workflows.",
    highlightLabel: "Core Architecture",
    highlightValue: "Computational Studio Optics • All-Day Marathon Power",
    badge: "Pro Intelligence",
    icon: Cpu
  }
];

export function BrandStorySection({ productState }: BrandStorySectionProps) {
  const [activeStep, setActiveStep] = useState(0);
  const products = productState.status === "success" ? productState.products : [];
  const activeProduct = products[activeStep % Math.max(products.length, 1)];
  const currentStory = storySteps[activeStep];
  const StepIcon = currentStory.icon;

  return (
    <section
      id="story"
      className="relative isolate overflow-hidden bg-surface py-14 sm:py-20 border-t border-line/70"
      aria-labelledby="story-title"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute top-1/2 right-10 -z-10 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.18),transparent_70%)] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-content px-5">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:min-h-[560px] lg:max-h-[80vh] lg:items-center">
          
          {/* Header Block: Order 1 on Mobile & Desktop Col 1 Row 1 */}
          <div className="order-1 flex flex-col lg:col-start-1 lg:row-start-1">
            <div className="inline-flex w-max items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-accent shadow-2xs">
              <Sparkles size={14} />
              <span>QTPhone Philosophy</span>
            </div>

            <h2
              id="story-title"
              className="mt-3.5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-[1.12]"
            >
              Where pure engineering meets visionary intelligence.
            </h2>

            <p className="mt-3.5 max-w-lg text-sm sm:text-base leading-7 text-muted">
              Every element of QTPhone is crafted not as a mere device, but as a seamless extension of
              human potential—balanced, enduring, and remarkably intuitive.
            </p>
          </div>

          {/* Product Glass Visual Card: Order 2 on Mobile & Desktop Col 2 Row 1-2 */}
          <div className="order-2 lg:col-start-2 lg:row-span-2 lg:self-center">
            <div className="premium-panel relative overflow-hidden rounded-[2rem] border border-white/15 bg-surface/85 p-6 sm:p-7 backdrop-blur-2xl shadow-cyanStrong">
              <div className="flex items-center justify-between border-b border-line/60 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
                    Visual Showcase
                  </span>
                </div>
                <span className="rounded-full border border-accent/40 bg-accent/15 px-3 py-0.5 text-[11px] font-extrabold text-accent">
                  {currentStory.badge}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`visual-${activeStep}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative mt-5 aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(ellipse_at_center,rgb(var(--color-accent)/0.18),transparent_75%)] bg-elevated sm:aspect-[16/10]"
                >
                  {activeProduct ? (
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                      className="absolute inset-0 flex items-center justify-center p-6"
                    >
                      <Image
                        src={activeProduct.image}
                        alt={`QTPhone ${currentStory.badge} visual preview`}
                        fill
                        priority
                        sizes="(min-width: 1024px) 480px, 90vw"
                        className="object-contain p-4 drop-shadow-[0_16px_30px_rgba(56,189,248,0.28)]"
                      />
                    </motion.div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-line/20 animate-pulse">
                      <span className="text-xs font-semibold text-muted">Loading visual...</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`spec-${activeStep}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mt-5 rounded-xl border border-accent/30 bg-[linear-gradient(135deg,rgb(var(--color-accent)/0.12),transparent)] p-4 shadow-inner"
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
                    {currentStory.highlightLabel}
                  </p>
                  <p className="mt-1 text-sm font-extrabold tracking-tight text-ink sm:text-base">
                    {currentStory.highlightValue}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Story Tabs & Active Story Detail: Order 3 on Mobile & Desktop Col 1 Row 2 */}
          <div className="order-3 flex flex-col lg:col-start-1 lg:row-start-2 lg:self-start">
            {/* Horizontal Compact Tabs */}
            <div className="flex flex-wrap items-center gap-2.5" role="tablist" aria-label="Story sections">
              {storySteps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={step.tabLabel}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveStep(index)}
                    className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 ${
                      isActive
                        ? "bg-accent text-white shadow-cyan border border-accent scale-105"
                        : "bg-elevated/80 text-muted hover:text-ink hover:bg-surface border border-line/80"
                    }`}
                  >
                    {step.tabLabel}
                  </button>
                );
              })}
            </div>

            {/* Active Story Detail Box below tabs */}
            <div className="mt-5 min-h-[140px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`detail-${activeStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-2xl border border-white/10 bg-elevated/60 p-5 sm:p-6 backdrop-blur-md shadow-sm"
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                    <StepIcon size={16} />
                    <span>{currentStory.badge}</span>
                  </div>
                  <h3 className="mt-2 text-lg sm:text-xl font-extrabold tracking-tight text-ink">
                    {currentStory.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-6 text-muted">
                    {currentStory.copy}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
