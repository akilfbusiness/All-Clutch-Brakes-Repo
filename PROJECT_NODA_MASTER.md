# Project Noda — Master Reference Document
# Ashar Disability Care Website

**Last Updated:** March 2026
**Built by:** v0 by Vercel (AI-assisted development)
**Project Name:** Project Noda
**Business:** Ashar Disability Care

---

## Table of Contents
1. [Project Goals & Ambitions](#1-project-goals--ambitions)
2. [Business Details](#2-business-details)
3. [Tech Stack & Reasoning](#3-tech-stack--reasoning)
4. [External Tools & Services](#4-external-tools--services)
5. [Environment Variables](#5-environment-variables)
6. [Site Architecture](#6-site-architecture)
7. [Build Process — Phase by Phase](#7-build-process--phase-by-phase)
8. [AEO/GEO/SEO Strategy](#8-aeogeo-seo-strategy)
9. [Risk Mitigation](#9-risk-mitigation)
10. [AI Agent — Phase 7](#10-ai-agent--phase-7)

---

## 1. Project Goals & Ambitions

### Primary Goal
Build an AEO (Answer Engine Optimisation), GEO (Generative Engine Optimisation), and SEO-optimised website for Ashar Disability Care — a registered NDIS provider in South Australia — to maximise lead generation by becoming the definitive source of truth for NDIS-related queries in South Australia.

### What This Means in Practice
- When someone asks ChatGPT, Perplexity, Claude, or Google "what NDIS services are available in Adelaide," Ashar Disability Care's website is the source that gets cited.
- When participants or their families search for NDIS support across South Australia, Ashar Disability Care appears for every relevant query.
- Every page, article, and schema element is engineered so that AI engines and search engines understand this website as a trusted, authoritative, locally relevant entity.
- The ultimate conversion goal is: visitor lands on site → trusts the business → calls or walks through the front door.

### Lead Generation Strategy
- 30–100 articles answering every question an NDIS participant or family member in SA might ask
- Location pages covering all SA regions and highest-priority suburbs
- Every page structured with Answer Capsules (direct 20–25 word answers below H1) to target AI citation
- FAQPage schema on every page to maximise AI engine answer extraction
- LocalBusiness schema establishing the business as a real, verified local entity

### Secondary Goal — Project Noda Package
This website is the first deliverable of "Project Noda" — a complete business intelligence package being built for Ashar Disability Care that includes:
1. The AEO/GEO/SEO website (this project)
2. An AI Agent with CRM capabilities (Phase 7 — separate project)

---

## 2. Business Details

| Field | Value |
|---|---|
| Business Name | Ashar Disability Care |
| Trading Name | Ashar Disability Care |
| NDIS Registration ID | 4-1C342A6 |
| ABN | 11 656 510 075 |
| Address | 2 Yangoura Ct, Surrey Downs 5126, South Australia, Australia |
| Phone 1 | 0425 760 172 |
| Phone 2 | 0425 409 849 |
| Email | info@ashardc.com.au |
| Website | ashardisabilitycare.com.au |
| Business Hours | Monday–Friday: 9:00 AM – 5:00 PM |
| Support Hours | 24/7 Support Available |
| Services | Personal Care, Home Care, Community Participation, Transport, Accommodation Support, NDIS Planning & Coordination |
| Service Area | All of South Australia (prioritised by region and high-density NDIS suburbs) |

---

## 3. Tech Stack & Reasoning

### Core Framework

| Technology | Version | Why |
|---|---|---|
| Next.js | 16+ (App Router) | SSR by default — pages are pre-rendered before delivery. Google and AI crawlers receive complete HTML instantly. This is the single most important SEO/AEO decision in the stack. |
| TypeScript | Latest | Prevents errors before they happen. Non-negotiable for a surgical, first-time-right build. |
| Tailwind CSS | v4 | Utility-first CSS. Fast to build, easy to maintain, no separate CSS files to manage. |

### CMS

| Technology | Version | Why |
|---|---|---|
| Sanity CMS | v3 | Structured, queryable content. Every article, service page, and location page has defined fields that automatically feed into metadata, schema, and answer capsules. |
| next-sanity | ^9.8.0 | Official Next.js + Sanity bridge. Handles live previews, ISR, and efficient data fetching. |
| @sanity/client | ^6.28.2 | Direct Sanity API client for server-side queries. |
| @sanity/image-url | ^1.1.0 | Sanity CDN image URL builder with transform support. |
| @portabletext/react | ^3.2.1 | Renders Sanity Portable Text (rich text) content in React components. |

### Hosting & Deployment

| Technology | Why |
|---|---|
| Vercel | Same company as Next.js. Zero-config deployment, global CDN, automatic HTTPS, edge network. Optimal for Next.js performance. |

### What Was Deliberately Excluded

| Technology | Reason Excluded |
|---|---|
| `next-seo` | Built for the Pages Router. App Router handles all metadata natively via `export const metadata` and `generateMetadata()`. Installing it creates conflicts with zero benefit. |
| `schema-dts` | TypeScript types for schema.org. Unnecessary overhead — JSON-LD objects are small and manually typed. |

---

## 4. External Tools & Services

| Tool | Purpose | URL | Notes |
|---|---|---|---|
| Sanity CMS | Content management — articles, services, locations, site settings | sanity.io | Project: "Ashar Disability Care CMS - Project Noda". Studio embedded at /studio |
| Vercel | Hosting and deployment | vercel.com | Connect domain ashardisabilitycare.com.au to Vercel project |
| Google Search Console | Submit sitemap, monitor indexing, track search performance | search.google.com/search-console | Submit sitemap after launch: ashardisabilitycare.com.au/sitemap.xml |
| Bing Webmaster Tools | Submit sitemap for Bing/Copilot indexing | bing.com/webmasters | Submit same sitemap after launch |
| Google Rich Results Test | Validate structured data (JSON-LD) on every page type | search.google.com/test/rich-results | Run after each content type is published |
| Google PageSpeed Insights | Monitor Core Web Vitals | pagespeed.web.dev | Run after each major change |
| GitHub | Version control | github.com | Connect via v0 Settings → Git |

---

## 5. Environment Variables

All four variables must be added to v0 Settings → Vars AND to Vercel project environment variables before launch.

| Variable | Value | Where to Get It |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `ihlh7pw2` | sanity.io/manage → project → Overview |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | sanity.io/manage → project → Datasets |
| `SANITY_API_READ_TOKEN` | `skb0yzpv...` (Viewer token) | sanity.io/manage → project → API → Tokens |
| `SANITY_WEBHOOK_SECRET` | `ashardisabilitycare` | Self-defined — must match Sanity webhook secret field |
| `NEXT_PUBLIC_SITE_URL` | `https://ashardisabilitycare.com.au` | Set manually |

### Sanity Webhook Configuration
- **Webhook URL:** `https://ashardisabilitycare.com.au/api/revalidate`
- **Trigger on:** Create, Update, Delete
- **Drafts:** Disabled (unchecked)
- **Versions:** Disabled (unchecked)
- **HTTP Method:** POST
- **Secret:** `ashardisabilitycare`
- **Purpose:** When content is published or updated in Sanity, this webhook fires and tells Next.js to rebuild only the affected page. New content goes live in seconds without a full site rebuild.

---

## 6. Site Architecture

### URL Structure
```
ashardisabilitycare.com.au/
├── /                              (Home)
├── /about
├── /contact
├── /privacy-policy
├── /services                      (Services index)
│   └── /services/[slug]           (Dynamic — 6 service pages)
│       ├── personal-care
│       ├── home-care
│       ├── community-participation
│       ├── transport
│       ├── accommodation-support
│       └── ndis-planning-and-coordination
├── /locations                     (Locations index)
│   └── /locations/[slug]          (Dynamic — regions + suburbs)
│       ├── REGIONS (10)
│       │   ├── northern-adelaide
│       │   ├── southern-adelaide
│       │   ├── eastern-adelaide
│       │   ├── western-adelaide
│       │   ├── cbd-and-inner-suburbs
│       │   ├── barossa-and-surrounds
│       │   ├── fleurieu-peninsula
│       │   ├── eyre-peninsula
│       │   ├── limestone-coast
│       │   └── yorke-and-mid-north
│       └── TIER 1 SUBURBS (15)
│           ├── elizabeth
│           ├── salisbury
│           ├── modbury
│           ├── para-hills
│           ├── davoren-park
│           ├── morphett-vale
│           ├── noarlunga
│           ├── mount-gambier
│           ├── whyalla
│           ├── port-augusta
│           ├── gawler
│           ├── victor-harbor
│           ├── murray-bridge
│           ├── port-pirie
│           └── tea-tree-gully
├── /articles                      (Articles index)
│   └── /articles/[slug]           (Dynamic — unlimited, from Sanity)
├── /studio/[[...tool]]            (Embedded Sanity Studio — CMS access)
├── /api/revalidate                (ISR webhook endpoint)
├── /robots.txt                    (Auto-generated from robots.ts)
└── /sitemap.xml                   (Auto-generated from sitemap.ts)
```

### Next.js File Structure
```
app/
├── layout.tsx                     (Root — metadataBase, lang=en-AU, WebSite + LocalBusiness schema)
├── page.tsx                       (Home)
├── about/page.tsx
├── contact/page.tsx
├── privacy-policy/page.tsx
├── services/
│   ├── page.tsx
│   └── [slug]/page.tsx            (generateStaticParams + generateMetadata)
├── locations/
│   ├── page.tsx
│   └── [slug]/page.tsx            (generateStaticParams + generateMetadata)
├── articles/
│   ├── page.tsx
│   └── [slug]/page.tsx            (generateStaticParams + generateMetadata)
├── studio/[[...tool]]/page.tsx    (Embedded Sanity Studio)
├── api/revalidate/route.ts        (ISR webhook)
├── robots.ts
├── sitemap.ts
└── opengraph-image.tsx            (Auto-generated OG images)

sanity/
├── config.ts                      (Project ID, dataset, API version)
├── client.ts                      (Sanity client with CDN caching)
├── image.ts                       (Image URL builder)
├── queries.ts                     (All GROQ queries with TypeScript types)
├── sanity.config.ts               (Studio configuration)
└── schemas/
    ├── index.ts                   (Schema registry)
    ├── article.ts
    ├── service.ts
    ├── location.ts
    ├── author.ts
    └── siteSettings.ts

public/
└── assets/                        (Logo goes here — filename: logo.png)
```

### Sanity CMS Schema Structure
```
Sanity Studio
├── Articles        (title, slug, answerCapsule, body, category, tags, faqs, author, publishedAt, seo)
├── Services        (title, slug, answerCapsule, body, faqs, seo)
├── Locations       (title, slug, locationType, suburbsIncluded, body, faqs, seo)
├── Authors         (name, role, bio, image)
└── Site Settings   (businessName, phones, email, address, hours, socialLinks)
```

---

## 7. Build Process — Phase by Phase

### Phase 1 — Backend Foundation [COMPLETE ✓]

| Step | Task | Status |
|---|---|---|
| 1 | Project scaffolding — Next.js config, Sanity dependencies, folder structure | ✓ Done |
| 2 | Root layout — metadataBase, lang=en-AU, WebSite schema, LocalBusiness schema | ✓ Done |
| 3 | robots.ts — AI and search crawler control | ✓ Done |
| 4 | sitemap.ts — Dynamic sitemap pulling from Sanity | ✓ Done |
| 5 | Sanity schemas — Article, Service, Location, Author, SiteSettings | ✓ Done |
| 6 | Sanity client — CDN caching configured (useCdn: true) | ✓ Done |
| 7 | GROQ queries — All data fetching queries with TypeScript types | ✓ Done |
| 8 | Core pages — Home, About, Contact, Privacy Policy (with full metadata + schema) | ✓ Done |
| 9 | Service pages — Index + dynamic [slug] template (generateStaticParams + generateMetadata) | ✓ Done |
| 10 | Location pages — Index + dynamic [slug] template (regions and suburbs) | ✓ Done |
| 11 | Article pages — Index + dynamic [slug] template (full AEO schema: Article + FAQPage + BreadcrumbList) | ✓ Done |
| 12 | OG Image generation — Auto-generated per page via ImageResponse | ✓ Done |
| 13 | ISR webhook — /api/revalidate route for instant content updates | ✓ Done |
| 14 | Sanity Studio embedded at /studio | ✓ Done |
| 15 | Environment variables defined (.env.local + .env.example) | ✓ Done |
| 16 | Sanity project created and connected (Project ID: ihlh7pw2) | ✓ Done |
| 17 | Sanity webhook configured pointing to /api/revalidate | ✓ Done |

---

### Phase 2 — Front End Functional Layout [NOT STARTED ✗]

Build a clean, navigable layout in v0 so the site is fully functional and testable before visual design.

| Step | Task | Status |
|---|---|---|
| 1 | Header component — logo placeholder, navigation links to all main sections | ✗ |
| 2 | Footer component — contact details, ABN, NDIS registration ID, links | ✗ |
| 3 | Page wrapper / layout shell — consistent spacing and structure across all pages | ✗ |
| 4 | Navigation — mobile responsive menu | ✗ |
| 5 | Verify all pages are navigable end to end | ✗ |

---

### Phase 3 — Visual Design (Claude) [NOT STARTED ✗]

Hand the working codebase to Claude for full visual redesign. Claude applies typography, colour, spacing, and component styling. Claude must not touch any functional code — only Tailwind class names.

**Instruction to give Claude:**
> "Only modify Tailwind class names for visual styling. Do not touch component logic, data fetching, metadata exports, schema JSON-LD, generateMetadata, generateStaticParams, or file structure."

| Step | Task | Status |
|---|---|---|
| 1 | Export codebase and provide to Claude | ✗ |
| 2 | Claude applies full visual design | ✗ |
| 3 | Bring restyled code back to v0 | ✗ |
| 4 | Verify no functional code was broken | ✗ |
| 5 | Add real logo to /public/assets/ | ✗ |

---

### Phase 4 — Content Population [NOT STARTED ✗]

Enter real content into Sanity Studio and verify all dynamic systems work correctly.

| Step | Task | Status |
|---|---|---|
| 1 | Add Site Settings (phone, email, address, hours) | ✗ |
| 2 | Add Author record for content attribution | ✗ |
| 3 | Add all 6 Service pages in Sanity with real content | ✗ |
| 4 | Add all 10 Region location pages with real content | ✗ |
| 5 | Add all 15 Tier 1 suburb pages with real content | ✗ |
| 6 | Write and publish first 5–10 articles | ✗ |
| 7 | Verify generateMetadata() outputs correct titles and descriptions per page | ✗ |
| 8 | Verify FAQPage schema is generating correctly from Sanity FAQ fields | ✗ |
| 9 | Verify Article schema is generating correctly | ✗ |
| 10 | Verify ISR webhook fires and pages update on content change | ✗ |

---

### Phase 5 — Pre-Launch QA [NOT STARTED ✗]

| Step | Task | Status |
|---|---|---|
| 1 | Google Rich Results Test — run on Home, Service page, Article page, Location page | ✗ |
| 2 | Validate all JSON-LD structured data | ✗ |
| 3 | Core Web Vitals — Google PageSpeed Insights on all page types | ✗ |
| 4 | Confirm sitemap.xml is correct and all URLs are present | ✗ |
| 5 | Confirm robots.txt is correct | ✗ |
| 6 | Check all metadata (title, description, OG tags) on every page type | ✗ |
| 7 | Check canonical URLs are correct on all pages | ✗ |
| 8 | Mobile responsiveness check on all page types | ✗ |
| 9 | Confirm lang=en-AU is set on HTML element | ✗ |
| 10 | Test contact form submission | ✗ |

---

### Phase 6 — Launch [NOT STARTED ✗]

| Step | Task | Status |
|---|---|---|
| 1 | Add all environment variables to Vercel production project | ✗ |
| 2 | Connect domain ashardisabilitycare.com.au to Vercel | ✗ |
| 3 | Verify HTTPS is active on production domain | ✗ |
| 4 | Update NEXT_PUBLIC_SITE_URL to production domain in Vercel env vars | ✗ |
| 5 | Submit sitemap to Google Search Console | ✗ |
| 6 | Submit sitemap to Bing Webmaster Tools | ✗ |
| 7 | Verify Google Search Console ownership verification | ✗ |
| 8 | Request indexing on Google Search Console for key pages | ✗ |

---

### Phase 7 — AI Agent (Separate v0 Project) [NOT STARTED ✗]

This is a standalone project, built separately and embedded into this website via a single script tag or iframe.

**What the agent does:**
- Answers customer queries about NDIS services using AI
- Captures lead information (name, location, email, service interest)
- Stores all conversations in a Supabase database
- Provides a CRM dashboard for the business owner to monitor customer behaviour, track lead intent, and view analytics
- Converts leads by guiding participants toward booking or calling

**Tech stack for the agent:**
- Next.js 15 (App Router)
- Vercel AI SDK (conversational AI, streaming responses)
- Supabase (conversation storage, lead records, real-time analytics)
- OpenAI or Anthropic model via Vercel AI Gateway
- Custom dashboard (protected by authentication) for the business owner

**Deployment:**
- Deploy on Vercel at subdomain: `chat.ashardisabilitycare.com.au` or `agent.ashardisabilitycare.com.au`
- Embed into this website via one script tag in the root layout

| Step | Task | Status |
|---|---|---|
| 1 | Create new v0 project for the AI agent | ✗ |
| 2 | Set up Supabase — conversations, leads, analytics tables | ✗ |
| 3 | Build conversational AI with Vercel AI SDK | ✗ |
| 4 | Build lead capture flow within conversation | ✗ |
| 5 | Build CRM dashboard — conversation viewer, lead list, analytics | ✗ |
| 6 | Add authentication to CRM dashboard | ✗ |
| 7 | Deploy agent to Vercel subdomain | ✗ |
| 8 | Embed agent script into this website's root layout | ✗ |
| 9 | Test end to end — conversation → lead capture → CRM visibility | ✗ |

---

## 8. AEO/GEO/SEO Strategy

### What AEO/GEO Means for This Build
- **AEO (Answer Engine Optimisation):** Structuring content so AI engines (ChatGPT, Perplexity, Claude, Gemini) extract and cite your pages when answering NDIS-related questions.
- **GEO (Generative Engine Optimisation):** Ensuring the website is recognised as a trusted, authoritative source by generative AI systems so it appears in AI-generated responses.
- **SEO:** Traditional search engine optimisation for Google and Bing.

### Core AEO Mechanisms Built Into This Site

**Answer Capsules**
Every page has a 20–25 word direct answer immediately below the H1. This is the primary citation target for AI engines. When an AI reads the page, the first thing it encounters after the heading is a clear, direct answer to the implied question of that page.

**FAQPage Schema**
Every page type (services, locations, articles, home) includes FAQPage JSON-LD schema. This tells AI engines exactly which questions this page answers and provides the answers in machine-readable format.

**Article Schema**
Every article includes Article JSON-LD with datePublished, dateModified, author, and publisher. This establishes recency and authorship — two trust signals AI engines weight heavily.

**LocalBusiness Schema**
Root layout contains LocalBusiness JSON-LD with full business details, NDIS registration, ABN, service area, and business hours. This establishes the business as a real, verified local entity.

**BreadcrumbList Schema**
Every page includes BreadcrumbList JSON-LD so AI engines understand the site hierarchy and depth.

**WebSite Schema with SearchAction**
Root layout includes WebSite schema declaring the site as a coherent entity with a search capability.

**robots.ts — Named AI Crawlers**
The robots.ts explicitly allows all major AI crawlers: GPTBot (ChatGPT), ClaudeBot (Claude), PerplexityBot (Perplexity), Google-Extended (Google AI), FacebookBot, Applebot, and Amazonbot. Unnecessary scrapers are blocked.

### Content Strategy for Geographic Coverage
Rather than 450 individual suburb pages (which Google would penalise as doorway pages):
- 10 region pages covering all of SA with suburbs listed explicitly within each
- 15 Tier 1 suburb pages for highest NDIS participant density suburbs
- Articles naturally mentioning suburbs and regions for long-tail geographic coverage
- LocalBusiness areaServed declaring South Australia and key regions

---

## 9. Risk Mitigation

### Sanity API Rate Limits
**Risk:** At scale, too many requests could exhaust Sanity's free tier quota.
**Mitigation:**
- `generateStaticParams()` pre-renders all pages at build time — Sanity is called once per page at deployment, not on every visitor request
- `useCdn: true` on the Sanity client — all reads go through Sanity's CDN cache, not the live API
- ISR with webhooks — pages only rebuild when content actually changes
- Result: Thousands of daily visitors trigger zero additional Sanity API calls

### Image Performance / Core Web Vitals
**Risk:** Unoptimised images degrade LCP scores and hurt rankings.
**Mitigation:** All images use Next.js `<Image>` component which automatically compresses, converts to WebP, lazy loads, and sizes correctly. Sanity images served via CDN.

### Structured Data at Scale
**Risk:** Manually written schema on 100 articles will have errors.
**Mitigation:** All schema is template-generated from Sanity fields. The Article schema, FAQPage schema, and BreadcrumbList are auto-generated from the page data — publish an article and all schema is correct automatically.

### Duplicate URL / Canonical Issues
**Risk:** Google indexes multiple versions of the same URL.
**Mitigation:** `metadataBase` set to production domain in root layout. All canonical URLs are absolute and consistent.

---

## 10. AI Agent — Phase 7

See Phase 7 in the Build Process section above for full details.

The agent is the second major deliverable of Project Noda. It is a customer intelligence system with a chat interface — not a simple chat widget. Its CRM and analytics capabilities are designed to give the business owner actionable insight into customer intent, behaviour patterns, and lead quality over time.

---

## Notes for Future Reference

- **Logo:** Add to `/public/assets/logo.png` — replace all `logo-here` placeholders
- **Sanity Studio:** Accessible at `ashardisabilitycare.com.au/studio` — requires Sanity account login
- **Content updates:** All content changes go through Sanity Studio. The website updates automatically via the ISR webhook within seconds of publishing.
- **Adding new articles:** Create in Sanity Studio → Articles → New Article. Fill in all fields including Answer Capsule, FAQ items, SEO Title, and SEO Description. Publish. Website updates automatically.
- **Adding new services or locations:** Same process via Sanity Studio → Services or Locations.
- **Never edit page content directly in code** — all content lives in Sanity. Code is for structure and templates only.
