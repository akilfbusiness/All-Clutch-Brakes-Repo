// Central Sanity project configuration
// All Sanity-related code imports from here — single source of truth

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
  // useCdn: true serves responses from Sanity's CDN cache layer
  // This means the live Sanity API is only hit when the cache expires
  // — not on every visitor request. Critical for rate limit mitigation.
  useCdn: process.env.NODE_ENV === "production",
}
