import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qtphone.example.com";
const title = "QTPhone | Flagship Smart Device Studio";
const description =
  "Explore the QTPhone flagship smart device landing page. Discover next-generation design engineered for studio photography, all-day battery endurance, and exceptional AI performance.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "QTPhone",
  keywords: ["flagship smartphone", "QTPhone", "next-gen smartphones", "premium smart devices"],
  icons: {
    icon: "/qtphone-icon-transparent-512.png",
    shortcut: "/qtphone-icon-transparent-512.png",
    apple: "/qtphone-icon-transparent-512.png"
  },
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "QTPhone",
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "QTPhone smartphone landing page preview"
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
  themeColor: "#F8FAFC"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-canvas text-ink selection:bg-accent selection:text-white">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="site-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
