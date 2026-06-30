# Delivery Evidence

## Local Verification

- `npm run lint`: passed.
- `npm run format:check`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- DummyJSON endpoint check from PowerShell: `200`.
- Local production server `/`: `200`.
- Playwright Chrome viewport audit:
  - Mobile `390x844`: no horizontal overflow; required sections present.
  - Desktop `1440x1000`: no horizontal overflow; required sections present.
- Theme toggle persisted dark mode class.
- Newsletter invalid email validation returned a visible error.
- Backend API routes added for newsletter validation, behavior tracking, and chatbot replies.
- Scrollytelling section, restrained parallax, and fixed chatbot widget added.
- Upgraded audit:
  - Mobile `390x844`: no horizontal overflow; story, features, products, specs, and newsletter sections present.
  - Desktop `1440x1000`: no horizontal overflow; story, features, products, specs, and newsletter sections present.
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
  - Scrollytelling flow uses the `BrandStorySection` to connect hero, product story, product proof, specifications, and newsletter conversion.
  - Lightweight parallax is implemented with transform-based motion and respects `prefers-reduced-motion`.
  - `POST /api/newsletter` accepts valid email submissions without a webhook configured and returns `{"ok":true,"stored":1}`.
  - `POST /api/newsletter` rejects invalid email submissions with `422`.
  - `POST /api/chat` returns demo product advice from live DummyJSON context when no AI key is configured.
  - `POST /api/chat` is ready to call OpenAI when `OPENAI_API_KEY` is configured, or Gemini when `GEMINI_API_KEY` is configured.
  - Click and scroll-depth tracking now shows non-blocking on-page toast notifications.
  - `POST /api/behavior` stores bounded recent behavior events in memory for demo evidence.
  - `GET /api/behavior` returns an event summary and recent behavior events when inspected.
  - `GET /api/newsletter` returns recent validated newsletter submissions for demo evidence.

## Live Deployment

- Vercel inspect URL: `https://vercel.com/tinhnqs-projects/frontend/38rQCyHHKQahCxrG9buETz4Zs75L`
- Vercel production deployment URL: `https://frontend-dh0h55cg4-tinhnqs-projects.vercel.app`
- Vercel production alias: `https://frontend-theta-three-33.vercel.app`
- Live `/` sanity check: `200 OK`.
- Live `POST /api/newsletter` valid email check: `{"ok":true,"stored":1}`.
- Live `POST /api/newsletter` after webhook/local delivery update: `{"ok":true,"delivery":"local","stored":1}`.
- Live `POST /api/newsletter` invalid email check: `422`.
- Live `POST /api/chat` demo check: `{"reply":"iPhone X currently has the strongest discount at 20% off, listed from $900.","provider":"demo","configured":false}`.
- Live `POST /api/behavior` check: `{"ok":true,"stored":1}`.
- Live `GET /api/behavior` check: `200 OK` with JSON summary. Stored count may be `0` across Vercel serverless instances because this is bounded in-memory demo storage.

## API States

- Loading state: skeleton cards are rendered while client data is pending.
- Successful API state: endpoint returned `200` from local machine.
- Failed API state: Chrome headless network restriction produced the product error state while preserving the page sections.

## Pending External Evidence

- Public GitHub repository URL: current remote `https://github.com/travondatrack/LandingPage` returned `404` on public check, so it still needs to be made public or corrected before submission.
- Google PageSpeed Insights mobile screenshot for the live URL. Public API check on 2026-06-30 returned `429 Too Many Requests`, so rerun manually or later when quota allows.
- Bonus webhook proof with a real `NEWSLETTER_WEBHOOK_URL`, if the submission reviewer requires external webhook evidence.
