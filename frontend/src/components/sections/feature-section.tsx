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
      className="relative isolate overflow-hidden border-y border-line bg-elevated py-16 sm:py-20"
    >
      <div className="absolute left-0 top-1/2 -z-10 h-[22rem] w-[min(22rem,92vw)] -translate-x-1/3 -translate-y-1/2 rounded-full bg-white/70 blur-3xl sm:h-[28rem] sm:w-[28rem]" />

      <div className="mx-auto max-w-content px-4 sm:px-5">
        <div className="flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-3xl min-w-0">
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

        <div className="mt-8 grid min-w-0 items-center gap-6 md:gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <div className="soft-reveal relative mx-auto flex w-full max-w-[34rem] justify-center lg:max-w-none">
            <div className="absolute inset-x-6 top-10 h-56 rounded-full bg-white/80 blur-3xl sm:inset-x-8 sm:h-72" />
            <div className="relative w-full overflow-hidden rounded-2xl border border-line/70 bg-white p-3 shadow-[0_24px_60px_rgb(15_23_42/0.1)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgb(15_23_42/0.14)] motion-reduce:transform-none sm:p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#FFFFFF,#EAF6FF)]">
                <Image
                  src="/images/qtphone-feature-mockup.webp"
                  alt="QTPhone premium smartphone"
                  fill
                  sizes="(min-width: 1024px) 520px, 92vw"
                  className="object-cover object-[48%_48%] transition duration-700 hover:scale-[1.035]"
                  priority={false}
                />
                <div className="absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.35),transparent_46%,rgb(var(--color-accent)/0.08))]" />
              </div>
              <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/88 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-accent shadow-sm backdrop-blur">
                <Sparkles aria-hidden="true" size={14} />
                QTPhone 16 Pro
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="soft-reveal group min-w-0 rounded-2xl border border-line/70 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_40px_rgb(15_23_42/0.1)] motion-reduce:transform-none"
                  style={{ animationDelay: `${index * 95}ms` }}
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-elevated text-accent transition duration-300 group-hover:scale-105">
                      <Icon aria-hidden="true" size={22} />
                    </div>
                    <span className="max-w-[8.5rem] break-words rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-center text-[10px] font-black uppercase tracking-wide text-accent">
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
