import Image from "next/image";
import { BatteryCharging, Camera, Cpu, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    title: "Next-Gen AI Performance",
    description: "On-device intelligence for instant editing, search, and multitasking.",
    spec: "45 TOPS NPU",
    icon: Cpu
  },
  {
    title: "Cinematic Pro Optics",
    description: "Studio-grade capture with stabilized night video and crisp portraits.",
    spec: "108MP OIS",
    icon: Camera
  },
  {
    title: "All-Day Endurance",
    description: "High-density cells keep flagship power ready from morning to night.",
    spec: "5000mAh",
    icon: BatteryCharging
  },
  {
    title: "Enterprise Security",
    description: "Hardware-backed protection for biometrics, passwords, and private data.",
    spec: "Secure Chip",
    icon: ShieldCheck
  }
];

export function FeatureSection() {
  return (
    <section
      id="features"
      className="relative isolate overflow-hidden border-y border-line bg-[radial-gradient(ellipse_90%_70%_at_12%_20%,rgb(var(--color-accent)/0.16),transparent_58%),linear-gradient(135deg,rgb(var(--color-canvas)),rgb(var(--color-surface))_48%,rgb(var(--color-elevated)))] py-14 sm:py-16 lg:py-18"
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
      <div className="absolute left-0 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/3 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-content px-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-widest text-accent">
              Why Choose QTPhone
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Flagship power, refined for real life.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            A compact feature system built around intelligence, optics, endurance, and trust.
          </p>
        </div>

        <div className="mt-8 grid items-center gap-6 md:gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <div className="soft-reveal relative mx-auto flex w-full max-w-[34rem] justify-center lg:max-w-none">
            <div className="absolute inset-x-8 top-10 h-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/52 p-3 shadow-[0_32px_100px_rgb(var(--color-accent)/0.18)] backdrop-blur-2xl transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_38px_120px_rgb(var(--color-accent)/0.26)] motion-reduce:transform-none sm:p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,rgb(var(--color-accent)/0.12),rgb(255_255_255/0.9))]">
                <Image
                  src="/images/qtphone-feature-mockup.webp"
                  alt="QTPhone premium smartphone"
                  fill
                  sizes="(min-width: 1024px) 520px, 92vw"
                  className="object-cover object-[48%_48%] transition duration-700 hover:scale-[1.035]"
                  priority={false}
                />
                <div className="absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.42),transparent_42%,rgb(var(--color-accent)/0.12))]" />
              </div>
              <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/82 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-accent shadow-cyan backdrop-blur">
                <Sparkles aria-hidden="true" size={14} />
                QTPhone 16 Pro
              </div>
            </div>
          </div>

          <div className="grid auto-cols-[minmax(15rem,82vw)] grid-flow-col gap-3 overflow-x-auto pb-3 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="soft-reveal group min-h-[13.25rem] rounded-2xl border border-white/60 bg-elevated/76 p-4 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-cyan motion-reduce:transform-none sm:min-h-0"
                  style={{ animationDelay: `${index * 95}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgb(var(--color-accent)/0.18),rgb(99_102_241/0.12))] text-accent transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgb(var(--color-accent)/0.35)]">
                      <Icon aria-hidden="true" size={22} />
                    </div>
                    <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-accent">
                      {feature.spec}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold tracking-tight text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
