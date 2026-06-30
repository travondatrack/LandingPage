import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import type { ProductLoadState } from "@/lib/products";
import { formatDiscount, formatPrice, formatRating } from "@/lib/format";

type HeroSectionProps = {
  productState: ProductLoadState;
};

export function HeroSection({ productState }: HeroSectionProps) {
  const featured = productState.status === "success" ? productState.products[0] : undefined;

  return (
    <section className="relative bg-canvas py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-content items-center gap-10 px-5 lg:grid-cols-[1fr_440px]">
        <div className="soft-reveal">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            HeliPhone collection
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-ink sm:text-6xl">
            Choose a smarter phone with real product data in view.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Browse smartphone options with live names, pricing, ratings, discounts, warranty
            details, and stable product visuals from DummyJSON.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accentStrong"
              href="#products"
            >
              Explore phones
              <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-line bg-surface px-5 text-sm font-semibold text-ink transition hover:border-accent"
              href="#specs"
            >
              Compare specs
            </a>
          </div>
        </div>

        <div className="soft-reveal rounded-lg border border-line bg-elevated p-5 shadow-soft">
          {featured ? (
            <article>
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface">
                <Image
                  src={featured.image}
                  alt={`${featured.name} smartphone product image`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="object-contain p-6"
                />
              </div>
              <div className="mt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted">{featured.brand}</p>
                    <h2 className="mt-1 text-2xl font-semibold text-ink">{featured.name}</h2>
                  </div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                    {formatDiscount(featured.discountPercentage)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span className="text-2xl font-semibold text-ink">
                    {formatPrice(featured.price)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star aria-hidden="true" size={16} className="fill-accent text-accent" />
                    {formatRating(featured.rating)}
                  </span>
                </div>
              </div>
            </article>
          ) : (
            <div className="animate-pulse">
              <div className="aspect-[4/3] rounded-md bg-line/40" />
              <div className="mt-5 h-4 w-24 rounded bg-line/50" />
              <div className="mt-3 h-7 w-3/4 rounded bg-line/50" />
              <div className="mt-5 h-6 w-36 rounded bg-line/50" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
