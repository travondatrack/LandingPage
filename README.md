# QTPhone

<div align="center">

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs" alt="Next.js 15"/>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0f172a" alt="React 19"/>
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.7"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 3.4"/>
    <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white" alt="Node.js 18+"/>
    <img src="https://img.shields.io/badge/Vercel-Ready-black?logo=vercel" alt="Vercel Ready"/>
  </p>
</div>

## Live Demo

Experience the live version of QTPhone here: [https://qtphone.vercel.app](https://qtphone.vercel.app)


## 🌟 Overview

QTPhone is a polished e-commerce-style smartphone landing page built with Next.js 15, React 19, TypeScript, Tailwind CSS, and App Router API routes. It aims to deliver a complete product browsing experience by combining a cinematic hero section, responsive product catalog, detailed product modal, filtering and sorting tools, favorites, mini cart behavior, email notification form, telemetry logging, and an AI chatbot for product recommendations.

The project focuses on user experience, visual clarity, and performance across desktop, tablet, and mobile screens. Product data is fetched from the public DummyJSON smartphone catalog and enriched with clearer flagship specifications for display, comparison, and consultation flows.

## ✨ Features

- **Modern Landing Page UI** - Clean product-focused layout with responsive sections for desktop, tablet, and mobile
- **Hero Product Showcase** - Prominent first-screen hero area with product imagery, animated device presentation, key metrics, and call-to-action buttons
- **Product Catalog** - Product cards include basic information, image, price, rating, discount, stock status, and action buttons
- **Filtering & Sorting** - Search products and filter by device series, with sorting by rating, price, and discount
- **Product Detail Popup** - Detail modal displays product images, technical specifications, color/options style UI, price, and purchase actions
- **Technology Highlight Section** - Dedicated showcase for AI, camera, battery, display, processor, durability, and premium hardware strengths
- **Favorites** - Users can save favorite products and review them from the navigation drawer
- **Mini Cart** - Basic shopping behavior with add/remove actions, quantity display, cart drawer, and subtotal preview
- **Email Notification Form** - Newsletter/pre-order notification form with validation and optional webhook delivery
- **AI Product Chatbot** - Floating chatbot in the corner for smartphone advice, comparisons, and product recommendations
- **Light/Dark Mode** - Theme toggle with persisted light and dark UI states
- **UX & Performance Optimized** - Responsive image handling, loading states, scroll interactions, compact UI feedback, and optimized Next.js build flow

## 🎯 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/travondatrack/LandingPage.git QTPhone
   cd QTPhone
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with optional webhook or AI provider configuration
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Open the site**
   ```text
   http://localhost:3000
   ```

## 📚 Documentation

- [Frontend README](frontend/README.md)
- [Environment Example](frontend/.env.example)
- [Next.js Configuration](frontend/next.config.ts)
- [Product Catalog Logic](frontend/src/lib/products.ts)
- [API Routes](frontend/src/app/api)

## 🏗️ Project Structure

```text
QTPhone/
+-- frontend/
|   +-- public/
|   |   +-- qtphone-icon-transparent-512.png
|   +-- src/
|   |   +-- app/
|   |   |   +-- api/
|   |   |       +-- behavior/
|   |   |       +-- chat/
|   |   |       +-- events/
|   |   |       +-- newsletter/
|   |   +-- components/
|   |   +-- lib/
|   |   +-- types.ts
|   +-- package.json
|   +-- tailwind.config.ts
|   +-- vercel.json
+-- openspec/
+-- README.md
+-- .gitignore
```

## 🤝 Contributing

We love your input! We want to make contributing to QTPhone as easy and transparent as possible. Please open an issue or pull request with a clear description of the change.

### Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- DummyJSON for public smartphone catalog data
- Next.js, React, TypeScript, and Tailwind CSS communities
- Lucide React for the icon set
- OpenAI, Gemini, or Groq-compatible providers for optional AI chatbot responses

## 📞 Support

- 📧 Email: 23162101@student.hcmute.edu.vn

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/travondatrack">@travondatrack</a>
</div>
