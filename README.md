# HELICORP Series X1 Showcase — Flagship Smartphone Landing Page

A next-generation, responsive smartphone landing page built for the **HELICORP Series X1 Showcase** IT Internship assignment (Round 2). This project integrates public mobile data from the [DummyJSON API](https://dummyjson.com/products/category/smartphones) with custom specification enrichment, real-time developer telemetry, dynamic product comparison matrices, and an AI-powered shopping concierge.

---

## 🌟 Key Highlights & Architecture

- **Framework**: Next.js 15+ (App Router, Server & Client Components)
- **Language**: TypeScript (Strict type safety across API routes, UI state, and telemetry payloads)
- **Styling**: Tailwind CSS with custom design tokens (`canvas`, `surface`, `ink`, `cyanAccent`)
- **Icons**: Lucide React
- **Data Layer**: Dynamic data fetching from `https://dummyjson.com/products/category/smartphones` enriched with custom high-fidelity hardware specifications (Retina displays, SoC processors, camera optics, battery speeds).

---

## 📱 Core Landing Page Sections

1. **Sticky Navbar & Interaction Drawers**:
   - Quick navigation links and real-time counters.
   - Slide-out drawers for **Saved Favorites** and **Pre-order Reservation Cart**.
2. **Hero Showcase**:
   - High-impact smartphone silhouette with floating interactive hardware badges.
   - Instant CTAs linked to product catalogs and comparison tables.
3. **Smartphone Curations (Product Grid)**:
   - Live filtering by brand (`Apple`, `Samsung`, `Huawei`, `OPPO`, etc.).
   - Multi-field keyword search across titles, descriptions, and specs.
   - Dynamic sorting by hardware rating, price ascending/descending, and pre-order discount percentage.
4. **Interactive Specifications Matrix (Compare Section)**:
   - Side-by-side comparative table supporting up to 3 devices simultaneously.
   - Differential highlighting for divergent hardware specifications.
   - Quick-trigger **Battle Scenarios** (e.g., *Compare Top Flagships*).
5. **Detailed Hardware Modal**:
   - Full-screen inspection modal featuring interactive image thumbnail galleries, color swatch selectors, and complete technical breakdowns.
6. **Pre-order Newsletter & Live Webhook Pipeline**:
   - Email validation with instant server-side webhook simulation payload inspectable directly in the UI.
7. **Developer Telemetry Console (Bottom Drawer)**:
   - Live monitor recording user interactions (`navigation`, `scroll-depth`, `click`, `favorite`, `cart`, `newsletter`) persisted in memory on the server.

---

## 🚀 Bonus & Interactive Features

- **Light/Dark & Premium Dark Theme**: Curated deep `#050505` aesthetic with glassmorphism overlays and vibrant accent borders.
- **Scrollytelling & Milestone Tracking**: Automatically logs milestone scroll depths (25%, 50%, 75%, 100%) and emits non-blocking UI notifications.
- **AI Co-pilot Chatbot (`/api/chat`)**: Built-in neural concierge supporting multi-provider LLM routing (OpenAI / Google Gemini) with instant demo fallback.
- **Zero Layout Shifts & Optimized Media**: Skeletons during data fetching and constrained responsive image frames.

---

## 🛠️ Getting Started Locally

### 1. Prerequisites
Ensure you have **Node.js 18+** installed.

### 2. Installation & Run
Navigate into the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the showcase.

### 3. Production Build Verification
Verify type validity and optimized static generation:

```bash
cd frontend
npm run build
```

---

## 📋 Final Submission Checklist

- [x] **Public GitHub Repository**: [https://github.com/travondatrack/LandingPage](https://github.com/travondatrack/LandingPage)
- [x] **DummyJSON Integration**: Real-time category data fetch + custom high-fidelity hardware specs enrichment.
- [x] **Responsive UI & Accessibility**: Tested across mobile viewports (`390px`) up to desktop (`1280px+`).
- [x] **Bonus Verification Proof**:
  - Live Webhook execution logs visible on newsletter submission.
  - Expandable developer telemetry dashboard tracking event streams.
  - Interactive Pre-order cart & Favorites queue persisted locally.

---
*Developed for HELICORP Round 2 IT Internship Assessment.*
