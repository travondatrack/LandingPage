import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        accentStrong: "rgb(var(--color-accent-strong) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        navy: "#07111F",
        navySurface: "#0E1A2B",
        cyanAccent: "#38BDF8"
      },
      boxShadow: {
        soft: "0 18px 60px rgb(7 17 31 / 0.45)",
        cyan: "0 0 35px rgba(56, 189, 248, 0.25)",
        cyanStrong: "0 0 50px rgba(56, 189, 248, 0.45)"
      },
      maxWidth: {
        content: "1240px"
      }
    }
  },
  plugins: []
};

export default config;
