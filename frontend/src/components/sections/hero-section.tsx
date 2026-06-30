import Image from "next/image";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";
import type { ProductLoadState } from "@/lib/products";
import { formatDiscount, formatPrice, formatRating } from "@/lib/format";

type HeroSectionProps = {
  productState: ProductLoadState;
};

const trustStats = [
  { label: "Products", value: "20+" },
  { label: "Real API data", value: "Live" },
  { label: "Compare faster", value: "<30s" }
];

export function HeroSection({ productState }: HeroSectionProps) {
  const featured = productState.status === "success" ? productState.products[0] : undefined;

  return (
    <section className="relative isolate overflow-hidden bg-canvas py-14 sm:py-20 lg:min-h-[calc(100vh-4rem)] lg:py-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,transparent_0%,rgb(var(--color-accent)/0.10)_44%,transparent_70%)]" />
      <div className="mx-auto grid max-w-content items-center gap-10 px-5 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="soft-reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/78 px-3 py-2 text-sm font-semibold text-accent shadow-sm backdrop-blur">
            <Sparkles aria-hidden="true" size={16} />
            Premium Smart Device Commerce
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Find your next smart device with real product data.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            Compare specs, price, ratings, discounts, warranty, and shipping details in one fast,
            premium buying flow powered by DummyJSON smartphones.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="premium-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-white"
              href="#products"
            >
              Explore phones
              <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a
              className="premium-button inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface/86 px-6 text-sm font-semibold text-ink backdrop-blur hover:border-accent"
              href="#specs"
            >
              Compare products
            </a>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {trustStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-surface/78 p-4 backdrop-blur"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {stat.label}
                </dt>
                <dd className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="soft-reveal relative">
          <div className="premium-panel product-sheen relative overflow-hidden rounded-[1.75rem] p-4 sm:p-6">
            {featured ? (
              <article>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
                    <Zap aria-hidden="true" size={15} />
                    {formatDiscount(featured.discountPercentage)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold text-muted">
                    <Star aria-hidden="true" size={15} className="fill-accent text-accent" />
                    {formatRating(featured.rating)}
                  </span>
                </div>

                <div className="relative mt-5 aspect-[1/0.9] overflow-hidden rounded-[1.25rem] bg-[linear-gradient(140deg,rgb(var(--color-surface)),rgb(var(--color-accent)/0.10))]">
                  <Image
                    src={featured.image}
                    alt={`${featured.name} smartphone product spotlight`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 520px, 92vw"
                    className="object-contain p-8 transition duration-500 hover:scale-[1.035]"
                  />
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <p className="text-sm font-medium text-muted">{featured.brand}</p>
                    <h2 className="mt-1 break-words text-3xl font-semibold tracking-tight text-ink">
                      {featured.name}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                      {featured.description}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-line bg-surface px-4 py-3 text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">From</p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
                      {formatPrice(featured.price)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: BadgeCheck, label: "Verified data" },
                    { icon: ShieldCheck, label: "Warranty shown" },
                    { icon: Zap, label: "Fast compare" }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-line bg-surface/78 p-3 text-sm font-semibold text-ink"
                      >
                        <Icon aria-hidden="true" size={18} className="mb-2 text-accent" />
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </article>
            ) : (
              <HeroSkeleton />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between">
        <div className="h-8 w-32 rounded-full bg-line/50" />
        <div className="h-8 w-24 rounded-full bg-line/50" />
      </div>
      <div className="mt-5 aspect-[1/0.9] rounded-[1.25rem] bg-line/40" />
      <div className="mt-6 h-8 w-3/4 rounded bg-line/50" />
      <div className="mt-3 h-4 w-full rounded bg-line/40" />
    </div>
  );
}
