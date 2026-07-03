"use client";

import React, { useState, useEffect } from "react";
import { Product, CartItem } from "../types";
import { trackTelemetryEvent } from "../api";
import { useSmartphones } from "@/lib/use-smartphones";
import { useBehaviorTracker } from "@/lib/use-behavior-tracker";
import { useScrollytelling } from "@/lib/use-scrollytelling";
import Navbar from "./Navbar";
import Hero from "./Hero";
import FeatureShowcase from "./FeatureShowcase";
import ProductGrid from "./ProductGrid";
import CompareSection from "./CompareSection";
import DetailModal from "./DetailModal";
import Newsletter from "./Newsletter";
import Chatbot from "./Chatbot";
import ToastContainer, { showToast } from "./Toast";
import { ShieldCheck, Sparkles } from "lucide-react";

function safeParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function LandingPage() {
  const { status, products, message } = useSmartphones();
  const isLoading = status === "loading";
  const error = status === "error" ? (message || "Failed to retrieve smartphone items from DummyJSON API.") : null;

  // Activate automated behavior tracking hook
  useBehaviorTracker();
  useScrollytelling();

  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  // Curation / favorites state (cached locally after hydration)
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Pre-order cart state (cached locally after hydration)
  const [cart, setCart] = useState<CartItem[]>([]);

  // Active comparisons (IDs only)
  const [comparingIds, setComparingIds] = useState<number[]>([]);

  // Detailed Modal selected product
  const [selectedDetailsProduct, setSelectedDetailsProduct] = useState<Product | null>(null);

  // Track slideout drawers open state to avoid floating UI overlaps
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setFavorites(safeParse<Product[]>("helicorp-favs", []));
    setCart(safeParse<CartItem[]>("helicorp-cart", []));
    setHasLoadedStorage(true);
  }, []);

  // Sync favorites state cache
  useEffect(() => {
    if (!hasLoadedStorage) return;
    try {
      localStorage.setItem("helicorp-favs", JSON.stringify(favorites));
    } catch {
      // ignore quota exceeded errors
    }
  }, [favorites, hasLoadedStorage]);

  // Sync pre-order cart cache
  useEffect(() => {
    if (!hasLoadedStorage) return;
    try {
      localStorage.setItem("helicorp-cart", JSON.stringify(cart));
    } catch {
      // ignore quota exceeded errors
    }
  }, [cart, hasLoadedStorage]);

  // Track page load telemetry once catalog is ready
  useEffect(() => {
    if (status === "success" && products.length > 0) {
      trackTelemetryEvent("navigation", "Landing Page Loaded", { deviceCount: products.length });
    }
  }, [status, products.length]);

  const triggerTelemetryRefresh = () => {};

  // Toggle Curation Favorites
  const handleToggleFavorite = (product: Product) => {
    const isFav = favorites.some((f) => f.id === product.id);
    let updated: Product[];

    if (isFav) {
      updated = favorites.filter((f) => f.id !== product.id);
      trackTelemetryEvent("favorite", `Removed from Favorites: ${product.title}`, { productId: product.id });
      showToast(`Removed ${product.title} from favorites.`, "info");
    } else {
      updated = [...favorites, product];
      trackTelemetryEvent("favorite", `Added to Favorites: ${product.title}`, { productId: product.id });
      showToast(`Added ${product.title} to favorites.`, "favorite");
    }

    setFavorites(updated);
    triggerTelemetryRefresh();
  };

  const handleRemoveFavoriteId = (id: number) => {
    const updated = favorites.filter((f) => f.id !== id);
    const item = favorites.find((f) => f.id === id);
    if (item) {
      trackTelemetryEvent("favorite", `Removed from Favorites drawer: ${item.title}`, { productId: id });
    }
    setFavorites(updated);
    triggerTelemetryRefresh();
  };

  // Pre-order Cart handling
  const handleToggleCart = (product: Product) => {
    const existing = cart.find((c) => c.product.id === product.id);
    let updated: CartItem[];

    if (existing) {
      // Toggle off / remove
      updated = cart.filter((c) => c.product.id !== product.id);
      trackTelemetryEvent("cart", `Removed Pre-order item: ${product.title}`, { productId: product.id });
      showToast(`Removed pre-order: ${product.title}`, "info");
    } else {
      // Add as pre-order
      updated = [...cart, { id: Date.now(), product, quantity: 1 }];
      trackTelemetryEvent("cart", `Pre-ordered Device: ${product.title}`, { productId: product.id, price: product.price });
      showToast(`Queued pre-order reservation for ${product.title}!`, "cart");
    }

    setCart(updated);
    triggerTelemetryRefresh();
  };

  const handleRemoveCartId = (id: number) => {
    const item = cart.find((c) => c.id === id);
    const updated = cart.filter((c) => c.id !== id);
    if (item) {
      trackTelemetryEvent("cart", `Removed from Pre-order cart: ${item.product.title}`, { productId: item.product.id });
    }
    setCart(updated);
    triggerTelemetryRefresh();
  };

  const handleCheckoutDemo = () => {
    trackTelemetryEvent("click", "Trigger secure checkout preorder dispatch", {
      cartItems: cart.map((c) => ({ title: c.product.title, price: c.product.price })),
    });
    showToast("Pre-order reservation submitted successfully.", "cart");
    setCart([]); // Clear pre-orders
    triggerTelemetryRefresh();
  };

  // Compare section state toggles (supports max 3 devices for layout integrity)
  const handleToggleCompare = (product: Product) => {
    const active = comparingIds.includes(product.id);
    let updated: number[];

    if (active) {
      updated = comparingIds.filter((id) => id !== product.id);
      trackTelemetryEvent("click", `Removed from Compare matrix: ${product.title}`);
    } else {
      if (comparingIds.length >= 3) {
        showToast("Maximum of 3 devices can be loaded into specs matrix.", "info");
        return;
      }
      updated = [...comparingIds, product.id];
      trackTelemetryEvent("click", `Added to Compare matrix: ${product.title}`);
    }

    setComparingIds(updated);
    triggerTelemetryRefresh();
  };

  // Trigger quick spec view modal overlay
  const handleViewDetails = (product: Product) => {
    setSelectedDetailsProduct(product);
    trackTelemetryEvent("click", `Inspect Specifications Detail: ${product.title}`, { productId: product.id });
    triggerTelemetryRefresh();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#171b26] text-slate-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      {/* Navbar layer */}
      <Navbar
        favorites={favorites}
        cart={cart}
        onRemoveFavorite={handleRemoveFavoriteId}
        onRemoveCart={handleRemoveCartId}
        onCheckoutDemo={handleCheckoutDemo}
        onViewProduct={handleViewDetails}
        onRefreshTelemetry={triggerTelemetryRefresh}
        onDrawerChange={setIsDrawerOpen}
      />

      {/* Hero Display */}
      <Hero products={products} onRefreshTelemetry={triggerTelemetryRefresh} />

      <main id="main-content" className="flex-grow story-flow">
        {/* Visionary Intelligence & Flagship Features Showcase */}
        <FeatureShowcase products={products} />

        {/* Curated Products Catalog */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          error={error}
          favorites={favorites}
          cart={cart}
          comparingIds={comparingIds}
          onToggleFavorite={handleToggleFavorite}
          onToggleCart={handleToggleCart}
          onToggleCompare={handleToggleCompare}
          onViewDetails={handleViewDetails}
          onRefreshTelemetry={triggerTelemetryRefresh}
        />

        {/* Specifications Matrix comparisons */}
        <CompareSection
          products={products}
          comparingIds={comparingIds}
          onToggleCompare={handleToggleCompare}
          onAddCart={handleToggleCart}
          cart={cart}
          onRefreshTelemetry={triggerTelemetryRefresh}
        />

        {/* Newsletter pre-order list conversions */}
        <Newsletter onRefreshTelemetry={triggerTelemetryRefresh} />
      </main>

      {/* Floating Chatbot shopping concierge co-pilot */}
      <Chatbot onRefreshTelemetry={triggerTelemetryRefresh} isDrawerOpen={isDrawerOpen} />

      {/* Custom Event-driven alerts stream */}
      <ToastContainer />

      {/* Full-width aesthetic static footer */}
      <footer className="bg-slate-100 dark:bg-[#1d2432] pt-16 pb-28 px-6 md:px-12 border-t border-slate-200 dark:border-white/10 text-slate-500 dark:text-zinc-400 text-xs transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <div className="flex items-center gap-2">
              <img src="/qtphone-icon-transparent-512.png" alt="QTPhone" className="w-5 h-5 object-contain opacity-80" />
              <span className="font-display font-bold text-sm text-slate-900 dark:text-white tracking-wide uppercase">QTPHONE</span>
            </div>
            <p className="leading-relaxed font-sans font-light text-slate-600 dark:text-zinc-400">
              Next-gen smartphones engineered for unmatched performance and elegant living.
            </p>
          </div>

          <div className="flex gap-4 items-center select-none">
            <span className="flex items-center gap-1.5 bg-white dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-none">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-300">FLAGSHIP SECURED</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-none">
              <Sparkles className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-300">NEURAL ENGINE OK</span>
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-slate-200 dark:border-white/5 text-center text-[10px] text-slate-500 dark:text-zinc-600 font-sans font-light">
          © 2026 QTPhone. All rights reserved.
        </div>
      </footer>

      {/* Detail quick specification modal overlay */}
      {selectedDetailsProduct && (
        <DetailModal
          product={selectedDetailsProduct}
          onClose={() => setSelectedDetailsProduct(null)}
          isFavorite={favorites.some((f) => f.id === selectedDetailsProduct.id)}
          isInCart={cart.some((c) => c.product.id === selectedDetailsProduct.id)}
          onToggleFavorite={handleToggleFavorite}
          onToggleCart={handleToggleCart}
        />
      )}
    </div>
  );
}

export default LandingPage;
