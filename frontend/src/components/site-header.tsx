import { Smartphone } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#products", label: "Products" },
  { href: "#specs", label: "Specs" },
  { href: "#newsletter", label: "Updates" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-content items-center justify-between gap-4 px-5">
        <a className="inline-flex items-center gap-2 font-semibold text-ink" href="#">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-white">
            <Smartphone aria-hidden="true" size={19} />
          </span>
          <span>HeliPhone</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm sm:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              className="font-medium text-muted transition hover:text-accent"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            className="hidden min-h-10 items-center justify-center rounded-md border border-line bg-canvas px-4 text-sm font-semibold text-ink transition hover:border-accent sm:inline-flex"
            href="#newsletter"
          >
            Get updates
          </a>
        </div>
      </div>
    </header>
  );
}
