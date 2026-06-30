"use client";

import { BehaviorToast } from "@/components/behavior-toast";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { BrandStorySection } from "@/components/sections/brand-story-section";
import { FeatureSection } from "@/components/sections/feature-section";
import { HeroSection } from "@/components/sections/hero-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { SpecsSection } from "@/components/sections/specs-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useBehaviorTracker } from "@/lib/use-behavior-tracker";
import { useSmartphones } from "@/lib/use-smartphones";

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
