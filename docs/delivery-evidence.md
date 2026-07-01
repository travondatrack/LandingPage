# Delivery Evidence

## Local Verification

- `npm run lint`: passed.
- Targeted Prettier check for updated files: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Catalog source check from PowerShell: `200`.
- Local production server `/`: `200`.
- Playwright Chrome viewport audit:
  - Mobile `390x844`: no horizontal overflow; required sections present.
  - Desktop `1440x1000`: no horizontal overflow; required sections present.
- Theme toggle persisted dark mode class.
- Newsletter invalid email validation returned a visible error.
- Backend API routes added for newsletter validation, behavior tracking, and chatbot replies.
- Scrollytelling section, restrained parallax, and fixed chatbot widget added.
- Upgraded audit:
  - Mobile `390x844`: no horizontal overflow; story, features, products, and newsletter sections present.
  - Desktop `1440x1000`: no horizontal overflow; story, features, products, and newsletter sections present.
  - Chatbot opened, sent a message, and returned an automated warranty response.
  - Newsletter invalid email validation remained visible after chatbot flow.
- Premium polish audit:
  - `npm run lint`, `npm run format:check`, `npm run typecheck`, and `npm run build` passed.
  - Production route `/` built at `21.1 kB`, `124 kB` first-load JS after AI-ready chatbot and webhook-ready newsletter support.
  - Mobile `390x844` and desktop `1440x1000`: no horizontal overflow, no console errors.
  - Product tabs, search, quick view modal, chatbot prompt response, and React Hook Form/Zod newsletter validation verified in Chrome.
- Bonus implementation audit:
  - Premium prompt-style polish added: global grain overlay, editorial hero typography, and an infinite trust-signal marquee.
  - Hero scale reduced for a cleaner first viewport, and the main headline now uses a lightweight typing cursor effect that respects reduced motion.
  - `Why Choose QTPhone` section redesigned with the selected `M011T0831 C` smartphone image, optimized to a lightweight WebP asset, left-side product image, compact 2x2 feature cards, spec badges, hover lift, glowing border, and responsive swipe behavior on mobile.
  - Standalone technical specifications section removed; product-specific precision details now live inside the Product Detail modal.
  - Scrollytelling flow uses the `BrandStorySection` to connect hero, product story, product proof, specifications, and newsletter conversion.
  - Lightweight parallax is implemented with transform-based motion and respects `prefers-reduced-motion`.
  - `POST /api/newsletter` accepts valid email submissions without a webhook configured and returns `{"ok":true,"stored":1}`.
  - `POST /api/newsletter` supports real webhook forwarding through `NEWSLETTER_WEBHOOK_URL` or `WEBHOOK_URL`, optional `NEWSLETTER_WEBHOOK_SECRET`, and returns sanitized delivery status for demo proof.
  - `POST /api/newsletter` rejects invalid email submissions with `422`.
  - `POST /api/chat` returns polished product advice from the QTPhone catalog context when no AI key is configured.
  - `POST /api/chat` is ready to call Groq when `GROQ_API_KEY` is configured, OpenAI when `OPENAI_API_KEY` is configured, or Gemini when `GEMINI_API_KEY` is configured.
  - Click and scroll-depth tracking now shows non-blocking on-page toast notifications.
  - `POST /api/behavior` stores bounded recent behavior events in memory for review.
  - `GET /api/behavior` returns an event summary and recent behavior events when inspected.
  - `GET /api/newsletter` returns recent validated newsletter submissions for review.

## Live Deployment

- Vercel production alias: `https://qtphone.vercel.app/`
- Latest Vercel production deployment: `https://frontend-cjwmqiywq-tinhnqs-projects.vercel.app`
- Latest Vercel inspect URL: `https://vercel.com/tinhnqs-projects/frontend/9NrYS45aC2SZRpVtGTf2rMuFGBL8`
- Live `/` sanity check: `200 OK`.
- Live `POST /api/newsletter` valid email check: `{"ok":true,"stored":1}`.
- Live `POST /api/newsletter` webhook check: `{"ok":true,"delivery":"webhook","webhook":{"ok":true,"status":200,"endpoint":"https://webhook.site/8042ff7b-b3c4-470c-8763-18ac287bce46"},"stored":1}`.
- Live `POST /api/newsletter` invalid email check: `422`.
- Live `POST /api/chat` Groq check: `{"reply":"The QTPhone 16 Ultra Titanium boasts a 200MP Quad Matrix optics, making it the phone with the best camera in our catalog, offering peerless photography capabilities.","provider":"groq"}`.
- Live `POST /api/behavior` check: `{"ok":true,"stored":1}`.
- Live `GET /api/behavior` check: `200 OK` with JSON summary. Stored count may be `0` across Vercel serverless instances because this is bounded in-memory demo storage.

## API States

- Loading state: skeleton cards are rendered while client data is pending.
- Successful API state: endpoint returned `200` from local machine.
- Failed API state: Chrome headless network restriction produced the product error state while preserving the page sections.

## External Evidence

- Public GitHub repository is available according to the latest submission check.
- Google PageSpeed Insights Mobile is available according to the latest submission check.
- Real webhook proof is active through `NEWSLETTER_WEBHOOK_URL`; the current webhook.site endpoint expires on `2026-07-08`.
