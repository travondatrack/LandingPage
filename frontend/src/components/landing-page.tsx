"use client";

import dynamic from "next/dynamic";
import { BehaviorToast } from "@/components/behavior-toast";
import { BrandStorySection } from "@/components/sections/brand-story-section";
import { FeatureSection } from "@/components/sections/feature-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { SpecsSection } from "@/components/sections/specs-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useBehaviorTracker } from "@/lib/use-behavior-tracker";
import { useSmartphones } from "@/lib/use-smartphones";

const ChatbotWidget = dynamic(
  () => import("@/components/chatbot-widget").then((mod) => mod.ChatbotWidget),
  { ssr: false }
);
const NewsletterSection = dynamic(
  () => import("@/components/sections/newsletter-section").then((mod) => mod.NewsletterSection),
  {
    loading: () => (
      <section id="newsletter" className="border-t border-line bg-canvas py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-content px-5">
          <div className="h-48 animate-pulse rounded-[1.75rem] border border-line bg-elevated" />
        </div>
      </section>
    )
  }
);

export function LandingPage() {
  const productState = useSmartphones();
  const behaviorNotice = useBehaviorTracker();

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-ink">
      <BehaviorToast message={behaviorNotice} />
      <SiteHeader />
      <main id="main-content">
        <HeroSection productState={productState} />
        <BrandStorySection productState={productState} />
        <FeatureSection />
        <ProductShowcase productState={productState} />
        <SpecsSection productState={productState} />
        <NewsletterSection />
      </main>
      <SiteFooter />
      <ChatbotWidget />
    </div>
  );
}
