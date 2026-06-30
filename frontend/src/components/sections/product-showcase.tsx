"use client";

import Image from "next/image";
import { Eye, Heart, RefreshCcw, ShoppingBag, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatDiscount, formatPrice, formatRating, formatStock } from "@/lib/format";
import { trackBehavior } from "@/lib/behavior";
import type { ProductLoadState, SmartphoneProduct } from "@/lib/products";

type ProductShowcaseProps = {
  productState: ProductLoadState;
};

export function ProductShowcase({ productState }: ProductShowcaseProps) {
  const [favoriteIds, setFavoriteIds] = useStoredIds("heliphone-favorites");
  const [cartIds, setCartIds] = useStoredIds("heliphone-cart");
  const [recentlyViewedIds, setRecentlyViewedIds] = useStoredIds("heliphone-recently-viewed");
  const recentlyViewed = useMemo(() => {
    const products = productState.status === "success" ? productState.products : [];

    return recentlyViewedIds
      .map((id) => products.find((product) => product.id === id))
      .filter((product): product is SmartphoneProduct => Boolean(product))
      .slice(0, 3);
  }, [productState, recentlyViewedIds]);
  const products = productState.status === "success" ? productState.products : [];
  const cartProducts = cartIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is SmartphoneProduct => Boolean(product));

  function toggleId(id: number, ids: number[], updateIds: (nextIds: number[]) => void) {
    updateIds(ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  }

  function markViewed(id: number) {
    setRecentlyViewedIds([id, ...recentlyViewedIds.filter((item) => item !== id)].slice(0, 3));
  }

  function handleFavorite(product: SmartphoneProduct) {
    toggleId(product.id, favoriteIds, setFavoriteIds);
    trackBehavior("favorite_product", { id: product.id, name: product.name });
  }

  function handleCart(product: SmartphoneProduct) {
    toggleId(product.id, cartIds, setCartIds);
    trackBehavior("cart_product", { id: product.id, name: product.name });
  }

  function handleViewed(product: SmartphoneProduct) {
    markViewed(product.id);
    trackBehavior("view_product", { id: product.id, name: product.name });
  }

  return (
    <section id="products" className="bg-canvas py-16 sm:py-20">
      <div className="mx-auto max-w-content px-5">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Product showcase
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              Live smartphone picks from DummyJSON.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Product cards keep price, discount, rating, stock, and product details visible without
            forcing a checkout flow.
          </p>
        </div>

        <div className="mt-10">
          {productState.status === "loading" ? <ProductSkeletonGrid /> : null}
          {productState.status === "empty" ? <EmptyState /> : null}
          {productState.status === "error" ? <ErrorState message={productState.message} /> : null}
          {productState.status === "success" ? (
            <>
              <InteractionSummary
                cartCount={cartIds.length}
                cartProducts={cartProducts}
                favoriteCount={favoriteIds.length}
                recentlyViewed={recentlyViewed}
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {productState.products.slice(0, 6).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favoriteIds.includes(product.id)}
                    isInCart={cartIds.includes(product.id)}
                    onAddToCart={() => handleCart(product)}
                    onToggleFavorite={() => handleFavorite(product)}
                    onView={() => handleViewed(product)}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  isFavorite,
  isInCart,
  onAddToCart,
  onToggleFavorite,
  onView
}: {
  product: SmartphoneProduct;
  isFavorite: boolean;
  isInCart: boolean;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  onView: () => void;
}) {
  return (
    <article className="soft-reveal rounded-lg border border-line bg-elevated p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-soft motion-reduce:transform-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface">
        <Image
          src={product.image}
          alt={`${product.name} smartphone product image`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-5"
        />
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">{product.brand}</p>
            <h3 className="mt-1 break-words text-lg font-semibold text-ink">{product.name}</h3>
          </div>
          <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
            {formatDiscount(product.discountPercentage)}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 break-words text-sm leading-6 text-muted">
          {product.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-2xl font-semibold text-ink">{formatPrice(product.price)}</span>
          <span className="inline-flex items-center gap-1 text-sm text-muted">
            <Star aria-hidden="true" size={16} className="fill-accent text-accent" />
            {formatRating(product.rating)}
          </span>
        </div>
        <div className="mt-4 rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium text-muted">
          {formatStock(product.stock)}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            className={`inline-flex min-h-10 items-center justify-center rounded-md border text-sm font-semibold transition ${
              isFavorite
                ? "border-danger bg-danger/10 text-danger"
                : "border-line bg-surface text-ink hover:border-accent"
            }`}
            type="button"
            aria-label={
              isFavorite ? `Remove ${product.name} from favorites` : `Favorite ${product.name}`
            }
            title={isFavorite ? "Remove favorite" : "Favorite"}
            onClick={onToggleFavorite}
          >
            <Heart aria-hidden="true" size={17} className={isFavorite ? "fill-current" : ""} />
          </button>
          <button
            className={`inline-flex min-h-10 items-center justify-center rounded-md border text-sm font-semibold transition ${
              isInCart
                ? "border-success bg-success/10 text-success"
                : "border-line bg-surface text-ink hover:border-accent"
            }`}
            type="button"
            aria-label={
              isInCart
                ? `Remove ${product.name} from cart preview`
                : `Add ${product.name} to cart preview`
            }
            title={isInCart ? "Remove from cart" : "Add to cart"}
            onClick={onAddToCart}
          >
            <ShoppingBag aria-hidden="true" size={17} />
          </button>
          <button
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-line bg-surface text-sm font-semibold text-ink transition hover:border-accent"
            type="button"
            aria-label={`Mark ${product.name} as recently viewed`}
            title="Mark viewed"
            onClick={onView}
          >
            <Eye aria-hidden="true" size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

function InteractionSummary({
  cartCount,
  cartProducts,
  favoriteCount,
  recentlyViewed
}: {
  cartCount: number;
  cartProducts: SmartphoneProduct[];
  favoriteCount: number;
  recentlyViewed: SmartphoneProduct[];
}) {
  const cartTotal = cartProducts.reduce((total, product) => total + product.price, 0);

  return (
    <div className="mb-5 rounded-lg border border-line bg-elevated p-4 text-sm text-muted">
      <div className="flex flex-wrap gap-3">
        <span className="rounded-full bg-surface px-3 py-1">Favorites: {favoriteCount}</span>
        <span className="rounded-full bg-surface px-3 py-1">
          Cart preview: {cartCount} item{cartCount === 1 ? "" : "s"}
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
            <div key={product.id} className="rounded-md border border-line bg-surface px-3 py-2">
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
  }

  return [ids, updateIds] as const;
}

function ProductSkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading products">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="rounded-lg border border-line bg-elevated p-4">
          <div className="animate-pulse">
            <div className="aspect-[4/3] rounded-md bg-line/40" />
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

function EmptyState() {
  return (
    <div className="rounded-lg border border-line bg-elevated p-6 text-muted">
      No smartphone products are available right now.
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-line bg-elevated p-6">
      <p className="font-semibold text-ink">Product data could not be loaded.</p>
      <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
      <button
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:border-accent"
        type="button"
        onClick={() => window.location.reload()}
      >
        <RefreshCcw aria-hidden="true" size={16} />
        Retry
      </button>
    </div>
  );
}
