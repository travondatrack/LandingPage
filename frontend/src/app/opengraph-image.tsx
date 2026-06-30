import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HeliPhone smartphone landing page preview";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f6f8fb",
        color: "#121826",
        padding: 72,
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0077b6" }}>HeliPhone</div>
      <div>
        <div style={{ maxWidth: 830, fontSize: 74, fontWeight: 800, lineHeight: 1.05 }}>
          Live smartphone picks with product data in view.
        </div>
        <div
          style={{ marginTop: 28, maxWidth: 760, fontSize: 30, lineHeight: 1.4, color: "#5b677b" }}
        >
          Ratings, discounts, specs, dark mode, and newsletter updates in one responsive landing
          page.
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, fontSize: 24, color: "#5b677b" }}>
        <span>DummyJSON products</span>
        <span>Responsive UI</span>
        <span>Fast build</span>
      </div>
    </div>,
    size
  );
}
