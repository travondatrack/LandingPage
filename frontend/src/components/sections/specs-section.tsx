"use client";

import { Cpu, MemoryStick, Smartphone, Star, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { formatPrice, formatRating, formatSpecValue, formatStock } from "@/lib/format";
import type { ProductLoadState, ProductSpec, SmartphoneProduct } from "@/lib/products";

type SpecsSectionProps = {
  productState: ProductLoadState;
};

const curatedSpecs: ProductSpec[] = [
  { label: "Display", value: "Immersive OLED-ready viewing" },
  { label: "Performance", value: "Flagship everyday multitasking" },
  { label: "Camera", value: "High-resolution capture modes" },
  { label: "Battery", value: "All-day power profile" },
  { label: "Security", value: "Biometric unlock ready" },
  { label: "Connectivity", value: "Modern wireless essentials" }
];

export function SpecsSection({ productState }: SpecsSectionProps) {
  const products = useMemo(
    () => (productState.status === "success" ? productState.products : []),
    [productState]
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? products[0],
    [products, selectedId]
  );
  const specs = selectedProduct ? buildSpecs(selectedProduct) : curatedSpecs;

  return (
    <section id="specs" className="bg-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-content gap-10 px-5 lg:grid-cols-[0.84fr_1.16fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Technical specifications
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            A specs dashboard for fast confidence.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted">
            Switch between products and scan brand, category, stock, rating, warranty, shipping, and
            pricing without leaving the landing page.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { label: "Visuals", value: "Stable images", icon: Smartphone },
              {
                label: "Rating",
                value: selectedProduct ? formatRating(selectedProduct.rating) : "Live score",
                icon: Star
              },
              {
                label: "Inventory",
                value: selectedProduct ? formatStock(selectedProduct.stock) : "Stock signal",
                icon: MemoryStick
              },
              { label: "Delivery", value: "Warranty + shipping", icon: Truck }
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="soft-reveal rounded-2xl border border-line bg-elevated p-4 shadow-sm"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <Icon aria-hidden="true" size={21} className="text-accent" />
                  <p className="mt-3 text-sm font-semibold text-ink">{item.label}</p>
                  <p className="mt-1 text-sm text-muted">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="premium-panel soft-reveal rounded-[1.75rem] p-5 sm:p-6">
          {products.length > 0 ? (
            <label className="block">
              <span className="text-sm font-semibold text-ink">Selected product</span>
              <select
                className="mt-3 min-h-12 w-full rounded-2xl border border-line bg-surface px-4 text-sm font-semibold text-ink"
                value={selectedProduct?.id ?? ""}
                onChange={(event) => setSelectedId(Number(event.target.value))}
              >
                {products.slice(0, 8).map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
              Specs preview will use live products when the API is available.
            </div>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {specs.map((spec) => (
              <div key={spec.label} className="rounded-2xl border border-line bg-surface p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {spec.label}
                </dt>
                <dd className="mt-2 break-words text-base font-semibold capitalize text-ink">
                  {formatSpecValue(spec.value)}
                </dd>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Cpu aria-hidden="true" size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Decision summary</p>
                <p className="mt-1 text-sm text-muted">
                  {selectedProduct
                    ? `${selectedProduct.name} starts at ${formatPrice(selectedProduct.price)} with ${formatRating(selectedProduct.rating)} rating.`
                    : "Live product pricing, rating, and fulfillment details are summarized here."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function buildSpecs(product: SmartphoneProduct): ProductSpec[] {
  return [
    { label: "Brand", value: product.brand },
    { label: "Category", value: "Smartphones" },
    { label: "Stock", value: formatStock(product.stock) },
    { label: "Rating", value: formatRating(product.rating) },
    { label: "Price", value: formatPrice(product.price) },
    ...product.specs.filter((spec) => ["Warranty", "Shipping", "Dimensions"].includes(spec.label))
  ];
}
