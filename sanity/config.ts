// Central Sanity project configuration
// All Sanity-related code imports from here — single source of truth
//
// projectId and dataset are NOT secrets — they are public identifiers
// hardcoded here to prevent build failures when env vars are not set.
// Only the read token (SANITY_API_READ_TOKEN) needs to be kept as an env var.

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "ihlh7pw2",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  // useCdn: true serves responses from Sanity's CDN cache layer
  // This means the live Sanity API is only hit when the cache expires
  // — not on every visitor request. Critical for rate limit mitigation.
  useCdn: process.env.NODE_ENV === "production",
}
