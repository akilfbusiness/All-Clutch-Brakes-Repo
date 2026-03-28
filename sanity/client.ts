// Sanity client — used for all data fetching in the Next.js app
// This is the READ client (frontend). Never exposes write permissions.

import { createClient } from "@sanity/client"
import { sanityConfig } from "./config"

export const sanityClient = createClient({
  ...sanityConfig,
  token: process.env.SANITY_API_READ_TOKEN,
})

// Typed fetch helper — wraps GROQ queries with revalidation for ISR
// revalidate: 0 = always fresh (use for preview)
// revalidate: 3600 = cache for 1 hour
// revalidate: false = cache indefinitely until webhook invalidates (default for production)
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = false,
  tags = [],
}: {
  query: string
  params?: Record<string, unknown>
  revalidate?: number | false
  tags?: string[]
}): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate,
      tags,
    },
  })
}
