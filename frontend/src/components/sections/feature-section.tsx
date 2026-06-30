import { BatteryCharging, Camera, Gauge, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "AI-ready confidence",
    description:
      "Surface the clearest buying signals first: rating, discount, availability, warranty, and shipping.",
    icon: Gauge
  },
  {
    title: "Camera-ready",
    description:
      "Large product media and quick-view details help visitors inspect each phone before deciding.",
    icon: Camera
  },
  {
    title: "Fast decisions",
    description:
      "Search, sort, tabs, favorites, cart preview, and recently viewed items reduce comparison friction.",
    icon: BatteryCharging
  },
  {
    title: "Reliable ownership",
    description:
      "Warranty and fulfillment details stay visible so the landing page feels trustworthy, not generic.",
    icon: ShieldCheck
  }
];

export function FeatureSection() {
  return (
    <section id="features" className="border-y border-line bg-canvas py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-content px-5">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Standout features
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Premium utility, not decorative noise.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Every interaction is designed to help visitors compare, save, and act without leaving
            the story.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="soft-reveal group rounded-2xl border border-line bg-elevated p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent/70 hover:shadow-soft motion-reduce:transform-none"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgb(var(--color-accent)/0.18),rgb(99_102_241/0.12))] text-accent transition group-hover:scale-105">
                  <Icon aria-hidden="true" size={23} />
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
