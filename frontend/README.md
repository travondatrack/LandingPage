# QTPhone Frontend

Next.js App Router frontend for the QTPhone smartphone landing page. The app provides a complete product browsing experience with a hero showcase, responsive catalog, product detail modal, product filters, favorites, mini cart, newsletter signup, telemetry events, and an AI product advisor.

## Live Demo

https://qtphone.vercel.app

<a href="https://qtphone.vercel.app">
  <img src="https://qtphone.vercel.app/opengraph-image" alt="QTPhone live demo screenshot" width="100%">
</a>

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run format:check
npm run typecheck
npm run build
```

## Core Features

- Responsive landing page interface for desktop, tablet, and mobile.
- Hero product showcase with flagship imagery, metrics, and CTA buttons.
- Product catalog cards with image, price, rating, discount, stock, and actions.
- Search, series filters, pagination, and sorting by rating, price, or discount.
- Product detail popup with technical specifications and image gallery.
- Technology showcase sections for AI, camera, display, battery, durability, and performance.
- Favorites drawer for saved products.
- Mini cart drawer with add/remove behavior, quantity display, and subtotal preview.
- Newsletter form with email validation and optional webhook forwarding.
- Floating chatbot for product recommendations and smartphone comparisons.
- Light/dark mode toggle with persisted theme preference.
- Loading, empty, and error states for smoother user experience.

## Deployment

Deploy on Vercel with these project settings:

```text
Root Directory: frontend
Install Command: npm install
Build Command: npm run build
Output Directory: leave empty / default Next.js
```

The Vercel config for these commands is in `frontend/vercel.json`. Do not set a custom output directory such as `.next`; Vercel's Next.js preset handles it automatically.

## Environment Variables

Create `frontend/.env.local` from `frontend/.env.example`, then fill only the providers you want to enable.

| Variable | Required | Example | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | `https://qtphone.vercel.app` | Public site URL used for metadata and social preview URLs. |
| `NEWSLETTER_WEBHOOK_URL` | No | `https://webhook.site/...` | Primary server-side webhook endpoint for newsletter or notification submissions. |
| `WEBHOOK_URL` | No | `https://webhook.site/...` | Fallback webhook endpoint used when `NEWSLETTER_WEBHOOK_URL` is not set. |
| `NEWSLETTER_WEBHOOK_SECRET` | No | `your-shared-secret` | Optional shared secret sent with newsletter webhook requests. |
| `GROQ_API_KEY` | No | `gsk_...` | Enables Groq-backed chatbot responses. |
| `GROQ_MODEL` | No | `llama-3.1-8b-instant` | Groq model name used by the chatbot route. |
| `OPENAI_API_KEY` | No | `sk-...` | Enables OpenAI-backed chatbot responses. |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI model name used by the chatbot route. |
| `GEMINI_API_KEY` | No | `AIza...` | Enables Gemini-backed chatbot responses. |
| `GEMINI_MODEL` | No | `gemini-1.5-flash` | Gemini model name used by the chatbot route. |

If no AI provider key is configured, the chatbot still works with a curated local fallback response flow.

## API Routes

- `POST /api/newsletter`: validates email, stores the submission in memory, and forwards to webhook when configured.
- `GET /api/newsletter`: returns a small in-memory summary of recent validated newsletter submissions.
- `POST /api/behavior`: stores recent click, scroll, chat, and ecommerce behavior events in memory.
- `GET /api/behavior`: returns a small in-memory summary of recent behavior events.
- `POST /api/chat`: returns Groq, OpenAI, or Gemini product advisory replies when credentials are configured, then falls back to curated catalog replies.

The product catalog is normalized into the smartphone showcase lineup from:

```text
https://dummyjson.com/products/category/smartphones
```
