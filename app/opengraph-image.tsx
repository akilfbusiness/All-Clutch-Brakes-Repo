// Root-level OG image — shown when the homepage or any page without a specific
// OG image is shared or cited. Generated at build time via Next.js ImageResponse.
// Individual article/service/location pages can override this with their own
// opengraph-image.tsx file placed inside their route folder.

import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Ashar Disability Care — Registered NDIS Provider, South Australia"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          padding: "80px",
        }}
      >
        {/* Logo placeholder — replace text with <img> once logo is added to /public/assets/ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              backgroundColor: "#3b82f6",
              marginRight: "16px",
            }}
          />
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            {/* logo-here */}
            Ashar Disability Care
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            margin: "0 0 24px 0",
            maxWidth: "900px",
            letterSpacing: "-0.03em",
          }}
        >
          Registered NDIS Provider
          <br />
          South Australia
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontSize: "24px",
            color: "#94a3b8",
            margin: "0 0 40px 0",
            lineHeight: 1.4,
          }}
        >
          Personal Care · Home Care · Community Participation
          <br />
          Transport · Accommodation Support · NDIS Planning
        </p>

        {/* Domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#1e293b",
            borderRadius: "8px",
            padding: "12px 24px",
          }}
        >
          <span style={{ fontSize: "20px", color: "#60a5fa" }}>
            ashardisabilitycare.com.au
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
