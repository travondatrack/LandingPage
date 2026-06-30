# HeliPhone Smartphone Landing Page

Next.js App Router landing page for the HELICORP round 2 frontend assignment.

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run format:check
npm run typecheck
npm run build
```

## Deployment

Deploy the `frontend` directory as the project root on Vercel.

Optional environment variables:

- `NEXT_PUBLIC_SITE_URL`: public deployment URL used by metadata.
- `NEWSLETTER_WEBHOOK_URL`: server-side webhook endpoint for newsletter submissions.

Backend routes included:

- `POST /api/newsletter`: validates email, stores the submission in memory, and forwards to webhook when configured.
- `POST /api/behavior`: stores recent click, scroll, chat, and ecommerce behavior events in memory.
- `POST /api/chat`: returns automated product advisory replies for the chatbot widget.

The page uses the public DummyJSON endpoint:

```text
https://dummyjson.com/products/category/smartphones
```
