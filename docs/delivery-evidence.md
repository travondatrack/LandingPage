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

## API States

- Loading state: skeleton cards are rendered while client data is pending.
- Successful API state: endpoint returned `200` from local machine.
- Failed API state: Chrome headless network restriction produced the product error state while preserving the page sections.

## Pending External Evidence

- Public GitHub repository URL after pushing branches.
- Live Vercel deployment URL.
- Google PageSpeed Insights mobile screenshot for the live URL.
