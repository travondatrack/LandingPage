import { Activity } from "lucide-react";

export function BehaviorToast({ message }: { message: string }) {
  return (
    <div
      className={`fixed left-1/2 top-20 z-50 w-[min(92vw,420px)] -translate-x-1/2 rounded-full border border-accent/40 bg-surface/90 px-4 py-2.5 text-xs font-bold text-ink shadow-cyan backdrop-blur-xl transition-all duration-300 flex items-center justify-between gap-3 ${
        message ? "translate-y-0 opacity-100 scale-100" : "pointer-events-none -translate-y-4 opacity-0 scale-95"
      }`}
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-accent">
        <Activity size={15} className="animate-pulse shrink-0" />
        <span className="uppercase tracking-widest text-[10px] font-extrabold text-muted">Telemetry Log</span>
      </div>
      <span className="truncate text-ink font-semibold">{message || "Tracking user interaction..."}</span>
    </div>
  );
}
