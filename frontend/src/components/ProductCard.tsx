"use client";

import React from "react";
import { Product } from "../types";
import { Star, Heart, ShoppingBag, Eye, ArrowLeftRight, Check } from "lucide-react";

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  isFavorite: boolean;
  isInCart: boolean;
  isComparing: boolean;
  onToggleFavorite: (product: Product) => void;
  onToggleCart: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({
  product,
  isFavorite,
  isInCart,
  isComparing,
  onToggleFavorite,
  onToggleCart,
  onToggleCompare,
  onViewDetails,
}: ProductCardProps) {
  // Calculate original list price based on the discount percentage
  const originalPrice = Math.round(product.price / (1 - (product.discountPercentage || 0) / 100));

  return (
    <div
      className="micro-lift group relative bg-white dark:bg-[#202838] border border-slate-200 dark:border-slate-500/20 rounded-2xl overflow-hidden hover:bg-slate-50 dark:hover:bg-[#253145] hover:border-slate-300 dark:hover:border-slate-400/30 transition-all duration-500 flex flex-col justify-between shadow-sm dark:shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
      style={{ contentVisibility: "auto" }}
    >
      {/* Badges / Floating Controls Header */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
        {/* Discount Badge */}
        <span className="px-2.5 py-1 rounded-full bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 text-[9px] font-mono font-bold uppercase tracking-wider shadow-lg">
          -{Math.round(product.discountPercentage || 0)}%
        </span>

        {/* Favorite Trigger */}
        <button
          onClick={() => onToggleFavorite(product)}
          className={`p-2 rounded-full border backdrop-blur-md transition-all active:scale-90 ${
            isFavorite
              ? "bg-rose-500/20 border-rose-500/40 text-rose-500 dark:text-rose-400"
              : "bg-white/80 dark:bg-slate-900/55 border-slate-200 dark:border-slate-500/25 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 shadow-xs"
          }`}
          title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-rose-500 dark:fill-rose-400 text-rose-500 dark:text-rose-400" : ""}`} />
        </button>
      </div>

      {/* Product Image Area */}
      <div className="relative pt-[70%] bg-slate-100 dark:bg-[#253145] overflow-hidden border-b border-slate-200 dark:border-slate-500/20 flex items-center justify-center">
        <img
          src={product.thumbnail}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-contain p-7 group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {/* Hover quick spec shortcut bar */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="px-5 py-2.5 bg-white text-black text-xs font-semibold rounded-full flex items-center gap-1.5 hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Specifications</span>
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Brand and Stock Alert */}
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">
            <span>{product.brand}</span>
            <span className={product.stock < 40 ? "text-amber-500 dark:text-amber-300 font-bold" : "text-slate-500 dark:text-slate-400"}>
              {product.stock < 40 ? `Only ${product.stock} left!` : "In Stock"}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-1 text-slate-900 dark:text-slate-50 text-sm font-display font-medium tracking-tight group-hover:text-blue-600 dark:group-hover:text-white truncate">
            {product.title}
          </h3>

          {/* Micro Rating */}
          <div className="mt-1.5 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-200 font-semibold">{(product.rating || 0).toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">/ 5.00</span>
          </div>

          {/* Description Snippet */}
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans font-light line-clamp-2">
            {product.description}
          </p>
        </div>

        <div>
          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 pt-3 border-t border-slate-200 dark:border-slate-500/20">
            <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-50">${product.price}</span>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 line-through">${originalPrice}</span>
          </div>

          {/* Action Row */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {/* Cartpre-order button */}
            <button
              onClick={() => onToggleCart(product)}
              className={`py-2 px-3 rounded-full text-[11px] font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                isInCart
                  ? "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-300/25"
                  : "bg-blue-600 dark:bg-sky-500 hover:bg-blue-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 shadow-xs"
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Pre-Order</span>
                </>
              )}
            </button>

            {/* Compare checkbox / button */}
            <button
              onClick={() => onToggleCompare(product)}
              className={`py-2 px-3 rounded-full text-[11px] font-semibold flex items-center justify-center gap-1.5 transition border ${
                isComparing
                  ? "border-blue-500 dark:border-sky-300/40 bg-blue-50 dark:bg-sky-400/10 text-blue-600 dark:text-sky-200"
                  : "border-slate-200 dark:border-slate-500/25 bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isComparing ? "Comparing" : "Compare"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
