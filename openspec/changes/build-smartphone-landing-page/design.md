## Context

The project needs a frontend landing page submission for the HELICORP round 2 test. The current workspace contains an OpenSpec planning area and an empty or not-yet-initialized `frontend` directory, so the implementation can establish a focused Next.js frontend app without migrating existing product UI.

The landing page will showcase smartphone products using the DummyJSON endpoint `https://dummyjson.com/products/category/smartphones`. The implementation must satisfy visual, responsive, SEO, performance, source-control, and deployment expectations from the assignment while staying practical for a short test delivery.

## Goals / Non-Goals

**Goals:**

- Create a production-ready frontend using Next.js, TypeScript, Tailwind CSS, ESLint, and Prettier.
- Render a visually polished smartphone landing page with hero, feature highlights, technical specification content, product-driven sections, and a newsletter form.
- Integrate DummyJSON smartphone data with loading, empty, and error states.
- Provide responsive desktop and mobile layouts with stable spacing, typography, and media treatment.
- Add SEO metadata and deployment-friendly build scripts.
- Include selected bonus features that provide high visible value without overcomplicating the app, such as dark mode, skeleton loading, saved favorites/cart/recently viewed, micro-interactions, and scroll animation.

**Non-Goals:**

- Build a full ecommerce checkout, payment flow, inventory system, or authenticated user accounts.
- Persist newsletter submissions to a real backend unless a webhook URL is later provided.
- Build a custom CMS or admin panel.
- Depend on paid cloud services.

## Decisions

### Use Next.js App Router as the application shell

Next.js App Router provides metadata support, route-level rendering control, optimized image handling, and straightforward Vercel deployment. A single-page marketing experience can live in the root route while still allowing clean component organization.

Alternative considered: a plain Vite React app. Vite is simpler, but Next.js gives stronger SEO and deployment ergonomics for a landing page submission.

### Fetch DummyJSON data through a typed data layer

Product fetching will be isolated in a typed API helper that maps DummyJSON responses into a small product model used by the UI. This keeps components focused on rendering and makes fallback states easier to test.

Alternative considered: fetch directly inside components. That would be faster initially but spreads API assumptions across the UI and makes loading/error behavior harder to maintain.

### Use Tailwind CSS with component-level composition

Tailwind enables fast visual iteration and responsive styling while keeping the bundle lean. Reusable sections such as hero, feature grid, product showcase, specs, newsletter, and site footer should be implemented as focused components.

Alternative considered: a component library. It could accelerate form controls, but the assignment rewards custom visual design and a library can add unnecessary weight.

### Prioritize inspectable product visuals and stable responsive layout

Product images from DummyJSON will be displayed with explicit dimensions, aspect ratios, and responsive constraints. Hero and product sections should reveal the actual device/product data instead of generic decorative visuals.

Alternative considered: abstract illustrations or purely decorative backgrounds. Those are less aligned with a product landing page and weaker for assessment.

### Keep bonus features local-first

Favorites, cart preview, recently viewed, theme preference, and newsletter state can use client-side state and `localStorage`. This demonstrates interactive polish without creating backend complexity.

Alternative considered: create API routes and persistence. That adds delivery risk and is not required by the assignment unless a real webhook integration is selected later.

## Risks / Trade-offs

- DummyJSON API latency or failure -> provide skeleton loading, meaningful fallback copy, and an error state that preserves page structure.
- External product image layout shifts -> use `next/image` or stable image containers with explicit dimensions and aspect ratios.
- Too many animation effects could hurt PageSpeed -> keep animations transform/opacity-based, respect reduced motion, and avoid heavyweight animation libraries unless necessary.
- Newsletter without real backend may feel incomplete -> implement strong client-side validation and keep the submission handler isolated so a webhook can be added later.
- Bonus ecommerce interactions can distract from landing-page quality -> keep cart/favorites/recently viewed lightweight and secondary to the hero/product narrative.
- Free hosting differences may affect build output -> target standard Next.js scripts and verify production build before deploy.

## Migration Plan

1. Initialize or update the `frontend` app with Next.js, TypeScript, Tailwind CSS, ESLint, and Prettier.
2. Build typed product fetching for DummyJSON smartphones.
3. Implement landing page sections and interaction components.
4. Add SEO metadata, responsive QA, lint/format scripts, and production build validation.
5. Deploy to a free hosting platform, preferably Vercel for the smoothest Next.js path.

Rollback is low risk because this is a new frontend capability. If implementation causes issues, revert the frontend app changes or deploy the previous known-good commit.

## Open Questions

- Which brand/product name should be shown in the final landing page if the implementation wants a custom branded identity instead of a generic smart-device store?
- Should newsletter submissions be connected to a real webhook, or remain client-side validated for the first submission?
- Which free deployment platform will be used for the final proof link?
