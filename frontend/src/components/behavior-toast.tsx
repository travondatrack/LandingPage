export function BehaviorToast({ message }: { message: string }) {
  return (
    <div
      className={`fixed left-1/2 top-20 z-40 w-[min(92vw,360px)] -translate-x-1/2 rounded-md border border-line bg-elevated px-4 py-3 text-sm font-medium text-ink shadow-soft transition ${
        message ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
      }`}
      aria-live="polite"
    >
      {message || "Tracking interaction"}
    </div>
  );
}
