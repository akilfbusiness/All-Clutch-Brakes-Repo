// Embedded Sanity Studio at /studio
// Accessible only to the business owner/content editors
// The entire Sanity Studio runs inside the Next.js app — no separate deployment needed

export const dynamic = "force-dynamic"

"use client"

import { NextStudio } from "next-sanity/studio"
import config from "../../../sanity/sanity.config"

export default function StudioPage() {
  return <NextStudio config={config} />
}
