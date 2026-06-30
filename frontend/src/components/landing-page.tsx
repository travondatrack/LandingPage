"use client";

import { FeatureSection } from "@/components/sections/feature-section";
import { HeroSection } from "@/components/sections/hero-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { SpecsSection } from "@/components/sections/specs-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useSmartphones } from "@/lib/use-smartphones";

export function LandingPage() {
  const productState = useSmartphones();

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-ink">
      <SiteHeader />
      <main id="main-content">
        <HeroSection productState={productState} />
        <FeatureSection />
        <ProductShowcase productState={productState} />
        <SpecsSection productState={productState} />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  );
}
