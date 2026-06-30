import { BatteryCharging, Camera, Gauge, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Next-Gen AI Performance",
    description:
      "Powered by our latest neural processing unit for instantaneous app launches, on-device AI assistance, and ultra-smooth multitasking.",
    icon: Gauge
  },
  {
    title: "Cinematic Pro Optics",
    description:
      "Multi-lens camera arrays with optical image stabilization let you capture professional portraits and crisp high-resolution video.",
    icon: Camera
  },
  {
    title: "All-Day Endurance",
    description:
      "High-density silicon-carbon battery cells deliver multi-day battery life with lightning-fast wired and wireless charging capabilities.",
    icon: BatteryCharging
  },
  {
    title: "Enterprise Security",
    description:
      "Dedicated hardware encryption and biometric authentication keep your personal data, passwords, and digital identity completely secure.",
    icon: ShieldCheck
  }
];

export function FeatureSection() {
  return (
    <section
      id="features"
      className="border-y border-line bg-surface/60 py-16 sm:py-20 lg:py-24 backdrop-blur"
    >
      <div className="mx-auto max-w-content px-5">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Why Choose QTPhone
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Engineered without compromise.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">
            Discover cutting-edge innovations designed to empower your creativity, boost
            productivity, and secure your digital life.
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
