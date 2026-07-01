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
- `NEWSLETTER_WEBHOOK_URL` or `WEBHOOK_URL`: server-side webhook endpoint for newsletter submissions.
- `NEWSLETTER_WEBHOOK_SECRET`: optional shared secret sent as `X-QTPhone-Webhook-Secret`.
- `GROQ_API_KEY` and optional `GROQ_MODEL`: enable Groq-backed chatbot responses. Groq is tried before OpenAI and Gemini.
- `OPENAI_API_KEY` and optional `OPENAI_MODEL`: enable OpenAI-backed chatbot responses.
- `GEMINI_API_KEY` and optional `GEMINI_MODEL`: enable Gemini-backed chatbot responses when OpenAI is not configured.

Backend routes included:

- `POST /api/newsletter`: validates email, stores the submission in memory, and forwards to webhook when configured. The response includes sanitized webhook delivery status when forwarding is active.
- `GET /api/newsletter`: returns a small in-memory summary of recent validated newsletter submissions.
- `POST /api/behavior`: stores recent click, scroll, chat, and ecommerce behavior events in memory.
- `GET /api/behavior`: returns a small in-memory summary of recent behavior events.
- `POST /api/chat`: returns Groq, OpenAI, or Gemini product advisory replies when credentials are configured, then falls back to curated catalog replies.

The product catalog is normalized into the QTPhone flagship lineup from:

```text
https://dummyjson.com/products/category/smartphones
```
