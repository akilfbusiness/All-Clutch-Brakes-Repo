// Central Sanity project configuration
// projectId and dataset are NOT secrets — hardcoded as fallbacks to prevent
// build failures when env vars are missing. The read token remains an env var.

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ihlh7pw2"
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"

export const sanityConfig = {
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  // useCdn must be false — CDN responses bypass Next.js fetch cache tags,
  // which means revalidateTag() calls from the webhook never clear the cache.
  // Without this, CMS changes don't appear until a full redeploy.
  useCdn: false,
}
