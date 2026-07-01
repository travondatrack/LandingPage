"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { formatDiscount, formatPrice, formatRating, getDiscountedPrice } from "@/lib/format";
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
      className="relative isolate overflow-hidden bg-surface py-20 sm:py-28 border-t border-line/70"
      aria-labelledby="showcase-title"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute top-0 left-1/2 -z-10 h-[450px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_70%)] blur-3xl pointer-events-none" />

      {/* Floating Action Toast */}
      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full border border-accent/50 bg-elevated/95 px-5 py-3 text-xs sm:text-sm font-bold text-ink shadow-cyanStrong backdrop-blur-xl"
          >
            <Sparkles
              size={16}
              className="text-accent shrink-0 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <span>{toastMessage}</span>
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
        <div className="mt-8 flex flex-wrap items-center gap-3 border-b border-line/70 pb-5">
          <button
            type="button"
            onClick={() => {
              setActiveMainTab("collection");
              trackBehavior("switch_tab", { tab: "collection" });
            }}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-extrabold transition ${
              activeMainTab === "collection"
                ? "bg-accent text-white shadow-sm"
                : "bg-surface text-muted hover:text-ink border border-line"
            }`}
          >
            <Smartphone size={16} />
            <span>Flagship Collection</span>
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
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-extrabold transition ${
              activeMainTab === "favorites"
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-surface text-muted hover:text-ink border border-line"
            }`}
          >
            <Heart size={16} className={favoriteIds.length > 0 ? "fill-current" : ""} />
            <span>VIP Favorites</span>
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
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-extrabold transition ${
              activeMainTab === "cart"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-surface text-muted hover:text-ink border border-line"
            }`}
          >
            <ShoppingBag size={16} />
            <span>Shopping Cart</span>
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
            <div className="mt-6 grid gap-4 rounded-[1.75rem] border border-white/10 bg-elevated/70 p-4 sm:p-5 backdrop-blur-xl shadow-sm lg:grid-cols-[1fr_auto_auto] items-center">
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
              <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface/90 p-2 border border-line/70 shadow-inner">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.92, rotateZ: 1 }}
                      onClick={() => handleCategory(cat.id)}
                      className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black tracking-wide transition-colors z-10 whitespace-nowrap overflow-hidden ${
                        isActive ? "text-accent bg-accent/10" : "text-muted hover:text-ink"
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="cyberDot"
                          className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(56,189,248)] animate-pulse"
                        />
                      ) : null}
                      <span>{cat.label}</span>
                      {isActive ? (
                        <motion.div
                          layoutId="cyberUnderline"
                          className="absolute bottom-0 left-2 right-2 h-[3px] rounded-full bg-[linear-gradient(90deg,transparent,rgb(var(--color-accent)),transparent)] shadow-cyan"
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        />
                      ) : null}
                    </motion.button>
                  );
                })}
              </div>

              {/* Sort Dropdown */}
              <label className="relative flex items-center gap-2">
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
                  className="min-h-12 w-full appearance-none rounded-2xl border border-line bg-surface pl-10 pr-8 text-xs font-bold text-ink focus:border-accent transition cursor-pointer"
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
                <div className="rounded-[2rem] border border-danger/40 bg-elevated/70 p-10 text-center backdrop-blur-xl">
                  <AlertCircle size={40} className="mx-auto text-danger" />
                  <h3 className="mt-4 text-lg font-bold text-ink">Catalog Connection Notice</h3>
                  <p className="mt-2 text-sm text-muted max-w-md mx-auto">{productState.message}</p>
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="rounded-[2rem] border border-white/10 bg-elevated/70 p-12 text-center backdrop-blur-xl">
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
                    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-elevated/60 px-6 py-4 backdrop-blur-md">
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
              <div className="rounded-[2rem] border border-white/10 bg-elevated/70 p-16 text-center backdrop-blur-xl">
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
              <div className="rounded-[2rem] border border-white/10 bg-elevated/70 p-16 text-center backdrop-blur-xl">
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
              <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
                <div className="space-y-4">
                  {cartProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-elevated/70 p-4 sm:p-5 backdrop-blur-xl shadow-sm"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative h-20 w-24 shrink-0 rounded-xl bg-surface p-2">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                            {product.brand}
                          </span>
                          <h4 className="font-extrabold text-ink sm:text-base">{product.name}</h4>
                          <p className="text-xs text-muted mt-0.5">{product.processor}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-line">
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
                <div className="sticky top-24 rounded-[2rem] border border-accent/40 bg-elevated/90 p-6 backdrop-blur-2xl shadow-cyanStrong space-y-6">
                  <h3 className="text-lg font-extrabold text-ink border-b border-line pb-4">
                    VIP Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-muted">
                      <span>Original Subtotal</span>
                      <span className="font-bold text-muted line-through">
                        {formatPrice(cartOriginalTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Discount Savings</span>
                      <span className="font-extrabold text-emerald-400">
                        -{formatPrice(cartSavings)}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Selected Items ({cartProducts.length})</span>
                      <span className="font-bold text-ink">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Express Shipping</span>
                      <span className="font-extrabold text-emerald-400">FREE</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Official Warranty</span>
                      <span className="font-bold text-ink">Included</span>
                    </div>
                  </div>

                  <div className="border-t border-line pt-4 flex justify-between items-baseline">
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
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex w-[min(94vw,680px)] items-center justify-between gap-4 rounded-[1.5rem] border border-accent/50 bg-elevated/95 px-5 py-3.5 backdrop-blur-2xl shadow-cyanStrong"
          >
            <div className="flex items-center gap-3 overflow-hidden">
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

            <div className="flex items-center gap-2 shrink-0">
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
      <AnimatePresence>
        {isCompareOpen ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-white/15 bg-elevated p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line/70 pb-4">
                <div className="flex items-center gap-2">
                  <GitCompare className="text-accent" size={20} />
                  <h3 className="text-xl font-extrabold text-ink">
                    Side-by-Side Hardware Comparison
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCompareOpen(false)}
                  className="h-9 w-9 rounded-xl border border-line bg-surface flex items-center justify-center text-ink hover:border-accent"
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
                            <Image src={p.image} alt={p.name} fill className="object-contain" />
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
      </AnimatePresence>

      {/* Harmonious Premium View Details Modal */}
      <AnimatePresence>
        {quickViewProduct ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-hidden bg-slate-950/45 backdrop-blur-xl before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_55%)] before:pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[92vw] max-w-5xl max-h-[90vh] md:max-h-[86vh] overflow-y-auto md:overflow-hidden rounded-[2rem] bg-white/85 dark:bg-slate-950/80 backdrop-blur-2xl border border-sky-400/20 shadow-[0_30px_100px_rgba(14,165,233,0.22)] p-5 md:p-8"
            >
              <div className="flex flex-col h-full min-w-0">
                {/* Top row */}
                <div className="flex items-center justify-between gap-4 border-b border-line/60 pb-3.5 shrink-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-accent border border-accent/20">
                    <Sparkles size={12} />
                    <span>QTPHONE FLAGSHIP STUDIO</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(null)}
                    aria-label="Close modal"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface/80 text-muted transition hover:border-accent hover:bg-accent hover:text-white shrink-0 shadow-2xs"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-8 min-w-0 mt-5 items-center flex-1 md:overflow-hidden">
                  {/* Left column: Image inside soft glass card */}
                  <div className="relative aspect-[4/3] md:aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.15),transparent_70%)] bg-surface/60 flex items-center justify-center p-6 shrink-0">
                    <Image
                      src={quickViewProduct.image}
                      alt={quickViewProduct.name}
                      fill
                      className="object-contain max-h-[42vh] md:max-h-[50vh] p-6 transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Right column: Details */}
                  <div className="min-w-0 flex flex-col justify-between h-full space-y-4">
                    <div className="min-w-0">
                      <h3 className="text-3xl md:text-5xl font-black tracking-tight text-ink line-clamp-2 break-words">
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
                          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-400">
                            {quickViewProduct.stock} in stock
                          </span>
                        </div>
                      </div>

                      {/* Short description */}
                      <p className="text-sm leading-relaxed text-muted line-clamp-3 break-words mt-3">
                        {quickViewProduct.description}
                      </p>

                      {/* 4 compact specification chips */}
                      <div className="grid grid-cols-2 gap-2.5 mt-4 min-w-0">
                        <div className="rounded-xl border border-line/60 bg-surface/80 p-3 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                            Brand
                          </span>
                          <p className="mt-0.5 text-xs font-extrabold text-ink truncate">
                            {quickViewProduct.brand}
                          </p>
                        </div>
                        <div className="rounded-xl border border-line/60 bg-surface/80 p-3 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                            Category
                          </span>
                          <p className="mt-0.5 text-xs font-extrabold text-ink truncate">
                            Flagship Smartphone
                          </p>
                        </div>
                        <div className="rounded-xl border border-line/60 bg-surface/80 p-3 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                            Rating
                          </span>
                          <p className="mt-0.5 text-xs font-extrabold text-ink truncate">
                            Tier-1 Neural Device
                          </p>
                        </div>
                        <div className="rounded-xl border border-line/60 bg-surface/80 p-3 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                            Warranty
                          </span>
                          <p className="mt-0.5 text-xs font-extrabold text-ink truncate">
                            Official VIP Care
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA row */}
                    <div className="mt-5 pt-4 border-t border-line/60 shrink-0">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleCartToggle(quickViewProduct)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-cyan hover:bg-accent/90 transition transform active:scale-98"
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
                              : "border-line bg-surface/90 text-muted hover:border-pink-500/50 hover:text-ink"
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
      </AnimatePresence>
    </section>
  );
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
      layout
      variants={cardVariants}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-elevated/70 p-5 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-cyan"
    >
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,rgb(var(--color-surface)),rgb(var(--color-accent)/0.08))]">
          <button
            type="button"
            onClick={onFavorite}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
            className={`absolute top-3.5 right-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-xl border transition ${
              isFavorite
                ? "border-pink-500/50 bg-pink-500/20 text-pink-400"
                : "border-line/80 bg-surface/80 text-muted hover:text-ink"
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
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
              {formatDiscount(product.discountPercentage)}
            </span>
          </div>

          <h3 className="mt-1.5 line-clamp-1 text-lg font-extrabold tracking-tight text-ink group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-line/60">
        <div className="flex items-baseline justify-between">
          <PriceStack product={product} compact />
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
            <Star size={14} className="fill-current" />
            {formatRating(product.rating)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[auto_1fr_auto] gap-2">
          <button
            type="button"
            onClick={onCompare}
            title={isCompared ? "Remove from Compare" : "Add to Compare"}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold transition ${
              isCompared
                ? "border-accent bg-accent/20 text-accent shadow-2xs"
                : "border-line bg-surface text-muted hover:border-accent hover:text-ink"
            }`}
          >
            <GitCompare size={15} />
          </button>

          <button
            type="button"
            onClick={onQuickView}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-accent/15 border border-accent/30 px-3 text-xs font-bold text-accent hover:bg-accent hover:text-white transition shadow-2xs"
          >
            <Eye size={14} />
            <span>Details</span>
          </button>

          <button
            type="button"
            onClick={onCart}
            title={inCart ? "Remove from Cart" : "Add to Cart"}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              inCart
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                : "border-line bg-surface text-muted hover:border-emerald-500 hover:text-emerald-400"
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
  compact = false
}: {
  product: SmartphoneProduct;
  align?: "left" | "center" | "right";
  compact?: boolean;
}) {
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
  const alignmentClass =
    align === "right"
      ? "items-end text-right"
      : align === "center"
        ? "items-center text-center"
        : "items-start";

  return (
    <div className={`flex flex-col ${alignmentClass}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`font-black tracking-tight text-accent ${
            compact ? "text-lg" : "text-2xl md:text-3xl"
          }`}
        >
          {formatPrice(discountedPrice)}
        </span>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-extrabold text-accent">
          {formatDiscount(product.discountPercentage)}
        </span>
      </div>
      <span className={`${compact ? "text-xs" : "text-sm"} font-bold text-muted line-through`}>
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
        <div key={idx} className="rounded-[2rem] border border-white/10 bg-elevated/50 p-5">
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
