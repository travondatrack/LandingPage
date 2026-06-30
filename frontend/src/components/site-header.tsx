"use client";

import { Heart, Menu, ShoppingBag, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "#story", label: "Story" },
  { href: "#features", label: "Features" },
  { href: "#products", label: "Products" },
  { href: "#specs", label: "Specs" },
  { href: "#newsletter", label: "Updates" }
];

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState("story");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [counts, setCounts] = useState({ favorites: 0, cart: 0 });

  useEffect(() => {
    function readCounts() {
      setCounts({
        favorites: readStoredCount("heliphone-favorites"),
        cart: readStoredCount("heliphone-cart")
      });
    }

    function handleScroll() {
      setScrolled(window.scrollY > 8);

      const current = navItems
        .map((item) => item.href.slice(1))
        .findLast((id) => {
          const section = document.getElementById(id);
          return section ? section.getBoundingClientRect().top <= 120 : false;
        });

      if (current) {
        setActiveSection(current);
      }
    }

    readCounts();
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("storage", readCounts);
    window.addEventListener("heliphone-storage", readCounts);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", readCounts);
      window.removeEventListener("heliphone-storage", readCounts);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition ${
        scrolled
          ? "border-line bg-surface/86 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-surface/64 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex min-h-16 max-w-content items-center justify-between gap-4 px-5">
        <a className="inline-flex min-w-0 items-center gap-2 font-semibold text-ink" href="#">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-soft">
            <Smartphone aria-hidden="true" size={20} />
          </span>
          <span className="truncate text-lg tracking-tight">HeliPhone</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 text-sm lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={`rounded-full px-4 py-2 font-medium transition ${
                activeSection === item.href.slice(1)
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-surface hover:text-ink"
              }`}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <BadgeButton count={counts.favorites} icon="heart" label="Favorite products" />
          <BadgeButton count={counts.cart} icon="bag" label="Cart preview" />
          <ThemeToggle />
          <a
            className="premium-button hidden min-h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-white lg:inline-flex"
            href="#products"
          >
            Shop picks
          </a>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink lg:hidden"
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" size={19} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 bg-ink/40 lg:hidden" role="presentation">
          <aside className="ml-auto flex h-full w-[min(84vw,340px)] flex-col border-l border-line bg-elevated p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-ink">Menu</span>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink"
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <nav className="mt-8 grid gap-2" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-ink transition hover:bg-surface"
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}

function BadgeButton({
  count,
  icon,
  label
}: {
  count: number;
  icon: "heart" | "bag";
  label: string;
}) {
  const Icon = icon === "heart" ? Heart : ShoppingBag;

  return (
    <a
      className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-ink transition hover:border-accent sm:inline-flex"
      href="#products"
      aria-label={`${label}: ${count}`}
      title={`${label}: ${count}`}
    >
      <Icon aria-hidden="true" size={18} />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-white">
          {count}
        </span>
      ) : null}
    </a>
  );
}

function readStoredCount(key: string) {
  try {
    const value = window.localStorage.getItem(key);
    const parsed = value ? (JSON.parse(value) as unknown) : [];
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}
