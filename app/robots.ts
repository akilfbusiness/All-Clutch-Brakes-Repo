// robots.ts — controls which crawlers can access which parts of the site
// This is the gatekeeper file: welcome the crawlers that generate leads,
// block the ones that waste bandwidth and Sanity quota.
// Next.js App Router generates /robots.txt automatically from this file.

import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashardisabilitycare.com.au"

  return {
    rules: [
      // ── Google ──────────────────────────────────────────────────────────────
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      // Google image crawler — allow for image search visibility
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      // Google Extended — powers AI Overviews and Search Generative Experience
      // Critical for AEO: this is how Google AI cites your content
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      // ── OpenAI / ChatGPT ────────────────────────────────────────────────────
      // GPTBot powers ChatGPT's web knowledge — allow for AI citation
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      // ChatGPT user-browsing agent
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      // ── Anthropic / Claude ──────────────────────────────────────────────────
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      // ── Perplexity ──────────────────────────────────────────────────────────
      // Perplexity is a primary AEO target — users ask questions and get cited answers
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      // ── Microsoft / Bing / Copilot ──────────────────────────────────────────
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      // Copilot AI — powers Microsoft Copilot citations
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      // ── Meta AI ─────────────────────────────────────────────────────────────
      {
        userAgent: "FacebookBot",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      // ── Apple ───────────────────────────────────────────────────────────────
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
      // ── Blocked crawlers ────────────────────────────────────────────────────
      // These crawlers serve no lead generation purpose and waste resources
      {
        userAgent: "SemrushBot",
        disallow: "/",
      },
      {
        userAgent: "AhrefsBot",
        disallow: "/",
      },
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
      {
        userAgent: "DotBot",
        disallow: "/",
      },
      // ── Default rule — allow all other legitimate crawlers ──────────────────
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio/", "/api/"],
      },
    ],
    // Sitemap reference — tells every crawler where to find the full page map
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
