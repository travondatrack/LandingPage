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

## API States

- Loading state: skeleton cards are rendered while client data is pending.
- Successful API state: endpoint returned `200` from local machine.
- Failed API state: Chrome headless network restriction produced the product error state while preserving the page sections.

## Pending External Evidence

- Public GitHub repository URL after pushing branches.
- Live Vercel deployment URL.
- Google PageSpeed Insights mobile screenshot for the live URL.
