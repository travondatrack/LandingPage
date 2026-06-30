const phoneBrands = [
  { name: "QTPhone Flagship", symbol: "QT" },
  { name: "Apple iPhone", symbol: "" },
  { name: "Samsung Galaxy", symbol: "S" },
  { name: "Google Pixel", symbol: "G" },
  { name: "Xiaomi Pro", symbol: "MI" },
  { name: "OPPO Find", symbol: "O" },
  { name: "OnePlus Flagship", symbol: "1+" },
  { name: "Vivo X Series", symbol: "V" },
  { name: "Sony Xperia", symbol: "X" },
  { name: "ASUS ROG Phone", symbol: "ROG" },
  { name: "Motorola Edge", symbol: "M" }
];

export function TrustedBrandsSection() {
  const brands = [...phoneBrands, ...phoneBrands];

  return (
    <section
      aria-label="Featured Smartphone Brands"
      className="border-y border-line/70 bg-surface/80 py-5 backdrop-blur"
    >
      <div className="trusted-marquee relative overflow-hidden">
        <div className="trusted-marquee-track flex w-max items-center gap-4 px-5">
          {brands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full border border-line bg-elevated px-5 text-xs font-bold tracking-widest text-ink/80 shadow-sm transition hover:border-accent hover:text-accent hover:scale-105 duration-300"
            >
              <span className="flex h-6 min-w-6 px-1.5 items-center justify-center rounded-full bg-accent/15 text-[11px] font-black text-accent border border-accent/30">
                {brand.symbol}
              </span>
              <span className="uppercase font-extrabold">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
