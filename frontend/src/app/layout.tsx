import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qtphone.example.com";
const title = "QTPhone Flagship Series | Next-Gen Smart Devices";
const description =
  "Explore the QTPhone Flagship Series showcase. Designed for next-gen mobility, aerospace titanium materials, and unparalleled neural intelligence.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "QTPhone Flagship Series",
  keywords: ["QTPhone", "Flagship Series", "smartphone showcase", "specs comparison", "aerospace titanium"],
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
  themeColor: "#171b26"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
try {
  var theme = localStorage.getItem("qtphone-theme");
  if (theme === "light" || theme === "dark") {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  }
} catch (_) {}
            `.trim()
          }}
        />
      </head>
      <body className="bg-[#f8fafc] dark:bg-[#171b26] text-slate-900 dark:text-zinc-100 selection:bg-blue-600 selection:text-white transition-colors duration-300">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
