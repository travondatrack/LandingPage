import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://heliphone.example.com";
const title = "HeliPhone | Flagship Smartphone Collection";
const description =
  "Explore the flagship HeliPhone series. Discover next-generation smartphones engineered for pro-grade photography, all-day battery endurance, and exceptional AI performance.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "HeliPhone",
  keywords: ["flagship smartphone", "HeliPhone", "next-gen smartphones", "premium mobile devices"],
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "HeliPhone",
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "HeliPhone smartphone landing page preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1018" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
