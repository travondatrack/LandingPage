import { BatteryCharging, Camera, Gauge, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "All-day confidence",
    description: "Battery-focused picks with fast shipping data and clear stock visibility.",
    icon: BatteryCharging
  },
  {
    title: "Camera-ready",
    description: "Compare device families with real product imagery and concise details.",
    icon: Camera
  },
  {
    title: "Fast decisions",
    description: "Discounts, ratings, and availability are surfaced where buyers scan first.",
    icon: Gauge
  },
  {
    title: "Reliable ownership",
    description: "Warranty, shipping, and return signals stay visible before a product click.",
    icon: ShieldCheck
  }
];

export function FeatureSection() {
  return (
    <section id="features" className="border-y border-line bg-surface/70 py-16 sm:py-20">
      <div className="mx-auto max-w-content px-5">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Standout features
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            Built for quick, confident smartphone comparison.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="soft-reveal rounded-lg border border-line bg-elevated p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft motion-reduce:transform-none"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon aria-hidden="true" size={22} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
