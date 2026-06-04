/**
 * Import / Export — Sanity Studio Tool
 *
 * Matches the 3-step layout from the PURA reference:
 *  Step 1 — Download JSON Template + Schema Guide
 *  Step 2 — Copy the AI prompt
 *  Step 3 — Paste filled JSON and import
 *
 * Covers every document type in the All Clutch & Brake CMS.
 */

import React, { useState } from "react"
import { definePlugin, useClient } from "sanity"

// ─── Document type registry ────────────────────────────────────────────────────

const DOCUMENT_TYPES = [
  { value: "post", label: "Blog Article" },
  { value: "service", label: "Service Page" },
  { value: "location", label: "Location Page" },
  { value: "testimonial", label: "Testimonial" },
  { value: "project", label: "Project" },
  { value: "promotion", label: "Promotion / Special" },
  { value: "productPage", label: "Product Page" },
  { value: "staff", label: "Staff Member" },
  { value: "certification", label: "Certification / Affiliation" },
] as const

type DocType = (typeof DOCUMENT_TYPES)[number]["value"]

// ─── JSON Templates ────────────────────────────────────────────────────────────

const TEMPLATES: Record<DocType, object> = {
  post: {
    _type: "post",
    title: "",
    _instructions_title:
      "[REQUIRED] The H1 headline of the blog post. Include the primary keyword. Max 120 chars. E.g. 'Clutch Replacement Cost Adelaide 2026: Full Price Guide'",
    slug: { current: "" },
    _instructions_slug:
      "[REQUIRED] URL-safe slug. Lowercase, hyphens only. Auto-generated from title. E.g. 'clutch-replacement-cost-adelaide-2026'",
    category: "",
    _instructions_category:
      "[REQUIRED] One of: 'Clutch Care' | 'Brake Safety' | 'Transmission' | 'How-To Guides' | 'Pricing & Costs' | 'Maintenance Tips' | 'Industry News'",
    publishedAt: new Date().toISOString(),
    readTimeMinutes: 5,
    _instructions_readTimeMinutes: "Approximate read time in minutes. Rough guide: 1 min per 200 words.",
    tags: [],
    _instructions_tags: "Array of keyword strings. E.g. ['clutch', 'adelaide', 'manual-transmission']",
    geoTags: [],
    _instructions_geoTags:
      "Array of location strings this post targets. E.g. ['Adelaide', 'South Australia', 'Edwardstown']",
    answerCapsule: "",
    _instructions_answerCapsule:
      "[REQUIRED — most important GEO/AEO field] A direct 20-40 word answer to the post's core question. AI engines (ChatGPT, Perplexity, Google AI Overviews) cite this verbatim. Must be a complete standalone sentence with specific data. E.g. 'Clutch replacement in Adelaide costs $800-$2,500 depending on vehicle make, whether the flywheel needs machining, and OEM vs aftermarket parts.'",
    quickAnswers: [
      {
        _key: "qa-1",
        question: "",
        quickAnswer: "",
        _instructions:
          "A key question and 1-2 sentence answer with specific data. Add 2-5 pairs. E.g. question: 'How long does a clutch replacement take?' answer: 'A standard clutch replacement takes 3-5 hours at All Clutch & Brake, or up to 8 hours for a dual-mass flywheel conversion.'",
      },
    ],
    body: [
      {
        _key: "block-intro",
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "", marks: [] }],
        markDefs: [],
        _instructions:
          "Introduction paragraph — 2-3 sentences expanding on the answer capsule. Include the primary keyword naturally.",
      },
      {
        _key: "block-h2-1",
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "", marks: [] }],
        markDefs: [],
        _instructions: "First main section heading (H2). Should be a clear, keyword-rich sub-question.",
      },
      {
        _key: "block-body-1",
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "", marks: [] }],
        markDefs: [],
        _instructions:
          "Section body — 2-4 paragraphs. Add more block objects as needed. For custom blocks (callout, table, comparison, YouTube, pullQuote, divider) see the Schema Guide.",
      },
    ],
    _instructions_body:
      "Full article content. Supported block types: standard blocks (style: normal|h2|h3|h4|blockquote), images, callout (type: info|tip|warning|danger), tableBlock (headers + rows), comparisonBlock (leftLabel/rightLabel + leftPoints/rightPoints), youtubeEmbed (url), pullQuote (quote + attribution), divider (style: line|spaced). See Schema Guide for exact shapes.",
    faqItems: [
      {
        _key: "faq-1",
        question: "",
        answer: "",
        _instructions:
          "One FAQ pair. Add 3-8 pairs total. Question should be a natural language query. Answer should be 2-5 sentences with specific data, prices, or steps.",
      },
    ],
    relatedPosts: [],
    _instructions_relatedPosts: "Leave as empty array — link related posts manually in Studio after import.",
    dataSources: [
      {
        _key: "src-1",
        label: "",
        url: "",
        _instructions:
          "One source/citation. E.g. label: 'Australian Competition and Consumer Commission', url: 'https://www.accc.gov.au'",
      },
    ],
    ctaHeading: "",
    _instructions_ctaHeading:
      "Optional — override the default CTA heading at the end of this post. Leave empty to use the site default.",
    ctaBody: "",
    _instructions_ctaBody: "Optional — override the default CTA body text. Leave empty for the site default.",
    seoTitle: "",
    _instructions_seoTitle: "Optional SEO title override. Max 60 chars. Leave empty to use the post title.",
    seoDescription: "",
    _instructions_seoDescription:
      "Optional meta description override. Max 155 chars. Leave empty for auto-generation.",
  },

  service: {
    _type: "service",
    title: "",
    _instructions_title: "[REQUIRED] The service name. E.g. 'Clutch Replacement', 'Brake Pad & Rotor Service'",
    slug: { current: "" },
    _instructions_slug:
      "[REQUIRED] URL slug. E.g. 'clutch-replacement' → URL becomes /services/clutch-replacement",
    answerCapsule: "",
    _instructions_answerCapsule:
      "[REQUIRED] A direct 20-30 word answer to 'What is [service] at All Clutch & Brake?' — this is what AI engines cite. E.g. 'All Clutch & Brake provides complete clutch replacement in Adelaide, covering all vehicle makes including 4WDs, using OEM and premium aftermarket parts with a labour warranty.'",
    body: [
      {
        _key: "block-intro",
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "", marks: [] }],
        markDefs: [],
        _instructions:
          "Service description paragraphs. Use H2/H3 for subheadings. Keep content specific and keyword-rich.",
      },
    ],
    _instructions_body:
      "Service page content. Supported styles: normal|h2|h3|h4|blockquote. Inline marks: strong|em|underline. Links require markDefs. See Schema Guide for full block shapes.",
    whoIsItFor: "",
    _instructions_whoIsItFor:
      "Optional. Describe which vehicle types, drivers, or situations this service is for. E.g. 'Ideal for manual transmission vehicles, 4WDs, performance cars, and any vehicle showing clutch slip or heavy pedal symptoms.'",
    faqItems: [
      {
        _key: "faq-1",
        question: "",
        answer: "",
        _instructions:
          "5-7 service-specific FAQs. E.g. 'How do I know if my clutch needs replacing?' / 'How long does a clutch replacement take?'",
      },
    ],
    icon: "",
    _instructions_icon:
      "Optional Lucide icon name used in service cards. E.g. 'wrench', 'settings', 'tool', 'shield-check'",
    order: 1,
    _instructions_order: "Controls display order on the Services page. Lower number = appears first.",
    seoTitle: "",
    _instructions_seoTitle: "Max 60 chars. Leave empty to use the service title.",
    seoDescription: "",
    _instructions_seoDescription: "Max 155 chars. Leave empty for auto-generation.",
  },

  location: {
    _type: "location",
    title: "",
    _instructions_title:
      "[REQUIRED] Location name. E.g. 'Northern Adelaide' (for a region) or 'Elizabeth' (for a suburb).",
    slug: { current: "" },
    _instructions_slug: "[REQUIRED] URL slug. E.g. 'northern-adelaide' → /locations/northern-adelaide",
    locationType: "",
    _instructions_locationType:
      "[REQUIRED] One of: 'region' (covers multiple suburbs) | 'suburb' (individual Tier 1 suburb page)",
    region: "",
    _instructions_region:
      "For suburb pages only — which region does this suburb fall under? One of: 'northern-adelaide' | 'southern-adelaide' | 'eastern-adelaide' | 'western-adelaide' | 'cbd-and-inner-suburbs' | 'barossa-and-surrounds' | 'fleurieu-peninsula' | 'eyre-peninsula' | 'limestone-coast' | 'yorke-and-mid-north'",
    suburbsIncluded: [],
    _instructions_suburbsIncluded:
      "For region pages only — array of suburb name strings included in this region. E.g. ['Elizabeth', 'Salisbury', 'Para Hills', 'Mawson Lakes']",
    answerCapsule: "",
    _instructions_answerCapsule:
      "[REQUIRED] Direct answer to 'Does All Clutch & Brake service [location]?' — 20-30 words. E.g. 'Yes, All Clutch & Brake services Elizabeth and the northern Adelaide region for clutch repairs, brake service, and transmission work, with free local pickup available.'",
    body: [
      {
        _key: "block-intro",
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "", marks: [] }],
        markDefs: [],
        _instructions:
          "Location page content. Reference the area, local driving conditions, suburbs served, and why residents should choose All Clutch & Brake.",
      },
    ],
    _instructions_body:
      "Location page content. Supported styles: normal|h2|h3|h4|blockquote. See Schema Guide for block shapes.",
    faqItems: [
      {
        _key: "faq-1",
        question: "",
        answer: "",
        _instructions:
          "3-5 location-specific FAQs. E.g. 'Do you offer mobile service in Elizabeth?' / 'How far is All Clutch & Brake from Mawson Lakes?'",
      },
    ],
    seoTitle: "",
    _instructions_seoTitle: "Max 60 chars. E.g. 'Clutch & Brake Repairs Northern Adelaide | All Clutch & Brake'",
    seoDescription: "",
    _instructions_seoDescription: "Max 155 chars.",
  },

  testimonial: {
    _type: "testimonial",
    customerName: "",
    _instructions_customerName:
      "[REQUIRED] Full name or first name + last initial. E.g. 'John Smith' or 'Sarah T.'",
    suburb: "",
    _instructions_suburb: "Customer's suburb for local trust signals. E.g. 'Modbury', 'Golden Grove'",
    vehicleType: "",
    _instructions_vehicleType:
      "Vehicle make/model. E.g. 'Toyota Hilux', '2015 Holden Commodore', 'Ford Ranger'",
    rating: 5,
    _instructions_rating: "[REQUIRED] Star rating 1-5. Integer only.",
    testimonial: "",
    _instructions_testimonial:
      "[REQUIRED] The customer's review text. Keep it authentic and specific — mention the service, the experience, and the outcome. Max 500 chars.",
    featured: false,
    _instructions_featured: "Set to true to show this testimonial in the homepage carousel.",
    date: new Date().toISOString().split("T")[0],
    _instructions_date: "[REQUIRED] Date in YYYY-MM-DD format. E.g. '2026-05-15'",
    source: "",
    _instructions_source:
      "Where this review came from. One of: 'google' | 'facebook' | 'email' | 'in-person' | 'other'",
    verified: true,
    _instructions_verified: "Set to true if you can confirm this is a real customer.",
  },

  project: {
    _type: "project",
    title: "",
    _instructions_title:
      "[REQUIRED] Project title. E.g. 'AP6 Valiant Clutch Rebuild', 'S13 Nissan 180SX Track Prep', 'Ford Ranger Dual-Mass Flywheel Conversion'",
    slug: { current: "" },
    _instructions_slug:
      "[REQUIRED] URL slug. E.g. 'ap6-valiant-clutch-rebuild' → /projects/ap6-valiant-clutch-rebuild",
    description: "",
    _instructions_description:
      "[REQUIRED] Detailed description of the project — the vehicle, the problem, the work performed, parts used, and the outcome. 100-400 words.",
    tags: [],
    _instructions_tags:
      "Array of project category strings. E.g. ['Clutch Replacement', 'Flywheel Machining', 'Custom Work', 'Performance Build', 'Race Preparation']",
    order: 1,
    _instructions_order: "Controls display order on the Projects page. Lower number = appears first.",
  },

  promotion: {
    _type: "promotion",
    title: "",
    _instructions_title:
      "[REQUIRED] Promotion title. Max 80 chars. E.g. 'Summer Special: 15% Off Clutch Replacements'",
    description: "",
    _instructions_description:
      "[REQUIRED] Short, compelling description of the promotion. Max 250 chars. E.g. 'Book your clutch replacement this summer and save 15% on all labour. Valid for manual vehicles only. Bookings essential.'",
    discountType: "",
    _instructions_discountType:
      "One of: 'percentage' | 'dollar' | 'free' | 'package' | 'other'",
    discountValue: "",
    _instructions_discountValue:
      "The displayed discount value. E.g. '15%', '$50', 'Free brake inspection with every clutch job'",
    startDate: new Date().toISOString().split("T")[0],
    _instructions_startDate: "[REQUIRED] Start date in YYYY-MM-DD format.",
    endDate: "",
    _instructions_endDate: "[REQUIRED] End date in YYYY-MM-DD format. Promotion auto-hides after this date.",
    ctaLabel: "Claim This Offer",
    _instructions_ctaLabel: "CTA button label. E.g. 'Claim This Offer', 'Book Now', 'Get Quote'",
    ctaLink: "/contact",
    _instructions_ctaLink: "URL or path the CTA links to. E.g. '/contact', '/services/clutch-replacement'",
    featured: false,
    _instructions_featured: "Set to true to show this promotion prominently on the homepage.",
    bannerStyle: "default",
    _instructions_bannerStyle:
      "Visual style. One of: 'default' (orange) | 'urgent' (red) | 'premium' (dark) | 'subtle' (light)",
    termsAndConditions: "",
    _instructions_termsAndConditions:
      "Fine print. E.g. 'Valid for new customers only. Cannot be combined with other offers. Bookings essential.'",
    active: true,
    _instructions_active: "Set to false to manually disable even within the date range.",
  },

  productPage: {
    _type: "productPage",
    title: "",
    _instructions_title:
      "[REQUIRED] Page title. E.g. 'Brake Pipes', 'Braided Brake Hoses', 'Specialty Parts & Components'",
    slug: { current: "" },
    _instructions_slug: "[REQUIRED] URL slug. E.g. 'brake-pipes' → /products/brake-pipes",
    heading: "",
    _instructions_heading: "[REQUIRED] Main H1 heading displayed at the top of the page.",
    introText: "",
    _instructions_introText:
      "Introductory paragraph explaining what this product page covers. 2-4 sentences.",
    detailedDescription: "",
    _instructions_detailedDescription:
      "In-depth description of the product — materials, specifications, process, applications. 4-8 sentences.",
    sections: [
      {
        _key: "section-1",
        heading: "",
        content: "",
        _instructions:
          "One content section. Add multiple sections to cover different product types or use cases. E.g. heading: 'Steel Brake Pipes', content: 'Our steel brake pipes are manufactured to OEM specifications...'",
      },
    ],
    specifications: [],
    _instructions_specifications:
      "Array of specification strings. E.g. ['Available in 3/16\" and 1/4\" bore', 'Stainless, steel, and cunifer options', 'Cut and flared to any length']",
    ctaHeading: "",
    _instructions_ctaHeading: "CTA section heading. E.g. 'Ready to Upgrade Your Brake Lines?'",
    ctaText: "",
    _instructions_ctaText: "CTA supporting text. 1-2 sentences encouraging the user to contact.",
    ctaButtonLabel: "Get a Quote",
    _instructions_ctaButtonLabel: "E.g. 'Contact Us', 'Get a Quote', 'Call Now'",
    ctaButtonLink: "/contact",
    _instructions_ctaButtonLink: "E.g. '/contact' or 'tel:0882778122'",
    seoTitle: "",
    _instructions_seoTitle: "Max 60 chars.",
    seoDescription: "",
    _instructions_seoDescription: "Max 155 chars.",
  },

  staff: {
    _type: "staff",
    name: "",
    _instructions_name: "[REQUIRED] Full name of the staff member. E.g. 'Michael Farzan'",
    role: "",
    _instructions_role:
      "[REQUIRED] Job title. E.g. 'Head Mechanic', 'Service Manager', 'Brake & Clutch Technician'",
    bio: "",
    _instructions_bio:
      "Background, experience, specialties, or a fun fact about this staff member. 2-4 sentences. E.g. 'Michael has been with All Clutch & Brake for over 15 years and specialises in high-performance clutch builds and vintage vehicles.'",
    order: 1,
    _instructions_order: "Controls display order on the Meet Our Staff page. Lower number = appears first.",
  },

  certification: {
    _type: "certification",
    name: "",
    _instructions_name:
      "[REQUIRED] Full certification name. E.g. 'MTA Member', 'VACC Accredited Repairer', 'AAA Approved Workshop'",
    abbreviation: "",
    _instructions_abbreviation: "Short form. E.g. 'MTA', 'VACC', 'AAA'",
    description: "",
    _instructions_description:
      "What this certification means and why it matters to customers. 2-3 sentences.",
    issuer: "",
    _instructions_issuer:
      "Issuing organisation name. E.g. 'Motor Trade Association of South Australia', 'Victorian Automobile Chamber of Commerce'",
    externalLink: "",
    _instructions_externalLink: "URL to the issuing organisation or verification page.",
    certificateNumber: "",
    _instructions_certificateNumber: "Your membership or certificate number. Optional.",
    dateObtained: "",
    _instructions_dateObtained: "Date first obtained in YYYY-MM-DD format.",
    expiryDate: "",
    _instructions_expiryDate: "Expiry date in YYYY-MM-DD format. Leave empty if it does not expire.",
    showInFooter: true,
    _instructions_showInFooter: "Set to true to display this badge in the footer trust section.",
    showOnAboutPage: true,
    _instructions_showOnAboutPage: "Set to true to display on the About page.",
    displayOrder: 1,
    _instructions_displayOrder: "Controls display order. Lower number = appears first.",
  },
}

// ─── Schema Guides ─────────────────────────────────────────────────────────────

const SCHEMA_GUIDES: Record<DocType, string> = {
  post: `# All Clutch & Brake — Blog Article Schema Guide

Use this guide alongside the JSON template. It defines the exact shape of every field and block type.
Do not invent field names or structures. Do not deviate from the shapes described here.

---

## Top-Level Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| \`_type\` | string | YES | Always \`"post"\` |
| \`title\` | string | YES | H1 headline, max 120 chars |
| \`slug.current\` | string | YES | Lowercase, hyphens only |
| \`category\` | string | YES | One of: Clutch Care / Brake Safety / Transmission / How-To Guides / Pricing & Costs / Maintenance Tips / Industry News |
| \`publishedAt\` | string | YES | ISO 8601. E.g. \`"2026-06-01T00:00:00.000Z"\` |
| \`answerCapsule\` | string | YES | 20-40 word direct answer. Most important GEO/AEO field — AI engines cite this verbatim. |
| \`readTimeMinutes\` | number | — | Minutes. ~1 min per 200 words. |
| \`tags\` | string[] | — | Keyword tags. E.g. \`["clutch replacement", "adelaide", "manual transmission"]\` |
| \`geoTags\` | string[] | — | Location tags for local SEO. E.g. \`["Adelaide", "South Australia", "Edwardstown"]\` |
| \`ctaHeading\` | string | — | Override end-of-article CTA heading. Leave empty to use site default. |
| \`ctaBody\` | string | — | Override end-of-article CTA body text. Leave empty to use site default. |
| \`seoTitle\` | string | — | Max 60 chars. Leave empty to use the post title. |
| \`seoDescription\` | string | — | Max 155 chars. Leave empty for auto-generation. |

### Example — Top-Level Fields

\`\`\`json
{
  "_type": "post",
  "title": "Clutch Replacement Cost Adelaide 2026: Full Price Guide",
  "slug": { "current": "clutch-replacement-cost-adelaide-2026" },
  "category": "Pricing & Costs",
  "publishedAt": "2026-06-01T00:00:00.000Z",
  "readTimeMinutes": 7,
  "tags": ["clutch replacement", "adelaide", "cost", "price guide", "manual transmission"],
  "geoTags": ["Adelaide", "South Australia", "Edwardstown", "Keswick", "Mile End"],
  "answerCapsule": "Clutch replacement in Adelaide costs $800-$2,500 at All Clutch & Brake depending on vehicle type, whether the flywheel needs machining, and OEM vs aftermarket parts.",
  "ctaHeading": "Need a Clutch Quote?",
  "ctaBody": "Call us or drop in for a free assessment. We service all makes and models.",
  "seoTitle": "Clutch Replacement Cost Adelaide 2026 | All Clutch & Brake",
  "seoDescription": "Full price guide for clutch replacement in Adelaide. Small cars from $800, 4WDs from $1,200. Free quotes available. All Clutch & Brake, Edwardstown SA."
}
\`\`\`

---

## quickAnswers — AI Citation Signals

These are extracted by AI engines (ChatGPT, Perplexity, Google AI Overviews) to answer user questions. Make each answer a complete standalone sentence with specific data — do not use vague language.

Add 2-5 pairs. Each \`_key\` must be unique (qa-1, qa-2, qa-3 etc.)

\`\`\`json
"quickAnswers": [
  {
    "_key": "qa-1",
    "question": "How long does a clutch replacement take?",
    "quickAnswer": "A standard clutch replacement at All Clutch & Brake takes 3-5 hours. Dual-mass flywheel conversions may take up to 8 hours depending on the vehicle."
  },
  {
    "_key": "qa-2",
    "question": "How much does clutch replacement cost in Adelaide?",
    "quickAnswer": "Clutch replacement in Adelaide costs $800-$1,100 for small cars, $1,200-$1,800 for 4WDs and utes, and up to $2,500 for vehicles requiring flywheel machining."
  },
  {
    "_key": "qa-3",
    "question": "Does All Clutch & Brake use OEM or aftermarket parts?",
    "quickAnswer": "All Clutch & Brake stocks both OEM and premium aftermarket clutch kits. Our mechanics recommend the best option for each vehicle based on use and budget."
  }
]
\`\`\`

---

## body — Portable Text Array

Every item in the body array MUST have a unique \`_key\`. Add as many blocks as needed — there is no limit.

IMPORTANT — \`images\`, \`callout\`, \`tableBlock\`, \`comparisonBlock\`, \`youtubeEmbed\`, \`pullQuote\`, and \`divider\` are supported in the blog body only. Do NOT use these custom block types in service or location body fields.

---

### Standard Paragraph

\`\`\`json
{
  "_key": "block-1",
  "_type": "block",
  "style": "normal",
  "children": [{ "_type": "span", "text": "A clutch replacement involves removing the gearbox, replacing the clutch disc, pressure plate, and release bearing, then resurfacing or replacing the flywheel if required.", "marks": [] }],
  "markDefs": []
}
\`\`\`

---

### Headings (H2, H3, H4)

\`\`\`json
{
  "_key": "block-h2-1",
  "_type": "block",
  "style": "h2",
  "children": [{ "_type": "span", "text": "What Does a Clutch Replacement Include?", "marks": [] }],
  "markDefs": []
}
\`\`\`

**style options:** \`normal\` \`h2\` \`h3\` \`h4\` \`blockquote\`

---

### Inline Text Formatting

Bold, italic, underline, and code are applied via the \`marks\` array on each span:

\`\`\`json
{
  "_key": "block-3",
  "_type": "block",
  "style": "normal",
  "children": [
    { "_type": "span", "text": "The flywheel ", "marks": [] },
    { "_type": "span", "text": "must be inspected", "marks": ["strong"] },
    { "_type": "span", "text": " on every clutch job — a worn flywheel ", "marks": [] },
    { "_type": "span", "text": "doubles the repair cost", "marks": ["strong", "em"] },
    { "_type": "span", "text": " if missed.", "marks": [] }
  ],
  "markDefs": []
}
\`\`\`

**Inline mark options:** \`strong\` (bold) \`em\` (italic) \`underline\` \`code\`

---

### Links

Links require a markDef entry. The span's \`marks\` array references the markDef's \`_key\`.

\`\`\`json
{
  "_key": "block-4",
  "_type": "block",
  "style": "normal",
  "children": [
    { "_type": "span", "text": "Book a free inspection via our ", "marks": [] },
    { "_type": "span", "text": "contact page", "marks": ["link-1"] },
    { "_type": "span", "text": " or call us directly.", "marks": [] }
  ],
  "markDefs": [
    { "_key": "link-1", "_type": "link", "href": "/contact", "blank": false }
  ]
}
\`\`\`

For external links, set \`"blank": true\` to open in a new tab:

\`\`\`json
"markDefs": [
  { "_key": "link-ext-1", "_type": "link", "href": "https://www.accc.gov.au", "blank": true }
]
\`\`\`

---

### Blockquote

\`\`\`json
{
  "_key": "block-bq-1",
  "_type": "block",
  "style": "blockquote",
  "children": [{ "_type": "span", "text": "A worn clutch disc left too long will score the flywheel — turning a straightforward replacement into a much larger job.", "marks": [] }],
  "markDefs": []
}
\`\`\`

---

### Inline Image (blog body only)

Images in the body must be uploaded to Sanity first, then referenced by asset ID. You cannot embed a raw image URL here — the asset must exist in the Sanity media library.

\`\`\`json
{
  "_key": "img-1",
  "_type": "image",
  "asset": { "_type": "reference", "_ref": "image-abc123def456-1200x800-jpg" },
  "alt": "Worn clutch disc removed from a Toyota Hilux",
  "caption": "A badly worn clutch disc — note the scored surface and missing friction material."
}
\`\`\`

NOTE: If you do not have the asset \`_ref\` from Sanity, leave the image block out of the JSON and add the image manually in Studio after import.

---

### callout (blog body only)

\`\`\`json
{
  "_key": "callout-1",
  "_type": "callout",
  "type": "tip",
  "heading": "Pro Tip",
  "body": "If your clutch pedal feels spongy or requires more travel than usual, book an inspection before it fails completely. A slipping clutch that is left too long will damage the flywheel."
}
\`\`\`

**type options and when to use them:**
- \`info\` — neutral information or background context
- \`tip\` — practical advice or a recommendation
- \`warning\` — something the reader should be cautious about
- \`danger\` — a serious risk or safety issue

---

### tableBlock (blog body only)

The number of strings in \`cells\` MUST exactly match the number of strings in \`headers\`. Each row needs a unique \`_key\`.

\`\`\`json
{
  "_key": "table-1",
  "_type": "tableBlock",
  "caption": "Clutch replacement cost comparison by vehicle type",
  "headers": ["Vehicle Type", "Parts Cost", "Labour", "Total Range"],
  "rows": [
    { "_key": "row-1", "cells": ["Small car (Corolla, Jazz)", "$400-600", "$350-500", "$800-1,100"] },
    { "_key": "row-2", "cells": ["Mid-size (Camry, Mazda 6)", "$500-800", "$400-600", "$1,000-1,400"] },
    { "_key": "row-3", "cells": ["4WD / Ute (Hilux, Ranger)", "$600-1,000", "$500-700", "$1,200-1,800"] },
    { "_key": "row-4", "cells": ["Performance / European", "$800-1,500", "$600-900", "$1,500-2,500"] }
  ]
}
\`\`\`

---

### comparisonBlock (blog body only)

Use for side-by-side comparisons — OEM vs aftermarket, repair vs replace, etc.

\`\`\`json
{
  "_key": "comp-1",
  "_type": "comparisonBlock",
  "heading": "OEM vs Aftermarket Clutch Kits",
  "leftLabel": "OEM",
  "rightLabel": "Aftermarket",
  "leftPoints": [
    "Exact fit guaranteed for your make and model",
    "Full manufacturer warranty",
    "Engineered to original performance specification",
    "Higher upfront cost"
  ],
  "rightPoints": [
    "Lower upfront cost",
    "Wide range of brands and performance ratings",
    "Good option for older or high-kilometre vehicles",
    "Fitment quality varies by brand"
  ]
}
\`\`\`

---

### youtubeEmbed (blog body only)

\`\`\`json
{
  "_key": "yt-1",
  "_type": "youtubeEmbed",
  "url": "https://www.youtube.com/watch?v=VIDEOID",
  "caption": "Watch our head mechanic explain the signs of a worn clutch"
}
\`\`\`

Replace \`VIDEOID\` with the actual YouTube video ID from the URL.

---

### pullQuote (blog body only)

Use to highlight a key insight or expert statement. Attribution is optional.

\`\`\`json
{
  "_key": "pq-1",
  "_type": "pullQuote",
  "quote": "A slipping clutch left unattended will damage the flywheel — turning a $900 job into a $1,800 one.",
  "attribution": "Michael Farzan, Head Mechanic"
}
\`\`\`

---

### divider (blog body only)

Use to visually separate major sections.

\`\`\`json
{ "_key": "div-1", "_type": "divider", "style": "line" }
\`\`\`

**style options:** \`line\` (thin horizontal rule) \`spaced\` (extra vertical whitespace only)

---

### Full body Example — Multiple Block Types Together

\`\`\`json
"body": [
  {
    "_key": "block-intro",
    "_type": "block",
    "style": "normal",
    "children": [{ "_type": "span", "text": "Clutch replacement is one of the most common repairs we perform at All Clutch & Brake. This guide covers exactly what is involved, how long it takes, and what you should expect to pay in Adelaide in 2026.", "marks": [] }],
    "markDefs": []
  },
  {
    "_key": "block-h2-1",
    "_type": "block",
    "style": "h2",
    "children": [{ "_type": "span", "text": "What Does a Clutch Replacement Include?", "marks": [] }],
    "markDefs": []
  },
  {
    "_key": "callout-1",
    "_type": "callout",
    "type": "info",
    "heading": "Standard Clutch Kit",
    "body": "A full clutch kit replacement includes the clutch disc, pressure plate, and release bearing. The flywheel is inspected and resurfaced or replaced as required."
  },
  {
    "_key": "table-1",
    "_type": "tableBlock",
    "caption": "Clutch replacement cost by vehicle type — Adelaide 2026",
    "headers": ["Vehicle Type", "Parts", "Labour", "Total"],
    "rows": [
      { "_key": "row-1", "cells": ["Small car", "$400-600", "$350-500", "$800-1,100"] },
      { "_key": "row-2", "cells": ["4WD / Ute", "$600-1,000", "$500-700", "$1,200-1,800"] }
    ]
  },
  {
    "_key": "div-1",
    "_type": "divider",
    "style": "line"
  },
  {
    "_key": "block-h2-2",
    "_type": "block",
    "style": "h2",
    "children": [{ "_type": "span", "text": "OEM vs Aftermarket: Which Is Right for Your Car?", "marks": [] }],
    "markDefs": []
  },
  {
    "_key": "comp-1",
    "_type": "comparisonBlock",
    "heading": "OEM vs Aftermarket Clutch Kits",
    "leftLabel": "OEM",
    "rightLabel": "Aftermarket",
    "leftPoints": ["Exact fit for your make/model", "Manufacturer warranty", "Higher cost"],
    "rightPoints": ["Lower upfront cost", "Wide brand range", "Fit varies by brand"]
  },
  {
    "_key": "pq-1",
    "_type": "pullQuote",
    "quote": "For daily drivers, a premium aftermarket kit is often the smarter investment. For performance cars, OEM or better.",
    "attribution": "Michael Farzan, Head Mechanic"
  }
]
\`\`\`

---

## faqItems

Add 3-8 pairs. Each \`_key\` must be unique. Questions should be natural language queries a customer would type. Answers should be 2-5 sentences with specific data, prices, or steps.

\`\`\`json
"faqItems": [
  {
    "_key": "faq-1",
    "question": "How much does clutch replacement cost in Adelaide?",
    "answer": "Clutch replacement in Adelaide costs $800-$2,500 at All Clutch & Brake depending on vehicle type and whether the flywheel needs machining. Small cars like a Corolla or Jazz cost $800-$1,100. 4WDs and utes like a Hilux or Ranger cost $1,200-$1,800. We provide a fixed-price quote before any work begins."
  },
  {
    "_key": "faq-2",
    "question": "How do I know if my clutch needs replacing?",
    "answer": "Common signs include clutch slip (engine revs rise but the car does not accelerate), a spongy or high-riding pedal, a burning smell when pulling away, or difficulty engaging gears. If you notice any of these, book a free inspection — early diagnosis prevents flywheel damage."
  },
  {
    "_key": "faq-3",
    "question": "How long does a clutch replacement take?",
    "answer": "Most clutch replacements are completed in 3-5 hours at All Clutch & Brake. Dual-mass flywheel conversions or vehicles with difficult gearbox access may take up to 8 hours. We will give you an accurate time estimate when you book."
  }
]
\`\`\`

---

## dataSources

List any external sources or citations used in the article. These are displayed at the bottom of the post and also signal credibility to AI engines.

\`\`\`json
"dataSources": [
  {
    "_key": "src-1",
    "label": "Australian Competition and Consumer Commission — Car Servicing Rights",
    "url": "https://www.accc.gov.au/consumers/buying-products-and-services/car-servicing"
  },
  {
    "_key": "src-2",
    "label": "Motor Trade Association of South Australia",
    "url": "https://www.mtasa.com.au"
  }
]
\`\`\`
`,

  service: `# All Clutch & Brake — Service Page Schema Guide

---

## Top-Level Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| \`_type\` | string | YES | Always \`"service"\` |
| \`title\` | string | YES | Service name. E.g. \`"Clutch Replacement"\` |
| \`slug.current\` | string | YES | URL slug. E.g. \`"clutch-replacement"\` → /services/clutch-replacement |
| \`answerCapsule\` | string | YES | 20-30 word AI citation answer. Must be a complete standalone sentence with specific detail. |
| \`body\` | array | YES | Portable Text content — standard blocks only (see below) |
| \`whoIsItFor\` | string | — | Plain text description of which customers this service suits |
| \`icon\` | string | — | Lucide icon name. E.g. \`"wrench"\`, \`"settings"\`, \`"shield-check"\` |
| \`order\` | number | — | Display order on Services page. Lower = first. |
| \`seoTitle\` | string | — | Max 60 chars. Leave empty to use the service title. |
| \`seoDescription\` | string | — | Max 155 chars. |

### Example — Top-Level Fields

\`\`\`json
{
  "_type": "service",
  "title": "Clutch Replacement",
  "slug": { "current": "clutch-replacement" },
  "answerCapsule": "All Clutch & Brake provides complete clutch replacement in Adelaide covering all vehicle makes including 4WDs, using OEM and premium aftermarket parts with a labour warranty.",
  "whoIsItFor": "Ideal for manual transmission vehicles of any age or make showing signs of clutch slip, heavy pedal, or difficulty engaging gears. We service passenger cars, 4WDs, utes, and performance vehicles.",
  "icon": "wrench",
  "order": 1,
  "seoTitle": "Clutch Replacement Adelaide | All Clutch & Brake",
  "seoDescription": "Expert clutch replacement in Adelaide for all makes and models. Free inspection, fixed-price quotes, OEM and aftermarket parts. Call All Clutch & Brake today."
}
\`\`\`

---

## body — Portable Text (standard blocks only)

IMPORTANT: The service body supports standard Portable Text blocks only.
DO NOT use: \`callout\`, \`tableBlock\`, \`comparisonBlock\`, \`youtubeEmbed\`, \`pullQuote\`, \`divider\`, or \`image\` blocks here — they are not supported and will be ignored.

Supported block types: \`normal\` paragraph, \`h2\`, \`h3\`, \`h4\`, \`blockquote\`, inline marks (\`strong\`, \`em\`, \`underline\`), and links via markDefs.

### Paragraph

\`\`\`json
{
  "_key": "block-1",
  "_type": "block",
  "style": "normal",
  "children": [{ "_type": "span", "text": "All Clutch & Brake has been replacing clutches across Adelaide for over 30 years. We work on all makes and models — from daily drivers to 4WDs, utes, and performance vehicles.", "marks": [] }],
  "markDefs": []
}
\`\`\`

### Heading (H2)

\`\`\`json
{
  "_key": "block-h2-1",
  "_type": "block",
  "style": "h2",
  "children": [{ "_type": "span", "text": "What Is Included in a Clutch Replacement?", "marks": [] }],
  "markDefs": []
}
\`\`\`

### Bold / Italic

\`\`\`json
{
  "_key": "block-2",
  "_type": "block",
  "style": "normal",
  "children": [
    { "_type": "span", "text": "Every clutch replacement includes a ", "marks": [] },
    { "_type": "span", "text": "free flywheel inspection", "marks": ["strong"] },
    { "_type": "span", "text": " — we will advise you before machining or replacing it.", "marks": [] }
  ],
  "markDefs": []
}
\`\`\`

### Link

\`\`\`json
{
  "_key": "block-3",
  "_type": "block",
  "style": "normal",
  "children": [
    { "_type": "span", "text": "Get a free quote via our ", "marks": [] },
    { "_type": "span", "text": "contact page", "marks": ["link-1"] },
    { "_type": "span", "text": " or call us on (08) 8277 8122.", "marks": [] }
  ],
  "markDefs": [
    { "_key": "link-1", "_type": "link", "href": "/contact", "blank": false }
  ]
}
\`\`\`

### Full body Example

\`\`\`json
"body": [
  {
    "_key": "block-intro",
    "_type": "block",
    "style": "normal",
    "children": [{ "_type": "span", "text": "All Clutch & Brake has been replacing clutches across Adelaide for over 30 years. We work on all makes and models — from daily drivers to 4WDs, utes, and high-performance vehicles.", "marks": [] }],
    "markDefs": []
  },
  {
    "_key": "block-h2-1",
    "_type": "block",
    "style": "h2",
    "children": [{ "_type": "span", "text": "What Is Included?", "marks": [] }],
    "markDefs": []
  },
  {
    "_key": "block-2",
    "_type": "block",
    "style": "normal",
    "children": [
      { "_type": "span", "text": "A standard clutch replacement includes the ", "marks": [] },
      { "_type": "span", "text": "clutch disc, pressure plate, and release bearing", "marks": ["strong"] },
      { "_type": "span", "text": ". The flywheel is inspected and resurfaced or replaced if worn.", "marks": [] }
    ],
    "markDefs": []
  },
  {
    "_key": "block-h2-2",
    "_type": "block",
    "style": "h2",
    "children": [{ "_type": "span", "text": "Get a Free Quote", "marks": [] }],
    "markDefs": []
  },
  {
    "_key": "block-3",
    "_type": "block",
    "style": "normal",
    "children": [
      { "_type": "span", "text": "Call us on (08) 8277 8122 or submit a request via our ", "marks": [] },
      { "_type": "span", "text": "contact page", "marks": ["link-1"] },
      { "_type": "span", "text": ". We provide fixed-price quotes before any work begins.", "marks": [] }
    ],
    "markDefs": [
      { "_key": "link-1", "_type": "link", "href": "/contact", "blank": false }
    ]
  }
]
\`\`\`

---

## faqItems

Add 5-7 service-specific FAQs. Each \`_key\` must be unique.

\`\`\`json
"faqItems": [
  {
    "_key": "faq-1",
    "question": "How do I know if my clutch needs replacing?",
    "answer": "Signs include clutch slip (engine revs rise but speed does not increase), a spongy or high-riding pedal, a burning smell when pulling away, or grinding when engaging gears. If you notice any of these, book a free inspection — catching it early prevents flywheel damage."
  },
  {
    "_key": "faq-2",
    "question": "How long does a clutch replacement take?",
    "answer": "A standard clutch replacement takes 3-5 hours at All Clutch & Brake. Vehicles with difficult gearbox access or dual-mass flywheel conversions may take up to 8 hours. We will give you an accurate time estimate when you book."
  },
  {
    "_key": "faq-3",
    "question": "Do you offer a warranty on clutch replacements?",
    "answer": "Yes. All clutch replacements at All Clutch & Brake come with a labour warranty. Parts carry the manufacturer's warranty. Ask our team for full warranty details when you book."
  }
]
\`\`\`
`,

  location: `# All Clutch & Brake — Location Page Schema Guide

---

## Top-Level Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| \`_type\` | string | YES | Always \`"location"\` |
| \`title\` | string | YES | Location name. E.g. \`"Northern Adelaide"\` or \`"Elizabeth"\` |
| \`slug.current\` | string | YES | URL slug. E.g. \`"northern-adelaide"\` → /locations/northern-adelaide |
| \`locationType\` | string | YES | \`"region"\` (covers multiple suburbs) or \`"suburb"\` (single suburb page) |
| \`region\` | string | — | For suburb pages only — the parent region slug this suburb belongs to |
| \`suburbsIncluded\` | string[] | — | For region pages only — array of suburb name strings in this region |
| \`answerCapsule\` | string | YES | 20-30 word answer to "Does All Clutch & Brake service [location]?" — complete standalone sentence |
| \`body\` | array | YES | Portable Text content — standard blocks only (see below) |
| \`faqItems\` | array | — | 3-5 location-specific FAQs |
| \`seoTitle\` | string | — | Max 60 chars. E.g. \`"Clutch & Brake Repairs Northern Adelaide | All Clutch & Brake"\` |
| \`seoDescription\` | string | — | Max 155 chars. |

---

## region options (for suburb pages — pick the correct parent region)

\`northern-adelaide\` \`southern-adelaide\` \`eastern-adelaide\` \`western-adelaide\`
\`cbd-and-inner-suburbs\` \`barossa-and-surrounds\` \`fleurieu-peninsula\`
\`eyre-peninsula\` \`limestone-coast\` \`yorke-and-mid-north\`

---

### Example — Region Page

\`\`\`json
{
  "_type": "location",
  "title": "Northern Adelaide",
  "slug": { "current": "northern-adelaide" },
  "locationType": "region",
  "suburbsIncluded": ["Elizabeth", "Salisbury", "Para Hills", "Mawson Lakes", "Modbury", "Golden Grove", "Tea Tree Gully"],
  "answerCapsule": "Yes, All Clutch & Brake services the northern Adelaide region including Elizabeth, Salisbury, and Mawson Lakes for clutch repairs, brake service, and transmission work.",
  "seoTitle": "Clutch & Brake Repairs Northern Adelaide | All Clutch & Brake",
  "seoDescription": "Expert clutch and brake repairs for northern Adelaide including Elizabeth, Salisbury, and Mawson Lakes. Free quotes. All Clutch & Brake, Edwardstown SA."
}
\`\`\`

### Example — Suburb Page

\`\`\`json
{
  "_type": "location",
  "title": "Elizabeth",
  "slug": { "current": "elizabeth" },
  "locationType": "suburb",
  "region": "northern-adelaide",
  "answerCapsule": "Yes, All Clutch & Brake services Elizabeth for clutch replacement, brake repairs, and transmission work. Free pickup and drop-off available for Elizabeth customers.",
  "seoTitle": "Clutch & Brake Repairs Elizabeth SA | All Clutch & Brake",
  "seoDescription": "Clutch replacement and brake repairs for Elizabeth SA. Free quotes, all makes and models. All Clutch & Brake, Edwardstown — servicing Elizabeth for 30+ years."
}
\`\`\`

---

## body — Portable Text (standard blocks only)

IMPORTANT: The location body supports standard Portable Text blocks only.
DO NOT use: \`callout\`, \`tableBlock\`, \`comparisonBlock\`, \`youtubeEmbed\`, \`pullQuote\`, \`divider\`, or \`image\` blocks here — they are not supported.

Supported: \`normal\`, \`h2\`, \`h3\`, \`h4\`, \`blockquote\`, inline marks (\`strong\`, \`em\`, \`underline\`), and links via markDefs. See the Service Page guide for exact block shapes — the structure is identical.

### Full body Example — Location Page

\`\`\`json
"body": [
  {
    "_key": "block-intro",
    "_type": "block",
    "style": "normal",
    "children": [{ "_type": "span", "text": "All Clutch & Brake has been servicing vehicles from Elizabeth and the northern Adelaide region for over 30 years. Whether you are dealing with a slipping clutch, worn brake pads, or a transmission issue, our team at Edwardstown provides fast, honest service with fixed-price quotes.", "marks": [] }],
    "markDefs": []
  },
  {
    "_key": "block-h2-1",
    "_type": "block",
    "style": "h2",
    "children": [{ "_type": "span", "text": "Services We Provide to Elizabeth Customers", "marks": [] }],
    "markDefs": []
  },
  {
    "_key": "block-2",
    "_type": "block",
    "style": "normal",
    "children": [
      { "_type": "span", "text": "We provide ", "marks": [] },
      { "_type": "span", "text": "clutch replacement", "marks": ["strong"] },
      { "_type": "span", "text": ", ", "marks": [] },
      { "_type": "span", "text": "brake pad and rotor service", "marks": ["strong"] },
      { "_type": "span", "text": ", flywheel machining, and transmission repairs for all makes and models.", "marks": [] }
    ],
    "markDefs": []
  },
  {
    "_key": "block-h2-2",
    "_type": "block",
    "style": "h2",
    "children": [{ "_type": "span", "text": "Free Pickup Available", "marks": [] }],
    "markDefs": []
  },
  {
    "_key": "block-3",
    "_type": "block",
    "style": "normal",
    "children": [
      { "_type": "span", "text": "We offer free local pickup and drop-off for Elizabeth and surrounding suburbs. ", "marks": [] },
      { "_type": "span", "text": "Book via our contact page", "marks": ["link-1"] },
      { "_type": "span", "text": " or call (08) 8277 8122.", "marks": [] }
    ],
    "markDefs": [
      { "_key": "link-1", "_type": "link", "href": "/contact", "blank": false }
    ]
  }
]
\`\`\`

---

## faqItems

Add 3-5 location-specific FAQs. Questions should reference the specific suburb or region by name.

\`\`\`json
"faqItems": [
  {
    "_key": "faq-1",
    "question": "Do you service vehicles from Elizabeth?",
    "answer": "Yes, All Clutch & Brake regularly services customers from Elizabeth and the northern Adelaide region. We offer free pickup and drop-off for customers who cannot drive their vehicle to our Edwardstown workshop."
  },
  {
    "_key": "faq-2",
    "question": "How far is All Clutch & Brake from Elizabeth?",
    "answer": "Our Edwardstown workshop is approximately 25 km south of Elizabeth — about 25 minutes by car. We also offer free local pickup so you do not need to arrange your own transport."
  },
  {
    "_key": "faq-3",
    "question": "What clutch and brake services do you provide to northern Adelaide customers?",
    "answer": "We provide clutch replacement, brake pad and rotor replacement, flywheel machining, transmission repairs, and brake fluid replacement for all vehicle makes. We service all northern Adelaide suburbs including Elizabeth, Salisbury, Mawson Lakes, and Tea Tree Gully."
  }
]
\`\`\`
`,

  testimonial: `# All Clutch & Brake — Testimonial Schema Guide

---

## Top-Level Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| \`_type\` | string | YES | Always \`"testimonial"\` |
| \`customerName\` | string | YES | Full name or first name + last initial. E.g. \`"John Smith"\` or \`"Sarah T."\` |
| \`rating\` | number | YES | Integer 1-5. |
| \`testimonial\` | string | YES | Review text, max 500 chars. Keep it authentic — mention the specific service, experience, and outcome. |
| \`date\` | string | YES | YYYY-MM-DD format. E.g. \`"2026-05-20"\` |
| \`suburb\` | string | — | Customer's suburb. Adds local trust signals. E.g. \`"Golden Grove"\` |
| \`vehicleType\` | string | — | Vehicle make/model. E.g. \`"2018 Toyota RAV4"\`, \`"Ford Ranger XLT"\` |
| \`featured\` | boolean | — | \`true\` = show in homepage carousel. Use sparingly — pick the best 4-6 reviews. |
| \`source\` | string | — | Where the review came from. One of: \`google\` / \`facebook\` / \`email\` / \`in-person\` / \`other\` |
| \`verified\` | boolean | — | \`true\` if you can confirm this is a real customer. |

---

## Example

\`\`\`json
{
  "_type": "testimonial",
  "customerName": "Sarah T.",
  "suburb": "Golden Grove",
  "vehicleType": "2018 Toyota RAV4",
  "rating": 5,
  "testimonial": "Brought my RAV4 in for a brake and clutch check after noticing the pedal felt different. They diagnosed a worn clutch disc and replaced it same day. The car drives like new and the team was upfront about cost the whole time. Will not take my car anywhere else.",
  "featured": true,
  "date": "2026-05-20",
  "source": "google",
  "verified": true
}
\`\`\`

### Multiple testimonials in one import

When importing a batch, wrap them in an array:

\`\`\`json
[
  {
    "_type": "testimonial",
    "customerName": "Sarah T.",
    "suburb": "Golden Grove",
    "vehicleType": "2018 Toyota RAV4",
    "rating": 5,
    "testimonial": "Brought my RAV4 in for a brake and clutch check. Diagnosed and replaced same day. Car drives like new.",
    "featured": true,
    "date": "2026-05-20",
    "source": "google",
    "verified": true
  },
  {
    "_type": "testimonial",
    "customerName": "James R.",
    "suburb": "Modbury",
    "vehicleType": "2020 Ford Ranger",
    "rating": 5,
    "testimonial": "Had my Ranger's clutch replaced after it started slipping under load. Quick turnaround and the price matched the quote exactly. Very happy.",
    "featured": false,
    "date": "2026-04-11",
    "source": "facebook",
    "verified": true
  }
]
\`\`\`
`,

  project: `# All Clutch & Brake — Project Schema Guide

---

## Top-Level Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| \`_type\` | string | YES | Always \`"project"\` |
| \`title\` | string | YES | Project title. Specific and descriptive. E.g. \`"AP6 Valiant Clutch Rebuild"\` |
| \`slug.current\` | string | YES | URL slug. E.g. \`"ap6-valiant-clutch-rebuild"\` → /projects/ap6-valiant-clutch-rebuild |
| \`description\` | string | YES | Plain text description of the job — vehicle, problem, work performed, parts used, outcome. 100-400 words. |
| \`tags\` | string[] | — | Project category tags. Use the tag options below. |
| \`order\` | number | — | Display order. Lower = appears first. |

NOTE: \`images\` cannot be set via JSON import — add project photos manually in Sanity Studio after import.

---

## tag options

\`Clutch Replacement\` \`Flywheel Machining\` \`Transmission Rebuild\` \`Brake Overhaul\`
\`Performance Build\` \`Race Preparation\` \`Classic / Vintage\` \`4WD Upgrade\` \`Custom Work\`
\`Brake Pipe Fabrication\` \`Dual-Mass Flywheel Conversion\` \`Heavy Duty Upgrade\`

---

## Example

\`\`\`json
{
  "_type": "project",
  "title": "AP6 Valiant Full Clutch & Brake Rebuild",
  "slug": { "current": "ap6-valiant-clutch-brake-rebuild" },
  "description": "A customer brought in their numbers-matching AP6 Valiant for a full clutch and brake overhaul ahead of a club rally season. The original single-plate clutch had been slipping under load, and the drums had worn beyond the serviceable limit. The clutch was replaced with a heavy-duty single-plate unit rated for the rebuilt 245 cubic inch Hemi-6. Front and rear drums were machined back within tolerance, fitted with new high-friction shoes, and all wheel cylinders were rebuilt with fresh seals. The brake master cylinder was also sleeved and resealed. The car left with crisp, progressive braking and a clutch that engages cleanly throughout the rev range — exactly as the factory intended.",
  "tags": ["Classic / Vintage", "Clutch Replacement", "Brake Overhaul", "Custom Work"],
  "order": 3
}
\`\`\`

### Multiple projects in one import

\`\`\`json
[
  {
    "_type": "project",
    "title": "AP6 Valiant Full Clutch & Brake Rebuild",
    "slug": { "current": "ap6-valiant-clutch-brake-rebuild" },
    "description": "Full clutch and drum brake overhaul on a numbers-matching AP6 Valiant ahead of the club rally season...",
    "tags": ["Classic / Vintage", "Clutch Replacement", "Brake Overhaul"],
    "order": 1
  },
  {
    "_type": "project",
    "title": "S13 Nissan 180SX Track Prep — Clutch & Brake Upgrade",
    "slug": { "current": "s13-180sx-track-prep" },
    "description": "Customer preparing their S13 for club track days. Fitted a heavy-duty clutch kit and upgraded to braided brake lines with fresh fluid and pad compound suited to track temperatures...",
    "tags": ["Performance Build", "Race Preparation", "Clutch Replacement", "Brake Overhaul"],
    "order": 2
  }
]
\`\`\`
`,

  promotion: `# All Clutch & Brake — Promotion Schema Guide

---

## Top-Level Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| \`_type\` | string | YES | Always \`"promotion"\` |
| \`title\` | string | YES | Promotion title, max 80 chars |
| \`description\` | string | YES | Short compelling description, max 250 chars |
| \`startDate\` | string | YES | YYYY-MM-DD — promotion becomes active on this date |
| \`endDate\` | string | YES | YYYY-MM-DD — promotion auto-hides after this date |
| \`discountType\` | string | — | \`percentage\` / \`dollar\` / \`free\` / \`package\` / \`other\` |
| \`discountValue\` | string | — | Displayed value. E.g. \`"15%"\` or \`"$50 off"\` or \`"Free brake inspection"\` |
| \`ctaLabel\` | string | — | Button label. E.g. \`"Claim This Offer"\`, \`"Book Now"\`, \`"Get a Quote"\` |
| \`ctaLink\` | string | — | Path or URL. E.g. \`"/contact"\` or \`"/services/clutch-replacement"\` |
| \`featured\` | boolean | — | \`true\` = show prominently on homepage |
| \`bannerStyle\` | string | — | \`default\` (orange) / \`urgent\` (red) / \`premium\` (dark) / \`subtle\` (light) |
| \`active\` | boolean | — | Manual on/off switch independent of dates. Set \`false\` to hide without deleting. |
| \`termsAndConditions\` | string | — | Fine print displayed under the offer |

---

## Example

\`\`\`json
{
  "_type": "promotion",
  "title": "Winter Special: Free Brake Inspection with Every Clutch Job",
  "description": "Book your clutch replacement this June or July and receive a full brake inspection at no extra charge. All makes and models. Bookings essential.",
  "discountType": "free",
  "discountValue": "Free brake inspection (valued at $80)",
  "startDate": "2026-06-01",
  "endDate": "2026-07-31",
  "ctaLabel": "Book Now",
  "ctaLink": "/contact",
  "featured": true,
  "bannerStyle": "urgent",
  "active": true,
  "termsAndConditions": "Valid for new bookings only. Cannot be combined with other offers. Applies to full clutch replacement jobs only. Bookings essential — call (08) 8277 8122."
}
\`\`\`
`,

  productPage: `# All Clutch & Brake — Product Page Schema Guide

---

## Top-Level Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| \`_type\` | string | YES | Always \`"productPage"\` |
| \`title\` | string | YES | Page title used in navigation and metadata |
| \`slug.current\` | string | YES | URL slug. E.g. \`"brake-pipes"\` → /products/brake-pipes |
| \`heading\` | string | YES | H1 heading displayed at the top of the page |
| \`introText\` | string | — | Introductory paragraph. 2-4 sentences explaining what the page covers. |
| \`detailedDescription\` | string | — | In-depth description of the product — materials, specs, process, applications. 4-8 sentences. |
| \`specifications\` | string[] | — | Bullet point list of specs or available options |
| \`sections\` | array | — | Repeatable heading + content sections for breaking up the page |
| \`ctaHeading\` | string | — | CTA section heading at the bottom of the page |
| \`ctaText\` | string | — | CTA supporting text, 1-2 sentences |
| \`ctaButtonLabel\` | string | — | Button label. E.g. \`"Get a Quote"\`, \`"Contact Us"\` |
| \`ctaButtonLink\` | string | — | Path or URL. E.g. \`"/contact"\` |
| \`seoTitle\` | string | — | Max 60 chars |
| \`seoDescription\` | string | — | Max 155 chars |

NOTE: \`heroImage\` cannot be set via JSON import — upload the image manually in Sanity Studio after import.

---

## sections — Repeatable Content Sections

Each section has a heading and a plain text content field. Add as many sections as needed to cover different product types, variants, or use cases.

\`\`\`json
"sections": [
  {
    "_key": "section-1",
    "heading": "Steel Brake Pipes",
    "content": "Our steel brake pipes are manufactured to OEM specifications and are available in standard lengths or cut and flared to any custom length. Suitable for all standard road vehicles."
  },
  {
    "_key": "section-2",
    "heading": "Stainless Steel Pipes",
    "content": "For performance builds and show vehicles, stainless steel brake pipes offer superior corrosion resistance and a polished finish. Available in 3/16 and 1/4 inch bore."
  },
  {
    "_key": "section-3",
    "heading": "Cunifer (Copper-Nickel) Pipes",
    "content": "Cunifer pipes are the preferred choice for marine and coastal environments where corrosion is a concern. Easier to bend and flare than steel, with excellent longevity."
  }
]
\`\`\`

---

## Full Example

\`\`\`json
{
  "_type": "productPage",
  "title": "Brake Pipes",
  "slug": { "current": "brake-pipes" },
  "heading": "Brake Pipes — Cut, Flared & Fitted to Any Vehicle",
  "introText": "All Clutch & Brake stocks and fabricates brake pipes for all vehicle types. Whether you need a straight replacement or a custom run for a classic or modified vehicle, we cut and flare to any length on-site.",
  "detailedDescription": "Brake pipes are a safety-critical component that corrodes over time, particularly on older vehicles and those used in coastal or high-humidity environments. We stock steel, stainless steel, and cunifer (copper-nickel) pipe in 3/16 and 1/4 inch bore. All pipes are double-flared to Australian standards and pressure-tested before fitting. We can fabricate single pipes or complete replacement sets for any vehicle.",
  "specifications": [
    "Available in 3/16\\\" and 1/4\\\" bore",
    "Steel, stainless steel, and cunifer options",
    "Cut and double-flared to any custom length",
    "Pressure-tested before installation",
    "Suits all domestic and imported vehicles"
  ],
  "sections": [
    {
      "_key": "section-1",
      "heading": "Steel Brake Pipes",
      "content": "Standard OEM-spec steel pipes for everyday road vehicles. Cost-effective and reliable for most applications."
    },
    {
      "_key": "section-2",
      "heading": "Stainless Steel Pipes",
      "content": "For show vehicles and performance builds where appearance and corrosion resistance matter. Available polished or brushed finish."
    }
  ],
  "ctaHeading": "Need a Brake Pipe Fabricated?",
  "ctaText": "Bring your vehicle in or call ahead with your make, model, and year. We fabricate and fit same day in most cases.",
  "ctaButtonLabel": "Get a Quote",
  "ctaButtonLink": "/contact",
  "seoTitle": "Brake Pipes Adelaide — Cut, Flared & Fitted | All Clutch & Brake",
  "seoDescription": "Custom brake pipe fabrication in Adelaide. Steel, stainless, and cunifer. Cut and double-flared to any length. All Clutch & Brake, Edwardstown SA."
}
\`\`\`
`,

  staff: `# All Clutch & Brake — Staff Member Schema Guide

---

## Top-Level Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| \`_type\` | string | YES | Always \`"staff"\` |
| \`name\` | string | YES | Full name. E.g. \`"Michael Farzan"\` |
| \`role\` | string | YES | Job title. E.g. \`"Head Mechanic"\`, \`"Service Manager"\`, \`"Brake & Clutch Technician"\` |
| \`bio\` | string | — | Background, experience, specialties, or something personal. 2-4 sentences. |
| \`order\` | number | — | Controls display order on the Meet Our Staff page. Lower = appears first. |

NOTE: \`photo\` cannot be set via JSON import — upload the staff member's photo manually in Sanity Studio after import.

---

## Bio writing guide

A good bio is specific and human. Include:
- How long they have been with the business or in the industry
- Their specialties or vehicle types they love working on
- A personal detail or philosophy that makes them feel real

---

## Example

\`\`\`json
{
  "_type": "staff",
  "name": "Michael Farzan",
  "role": "Head Mechanic",
  "bio": "Michael has over 20 years of experience in clutch and brake repairs and has been with All Clutch & Brake since 2008. He specialises in high-performance clutch builds, dual-mass flywheel conversions, and vintage vehicle restorations. Outside the workshop, Michael competes in club-level motorsport with a heavily modified S13 Silvia.",
  "order": 1
}
\`\`\`

### Multiple staff in one import

\`\`\`json
[
  {
    "_type": "staff",
    "name": "Michael Farzan",
    "role": "Head Mechanic",
    "bio": "Michael has over 20 years of experience and specialises in high-performance clutch builds and vintage restorations.",
    "order": 1
  },
  {
    "_type": "staff",
    "name": "David Chen",
    "role": "Brake Technician",
    "bio": "David joined the team in 2019 and has a particular interest in brake system upgrades for 4WDs and touring vehicles. He holds a Certificate III in Automotive Technology.",
    "order": 2
  }
]
\`\`\`
`,

  certification: `# All Clutch & Brake — Certification / Affiliation Schema Guide

---

## Top-Level Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| \`_type\` | string | YES | Always \`"certification"\` |
| \`name\` | string | YES | Full certification or membership name. E.g. \`"MTA Member"\` |
| \`abbreviation\` | string | — | Short form. E.g. \`"MTA"\`, \`"VACC"\`, \`"AAA"\` |
| \`description\` | string | — | What this certification means and why it matters to customers. 2-3 sentences. |
| \`issuer\` | string | — | Full name of the issuing organisation. E.g. \`"Motor Trade Association of South Australia"\` |
| \`externalLink\` | string | — | URL to the issuer's website or verification page. |
| \`certificateNumber\` | string | — | Membership or certificate number. Leave empty if not applicable. |
| \`dateObtained\` | string | — | Date first obtained in YYYY-MM-DD format. |
| \`expiryDate\` | string | — | Expiry date in YYYY-MM-DD format. Leave empty if it does not expire. |
| \`showInFooter\` | boolean | — | \`true\` = display this badge in the footer trust section. |
| \`showOnAboutPage\` | boolean | — | \`true\` = display on the About page certifications section. |
| \`displayOrder\` | number | — | Controls display order. Lower = appears first. |

NOTE: \`logo\` cannot be set via JSON import — upload the certification badge image manually in Sanity Studio after import.

---

## Example

\`\`\`json
{
  "_type": "certification",
  "name": "MTA Member",
  "abbreviation": "MTA",
  "description": "All Clutch & Brake is a member of the Motor Trade Association of South Australia — the peak industry body representing automotive repairers in SA. MTA membership signals adherence to industry standards, fair trading, and professional conduct.",
  "issuer": "Motor Trade Association of South Australia",
  "externalLink": "https://www.mtasa.com.au",
  "certificateNumber": "MTA-12345",
  "dateObtained": "2010-01-01",
  "expiryDate": "",
  "showInFooter": true,
  "showOnAboutPage": true,
  "displayOrder": 1
}
\`\`\`

### Multiple certifications in one import

\`\`\`json
[
  {
    "_type": "certification",
    "name": "MTA Member",
    "abbreviation": "MTA",
    "description": "Member of the Motor Trade Association of South Australia — the peak body for automotive repairers in SA.",
    "issuer": "Motor Trade Association of South Australia",
    "externalLink": "https://www.mtasa.com.au",
    "showInFooter": true,
    "showOnAboutPage": true,
    "displayOrder": 1
  },
  {
    "_type": "certification",
    "name": "VACC Accredited Repairer",
    "abbreviation": "VACC",
    "description": "VACC accreditation recognises repairers who meet strict standards for training, equipment, and customer service. It is one of the most respected credentials in the Australian automotive industry.",
    "issuer": "Victorian Automobile Chamber of Commerce",
    "externalLink": "https://www.vacc.com.au",
    "showInFooter": true,
    "showOnAboutPage": true,
    "displayOrder": 2
  }
]
\`\`\`
`,
}

// ─── AI Prompt ─────────────────────────────────────────────────────────────────

function buildPrompt(label: string): string {
  return `You have been given two files:
1. A Sanity CMS JSON template for an All Clutch & Brake document (acb-${label.toLowerCase().replace(/ /g, "-")}-template.json)
2. A schema guide explaining the exact shape of every field and block type (acb-${label.toLowerCase().replace(/ /g, "-")}-schema-guide.md)

Please fill in every field in the JSON template using the content notes below. Follow the schema guide exactly for all block types — do not guess or invent field structures. For any field marked [REQUIRED], make sure it has a real value. Remove ALL _instructions fields from the output. Return only the completed, valid JSON — nothing else.

[PASTE YOUR CONTENT NOTES HERE]`
}

// ─── Download helpers ──────────────────────────────────────────────────────────

function downloadJSON(data: object, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── Validation helpers ────────────────────────────────────────────────────────

interface ValidationResult {
  valid: boolean
  warnings: string[]
  errors: string[]
  docType: string | null
  cleanDoc: Record<string, unknown> | null
}

function validateImport(raw: string, expectedType: DocType): ValidationResult {
  const warnings: string[] = []
  const errors: string[] = []

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { valid: false, warnings, errors: ["Invalid JSON — could not parse. Check for missing commas or brackets."], docType: null, cleanDoc: null }
  }

  // Check _type
  const docType = parsed._type as string | undefined
  if (!docType) {
    errors.push("Missing required field: _type")
  } else if (docType !== expectedType) {
    warnings.push(`_type is "${docType}" but selected document type is "${expectedType}". Proceeding with import.`)
  }

  // Remove all _instructions_* and metadata fields
  const clean: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(parsed)) {
    if (key.startsWith("_instructions")) continue
    if (key === "_id" || key === "_rev" || key === "_createdAt" || key === "_updatedAt") continue
    clean[key] = value
  }

  // Strip _instructions from nested arrays recursively
  function stripInstructions(obj: unknown): unknown {
    if (Array.isArray(obj)) return obj.map(stripInstructions)
    if (obj && typeof obj === "object") {
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
        if (k.startsWith("_instructions")) continue
        out[k] = stripInstructions(v)
      }
      return out
    }
    return obj
  }

  const cleanDoc = stripInstructions(clean) as Record<string, unknown>

  // Check required fields per type
  if (expectedType === "post") {
    if (!cleanDoc.title) errors.push("Missing required field: title")
    if (!cleanDoc.answerCapsule) errors.push("Missing required field: answerCapsule")
    if (!(cleanDoc.slug as any)?.current) errors.push("Missing required field: slug.current")
  }
  if (expectedType === "service") {
    if (!cleanDoc.title) errors.push("Missing required field: title")
    if (!cleanDoc.answerCapsule) errors.push("Missing required field: answerCapsule")
  }
  if (expectedType === "testimonial") {
    if (!cleanDoc.customerName) errors.push("Missing required field: customerName")
    if (!cleanDoc.testimonial) errors.push("Missing required field: testimonial")
    if (!cleanDoc.rating) errors.push("Missing required field: rating")
  }
  if (expectedType === "location") {
    if (!cleanDoc.title) errors.push("Missing required field: title")
    if (!cleanDoc.answerCapsule) errors.push("Missing required field: answerCapsule")
    if (!(cleanDoc.slug as any)?.current) errors.push("Missing required field: slug.current")
  }
  if (expectedType === "project") {
    if (!cleanDoc.title) errors.push("Missing required field: title")
    if (!(cleanDoc.slug as any)?.current) errors.push("Missing required field: slug.current")
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
    docType: docType ?? null,
    cleanDoc: errors.length === 0 ? cleanDoc : null,
  }
}

// ─── Main Tool Component ───────────────────────────────────────────────────────

function ImportExportTool() {
  const client = useClient({ apiVersion: "2024-01-01" })
  const [selectedType, setSelectedType] = useState<DocType>("post")
  const [jsonInput, setJsonInput] = useState("")
  const [promptCopied, setPromptCopied] = useState(false)
  const [importStatus, setImportStatus] = useState<"idle" | "reviewing" | "importing" | "success" | "error">("idle")
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [importError, setImportError] = useState("")

  const selectedLabel = DOCUMENT_TYPES.find((d) => d.value === selectedType)?.label ?? ""
  const slug = selectedLabel.toLowerCase().replace(/ /g, "-")

  function handleCopyPrompt() {
    navigator.clipboard.writeText(buildPrompt(selectedLabel)).then(() => {
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 2000)
    })
  }

  function handleReview() {
    if (!jsonInput.trim()) return
    const result = validateImport(jsonInput, selectedType)
    setValidation(result)
    setImportStatus("reviewing")
    setImportError("")
  }

  async function handleImport() {
    if (!validation?.valid || !validation.cleanDoc) return
    setImportStatus("importing")
    setImportError("")

    try {
      const doc = {
        ...validation.cleanDoc,
        _type: selectedType,
      }

      await client.create(doc)
      setImportStatus("success")
      setJsonInput("")
      setValidation(null)
    } catch (err) {
      setImportStatus("error")
      setImportError((err as Error).message)
    }
  }

  function handleReset() {
    setImportStatus("idle")
    setValidation(null)
    setJsonInput("")
    setImportError("")
  }

  // ─── Styles (inline — no external CSS dependency) ──────────────────────────

  const s = {
    page: {
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e8e8e8",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: "0 0 80px 0",
    } as React.CSSProperties,

    header: {
      borderBottom: "1px solid #1e1e1e",
      padding: "32px 40px 28px",
    } as React.CSSProperties,

    headerTitle: {
      fontSize: 22,
      fontWeight: 700,
      color: "#ffffff",
      margin: 0,
      letterSpacing: "-0.02em",
    } as React.CSSProperties,

    headerSubtitle: {
      fontSize: 13,
      color: "#6b6b6b",
      margin: "6px 0 0",
      lineHeight: 1.5,
    } as React.CSSProperties,

    body: {
      maxWidth: 780,
      margin: "0 auto",
      padding: "32px 40px",
    } as React.CSSProperties,

    label: {
      display: "block",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      color: "#6b6b6b",
      marginBottom: 8,
    } as React.CSSProperties,

    select: {
      width: "100%",
      background: "#141414",
      border: "1px solid #2a2a2a",
      borderRadius: 6,
      color: "#e8e8e8",
      fontSize: 14,
      padding: "10px 14px",
      cursor: "pointer",
      outline: "none",
      appearance: "auto" as const,
    } as React.CSSProperties,

    card: {
      background: "#111111",
      border: "1px solid #1e1e1e",
      borderRadius: 10,
      padding: "24px 28px",
      marginBottom: 16,
    } as React.CSSProperties,

    stepTag: {
      display: "inline-block",
      fontSize: 9,
      fontWeight: 800,
      letterSpacing: "0.12em",
      textTransform: "uppercase" as const,
      color: "#6b6b6b",
      marginBottom: 10,
    } as React.CSSProperties,

    cardTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: "#ffffff",
      margin: "0 0 6px",
      letterSpacing: "-0.01em",
    } as React.CSSProperties,

    cardDesc: {
      fontSize: 12,
      color: "#6b6b6b",
      lineHeight: 1.6,
      margin: "0 0 20px",
    } as React.CSSProperties,

    btnRow: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap" as const,
    } as React.CSSProperties,

    btnPrimary: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      background: "#4f46e5",
      color: "#ffffff",
      border: "none",
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 600,
      padding: "9px 16px",
      cursor: "pointer",
      letterSpacing: "-0.01em",
    } as React.CSSProperties,

    btnSecondary: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      background: "#1e1e1e",
      color: "#e8e8e8",
      border: "1px solid #2a2a2a",
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 600,
      padding: "9px 16px",
      cursor: "pointer",
      letterSpacing: "-0.01em",
    } as React.CSSProperties,

    btnSuccess: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      background: "#166534",
      color: "#bbf7d0",
      border: "1px solid #15803d",
      borderRadius: 6,
      fontSize: 13,
      fontWeight: 600,
      padding: "9px 16px",
      cursor: "default",
      letterSpacing: "-0.01em",
    } as React.CSSProperties,

    promptBox: {
      background: "#0d0d0d",
      border: "1px solid #2a2a2a",
      borderRadius: 6,
      padding: "16px 18px",
      fontSize: 12,
      color: "#a0a0a0",
      lineHeight: 1.7,
      fontFamily: "monospace",
      whiteSpace: "pre-wrap" as const,
      marginBottom: 14,
    } as React.CSSProperties,

    textarea: {
      width: "100%",
      minHeight: 180,
      background: "#0d0d0d",
      border: "1px solid #2a2a2a",
      borderRadius: 6,
      color: "#e8e8e8",
      fontSize: 12,
      fontFamily: "monospace",
      padding: "14px 16px",
      resize: "vertical" as const,
      outline: "none",
      boxSizing: "border-box" as const,
      lineHeight: 1.6,
    } as React.CSSProperties,

    validationBox: {
      background: "#0d0d0d",
      border: "1px solid #2a2a2a",
      borderRadius: 8,
      padding: "18px 20px",
      marginBottom: 16,
    } as React.CSSProperties,

    validRow: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 6,
      fontSize: 13,
    } as React.CSSProperties,

    dot: (color: string) =>
      ({
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      } as React.CSSProperties),

    successBanner: {
      background: "#052e16",
      border: "1px solid #166534",
      borderRadius: 8,
      padding: "18px 20px",
      fontSize: 14,
      color: "#bbf7d0",
      lineHeight: 1.5,
    } as React.CSSProperties,

    errorBanner: {
      background: "#1c0a0a",
      border: "1px solid #7f1d1d",
      borderRadius: 8,
      padding: "14px 18px",
      fontSize: 13,
      color: "#fca5a5",
      lineHeight: 1.5,
    } as React.CSSProperties,

    divider: {
      border: "none",
      borderTop: "1px solid #1e1e1e",
      margin: "28px 0",
    } as React.CSSProperties,
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.headerTitle}>JSON Import / Export</h1>
        <p style={s.headerSubtitle}>
          Download a blank template for any document type, fill it in using AI, then import the completed JSON
          to instantly create the document in Sanity — no manual typing required.
        </p>
      </div>

      <div style={s.body}>
        {/* Document Type Selector */}
        <div style={{ marginBottom: 32 }}>
          <label style={s.label} htmlFor="doctype-select">
            Document Type
          </label>
          <select
            id="doctype-select"
            style={s.select}
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as DocType)
              handleReset()
            }}
          >
            {DOCUMENT_TYPES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Step 1 — Download */}
        <div style={s.card}>
          <span style={s.stepTag}>Step 1 — Export Template &amp; Schema Guide</span>
          <h2 style={s.cardTitle}>Download both files for {selectedLabel}</h2>
          <p style={s.cardDesc}>
            Give both files to Claude or ChatGPT along with your content notes. The JSON template is what
            gets filled in and uploaded. The schema guide tells the AI exactly how to format every field and
            block type — no guessing, no data loss.
          </p>
          <div style={s.btnRow}>
            <button
              style={s.btnPrimary}
              onClick={() => downloadJSON(TEMPLATES[selectedType], `acb-${slug}-template.json`)}
            >
              &#8595; JSON Template
            </button>
            <button
              style={s.btnSecondary}
              onClick={() =>
                downloadMarkdown(SCHEMA_GUIDES[selectedType], `acb-${slug}-schema-guide.md`)
              }
            >
              &#8595; Schema Guide (.md)
            </button>
          </div>
        </div>

        {/* Step 2 — AI Prompt */}
        <div style={s.card}>
          <span style={s.stepTag}>Step 2 — Fill With AI</span>
          <h2 style={s.cardTitle}>Paste this prompt into Claude or ChatGPT along with the template and your content:</h2>
          <div style={s.promptBox}>{buildPrompt(selectedLabel)}</div>
          <button
            style={promptCopied ? { ...s.btnPrimary, background: "#166534" } : s.btnPrimary}
            onClick={handleCopyPrompt}
          >
            {promptCopied ? "Copied!" : "Copy Prompt"}
          </button>
        </div>

        {/* Step 3 — Import */}
        <div style={s.card}>
          <span style={s.stepTag}>Step 3 — Import Filled JSON</span>
          <h2 style={s.cardTitle}>Paste your completed JSON below</h2>
          <p style={s.cardDesc}>
            Paste the completed JSON from your AI, then click Review. All fields will be validated against
            the schema before import. Any missing required fields are flagged with an error — the import
            will not proceed until they are resolved.
          </p>

          {importStatus === "success" ? (
            <div style={s.successBanner}>
              Document created successfully. You can find it in the Studio under{" "}
              <strong>{selectedLabel}</strong>. Refresh the document list to see it.
              <br />
              <button style={{ ...s.btnSecondary, marginTop: 14 }} onClick={handleReset}>
                Import Another
              </button>
            </div>
          ) : (
            <>
              <textarea
                style={s.textarea}
                placeholder={`Paste your filled ${selectedLabel} JSON here...`}
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value)
                  if (importStatus === "reviewing") handleReset()
                }}
                spellCheck={false}
              />

              {/* Validation results */}
              {importStatus === "reviewing" && validation && (
                <div style={{ ...s.validationBox, marginTop: 14 }}>
                  {validation.errors.length === 0 && (
                    <div style={{ ...s.validRow, color: "#4ade80", marginBottom: 10 }}>
                      <span style={s.dot("#4ade80")} />
                      <strong>Validation passed</strong> — document is ready to import
                    </div>
                  )}

                  {validation.errors.map((err, i) => (
                    <div key={i} style={{ ...s.validRow, color: "#f87171" }}>
                      <span style={s.dot("#f87171")} />
                      {err}
                    </div>
                  ))}

                  {validation.warnings.map((w, i) => (
                    <div key={i} style={{ ...s.validRow, color: "#fbbf24" }}>
                      <span style={s.dot("#fbbf24")} />
                      {w}
                    </div>
                  ))}
                </div>
              )}

              {importStatus === "error" && (
                <div style={{ ...s.errorBanner, marginTop: 14 }}>
                  Import failed: {importError}
                </div>
              )}

              <div style={{ ...s.btnRow, marginTop: 14 }}>
                {importStatus !== "reviewing" && (
                  <button
                    style={jsonInput.trim() ? s.btnSecondary : { ...s.btnSecondary, opacity: 0.4, cursor: "not-allowed" }}
                    onClick={handleReview}
                    disabled={!jsonInput.trim()}
                  >
                    Review and Import
                  </button>
                )}

                {importStatus === "reviewing" && validation && (
                  <>
                    {validation.valid ? (
                      <button
                        style={importStatus === "importing" ? { ...s.btnPrimary, opacity: 0.6 } : s.btnPrimary}
                        onClick={handleImport}
                        disabled={importStatus === "importing"}
                      >
                        {importStatus === "importing" ? "Importing..." : "Confirm Import"}
                      </button>
                    ) : (
                      <button style={{ ...s.btnPrimary, opacity: 0.4, cursor: "not-allowed" }} disabled>
                        Fix errors before importing
                      </button>
                    )}
                    <button style={s.btnSecondary} onClick={handleReset}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Plugin definition ─────────────────────────────────────────────────────────

export const importExportTool = definePlugin({
  name: "import-export-tool",
  tools: [
    {
      name: "import-export",
      title: "Import / Export",
      component: ImportExportTool,
    },
  ],
})
