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
- `OPENAI_API_KEY` and optional `OPENAI_MODEL`: enable OpenAI-backed chatbot responses.
- `GEMINI_API_KEY` and optional `GEMINI_MODEL`: enable Gemini-backed chatbot responses when OpenAI is not configured.

Backend routes included:

- `POST /api/newsletter`: validates email, stores the submission in memory, and forwards to webhook when configured.
- `GET /api/newsletter`: returns a small in-memory summary of recent validated newsletter submissions for demo evidence.
- `POST /api/behavior`: stores recent click, scroll, chat, and ecommerce behavior events in memory.
- `GET /api/behavior`: returns a small in-memory summary of recent behavior events for demo evidence.
- `POST /api/chat`: returns OpenAI or Gemini product advisory replies when credentials are configured, then falls back to demo replies using live DummyJSON smartphone data.

The page uses the public DummyJSON endpoint:

```text
https://dummyjson.com/products/category/smartphones
```
