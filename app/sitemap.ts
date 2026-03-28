// sitemap.ts — auto-generates /sitemap.xml for all pages
// Dynamic pages (articles, services, locations) are pulled from Sanity
// so every new piece of content is automatically included in the sitemap
// without any manual updates. Google and AI crawlers use this as the
// master map of everything on the site.

import type { MetadataRoute } from "next"
import {
  getAllArticleSlugs,
  getAllServiceSlugs,
  getAllLocationSlugs,
} from "@/sanity/queries"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashardisabilitycare.com.au"

  const now = new Date()

  // ── Static pages ────────────────────────────────────────────────────────────
  // lastModified tells Google when to prioritise recrawling
  // changeFrequency tells crawlers how often content typically changes
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      // priority 1.0 = highest — home page is always top priority
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/locations`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: now,
      changeFrequency: "daily",
      // Articles index updates most frequently — new content added regularly
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // ── Dynamic pages from Sanity ────────────────────────────────────────────────
  // If Sanity is not yet connected (env vars missing), these return empty arrays
  // so the sitemap still generates without errors during development

  let articlePages: MetadataRoute.Sitemap = []
  let servicePages: MetadataRoute.Sitemap = []
  let locationPages: MetadataRoute.Sitemap = []

  try {
    const [articleSlugs, serviceSlugs, locationSlugs] = await Promise.all([
      getAllArticleSlugs(),
      getAllServiceSlugs(),
      getAllLocationSlugs(),
    ])

    articlePages = articleSlugs.map(({ slug }) => ({
      url: `${siteUrl}/articles/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      // Articles are high priority — core AEO/GEO content
      priority: 0.8,
    }))

    servicePages = serviceSlugs.map(({ slug }) => ({
      url: `${siteUrl}/services/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }))

    locationPages = locationSlugs.map(({ slug }) => ({
      url: `${siteUrl}/locations/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }))
  } catch {
    // Sanity not connected yet — sitemap generates with static pages only
    // This prevents build failures during initial development
  }

  return [
    ...staticPages,
    ...servicePages,
    ...locationPages,
    ...articlePages,
  ]
}
