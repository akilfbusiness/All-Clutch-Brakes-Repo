// sitemap.ts — auto-generates /sitemap.xml
// Static pages are hardcoded with appropriate priority and changeFrequency.
// Dynamic pages (blog posts, services, locations, projects, products) are
// pulled live from Sanity so every new CMS document is automatically included.

import type { MetadataRoute } from "next"
import {
  getAllPostSlugs,
  getAllServiceSlugs,
  getAllLocationSlugs,
  getAllProjectSlugs,
  getAllProductSlugs,
} from "@/sanity/queries"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.allclutchandbrake.com.au"

  const now = new Date()

  // ── Static pages ─────────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl,                               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${siteUrl}/about`,                    lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/what-we-do`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/services`,                 lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${siteUrl}/locations`,                lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/blog`,                     lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${siteUrl}/faq`,                      lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/contact`,                  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/testimonials`,             lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${siteUrl}/gallery`,                  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/brands`,                   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/projects`,                 lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/meet-our`,                 lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/featured-product`,         lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${siteUrl}/miscellaneous`,            lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/privacy-policy`,           lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ]

  // ── Dynamic pages from Sanity ─────────────────────────────────────────────────
  let blogPages:     MetadataRoute.Sitemap = []
  let servicePages:  MetadataRoute.Sitemap = []
  let locationPages: MetadataRoute.Sitemap = []
  let projectPages:  MetadataRoute.Sitemap = []
  let productPages:  MetadataRoute.Sitemap = []

  try {
    const [postSlugs, serviceSlugs, locationSlugs, projectSlugs, productSlugs] =
      await Promise.all([
        getAllPostSlugs(),
        getAllServiceSlugs(),
        getAllLocationSlugs(),
        getAllProjectSlugs(),
        getAllProductSlugs(),
      ])

    blogPages = postSlugs.map(({ slug }) => ({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
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

    projectPages = projectSlugs.map(({ slug }) => ({
      url: `${siteUrl}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))

    productPages = productSlugs.map(({ slug }) => ({
      url: `${siteUrl}/products/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  } catch {
    // Sanity unreachable — sitemap still generates with static pages only
  }

  return [
    ...staticPages,
    ...servicePages,
    ...locationPages,
    ...blogPages,
    ...projectPages,
    ...productPages,
  ]
}
