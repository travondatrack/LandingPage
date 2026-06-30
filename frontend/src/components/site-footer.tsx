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
          <p className="text-lg font-semibold text-ink">HeliPhone</p>
          <p className="mt-1 text-sm text-muted">Smartphone landing page for HELICORP round 2.</p>
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
