import { Cpu, MemoryStick, Smartphone, Truck } from "lucide-react";
import { formatSpecValue } from "@/lib/format";
import type { ProductLoadState, ProductSpec } from "@/lib/products";

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

const specHighlights = [
  { label: "Product images", value: "Stable aspect ratios", icon: Smartphone },
  { label: "Performance cues", value: "Ratings and discounts", icon: Cpu },
  { label: "Inventory", value: "Stock visibility", icon: MemoryStick },
  { label: "Delivery", value: "Shipping and warranty", icon: Truck }
];

export function SpecsSection({ productState }: SpecsSectionProps) {
  const sourceProduct = productState.status === "success" ? productState.products[0] : undefined;
  const specs = sourceProduct?.specs ?? curatedSpecs;

  return (
    <section id="specs" className="bg-surface py-16 sm:py-20">
      <div className="mx-auto grid max-w-content gap-10 px-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Technical specifications
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            Details that make the buying path clearer.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted">
            Specs combine curated smartphone priorities with product-derived availability,
            dimensions, warranty, and shipping data when the API is available.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {specHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-lg border border-line bg-elevated p-4">
                  <Icon aria-hidden="true" size={20} className="text-accent" />
                  <p className="mt-3 text-sm font-semibold text-ink">{item.label}</p>
                  <p className="mt-1 text-sm text-muted">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-line bg-elevated p-4 shadow-sm sm:p-6">
          {sourceProduct ? (
            <p className="mb-4 text-sm font-semibold text-accent">Based on {sourceProduct.name}</p>
          ) : null}
          <dl className="grid gap-3 sm:grid-cols-2">
            {specs.map((spec) => (
              <div key={spec.label} className="rounded-md border border-line bg-surface p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {spec.label}
                </dt>
                <dd className="mt-2 text-base font-semibold capitalize text-ink">
                  {formatSpecValue(spec.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
