import Image from "next/image";
import { RefreshCcw, Star } from "lucide-react";
import { formatDiscount, formatPrice, formatRating, formatStock } from "@/lib/format";
import type { ProductLoadState, SmartphoneProduct } from "@/lib/products";

type ProductShowcaseProps = {
  productState: ProductLoadState;
};

export function ProductShowcase({ productState }: ProductShowcaseProps) {
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {productState.products.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: SmartphoneProduct }) {
  return (
    <article className="rounded-lg border border-line bg-elevated p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-soft motion-reduce:transform-none">
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
            <h3 className="mt-1 text-lg font-semibold text-ink">{product.name}</h3>
          </div>
          <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
            {formatDiscount(product.discountPercentage)}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{product.description}</p>
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
      </div>
    </article>
  );
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
