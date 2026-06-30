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
          Flagship smartphones crafted for performance & intelligence.
        </div>
        <div
          style={{ marginTop: 28, maxWidth: 760, fontSize: 30, lineHeight: 1.4, color: "#5b677b" }}
        >
          Next-generation mobile devices engineered for pro-grade imaging, extreme endurance, and
          seamless connectivity.
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, fontSize: 24, color: "#5b677b" }}>
        <span>Pro-Grade Optics</span>
        <span>AI Performance</span>
        <span>All-Day Power</span>
      </div>
    </div>,
    size
  );
}
