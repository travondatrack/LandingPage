"use client";

import dynamic from "next/dynamic";
import { BrandStorySection } from "@/components/sections/brand-story-section";
import { FeatureSection } from "@/components/sections/feature-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { TrustedBrandsSection } from "@/components/sections/trusted-brands-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-ink">
      <SiteHeader />
      <main id="main-content">
        <HeroSection productState={productState} />
        <TrustedBrandsSection />
        <BrandStorySection productState={productState} />
        <FeatureSection />
        <ProductShowcase productState={productState} />
        <NewsletterSection />
      </main>
      <SiteFooter />
      <ChatbotWidget />
    </div>
  );
}
