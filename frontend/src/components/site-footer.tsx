import Image from "next/image";

const footerLinks = [
  { label: "Products", href: "#products" },
  { label: "Features", href: "#features" },
  { label: "Specs", href: "#specs" },
  { label: "Newsletter", href: "#newsletter" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-canvas py-10">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-accent/10 p-1 border border-accent/20">
              <Image
                src="/qtphone-logo-transparent.png"
                alt="QTPhone Logo"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <p className="text-lg font-extrabold text-ink tracking-tight">QTPhone</p>
          </div>
          <p className="mt-2 text-sm text-muted">
            Flagship smart devices crafted for performance, design, and intelligent everyday living.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 text-sm text-muted">
          {footerLinks.map((link) => (
            <a key={link.href} className="transition hover:text-accent" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
