// Embedded Sanity Studio at /studio
// Accessible only to the business owner/content editors
// The entire Sanity Studio runs inside the Next.js app — no separate deployment needed
// Must be force-dynamic so Next.js does not attempt to prerender it at build time

export const dynamic = "force-dynamic"

import { StudioClient } from "./studio-client"

export default function StudioPage() {
  return <StudioClient />
}
