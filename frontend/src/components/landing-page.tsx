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

  // Recently viewed products state (cached locally after hydration)
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Active comparisons (IDs only)
  const [comparingIds, setComparingIds] = useState<number[]>([]);

  // Detailed Modal selected product
  const [selectedDetailsProduct, setSelectedDetailsProduct] = useState<Product | null>(null);

  // Track slideout drawers open state to avoid floating UI overlaps
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setFavorites(safeParse<Product[]>("helicorp-favs", []));
    setCart(safeParse<CartItem[]>("helicorp-cart", []));
    setRecentlyViewed(safeParse<Product[]>("qtphone-recently-viewed", []));
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

  // Sync recently viewed state cache
  useEffect(() => {
    if (!hasLoadedStorage) return;
    try {
      localStorage.setItem("qtphone-recently-viewed", JSON.stringify(recentlyViewed));
    } catch {
      // ignore quota exceeded errors
    }
  }, [recentlyViewed, hasLoadedStorage]);

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
    setRecentlyViewed((current) => [product, ...current.filter((item) => item.id !== product.id)].slice(0, 6));
    trackTelemetryEvent("click", `Inspect Specifications Detail: ${product.title}`, { productId: product.id });
    triggerTelemetryRefresh();
  };

  const handleClearRecentlyViewed = () => {
    setRecentlyViewed([]);
    trackTelemetryEvent("click", "Cleared recently viewed products");
    showToast("Recently viewed products cleared.", "info");
    triggerTelemetryRefresh();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#171b26] text-slate-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      <div className="scroll-progress" aria-hidden="true" />

      {/* Navbar layer */}
      <Navbar
        favorites={favorites}
        cart={cart}
        recentlyViewed={recentlyViewed}
        onRemoveFavorite={handleRemoveFavoriteId}
        onRemoveCart={handleRemoveCartId}
        onClearRecentlyViewed={handleClearRecentlyViewed}
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

      {/* Full-width aesthetic e-commerce footer */}
      <footer className="bg-white text-slate-600 dark:bg-[#111827] dark:text-zinc-300 pt-12 pb-20 md:pb-14 px-6 md:px-12 border-t border-slate-200 dark:border-white/10 text-xs transition-colors duration-300 selection:bg-cyan-500/30">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          {/* 4-Column E-commerce Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {/* Col 1: Brand & Social */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <img src="/qtphone-icon-transparent-512.png" alt="QTPhone" className="w-6 h-6 object-contain" />
                <span className="font-display font-bold text-base text-slate-950 dark:text-white tracking-widest uppercase">QTPhone</span>
              </div>
              <p className="leading-relaxed font-sans font-light text-slate-500 dark:text-zinc-400 text-xs pr-2">
                Next-gen smartphones engineered for unmatched performance and elegant living.
              </p>
              <div className="flex items-center gap-2.5 pt-1" aria-label="Social media links">
                <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-cyan-500 text-slate-600 hover:text-slate-950 dark:text-zinc-300 transition transform hover:scale-105">
                  <SocialFacebook className="w-3.5 h-3.5 fill-current" />
                </a>
                <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-cyan-500 text-slate-600 hover:text-slate-950 dark:text-zinc-300 transition transform hover:scale-105">
                  <SocialInstagram className="w-3.5 h-3.5 fill-current" />
                </a>
                <a href="https://x.com" aria-label="Twitter X" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-cyan-500 text-slate-600 hover:text-slate-950 dark:text-zinc-300 transition transform hover:scale-105">
                  <SocialX className="w-3.5 h-3.5 fill-current" />
                </a>
                <a href="https://tiktok.com" aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-cyan-500 text-slate-600 hover:text-slate-950 dark:text-zinc-300 transition transform hover:scale-105">
                  <SocialTikTok className="w-3.5 h-3.5 fill-current" />
                </a>
              </div>
            </div>

            {/* Col 2: Support */}
            <div className="flex flex-col gap-3">
              <h4 className="font-display font-bold text-xs text-slate-950 dark:text-white uppercase tracking-wider">Support</h4>
              <ul className="flex flex-col gap-2 font-medium text-xs text-slate-500 dark:text-zinc-400">
                <li><a href="#contact" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Contact Us</a></li>
                <li><a href="#faq" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">FAQ</a></li>
                <li><a href="#shipping" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Shipping</a></li>
                <li><a href="#tracking" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Order Tracking</a></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div className="flex flex-col gap-3">
              <h4 className="font-display font-bold text-xs text-slate-950 dark:text-white uppercase tracking-wider">Company</h4>
              <ul className="flex flex-col gap-2 font-medium text-xs text-slate-500 dark:text-zinc-400">
                <li><a href="#about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">About</a></li>
                <li><a href="#warranty" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Warranty</a></li>
                <li><a href="#stores" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Store Locator</a></li>
                <li><a href="#careers" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Careers</a></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="flex flex-col gap-3">
              <h4 className="font-display font-bold text-xs text-slate-950 dark:text-white uppercase tracking-wider">Newsletter</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-light">
                Get VIP flagship drops & neural engine insights directly to your inbox.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); showToast("Subscribed to VIP Newsletter!", "newsletter"); }} className="flex gap-1.5 pt-1">
                <input
                  type="email"
                  placeholder="Enter email..."
                  required
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition shrink-0 cursor-pointer shadow-xs"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar: Copyright & High-Contrast Legal Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1 text-xs md:pr-16">
            <div className="text-slate-500 dark:text-zinc-400 font-light text-center md:text-left">
              © 2026 QTPhone. All rights reserved.
            </div>

            <nav aria-label="Legal Navigation">
              <ul className="flex flex-wrap justify-center gap-4 text-slate-600 dark:text-zinc-300 font-medium">
                <li><a href="#privacy" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Terms</a></li>
                <li><a href="#accessibility" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Accessibility</a></li>
                <li><a href="#cookies-choices" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Set My Cookie Choices</a></li>
                <li><a href="#cookies-policy" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Cookie Policy</a></li>
              </ul>
            </nav>
          </div>
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

function SocialFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function SocialInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function SocialX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialTikTok({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export default LandingPage;
