"use client";

import React from "react";
import { Product, CartItem } from "../types";
import { ArrowLeftRight, X, Star, Sparkles, AlertCircle } from "lucide-react";
import { trackTelemetryEvent } from "../api";

interface CompareSectionProps {
  products: Product[];
  comparingIds: number[];
  onToggleCompare: (product: Product) => void;
  onAddCart: (product: Product) => void;
  cart: CartItem[];
  onRefreshTelemetry: () => void;
}

export default function CompareSection({
  products,
  comparingIds,
  onToggleCompare,
  onAddCart,
  cart,
  onRefreshTelemetry,
}: CompareSectionProps) {
  // Get currently selected products
  const selectedProducts = products.filter((p) => comparingIds.includes(p.id));

  // Default demo comparisons if empty
  const handleQuickCompare = (idA: number, idB: number) => {
    trackTelemetryEvent("click", "Compare Section: Trigger Quick Shortcut Comparison", { idA, idB });
    onRefreshTelemetry();
    // Reset comparing and select idA and idB
    const prodA = products.find((p) => p.id === idA);
    const prodB = products.find((p) => p.id === idB);
    if (prodA && !comparingIds.includes(idA)) onToggleCompare(prodA);
    if (prodB && !comparingIds.includes(idB)) onToggleCompare(prodB);
  };

  const clearComparing = () => {
    trackTelemetryEvent("click", "Compare Section: Clear all selections");
    onRefreshTelemetry();
    selectedProducts.forEach((p) => onToggleCompare(p));
  };

  const getIsDiff = (key: keyof Product["specs"] | "price" | "rating" | "brand") => {
    if (selectedProducts.length < 2) return false;
    const firstVal =
      key in selectedProducts[0]
        ? selectedProducts[0][key as keyof Product]
        : selectedProducts[0].specs[key as keyof Product["specs"]];
    return selectedProducts.some((p) => {
      const val = key in p ? p[key as keyof Product] : p.specs[key as keyof Product["specs"]];
      return String(val) !== String(firstVal);
    });
  };

  return (
    <section id="specs-compare" className="story-panel bg-[#f8fafc] dark:bg-[#171b26] py-16 px-6 md:px-12 border-b border-slate-200 dark:border-white/10 scroll-mt-20 transition-colors duration-300" data-reveal>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10" data-reveal>
          <div>
            <h2 className="font-display font-light text-3xl text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-blue-600 dark:text-white" />
              <span>Specs <span className="font-serif italic text-slate-500 dark:text-zinc-400">Matrix</span></span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">
              Analyze and cross-reference hardware capabilities side-by-side to make data-driven buying decisions.
            </p>
          </div>

          {selectedProducts.length > 0 && (
            <button
              onClick={clearComparing}
              className="text-[10px] font-mono uppercase tracking-wider bg-slate-200/70 hover:bg-slate-300/70 dark:bg-white/5 dark:hover:bg-white/10 px-4 py-2 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white rounded-full transition"
            >
              Clear Comparison Matrix
            </button>
          )}
        </div>

        {/* Comparison Table Workspace */}
        {selectedProducts.length === 0 ? (
          /* Empty / Suggestion Area */
          <div className="micro-lift p-8 md:p-12 rounded-2xl bg-white dark:bg-[#202838] border border-slate-200 dark:border-slate-500/20 flex flex-col items-center text-center shadow-sm dark:shadow-[0_18px_45px_rgba(0,0,0,0.16)]" data-reveal>
            <ArrowLeftRight className="w-10 h-10 text-slate-400 dark:text-slate-500 animate-pulse" />
            <h3 className="text-slate-800 dark:text-slate-100 font-display font-medium text-sm mt-4">Compare Matrices are Empty</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mt-1 leading-relaxed">
              No smartphones are loaded into the comparison matrix. Click &quot;Compare&quot; on catalog items or trigger a pre-configured scenario below.
            </p>

            <div className="mt-8">
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-zinc-600 tracking-wider uppercase block mb-3">
                Pre-configured Battle Scenarios
              </span>
              <div className="flex flex-wrap gap-3 justify-center">
                {products.length >= 2 && (
                  <button
                    onClick={() => handleQuickCompare(products[0]?.id || 1, products[1]?.id || 2)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-700 dark:text-zinc-300 rounded-full border border-slate-200 dark:border-white/10 transition flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    <span>Compare Top 2 Flagships</span>
                  </button>
                )}
                {products.length >= 4 && (
                  <button
                    onClick={() => handleQuickCompare(products[2]?.id || 3, products[3]?.id || 4)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-700 dark:text-zinc-300 rounded-full border border-slate-200 dark:border-white/10 transition flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                    <span>Compare Midrange & Value</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Comparison Table Grid */
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-500/25 bg-white dark:bg-[#202838] backdrop-blur-md shadow-sm dark:shadow-none" data-reveal>
            <table className="w-full text-left border-collapse min-w-[600px] text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
                  <th className="p-4 font-mono font-bold text-slate-500 dark:text-zinc-500 w-1/4">Specification Fields</th>
                  {selectedProducts.map((p) => (
                    <th key={p.id} className="p-4 w-1/4 relative">
                      <button
                        onClick={() => onToggleCompare(p)}
                        className="absolute top-2 right-2 text-slate-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/5 transition"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-3 mt-2">
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="w-10 h-10 object-cover rounded border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-zinc-950 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-display font-medium text-slate-900 dark:text-zinc-200 truncate">{p.title}</h4>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500">{p.brand}</span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {/* Price Row */}
                <tr className={getIsDiff("price") ? "bg-slate-50/80 dark:bg-white/[0.02]" : ""}>
                  <td className="p-4 font-mono font-bold text-slate-600 dark:text-zinc-400">Retail Pre-Order Price</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                      ${p.price}
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr className={getIsDiff("rating") ? "bg-slate-50/80 dark:bg-white/[0.02]" : ""}>
                  <td className="p-4 font-mono text-slate-600 dark:text-zinc-400">Hardware Rating</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4">
                      <div className="flex items-center gap-1 font-mono">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-900 dark:text-zinc-200">{(p.rating || 0).toFixed(2)}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Display Type */}
                <tr className={getIsDiff("displayType") ? "bg-slate-50/80 dark:bg-white/[0.02]" : ""}>
                  <td className="p-4 font-mono text-slate-600 dark:text-zinc-400">Display Technology</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800 dark:text-zinc-300">
                      <div>{p.specs.displayType}</div>
                      <div className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">{p.specs.screenSize}</div>
                    </td>
                  ))}
                </tr>

                {/* Processor */}
                <tr className={getIsDiff("processor") ? "bg-slate-50/80 dark:bg-white/[0.02]" : ""}>
                  <td className="p-4 font-mono text-slate-600 dark:text-zinc-400">CPU SoC Processor</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800 dark:text-zinc-300">
                      {p.specs.processor}
                    </td>
                  ))}
                </tr>

                {/* Rear Camera */}
                <tr className={getIsDiff("rearCamera") ? "bg-slate-50/80 dark:bg-white/[0.02]" : ""}>
                  <td className="p-4 font-mono text-slate-600 dark:text-zinc-400">Rear Camera Optics</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800 dark:text-zinc-300">
                      {p.specs.rearCamera}
                    </td>
                  ))}
                </tr>

                {/* Front Camera */}
                <tr className={getIsDiff("frontCamera") ? "bg-slate-50/80 dark:bg-white/[0.02]" : ""}>
                  <td className="p-4 font-mono text-slate-600 dark:text-zinc-400">Front Selfie Optics</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800 dark:text-zinc-300">
                      {p.specs.frontCamera}
                    </td>
                  ))}
                </tr>

                {/* OS */}
                <tr className={getIsDiff("os") ? "bg-slate-50/80 dark:bg-white/[0.02]" : ""}>
                  <td className="p-4 font-mono text-slate-600 dark:text-zinc-400">Operating System</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800 dark:text-zinc-300">
                      {p.specs.os}
                    </td>
                  ))}
                </tr>

                {/* Battery & Charging */}
                <tr className={getIsDiff("battery") ? "bg-slate-50/80 dark:bg-white/[0.02]" : ""}>
                  <td className="p-4 font-mono text-slate-600 dark:text-zinc-400">Battery Cell & Charging</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800 dark:text-zinc-300">
                      <div>{p.specs.battery}</div>
                      <div className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">Speed: {p.specs.charging}</div>
                    </td>
                  ))}
                </tr>

                {/* Memory Config */}
                <tr className={getIsDiff("ram") ? "bg-slate-50/80 dark:bg-white/[0.02]" : ""}>
                  <td className="p-4 font-mono text-slate-600 dark:text-zinc-400">System Memory & Disk</td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800 dark:text-zinc-300">
                      <div>RAM: {p.specs.ram}</div>
                      <div className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">Storage: {p.specs.storage}</div>
                    </td>
                  ))}
                </tr>

                {/* CTA Preorder line */}
                <tr>
                  <td className="p-4 font-mono text-slate-500 dark:text-zinc-500">Instant Pre-order Actions</td>
                  {selectedProducts.map((p) => {
                    const inCart = cart.some((c) => c.product.id === p.id);
                    return (
                      <td key={p.id} className="p-4">
                        <button
                          onClick={() => onAddCart(p)}
                          className={`w-full py-2 px-3 rounded-full text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 ${
                            inCart
                              ? "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-300/25"
                              : "bg-blue-600 dark:bg-sky-500 hover:bg-blue-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-bold shadow-xs"
                          }`}
                        >
                          {inCart ? "Added Queue" : "Pre-order Now"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>

            {/* Differential Alert Footer */}
            <div className="p-4 bg-slate-50 dark:bg-white/[0.01] border-t border-slate-200 dark:border-white/5 flex items-center gap-2 text-[10px] text-slate-500 dark:text-zinc-500 select-none">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 shrink-0" />
              <span>Rows highlighted in dim overlay indicate specification variances detected across products.</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
