"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Star,
  Heart,
  GitCompare,
  Eye,
  X,
  Sparkles,
  ShoppingBag,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCcw,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import {
  formatDiscount,
  formatPrice,
  formatRating,
  formatStock,
  getDiscountedPrice
} from "@/lib/format";
import { trackBehavior } from "@/lib/behavior";
import type { ProductLoadState, SmartphoneProduct } from "@/lib/products";

type ProductShowcaseProps = {
  productState: ProductLoadState;
};

type SortMode = "recommended" | "price-low" | "price-high" | "rating";
type MainTab = "collection" | "favorites" | "cart";

const PAGE_SIZE = 6;

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 45, rotateX: -14, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 340, damping: 24 }
  },
  exit: {
    opacity: 0,
    y: -25,
    rotateX: 12,
    scale: 0.92,
    transition: { duration: 0.2 }
  }
};

export function ProductShowcase({ productState }: ProductShowcaseProps) {
  const [favoriteIds, setFavoriteIds] = useStoredIds("qtphone-favorites");
  const [cartIds, setCartIds] = useStoredIds("qtphone-cart");
  const [compareIds, setCompareIds] = useStoredIds("qtphone-compare");

  const [activeMainTab, setActiveMainTab] = useState<MainTab>("collection");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [currentPage, setCurrentPage] = useState(1);

  const [quickViewProduct, setQuickViewProduct] = useState<SmartphoneProduct | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);
  const canUsePortal = typeof document !== "undefined";

  useEffect(() => {
    if (quickViewProduct) {
      document.body.style.overflow = "hidden";
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          setQuickViewProduct(null);
        }
      }
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [quickViewProduct]);

  const products = useMemo(
    () => (productState.status === "success" ? productState.products : []),
    [productState]
  );

  function showToast(msg: string) {
    setToastMessage(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(""), 2800);
  }

  const comparedProducts = useMemo(
    () =>
      compareIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is SmartphoneProduct => Boolean(p)),
    [products, compareIds]
  );

  const favoriteProducts = useMemo(
    () =>
      favoriteIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is SmartphoneProduct => Boolean(p)),
    [products, favoriteIds]
  );

  const cartProducts = useMemo(
    () =>
      cartIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is SmartphoneProduct => Boolean(p)),
    [products, cartIds]
  );

  const cartTotal = useMemo(
    () =>
      cartProducts.reduce((sum, p) => sum + getDiscountedPrice(p.price, p.discountPercentage), 0),
    [cartProducts]
  );
  const cartOriginalTotal = useMemo(
    () => cartProducts.reduce((sum, p) => sum + p.price, 0),
    [cartProducts]
  );
  const cartSavings = cartOriginalTotal - cartTotal;

  const categories = useMemo(() => {
    return [
      { id: "all", label: "All Flagships" },
      { id: "titanium", label: "Ultra Titanium" },
      { id: "pro", label: "Pro Cyber" },
      { id: "fold", label: "Fold Apex" },
      { id: "ai", label: "AI Studio" }
    ];
  }, []);

  const visibleProducts = useMemo(() => {
    let next = [...products];

    if (selectedCategory !== "all") {
      next = next.filter((p) => p.name.toLowerCase().includes(selectedCategory));
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      next = next.filter((p) =>
        [p.name, p.brand, p.processor, p.camera, p.description].join(" ").toLowerCase().includes(q)
      );
    }

    return next.sort((a, b) => {
      const discountedA = getDiscountedPrice(a.price, a.discountPercentage);
      const discountedB = getDiscountedPrice(b.price, b.discountPercentage);
      if (sortMode === "price-low") return discountedA - discountedB;
      if (sortMode === "price-high") return discountedB - discountedA;
      if (sortMode === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, query, sortMode]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibleProducts.slice(start, start + PAGE_SIZE);
  }, [visibleProducts, currentPage]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setCurrentPage(1);
    if (val.trim().length > 2) {
      trackBehavior("search_products", { query: val });
    }
  }

  function handleCategory(cat: string) {
    setSelectedCategory(cat);
    setCurrentPage(1);
    trackBehavior("filter_products", { category: cat });
  }

  function handleSort(mode: SortMode) {
    setSortMode(mode);
    setCurrentPage(1);
    trackBehavior("sort_products", { sortMode: mode });
  }

  function handleFavoriteToggle(product: SmartphoneProduct) {
    const isFav = favoriteIds.includes(product.id);
    const nextIds = isFav
      ? favoriteIds.filter((id) => id !== product.id)
      : [...favoriteIds, product.id];
    setFavoriteIds(nextIds);
    if (!isFav) {
      showToast(`Added "${product.name}" to VIP Favorites`);
    } else {
      showToast(`Removed from VIP Favorites`);
    }
    trackBehavior("favorite_product", { id: product.id, name: product.name, favorited: !isFav });
  }

  function handleCartToggle(product: SmartphoneProduct) {
    const inCart = cartIds.includes(product.id);
    const nextIds = inCart ? cartIds.filter((id) => id !== product.id) : [...cartIds, product.id];
    setCartIds(nextIds);
    if (!inCart) {
      showToast(`Added "${product.name}" to Shopping Cart`);
    } else {
      showToast(`Removed from Shopping Cart`);
    }
    trackBehavior("cart_product", { id: product.id, name: product.name, inCart: !inCart });
  }

  function handleCompareToggle(product: SmartphoneProduct) {
    const isComp = compareIds.includes(product.id);
    const nextIds = isComp
      ? compareIds.filter((id) => id !== product.id)
      : [...compareIds, product.id];
    setCompareIds(nextIds.slice(0, 4));
    if (!isComp) {
      showToast(`Added "${product.name}" to Comparison Bar`);
    }
    trackBehavior("compare_product", { id: product.id, name: product.name });
  }

  function handleQuickView(product: SmartphoneProduct) {
    setQuickViewProduct(product);
    trackBehavior("view_product_detail", { target: product.name, section: "products" });
  }

  return (
    <section
      id="products"
      className="relative isolate overflow-hidden border-t border-line/70 bg-white py-20 sm:py-28"
      aria-labelledby="showcase-title"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[360px] w-[min(760px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-elevated/70 blur-3xl" />

      {/* Floating Action Toast */}
      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 left-1/2 z-50 flex w-[min(calc(100vw-2rem),34rem)] -translate-x-1/2 items-center gap-2.5 rounded-2xl border border-line bg-white/95 px-4 py-3 text-xs font-bold text-ink shadow-[0_18px_46px_rgb(15_23_42/0.16)] backdrop-blur-xl sm:rounded-full sm:px-5 sm:text-sm"
          >
            <Sparkles
              size={16}
              className="text-accent shrink-0 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <span className="min-w-0 break-words">{toastMessage}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mx-auto max-w-content px-5">
        {/* Header Block */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              QTPhone Flagship Ecosystem
            </span>

            <h2
              id="showcase-title"
              className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-[1.12]"
            >
              Next-Gen Smart Devices.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-muted">
            Experience precision engineering, aerospace titanium craftsmanship, and revolutionary
            neural intelligence across our flagship collection.
          </p>
        </div>

        {/* Main Navigation Tabs */}
        <div className="mt-8 grid grid-cols-1 gap-3 border-b border-line/70 pb-5 sm:flex sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => {
              setActiveMainTab("collection");
              trackBehavior("switch_tab", { tab: "collection" });
            }}
            className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition sm:justify-start sm:px-5 sm:text-sm ${
              activeMainTab === "collection"
                ? "bg-accent text-white shadow-sm"
                : "bg-surface text-muted hover:text-ink border border-line"
            }`}
          >
            <Smartphone size={16} />
            <span className="min-w-0 break-words">Flagship Collection</span>
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${activeMainTab === "collection" ? "bg-white/20 text-white" : "bg-elevated text-muted"}`}
            >
              {products.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab("favorites");
              trackBehavior("switch_tab", { tab: "favorites" });
            }}
            className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition sm:justify-start sm:px-5 sm:text-sm ${
              activeMainTab === "favorites"
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-surface text-muted hover:text-ink border border-line"
            }`}
          >
            <Heart size={16} className={favoriteIds.length > 0 ? "fill-current" : ""} />
            <span className="min-w-0 break-words">VIP Favorites</span>
            {favoriteIds.length > 0 ? (
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white font-black">
                {favoriteIds.length}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMainTab("cart");
              trackBehavior("switch_tab", { tab: "cart" });
            }}
            className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition sm:justify-start sm:px-5 sm:text-sm ${
              activeMainTab === "cart"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-surface text-muted hover:text-ink border border-line"
            }`}
          >
            <ShoppingBag size={16} />
            <span className="min-w-0 break-words">Shopping Cart</span>
            {cartIds.length > 0 ? (
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white font-black">
                {cartIds.length}
              </span>
            ) : null}
          </button>
        </div>

        {/* TAB 1: COLLECTION LISTING */}
        {activeMainTab === "collection" ? (
          <>
            {/* Clean Interactive Control Bar */}
            <div className="mt-6 grid min-w-0 gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
              <label className="relative block">
                <span className="sr-only">Search smartphone models</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  className="min-h-12 w-full rounded-2xl border border-line bg-surface py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:ring-1 focus:ring-accent transition"
                  value={query}
                  placeholder="Search flagship model, processor, or specs..."
                  onChange={handleSearch}
                />
              </label>

              {/* Futuristic Glowing Underline Beam & Dot Pills */}
              <div className="grid min-w-0 grid-cols-2 gap-2 rounded-2xl border border-line/70 bg-canvas p-2 sm:flex sm:flex-wrap sm:items-center">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.92, rotateZ: 1 }}
                      onClick={() => handleCategory(cat.id)}
                      className={`relative z-10 flex min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-xl px-3 py-2 text-center text-[11px] font-black tracking-wide transition-colors sm:justify-start sm:px-4 sm:text-xs ${
                        isActive ? "text-accent bg-accent/10" : "text-muted hover:text-ink"
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="cyberDot"
                          className="h-1.5 w-1.5 rounded-full bg-accent"
                        />
                      ) : null}
                      <span className="min-w-0 break-words">{cat.label}</span>
                      {isActive ? (
                        <motion.div
                          layoutId="cyberUnderline"
                          className="absolute bottom-0 left-2 right-2 h-[3px] rounded-full bg-accent"
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        />
                      ) : null}
                    </motion.button>
                  );
                })}
              </div>

              {/* Sort Dropdown */}
              <label className="relative flex min-w-0 items-center gap-2">
                <span className="sr-only">Sort products</span>
                <motion.div
                  key={sortMode}
                  initial={{ rotate: -90, scale: 0.6 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="pointer-events-none absolute left-3.5 text-accent"
                >
                  <SlidersHorizontal size={15} />
                </motion.div>
                <select
                  className="min-h-12 w-full min-w-0 appearance-none rounded-2xl border border-line bg-surface pl-10 pr-8 text-xs font-bold text-ink transition focus:border-accent lg:w-auto"
                  value={sortMode}
                  onChange={(e) => handleSort(e.target.value as SortMode)}
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </label>
            </div>

            {/* Product Grid Render */}
            <div className="mt-8">
              {productState.status === "loading" ? (
                <ProductSkeletonGrid />
              ) : productState.status === "error" ? (
                <div className="rounded-2xl border border-danger/40 bg-white p-10 text-center shadow-sm">
                  <AlertCircle size={40} className="mx-auto text-danger" />
                  <h3 className="mt-4 text-lg font-bold text-ink">Catalog Connection Notice</h3>
                  <p className="mt-2 text-sm text-muted max-w-md mx-auto">{productState.message}</p>
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-sm">
                  <Search size={36} className="mx-auto text-muted/60" />
                  <h3 className="mt-4 text-lg font-bold text-ink">No matching flagship models</h3>
                  <p className="mt-2 text-sm text-muted">
                    Try adjusting your search query or selecting another filter category.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSelectedCategory("all");
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-accent/90 transition"
                  >
                    <RefreshCcw size={14} />
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <motion.div
                    key={`${selectedCategory}-${sortMode}-${currentPage}-${query}`}
                    variants={gridContainerVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {paginatedProducts.map((product) => (
                      <ProductCardItem
                        key={product.id}
                        product={product}
                        isFavorite={favoriteIds.includes(product.id)}
                        inCart={cartIds.includes(product.id)}
                        isCompared={compareIds.includes(product.id)}
                        onFavorite={() => handleFavoriteToggle(product)}
                        onCart={() => handleCartToggle(product)}
                        onCompare={() => handleCompareToggle(product)}
                        onQuickView={() => handleQuickView(product)}
                      />
                    ))}
                  </motion.div>

                  {/* Clean Pagination Bar */}
                  {totalPages > 1 ? (
                    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-6 py-4 shadow-sm">
                      <p className="text-xs font-bold text-muted">
                        Showing{" "}
                        <span className="text-ink">{(currentPage - 1) * PAGE_SIZE + 1}</span> -{" "}
                        <span className="text-ink">
                          {Math.min(currentPage * PAGE_SIZE, visibleProducts.length)}
                        </span>{" "}
                        of <span className="text-ink">{visibleProducts.length}</span> flagship
                        models
                      </p>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent transition"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`h-9 min-w-9 rounded-xl px-2.5 text-xs font-extrabold transition ${
                              currentPage === page
                                ? "bg-accent text-white shadow-2xs"
                                : "border border-line bg-surface text-muted hover:text-ink"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent transition"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </>
        ) : null}

        {/* TAB 2: VIP FAVORITES */}
        {activeMainTab === "favorites" ? (
          <div className="mt-8">
            {favoriteProducts.length === 0 ? (
              <div className="rounded-2xl border border-line bg-white p-16 text-center shadow-sm">
                <Heart size={44} className="mx-auto text-pink-400/40" />
                <h3 className="mt-4 text-xl font-extrabold text-ink">No saved VIP Favorites yet</h3>
                <p className="mt-2 text-sm text-muted max-w-md mx-auto">
                  Click the heart icon on any flagship smartphone to save it to your personal
                  wishlist.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveMainTab("collection")}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-accent/90 transition"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <motion.div
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {favoriteProducts.map((product) => (
                  <ProductCardItem
                    key={product.id}
                    product={product}
                    isFavorite={favoriteIds.includes(product.id)}
                    inCart={cartIds.includes(product.id)}
                    isCompared={compareIds.includes(product.id)}
                    onFavorite={() => handleFavoriteToggle(product)}
                    onCart={() => handleCartToggle(product)}
                    onCompare={() => handleCompareToggle(product)}
                    onQuickView={() => handleQuickView(product)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        ) : null}

        {/* TAB 3: SHOPPING CART */}
        {activeMainTab === "cart" ? (
          <div className="mt-8">
            {cartProducts.length === 0 ? (
              <div className="rounded-2xl border border-line bg-white p-16 text-center shadow-sm">
                <ShoppingBag size={44} className="mx-auto text-emerald-400/40" />
                <h3 className="mt-4 text-xl font-extrabold text-ink">
                  Your Shopping Cart is empty
                </h3>
                <p className="mt-2 text-sm text-muted max-w-md mx-auto">
                  Select flagship devices from the collection to claim exclusive online VIP
                  packages.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveMainTab("collection")}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-accent/90 transition"
                >
                  Browse Flagships
                </button>
              </div>
            ) : (
              <div className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-4">
                  {cartProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex min-w-0 flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:flex-row sm:p-5"
                    >
                      <div className="flex min-w-0 w-full items-center gap-4 sm:w-auto">
                        <div className="relative h-20 w-24 shrink-0 rounded-xl bg-surface p-2">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                            {product.brand}
                          </span>
                          <h4 className="break-words font-extrabold text-ink sm:text-base">
                            {product.name}
                          </h4>
                          <p className="mt-0.5 break-words text-xs text-muted">
                            {product.processor}
                          </p>
                        </div>
                      </div>

                      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-4 border-t border-line pt-3 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
                        <PriceStack product={product} align="right" compact />

                        <button
                          type="button"
                          onClick={() => handleCartToggle(product)}
                          className="flex items-center gap-1.5 rounded-xl border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger hover:bg-danger hover:text-white transition"
                        >
                          <Trash2 size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary Panel */}
                <div className="sticky top-24 min-w-0 space-y-6 rounded-2xl border border-line bg-white p-5 shadow-[0_22px_60px_rgb(15_23_42/0.1)] sm:p-6">
                  <h3 className="text-lg font-extrabold text-ink border-b border-line pb-4">
                    VIP Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex min-w-0 justify-between gap-3 text-muted">
                      <span>Original Subtotal</span>
                      <span className="font-bold text-muted line-through">
                        {formatPrice(cartOriginalTotal)}
                      </span>
                    </div>
                    <div className="flex min-w-0 justify-between gap-3 text-muted">
                      <span>Discount Savings</span>
                      <span className="font-extrabold text-emerald-400">
                        -{formatPrice(cartSavings)}
                      </span>
                    </div>
                    <div className="flex min-w-0 justify-between gap-3 text-muted">
                      <span>Selected Items ({cartProducts.length})</span>
                      <span className="font-bold text-ink">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex min-w-0 justify-between gap-3 text-muted">
                      <span>Express Shipping</span>
                      <span className="font-extrabold text-emerald-400">FREE</span>
                    </div>
                    <div className="flex min-w-0 justify-between gap-3 text-muted">
                      <span>Official Warranty</span>
                      <span className="font-bold text-ink">Included</span>
                    </div>
                  </div>

                  <div className="flex min-w-0 items-baseline justify-between gap-3 border-t border-line pt-4">
                    <span className="font-bold text-ink">Total Due</span>
                    <span className="text-2xl font-black text-accent">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      showToast("Redirecting to QTPhone Secure Checkout...");
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-extrabold text-white shadow-sm hover:bg-accent/90 transition"
                  >
                    <CheckCircle2 size={17} />
                    <span>Proceed to Checkout</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCartIds([])}
                    className="w-full text-center text-xs font-bold text-muted hover:text-ink transition"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Sticky Bottom Compare Bar */}
      <AnimatePresence>
        {comparedProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-6 left-1/2 z-40 flex w-[min(calc(100vw-1.5rem),680px)] -translate-x-1/2 flex-col gap-3 rounded-2xl border border-line bg-white/95 px-4 py-3.5 shadow-[0_22px_60px_rgb(15_23_42/0.16)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
          >
            <div className="flex w-full min-w-0 items-center gap-3 overflow-hidden sm:w-auto">
              <div className="flex -space-x-2 shrink-0">
                {comparedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-surface bg-surface"
                  >
                    <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                  </div>
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-ink truncate">
                  {comparedProducts.length} Models Selected
                </p>
                <p className="text-[11px] text-muted truncate">
                  {comparedProducts.map((p) => p.name).join(" • ")}
                </p>
              </div>
            </div>

            <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="rounded-xl px-2.5 py-1.5 text-xs font-bold text-muted hover:text-ink transition"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCompareOpen(true);
                  trackBehavior("open_compare_drawer", { count: comparedProducts.length });
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-accent/90 transition"
              >
                <GitCompare size={14} />
                <span>Compare Specs</span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Side-by-Side Compare Modal */}
      {canUsePortal
        ? createPortal(
            <AnimatePresence>
              {isCompareOpen ? (
                <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-line bg-white p-4 shadow-2xl sm:p-6"
                  >
                    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-line/70 pb-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <GitCompare className="shrink-0 text-accent" size={20} />
                        <h3 className="min-w-0 break-words text-lg font-extrabold text-ink sm:text-xl">
                          Side-by-Side Hardware Comparison
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCompareOpen(false)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink hover:border-accent"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-line">
                            <th className="p-3 font-bold text-muted">Feature</th>
                            {comparedProducts.map((p) => (
                              <th key={p.id} className="p-3 text-center min-w-[160px]">
                                <div className="relative mx-auto h-20 w-20">
                                  <Image
                                    src={p.image}
                                    alt={p.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <p className="mt-2 font-bold text-ink">{p.name}</p>
                                <PriceStack product={p} align="center" compact />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line/60">
                          <tr>
                            <td className="p-3 font-bold text-muted">Processor</td>
                            {comparedProducts.map((p) => (
                              <td key={p.id} className="p-3 text-center text-ink font-medium">
                                {p.processor}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-muted">Display</td>
                            {comparedProducts.map((p) => (
                              <td key={p.id} className="p-3 text-center text-ink font-medium">
                                {p.display}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-muted">Camera System</td>
                            {comparedProducts.map((p) => (
                              <td key={p.id} className="p-3 text-center text-ink font-medium">
                                {p.camera}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-muted">Battery & Charge</td>
                            {comparedProducts.map((p) => (
                              <td key={p.id} className="p-3 text-center text-ink font-medium">
                                {p.battery}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            <td className="p-3 font-bold text-muted">Rating</td>
                            {comparedProducts.map((p) => (
                              <td key={p.id} className="p-3 text-center font-bold text-amber-400">
                                ★ {formatRating(p.rating)}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}

      {/* Harmonious Premium View Details Modal */}
      {canUsePortal
        ? createPortal(
            <AnimatePresence>
              {quickViewProduct ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setQuickViewProduct(null)}
                  className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-ink/40 px-3 py-4 backdrop-blur-md before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgb(var(--color-accent)/0.12),transparent_56%)] sm:px-5 sm:py-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-white/95 p-4 text-ink shadow-[0_30px_90px_rgb(15_23_42/0.18)] backdrop-blur-2xl sm:p-5 md:max-h-[84vh]"
                  >
                    <div className="flex max-h-[calc(90vh-2rem)] min-w-0 flex-col md:max-h-[calc(84vh-2.5rem)]">
                      {/* Top row */}
                      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line pb-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-accent border border-accent/20">
                          <Sparkles size={12} />
                          <span>Product Detail</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(null)}
                          aria-label="Close modal"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink shadow-2xs transition hover:border-accent hover:bg-accent hover:text-white"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Grid */}
                      <div className="mt-4 grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 overflow-y-auto overflow-x-hidden pr-1 md:grid-cols-[0.82fr_1.18fr] md:overflow-visible md:pr-0">
                        {/* Left column: Image inside soft glass card */}
                        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(135deg,#FFFFFF,#EAF6FF)] md:sticky md:top-0">
                          <Image
                            src={quickViewProduct.image}
                            alt={quickViewProduct.name}
                            fill
                            sizes="(min-width: 768px) 44vw, 92vw"
                            className="object-contain p-5 transition-transform duration-500 hover:scale-105 sm:p-7"
                          />
                        </div>

                        {/* Right column: Details */}
                        <div className="flex min-w-0 flex-col">
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 break-words text-2xl font-black tracking-tight text-ink sm:text-3xl">
                              {quickViewProduct.name}
                            </h3>

                            {/* Meta row */}
                            <div className="flex items-baseline justify-between gap-3 mt-3 flex-wrap">
                              <PriceStack product={quickViewProduct} />
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-500">
                                  <Star size={13} className="fill-amber-400 text-amber-400" />
                                  <span>{formatRating(quickViewProduct.rating)}</span>
                                </span>
                                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-400">
                                  {formatStock(quickViewProduct.stock)}
                                </span>
                              </div>
                            </div>

                            <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-muted">
                              {quickViewProduct.description}
                            </p>

                            <div className="mt-4 rounded-2xl border border-line bg-surface/78 p-3 shadow-sm backdrop-blur-xl sm:p-3.5">
                              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                <p className="text-xs font-black uppercase tracking-widest text-accent">
                                  Key Specs
                                </p>
                                <span className="w-fit rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-accent">
                                  Essential
                                </span>
                              </div>

                              <dl className="mt-3 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                                {buildDetailSpecs(quickViewProduct).map((spec) => (
                                  <div
                                    key={spec.label}
                                    className="min-w-0 rounded-xl border border-line bg-white p-2.5 shadow-sm"
                                  >
                                    <dt className="text-[10px] font-black uppercase tracking-wide text-muted">
                                      {spec.label}
                                    </dt>
                                    <dd className="mt-1 break-words text-xs font-extrabold leading-5 text-ink">
                                      {spec.value}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                          </div>

                          {/* CTA row */}
                          <div className="mt-5 shrink-0 border-t border-line pt-4">
                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                              <button
                                type="button"
                                onClick={() => handleCartToggle(quickViewProduct)}
                                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-accent px-3 py-3 text-xs font-extrabold text-white shadow-cyan transition hover:bg-accent/90 active:scale-98 sm:py-3.5 sm:text-sm"
                              >
                                <ShoppingBag size={17} />
                                <span>
                                  {cartIds.includes(quickViewProduct.id)
                                    ? "Remove from Cart"
                                    : "Add to Cart"}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleFavoriteToggle(quickViewProduct)}
                                aria-label="Toggle wishlist"
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition ${
                                  favoriteIds.includes(quickViewProduct.id)
                                    ? "border-pink-500 bg-pink-500/20 text-pink-400 shadow-sm"
                                    : "border-line bg-surface text-muted hover:border-pink-500/50 hover:text-ink"
                                }`}
                              >
                                <Heart
                                  size={18}
                                  className={
                                    favoriteIds.includes(quickViewProduct.id) ? "fill-current" : ""
                                  }
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </section>
  );
}

function buildDetailSpecs(product: SmartphoneProduct) {
  return [
    { label: "Display", value: product.display },
    { label: "Processor", value: product.processor },
    { label: "Camera", value: product.camera },
    { label: "Battery", value: product.battery }
  ].filter((spec): spec is { label: string; value: string } => Boolean(spec.value));
}

function ProductCardItem({
  product,
  isFavorite,
  inCart,
  isCompared,
  onFavorite,
  onCart,
  onCompare,
  onQuickView
}: {
  product: SmartphoneProduct;
  isFavorite: boolean;
  inCart: boolean;
  isCompared: boolean;
  onFavorite: () => void;
  onCart: () => void;
  onCompare: () => void;
  onQuickView: () => void;
}) {
  return (
    <motion.article
      id={`product-${product.id}`}
      layout
      variants={cardVariants}
      className="group relative min-w-0 scroll-mt-24 flex flex-col justify-between overflow-hidden rounded-2xl border border-line/70 bg-white p-5 shadow-[0_16px_42px_rgb(15_23_42/0.08)] transition-all duration-300 target:border-accent hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_22px_54px_rgb(15_23_42/0.12)]"
    >
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#FFFFFF,#EAF6FF)]">
          <button
            type="button"
            onClick={onFavorite}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
            className={`absolute top-3.5 right-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-xl border transition ${
              isFavorite
                ? "border-pink-500/50 bg-pink-500/20 text-pink-400"
                : "border-line bg-white/90 text-muted hover:text-ink"
            }`}
          >
            <Heart size={16} className={isFavorite ? "fill-current" : ""} />
          </button>

          <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-105">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-contain p-6"
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted font-semibold">
            <span>{product.brand} • Smartphones</span>
            <span className="rounded-full bg-elevated px-2.5 py-0.5 text-[10px] font-bold text-accent">
              {formatDiscount(product.discountPercentage)}
            </span>
          </div>

          <h3 className="mt-1.5 line-clamp-1 text-lg font-extrabold tracking-tight text-ink group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-line/60">
        <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-3">
          <PriceStack product={product} compact />
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
            <Star size={14} className="fill-current" />
            {formatRating(product.rating)}
          </span>
        </div>

        <div className="mt-4 grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] gap-2">
          <button
            type="button"
            onClick={onCompare}
            title={isCompared ? "Remove from Compare" : "Add to Compare"}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold transition ${
              isCompared
                ? "border-accent bg-accent/10 text-accent shadow-2xs"
                : "border-line bg-white text-muted hover:border-accent hover:text-ink"
            }`}
          >
            <GitCompare size={15} />
          </button>

          <button
            type="button"
            onClick={onQuickView}
            className="flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-accent px-3 text-xs font-bold text-white shadow-[0_10px_22px_rgb(var(--color-accent)/0.18)] transition hover:bg-accentStrong"
          >
            <Eye size={14} />
            <span className="min-w-0 truncate">Details</span>
          </button>

          <button
            type="button"
            onClick={onCart}
            title={inCart ? "Remove from Cart" : "Add to Cart"}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              inCart
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                : "border-line bg-white text-muted hover:border-emerald-500 hover:text-emerald-500"
            }`}
          >
            <ShoppingBag size={15} className={inCart ? "fill-current" : ""} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function PriceStack({
  product,
  align = "left",
  compact = false,
  contrast = false
}: {
  product: SmartphoneProduct;
  align?: "left" | "center" | "right";
  compact?: boolean;
  contrast?: boolean;
}) {
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
  const alignmentClass =
    align === "right"
      ? "items-end text-right"
      : align === "center"
        ? "items-center text-center"
        : "items-start";

  return (
    <div className={`flex min-w-0 flex-col ${alignmentClass}`}>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span
          className={`break-words font-black tracking-tight text-accent ${
            compact ? "text-lg" : "text-2xl md:text-3xl"
          }`}
        >
          {formatPrice(discountedPrice)}
        </span>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-extrabold text-accent">
          {formatDiscount(product.discountPercentage)}
        </span>
      </div>
      <span
        className={`${compact ? "text-xs" : "text-sm"} font-bold ${
          contrast ? "text-slate-400" : "text-muted"
        } line-through`}
      >
        {formatPrice(product.price)}
      </span>
    </div>
  );
}

function useStoredIds(key: string) {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as number[];
      setIds(Array.isArray(parsed) ? parsed.filter((id) => Number.isInteger(id)) : []);
    } catch {
      setIds([]);
    }
  }, [key]);

  function updateIds(nextIds: number[]) {
    setIds(nextIds);
    window.localStorage.setItem(key, JSON.stringify(nextIds));
    window.dispatchEvent(new Event("qtphone-storage"));
  }

  return [ids, updateIds] as const;
}

function ProductSkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading products">
      {Array.from({ length: 6 }, (_, idx) => (
        <div key={idx} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="animate-pulse">
            <div className="aspect-[4/3] rounded-[1.5rem] bg-line/40" />
            <div className="mt-4 h-4 w-32 rounded bg-line/50" />
            <div className="mt-3 h-6 w-3/4 rounded bg-line/50" />
            <div className="mt-5 pt-3 border-t border-line/40 flex justify-between">
              <div className="h-6 w-20 rounded bg-line/40" />
              <div className="h-8 w-24 rounded bg-line/40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
