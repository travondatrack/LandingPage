"use client";

import React, { useState } from "react";
import { Product, CartItem } from "../types";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, PackageOpen } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  favorites: Product[];
  cart: CartItem[];
  comparingIds: number[];
  onToggleFavorite: (product: Product) => void;
  onToggleCart: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onRefreshTelemetry: () => void;
}

const PRODUCTS_PER_PAGE = 6;
const SERIES_FILTERS = ["All Flagships", "Ultra Titanium", "Pro Cyber", "Fold Apex"];

function getProductSeries(product: Product) {
  const title = product.title.toLowerCase();
  if (title.includes("fold apex")) return "Fold Apex";
  if (title.includes("pro cyber")) return "Pro Cyber";
  if (title.includes("ultra titanium")) return "Ultra Titanium";
  return "Ultra Titanium";
}

export default function ProductGrid({
  products,
  isLoading,
  error,
  favorites,
  cart,
  comparingIds,
  onToggleFavorite,
  onToggleCart,
  onToggleCompare,
  onViewDetails,
  onRefreshTelemetry,
}: ProductGridProps) {
  const [search, setSearch] = useState("");
  const [seriesFilter, setSeriesFilter] = useState("All Flagships");
  const [sortOption, setSortOption] = useState("rating-desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
      getProductSeries(p).toLowerCase().includes(search.toLowerCase());

    const matchesSeries = seriesFilter === "All Flagships" || getProductSeries(p) === seriesFilter;

    return matchesSearch && matchesSeries;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "rating-desc") return (b.rating || 0) - (a.rating || 0);
    if (sortOption === "discount-desc") return (b.discountPercentage || 0) - (a.discountPercentage || 0);
    return 0;
  });
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
  const normalizedPage = Math.min(currentPage, totalPages);
  const pageStart = (normalizedPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(pageStart, pageStart + PRODUCTS_PER_PAGE);
  const pageEnd = Math.min(pageStart + PRODUCTS_PER_PAGE, sortedProducts.length);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    onRefreshTelemetry();
  };

  const handleSeriesChange = (series: string) => {
    setSeriesFilter(series);
    setCurrentPage(1);
    onRefreshTelemetry();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
    onRefreshTelemetry();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onRefreshTelemetry();
    const element = document.getElementById("smartphone-catalog");
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="smartphone-catalog" className="story-panel bg-[#f8fafc] dark:bg-[#171b26] py-16 px-6 md:px-12 border-b border-slate-200 dark:border-white/10 scroll-mt-20 transition-colors duration-300" data-reveal>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10" data-reveal>
          <div>
            <h2 className="font-display font-light text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              Next-Gen <span className="font-serif italic text-slate-500 dark:text-zinc-400">Smart Devices.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Explore our complete lineup of cutting-edge smartphones, engineered for performance, creativity, and everyday excellence.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-slate-200/70 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-500/25 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              SHOWING {sortedProducts.length === 0 ? 0 : pageStart + 1}-{pageEnd} OF {sortedProducts.length} DEVICES
            </span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="mb-10 grid grid-cols-1 xl:grid-cols-12 gap-4 items-start" data-reveal>
          {/* Search Input */}
          <div className="relative xl:col-span-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search specifications, names, or brands..."
              value={search}
              onChange={handleSearchChange}
              className="w-full bg-white dark:bg-[#202838] hover:bg-slate-50 dark:hover:bg-[#253145] border border-slate-200 dark:border-slate-500/25 focus:border-blue-600 dark:focus:border-sky-400 focus:outline-none rounded-full py-2.5 pl-11 pr-4 text-xs text-slate-800 dark:text-slate-100 transition shadow-xs dark:shadow-none"
            />
          </div>

          {/* Series quick buttons */}
          <div className="xl:col-span-5 flex flex-wrap items-center gap-2">
            {SERIES_FILTERS.map((series) => (
              <button
                key={series}
                onClick={() => handleSeriesChange(series)}
                className={`min-h-10 px-4 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border transition ${
                  seriesFilter === series
                    ? "bg-blue-600 dark:bg-sky-500 border-transparent text-white dark:text-slate-950 shadow-sm"
                    : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-500/25 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
                }`}
              >
                {series}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="relative xl:col-span-3 flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full bg-white dark:bg-[#202838] hover:bg-slate-50 dark:hover:bg-[#253145] border border-slate-200 dark:border-slate-500/25 focus:border-blue-600 dark:focus:border-sky-400 focus:outline-none rounded-full py-2.5 px-4 text-xs text-slate-700 dark:text-slate-200 transition appearance-none cursor-pointer shadow-xs dark:shadow-none"
            >
              <option value="rating-desc" className="bg-white dark:bg-[#202838] text-slate-800 dark:text-slate-200">Rating: Highest First</option>
              <option value="price-asc" className="bg-white dark:bg-[#202838] text-slate-800 dark:text-slate-200">Price: Low to High</option>
              <option value="price-desc" className="bg-white dark:bg-[#202838] text-slate-800 dark:text-slate-200">Price: High to Low</option>
              <option value="discount-desc" className="bg-white dark:bg-[#202838] text-slate-800 dark:text-slate-200">Highest Pre-Order Discount</option>
            </select>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          /* Skeleton Loader List */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton-shimmer bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 animate-pulse">
                <div className="bg-white/5 h-44 rounded-xl w-full" />
                <div className="flex justify-between">
                  <div className="bg-white/5 h-3 w-1/4 rounded" />
                  <div className="bg-white/5 h-3 w-1/4 rounded" />
                </div>
                <div className="bg-white/5 h-5 w-3/4 rounded animate-pulse" />
                <div className="bg-white/5 h-10 w-full rounded-full mt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error Fallback Panel */
          <div className="p-8 rounded-2xl bg-white/[0.01] border border-red-500/10 text-center flex flex-col items-center gap-3">
            <PackageOpen className="w-10 h-10 text-red-400/80" />
            <h3 className="text-zinc-200 font-display font-medium text-sm">Failed to Load Products</h3>
            <p className="text-zinc-400 text-xs max-w-sm">{error}</p>
            <p className="text-[10px] text-zinc-500 font-mono">Verify server or public connectivity.</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          /* Empty Search Fallback */
          <div className="p-12 rounded-2xl bg-white/[0.01] border border-white/10 text-center flex flex-col items-center gap-3">
            <PackageOpen className="w-10 h-10 text-zinc-600 animate-bounce" />
            <h3 className="text-zinc-300 font-display font-medium text-sm">No Smartphones Found</h3>
            <p className="text-zinc-500 text-xs max-w-sm">
              We couldn&apos;t find any devices matching &quot;{search}&quot; under series filter &quot;{seriesFilter}&quot;.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSeriesFilter("All Flagships");
                setCurrentPage(1);
              }}
              className="mt-2 text-xs bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full border border-white/10 text-white transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Grid list products */
          <div className="space-y-8">
            <div
              key={`${seriesFilter}-${sortOption}-${currentPage}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
            >
              {paginatedProducts.map((p, idx) => (
                <div
                  key={`${p.id}-${seriesFilter}-${sortOption}`}
                  className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both transition-all"
                  style={{ animationDelay: `${idx * 75}ms` }}
                >
                  <ProductCard
                    product={p}
                    isFavorite={favorites.some((fav) => fav.id === p.id)}
                    isInCart={cart.some((c) => c.product.id === p.id)}
                    isComparing={comparingIds.includes(p.id)}
                    onToggleFavorite={onToggleFavorite}
                    onToggleCart={onToggleCart}
                    onToggleCompare={onToggleCompare}
                    onViewDetails={onViewDetails}
                  />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                  Page {normalizedPage} of {totalPages}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.max(1, normalizedPage - 1))}
                    disabled={normalizedPage === 1}
                    className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-700 dark:text-zinc-300 flex items-center justify-center transition hover:border-sky-300 hover:text-sky-700 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700"
                    aria-label="Previous product page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`h-10 min-w-10 rounded-full px-3 text-xs font-mono font-bold transition ${
                        page === normalizedPage
                          ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20"
                          : "border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-600 dark:text-zinc-400 hover:border-sky-300 hover:text-sky-700 dark:hover:text-sky-300"
                      }`}
                      aria-current={page === normalizedPage ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handlePageChange(Math.min(totalPages, normalizedPage + 1))}
                    disabled={normalizedPage === totalPages}
                    className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-700 dark:text-zinc-300 flex items-center justify-center transition hover:border-sky-300 hover:text-sky-700 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-700"
                    aria-label="Next product page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
