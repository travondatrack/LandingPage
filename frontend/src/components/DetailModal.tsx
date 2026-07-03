"use client";

import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { X, ShoppingBag, Heart, Star } from "lucide-react";

interface DetailModalProps {
  product: Product | null;
  onClose: () => void;
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: (product: Product) => void;
  onToggleCart: (product: Product) => void;
}

export default function DetailModal({
  product,
  onClose,
  isFavorite,
  isInCart,
  onToggleFavorite,
  onToggleCart,
}: DetailModalProps) {
  // Selected gallery image state must be called unconditionally
  const [activeImage, setActiveImage] = useState(product?.thumbnail || "");

  useEffect(() => {
    if (product?.thumbnail) {
      setActiveImage(product.thumbnail);
    }
  }, [product]);

  if (!product) return null;

  // Fallback to empty colors array if undefined
  const colorsList = product.specs.colors || ["Graphite Charcoal"];

  // Calculate original list price based on the discount percentage
  const originalPrice = Math.round(product.price / (1 - (product.discountPercentage || 0) / 100));

  return (
    <div
      id="product-details-modal"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-[#1d2432] border border-slate-200 dark:border-slate-500/25 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-zinc-100">
        {/* Absolute Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-slate-500 dark:text-zinc-400 hover:text-black dark:hover:text-white p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 transition shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left column: Image Gallery & Previews */}
        <div className="md:w-1/2 p-6 bg-slate-50 dark:bg-[#171b26] border-r border-slate-200 dark:border-slate-500/20 flex flex-col justify-between gap-4">
          <div className="flex-1 flex flex-col justify-center items-center">
            {/* Active Display Image */}
            <div className="relative w-full aspect-square max-h-[300px] bg-white dark:bg-[#253145] rounded-2xl border border-slate-200 dark:border-slate-500/20 overflow-hidden flex items-center justify-center shadow-inner">
              <img
                src={activeImage}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Gallery Thumbnail Triggers */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 mt-4 overflow-x-auto py-1 max-w-full">
                {Array.from(new Set([product.thumbnail, ...product.images]))
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-12 h-12 rounded-xl border p-1 bg-white dark:bg-[#202838] shrink-0 transition ${
                        activeImage === img ? "border-blue-600 dark:border-white scale-95 shadow-sm" : "border-slate-200 dark:border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Technical Specifications list */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between gap-6">
          <div>
            {/* Brand and Stock Alert */}
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-500">
              <span className="font-bold text-slate-900 dark:text-white">{product.brand}</span>
              <span>STOCK PRE-ORDER: {product.stock} UNITS</span>
            </div>

            {/* Title */}
            <h2 className="mt-1 text-slate-900 dark:text-white text-2xl font-display font-light tracking-tight">{product.title}</h2>

            {/* Rating Stars */}
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(product.rating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold font-mono text-slate-700 dark:text-zinc-300">{(product.rating || 0).toFixed(2)}</span>
            </div>

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">${product.price}</span>
              <span className="text-xs font-mono text-slate-400 dark:text-zinc-500 line-through">${originalPrice}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 text-[9px] font-mono font-bold shadow-xs">
                SAVE ${originalPrice - product.price}
              </span>
            </div>

            {/* Description */}
            <p className="mt-4 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans font-light">{product.description}</p>

            {/* Tech Specs Bento Grid List */}
            <div className="mt-6">
              <h3 className="text-[10px] font-mono font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase border-b border-slate-200 dark:border-white/5 pb-1.5">
                TECHNICAL SPECIFICATIONS
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-3.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">DISPLAY SIZE / TECH</span>
                  <span className="text-slate-800 dark:text-zinc-300 mt-0.5 font-medium block">
                    {product.specs.displayType} ({product.specs.screenSize})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">SOC PROCESSOR</span>
                  <span className="text-slate-800 dark:text-zinc-300 mt-0.5 font-medium block">{product.specs.processor}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">MAIN CAMERA OPTICS</span>
                  <span className="text-slate-800 dark:text-zinc-300 mt-0.5 font-medium block">{product.specs.rearCamera}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">SELFIE FRONT OPTICS</span>
                  <span className="text-slate-800 dark:text-zinc-300 mt-0.5 font-medium block">{product.specs.frontCamera}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">BATTERY CELL SPEED</span>
                  <span className="text-slate-800 dark:text-zinc-300 mt-0.5 font-medium block">
                    {product.specs.battery} / {product.specs.charging}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">DISK & MEMORY</span>
                  <span className="text-slate-800 dark:text-zinc-300 mt-0.5 font-medium block">
                    {product.specs.ram} RAM / {product.specs.storage}
                  </span>
                </div>
              </div>

              {/* Color Swatches */}
              <div className="mt-5">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">AVAILABLE SHADES</span>
                <div className="flex gap-2 mt-2">
                  {colorsList.map((color, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-mono text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-white/10"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-white/5">
            {/* preorder */}
            <button
              onClick={() => onToggleCart(product)}
              className={`flex-1 py-3 px-4 rounded-full font-display font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
                isInCart ? "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-300/25" : "bg-blue-600 dark:bg-sky-500 hover:bg-blue-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-bold shadow-md"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isInCart ? "PRE-ORDER RESERVED" : "SECURE PRE-ORDER QUEUE"}</span>
            </button>

            {/* Favorite toggle */}
            <button
              onClick={() => onToggleFavorite(product)}
              className={`p-3 rounded-full border transition-all active:scale-90 ${
                isFavorite
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-500 dark:text-rose-400"
                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 dark:fill-rose-400 text-rose-500 dark:text-rose-400" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}