// Sanity client — used for all data fetching in the Next.js app
// This is the READ client (frontend). Never exposes write permissions.

import { createClient } from "@sanity/client"
import { sanityConfig } from "./config"

export const sanityClient = createClient({
  ...sanityConfig,
  token: process.env.SANITY_API_READ_TOKEN,
})

// Typed fetch helper — wraps GROQ queries with Next.js cache tags for ISR.
//
// How revalidation works:
// - Pages are cached on first load and served instantly on repeat visits.
// - When you publish content in Sanity, a webhook fires to /api/revalidate.
// - That webhook calls revalidateTag() which clears only the affected pages.
// - The next visitor to those pages gets a fresh rebuild — all others stay cached.
// - The 60-second fallback ensures pages never stay stale longer than 1 minute,
//   even if the webhook fails to fire.
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string
  params?: Record<string, unknown>
  revalidate?: number | false
  tags?: string[]
}): Promise<T | null> {
  try {
    return await sanityClient.fetch<T>(query, params, {
      next: {
        revalidate,
        tags,
      },
    })
  } catch {
    return null
  }
}
