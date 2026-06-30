import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HeliPhone | Smartphone Landing Page",
  description: "A responsive smartphone landing page powered by DummyJSON product data."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
