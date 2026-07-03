"use client";

import React, { useState } from "react";
import { Product, CartItem } from "../types";
import { Heart, ShoppingBag, ShieldCheck, Trash2, ArrowRight, Sun, Moon } from "lucide-react";
import { trackTelemetryEvent } from "../api";
import { useTheme } from "@/lib/theme";

interface NavbarProps {
  favorites: Product[];
  cart: CartItem[];
  onRemoveFavorite: (id: number) => void;
  onRemoveCart: (id: number) => void;
  onCheckoutDemo: () => void;
  onViewProduct: (product: Product) => void;
  onRefreshTelemetry: () => void;
  onDrawerChange?: (isOpen: boolean) => void;
}

export default function Navbar({
  favorites,
  cart,
  onRemoveFavorite,
  onRemoveCart,
  onCheckoutDemo,
  onViewProduct,
  onRefreshTelemetry,
  onDrawerChange,
}: NavbarProps) {
  const [showFavDrawer, setShowFavDrawer] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    onDrawerChange?.(showFavDrawer || showCartDrawer);
  }, [showFavDrawer, showCartDrawer, onDrawerChange]);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const toggleFavDrawer = () => {
    setShowFavDrawer(!showFavDrawer);
    if (!showFavDrawer) {
      setShowCartDrawer(false);
      trackTelemetryEvent("click", "Navbar: Open Favorites Drawer", { count: favorites.length });
      onRefreshTelemetry();
    }
  };

  const toggleCartDrawer = () => {
    setShowCartDrawer(!showCartDrawer);
    if (!showCartDrawer) {
      setShowFavDrawer(false);
      trackTelemetryEvent("click", "Navbar: Open Cart Drawer", { count: cartItemCount, total: cartTotal });
      onRefreshTelemetry();
    }
  };

  return (
    <>
      <header id="site-header" className="sticky top-0 z-[55] bg-white/85 dark:bg-[#171b26]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 px-6 md:px-12 h-20 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shrink-0 p-1.5">
            <img src="/qtphone-icon-transparent-512.png" alt="QTPhone" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-black text-slate-900 dark:text-white text-lg tracking-tighter uppercase leading-none block">
              QTPhone
            </span>
            <span className="text-[9px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-widest block mt-0.5">
              FLAGSHIP SERIES
            </span>
          </div>
        </div>

        {/* Central Anchor Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-white/60">
          <a
            href="#explore-engineering"
            onClick={() => trackTelemetryEvent("click", "Navbar Nav: Explore")}
            className="hover:text-black dark:hover:text-white transition"
          >
            Explore
          </a>
          <a
            href="#smartphone-catalog"
            onClick={() => trackTelemetryEvent("click", "Navbar Nav: Shop")}
            className="hover:text-black dark:hover:text-white transition"
          >
            Shop
          </a>
          <a
            href="#specs-compare"
            onClick={() => trackTelemetryEvent("click", "Navbar Nav: Support")}
            className="hover:text-black dark:hover:text-white transition"
          >
            Support
          </a>
          <a
            href="#newsletter-signup"
            onClick={() => trackTelemetryEvent("click", "Navbar Nav: Pre-order")}
            className="hover:text-black dark:hover:text-white transition"
          >
            Pre-order
          </a>
        </nav>

        {/* Interaction Triggers */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-zinc-400 hover:text-black dark:hover:text-white transition cursor-pointer shadow-sm"
            title={theme === "dark" ? "Chuyển sang Light Mode" : "Chuyển sang Dark Mode dịu mắt"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {/* Favorites Button */}
          <button
            onClick={toggleFavDrawer}
            className={`relative p-2.5 rounded-full border text-slate-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 transition hover:bg-slate-100 dark:hover:bg-white/5 ${
              showFavDrawer ? "bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 border-rose-300 dark:border-rose-500/30" : "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5"
            }`}
            title="Favorites"
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={toggleCartDrawer}
            className={`relative p-2.5 rounded-full border text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition hover:bg-slate-100 dark:hover:bg-white/5 ${
              showCartDrawer ? "bg-slate-200 dark:bg-white/10 text-black dark:text-white border-slate-300 dark:border-white/20" : "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5"
            }`}
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Sign in Button */}
          <button
            onClick={() => trackTelemetryEvent("click", "Navbar: Click Sign In")}
            className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-display font-medium text-xs px-4 py-2 rounded-full transition shadow-lg shadow-blue-600/20 ml-1 cursor-pointer"
          >
            <span>Sign in</span>
          </button>
        </div>
      </header>

      {/* Slideout Drawers Overlay */}
      {(showFavDrawer || showCartDrawer) && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[45] transition-opacity"
          onClick={() => {
            setShowFavDrawer(false);
            setShowCartDrawer(false);
          }}
        />
      )}

      {/* Favorites List Drawer */}
      <div
        className={`fixed top-20 right-0 h-[calc(100vh-5rem)] w-full sm:w-96 bg-white dark:bg-[#1d2432] border-l border-slate-200 dark:border-white/10 z-50 transition-transform duration-300 transform shadow-2xl flex flex-col text-slate-900 dark:text-zinc-100 ${
          showFavDrawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-sm font-display font-medium tracking-wide">SAVED FAVORITES</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase">{favorites.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {favorites.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600 gap-2 h-44 text-center">
              <Heart className="w-8 h-8 text-slate-300 dark:text-zinc-800" />
              <p className="text-xs">No favorites saved yet.</p>
              <p className="text-[10px] max-w-xs text-slate-400 dark:text-zinc-500">Click the heart icon on any device to add it here.</p>
            </div>
          ) : (
            favorites.map((product) => (
              <div
                key={product.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition flex gap-3 items-center"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-12 h-12 rounded object-cover bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{product.title}</h4>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 mt-0.5">${product.price}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onViewProduct(product)}
                    className="p-1 text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white text-[10px] uppercase font-bold tracking-wider font-mono hover:bg-slate-200 dark:hover:bg-white/5 rounded transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(product.id)}
                    className="p-1.5 text-slate-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cart List Drawer */}
      <div
        className={`fixed top-20 right-0 h-[calc(100vh-5rem)] w-full sm:w-96 bg-white dark:bg-[#1d2432] border-l border-slate-200 dark:border-white/10 z-50 transition-transform duration-300 transform shadow-2xl flex flex-col text-slate-900 dark:text-zinc-100 ${
          showCartDrawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-white" />
            <span className="text-sm font-display font-medium tracking-wide">YOUR PRE-ORDER CART</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase">{cartItemCount} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-zinc-600 gap-2 h-44 text-center">
              <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-zinc-800" />
              <p className="text-xs">Your pre-order cart is empty.</p>
              <p className="text-[10px] max-w-xs text-slate-400 dark:text-zinc-500">Add smartphones to prepare your launch reservation.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition flex gap-3 items-center"
              >
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  className="w-12 h-12 rounded object-cover bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-white/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{item.product.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">${item.product.price}</p>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">Qty: {item.quantity}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveCart(item.id)}
                  className="p-1.5 text-slate-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded transition shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/5 flex flex-col gap-3 shrink-0">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-zinc-400 font-medium">Pre-order Subtotal</span>
              <span className="font-mono font-bold text-sm">${cartTotal}</span>
            </div>

            <button
              onClick={onCheckoutDemo}
              className="w-full bg-blue-600 dark:bg-sky-500 hover:bg-blue-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-display font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 transition shadow-md"
            >
              <span>RESERVE PRE-ORDER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-400 dark:text-zinc-500 select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>QTPhone flagship pre-order queue</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
