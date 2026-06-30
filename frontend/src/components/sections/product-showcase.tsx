"use client";

import Image from "next/image";
import {
  Eye,
  GitCompare,
  Heart,
  RefreshCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { formatDiscount, formatPrice, formatRating, formatStock } from "@/lib/format";
import { trackBehavior } from "@/lib/behavior";
import type { ProductLoadState, SmartphoneProduct } from "@/lib/products";

type ProductShowcaseProps = {
  productState: ProductLoadState;
};

type ProductTab = "featured" | "rating" | "discount" | "recent";
type SortMode = "recommended" | "price-low" | "price-high" | "rating";

const tabs: Array<{ id: ProductTab; label: string }> = [
  { id: "featured", label: "Featured" },
  { id: "rating", label: "High rating" },
  { id: "discount", label: "Best discount" },
  { id: "recent", label: "Recently viewed" }
];

export function ProductShowcase({ productState }: ProductShowcaseProps) {
  const [favoriteIds, setFavoriteIds] = useStoredIds("heliphone-favorites");
  const [cartIds, setCartIds] = useStoredIds("heliphone-cart");
  const [compareIds, setCompareIds] = useStoredIds("heliphone-compare");
  const [recentlyViewedIds, setRecentlyViewedIds] = useStoredIds("heliphone-recently-viewed");
  const [activeTab, setActiveTab] = useState<ProductTab>("featured");
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [quickViewProduct, setQuickViewProduct] = useState<SmartphoneProduct | null>(null);
  const products = useMemo(
    () => (productState.status === "success" ? productState.products : []),
    [productState]
  );

  const recentlyViewed = useMemo(
    () =>
      recentlyViewedIds
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is SmartphoneProduct => Boolean(product)),
    [products, recentlyViewedIds]
  );
  const cartProducts = cartIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is SmartphoneProduct => Boolean(product));
  const visibleProducts = useMemo(() => {
    let nextProducts =
      activeTab === "recent"
        ? recentlyViewed
        : activeTab === "rating"
          ? [...products].sort((a, b) => b.rating - a.rating)
          : activeTab === "discount"
            ? [...products].sort((a, b) => b.discountPercentage - a.discountPercentage)
            : products;

    if (query.trim()) {
      const normalizedQuery = query.trim().toLowerCase();
      nextProducts = nextProducts.filter((product) =>
        [product.name, product.brand, product.description, ...product.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      );
    }

    return [...nextProducts].sort((a, b) => {
      if (sortMode === "price-low") return a.price - b.price;
      if (sortMode === "price-high") return b.price - a.price;
      if (sortMode === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [activeTab, products, query, recentlyViewed, sortMode]);

  function toggleId(id: number, ids: number[], updateIds: (nextIds: number[]) => void) {
    updateIds(ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  }

  function markViewed(product: SmartphoneProduct) {
    setRecentlyViewedIds(
      [product.id, ...recentlyViewedIds.filter((item) => item !== product.id)].slice(0, 6)
    );
    trackBehavior("view_product", { id: product.id, name: product.name });
  }

  function openQuickView(product: SmartphoneProduct) {
    markViewed(product);
    setQuickViewProduct(product);
  }

  function handleFavorite(product: SmartphoneProduct) {
    toggleId(product.id, favoriteIds, setFavoriteIds);
    trackBehavior("favorite_product", { id: product.id, name: product.name });
  }

  function handleCart(product: SmartphoneProduct) {
    toggleId(product.id, cartIds, setCartIds);
    trackBehavior("cart_product", { id: product.id, name: product.name });
  }

  function handleCompare(product: SmartphoneProduct) {
    toggleId(product.id, compareIds, setCompareIds);
    trackBehavior("view_product", { type: "compare", id: product.id, name: product.name });
  }

  return (
    <section id="products" className="bg-canvas py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-content px-5">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Product showcase
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Shop-like comparison without checkout complexity.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Search, sort, save, compare, quick view, and revisit products from live DummyJSON data.
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-3xl border border-line bg-elevated p-4 shadow-sm lg:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              className="min-h-12 w-full rounded-2xl border border-line bg-surface py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted/75"
              value={query}
              placeholder="Search by brand, model, or detail"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Sort products</span>
            <SlidersHorizontal
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <select
              className="min-h-12 w-full rounded-2xl border border-line bg-surface py-3 pl-11 pr-10 text-sm font-semibold text-ink lg:w-52"
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Highest rating</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
            </select>
          </label>
          <a
            className="premium-button inline-flex min-h-12 items-center justify-center rounded-2xl bg-accent px-5 text-sm font-semibold text-white"
            href="#specs"
          >
            Compare specs
          </a>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-accent text-white shadow-soft"
                  : "border border-line bg-surface text-muted hover:border-accent hover:text-ink"
              }`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {productState.status === "loading" ? <ProductSkeletonGrid /> : null}
          {productState.status === "empty" ? <EmptyState /> : null}
          {productState.status === "error" ? <ErrorState message={productState.message} /> : null}
          {productState.status === "success" ? (
            <>
              <InteractionSummary
                cartProducts={cartProducts}
                compareCount={compareIds.length}
                favoriteCount={favoriteIds.length}
                recentlyViewed={recentlyViewed}
              />
              {visibleProducts.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.slice(0, 9).map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      isFavorite={favoriteIds.includes(product.id)}
                      isInCart={cartIds.includes(product.id)}
                      isCompared={compareIds.includes(product.id)}
                      onAddToCart={() => handleCart(product)}
                      onCompare={() => handleCompare(product)}
                      onQuickView={() => openQuickView(product)}
                      onToggleFavorite={() => handleFavorite(product)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No products match the selected filter." />
              )}
            </>
          ) : null}
        </div>
      </div>

      <ProductQuickView
        product={quickViewProduct}
        isFavorite={quickViewProduct ? favoriteIds.includes(quickViewProduct.id) : false}
        isInCart={quickViewProduct ? cartIds.includes(quickViewProduct.id) : false}
        onAddToCart={() => quickViewProduct && handleCart(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        onToggleFavorite={() => quickViewProduct && handleFavorite(quickViewProduct)}
      />
    </section>
  );
}

function ProductCard({
  product,
  index,
  isFavorite,
  isInCart,
  isCompared,
  onAddToCart,
  onCompare,
  onQuickView,
  onToggleFavorite
}: {
  product: SmartphoneProduct;
  index: number;
  isFavorite: boolean;
  isInCart: boolean;
  isCompared: boolean;
  onAddToCart: () => void;
  onCompare: () => void;
  onQuickView: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <article
      className="soft-reveal group rounded-3xl border border-line bg-elevated p-4 shadow-sm transition hover:-translate-y-1 hover:border-accent/70 hover:shadow-soft motion-reduce:transform-none"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <button
        className="product-sheen relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[linear-gradient(135deg,rgb(var(--color-surface)),rgb(var(--color-accent)/0.08))]"
        type="button"
        onClick={onQuickView}
      >
        <Image
          src={product.image}
          alt={`${product.name} smartphone product image`}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 640px) 45vw, 92vw"
          className="object-contain p-5 transition duration-500 group-hover:scale-[1.045]"
        />
      </button>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">{product.brand}</p>
            <h3 className="mt-1 break-words text-xl font-semibold tracking-tight text-ink">
              {product.name}
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
            {formatDiscount(product.discountPercentage)}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 break-words text-sm leading-6 text-muted">
          {product.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-2xl font-semibold tracking-tight text-ink">
            {formatPrice(product.price)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-muted">
            <Star aria-hidden="true" size={16} className="fill-accent text-accent" />
            {formatRating(product.rating)}
          </span>
        </div>
        <div className="mt-4 rounded-2xl border border-line bg-surface px-3 py-2 text-sm font-medium text-muted">
          {formatStock(product.stock)}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <IconAction
            active={isFavorite}
            icon={
              <Heart aria-hidden="true" size={17} className={isFavorite ? "fill-current" : ""} />
            }
            label={
              isFavorite ? `Remove ${product.name} from favorites` : `Favorite ${product.name}`
            }
            onClick={onToggleFavorite}
          />
          <IconAction
            active={isInCart}
            icon={<ShoppingBag aria-hidden="true" size={17} />}
            label={isInCart ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
            onClick={onAddToCart}
            tone="success"
          />
          <IconAction
            active={isCompared}
            icon={<GitCompare aria-hidden="true" size={17} />}
            label={
              isCompared ? `Remove ${product.name} from compare` : `Add ${product.name} to compare`
            }
            onClick={onCompare}
          />
          <IconAction
            icon={<Eye aria-hidden="true" size={17} />}
            label={`Quick view ${product.name}`}
            onClick={onQuickView}
          />
        </div>
      </div>
    </article>
  );
}

function IconAction({
  active = false,
  icon,
  label,
  onClick,
  tone = "accent"
}: {
  active?: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  tone?: "accent" | "success";
}) {
  const activeClass =
    tone === "success"
      ? "border-success bg-success/10 text-success"
      : "border-accent bg-accent/10 text-accent";

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-2xl border text-sm font-semibold transition hover:border-accent ${
        active ? activeClass : "border-line bg-surface text-ink"
      }`}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

function InteractionSummary({
  cartProducts,
  compareCount,
  favoriteCount,
  recentlyViewed
}: {
  cartProducts: SmartphoneProduct[];
  compareCount: number;
  favoriteCount: number;
  recentlyViewed: SmartphoneProduct[];
}) {
  const cartTotal = cartProducts.reduce((total, product) => total + product.price, 0);

  return (
    <div className="mb-5 rounded-3xl border border-line bg-elevated p-4 text-sm text-muted shadow-sm">
      <div className="flex flex-wrap gap-3">
        <span className="rounded-full bg-surface px-3 py-1">Favorites: {favoriteCount}</span>
        <span className="rounded-full bg-surface px-3 py-1">Compare: {compareCount}</span>
        <span className="rounded-full bg-surface px-3 py-1">
          Cart preview: {cartProducts.length} item{cartProducts.length === 1 ? "" : "s"}
        </span>
        <span className="rounded-full bg-surface px-3 py-1">
          Cart total: {formatPrice(cartTotal)}
        </span>
        <span className="rounded-full bg-surface px-3 py-1">
          Recently viewed: {recentlyViewed.length || "None"}
        </span>
      </div>
      {cartProducts.length > 0 ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {cartProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="rounded-2xl border border-line bg-surface px-3 py-2">
              <p className="truncate font-semibold text-ink">{product.name}</p>
              <p className="mt-1 text-xs text-muted">{formatPrice(product.price)}</p>
            </div>
          ))}
        </div>
      ) : null}
      {recentlyViewed.length > 0 ? (
        <p className="mt-3 truncate">
          Last viewed: {recentlyViewed.map((product) => product.name).join(", ")}
        </p>
      ) : null}
    </div>
  );
}

function ProductQuickView({
  product,
  isFavorite,
  isInCart,
  onAddToCart,
  onClose,
  onToggleFavorite
}: {
  product: SmartphoneProduct | null;
  isFavorite: boolean;
  isInCart: boolean;
  onAddToCart: () => void;
  onClose: () => void;
  onToggleFavorite: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!product) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, product]);

  if (!product) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-end bg-ink/45 p-3 backdrop-blur-sm sm:p-5 lg:place-items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div
        ref={dialogRef}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-line bg-elevated p-5 shadow-soft sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Quick view</p>
            <h3
              id="quick-view-title"
              className="mt-2 text-3xl font-semibold tracking-tight text-ink"
            >
              {product.name}
            </h3>
          </div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-surface text-ink"
            type="button"
            aria-label="Close quick view"
            onClick={onClose}
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-surface">
            <Image
              src={product.image}
              alt={`${product.name} quick view image`}
              fill
              sizes="(min-width: 1024px) 420px, 92vw"
              className="object-contain p-7"
            />
          </div>
          <div>
            <p className="text-sm leading-6 text-muted">{product.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["Brand", product.brand],
                ["Rating", formatRating(product.rating)],
                ["Price", formatPrice(product.price)],
                ["Discount", formatDiscount(product.discountPercentage)]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-line bg-surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {label}
                  </p>
                  <p className="mt-2 font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                className="premium-button inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white"
                type="button"
                onClick={onAddToCart}
              >
                <ShoppingBag aria-hidden="true" size={17} />
                {isInCart ? "Remove from cart" : "Add to cart"}
              </button>
              <button
                className="premium-button inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-semibold text-ink"
                type="button"
                onClick={onToggleFavorite}
              >
                <Heart
                  aria-hidden="true"
                  size={17}
                  className={isFavorite ? "fill-current text-danger" : ""}
                />
                {isFavorite ? "Saved" : "Save favorite"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useStoredIds(key: string) {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      return;
    }

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
    window.dispatchEvent(new Event("heliphone-storage"));
  }

  return [ids, updateIds] as const;
}

function ProductSkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading products">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="rounded-3xl border border-line bg-elevated p-4">
          <div className="animate-pulse">
            <div className="aspect-[4/3] rounded-2xl bg-line/40" />
            <div className="mt-4 h-4 w-24 rounded bg-line/50" />
            <div className="mt-3 h-6 w-3/4 rounded bg-line/50" />
            <div className="mt-4 h-4 w-full rounded bg-line/40" />
            <div className="mt-2 h-4 w-5/6 rounded bg-line/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  message = "No smartphone products are available right now."
}: {
  message?: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-elevated p-6 text-muted shadow-sm">
      {message}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-line bg-elevated p-6 shadow-sm">
      <p className="font-semibold text-ink">Product data could not be loaded.</p>
      <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
      <button
        className="premium-button mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink hover:border-accent"
        type="button"
        onClick={() => window.location.reload()}
      >
        <RefreshCcw aria-hidden="true" size={16} />
        Retry
      </button>
    </div>
  );
}
