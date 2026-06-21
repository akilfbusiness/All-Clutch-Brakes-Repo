// Location schema — covers both region pages and suburb spoke pages
// Used for hub-and-spoke local SEO: /locations/ hub + individual suburb pages

import { defineField, defineType } from "sanity"

export const locationSchema = defineType({
  name: "location",
  title: "Locations",
  type: "document",
  fields: [
    // ─── HERO ──────────────────────────────────────────────────────────────────
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Full-viewport background image shown in the hero section of this location page.",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Background Video",
      type: "file",
      description: "Optional looping background video. Upload MP4 (H.264, 1080p, 5–15 MB, no audio).",
      options: { accept: "video/mp4,video/webm" },
    }),

    // ─── CORE ──────────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Location Name",
      type: "string",
      description: "The suburb or region name. E.g. 'Norwood' or 'Northern Adelaide'.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageHeading",
      title: "Page Heading (H1)",
      type: "string",
      description: "Explicit H1 — keyword-rich, different from the location name. E.g. 'Clutch & Brake Repairs Near Norwood | All Clutch & Brake'.",
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "Becomes the URL: /locations/[slug]",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locationType",
      title: "Location Type",
      type: "string",
      options: {
        list: [
          { title: "Region (covers multiple suburbs)", value: "region" },
          { title: "Suburb (individual spoke page)", value: "suburb" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "region",
      title: "Parent Region",
      type: "string",
      description: "For suburb pages — which region does this suburb fall under?",
      options: {
        list: [
          { title: "Northern Adelaide", value: "northern-adelaide" },
          { title: "Southern Adelaide", value: "southern-adelaide" },
          { title: "Eastern Adelaide", value: "eastern-adelaide" },
          { title: "Western Adelaide", value: "western-adelaide" },
          { title: "CBD & Inner Suburbs", value: "cbd-and-inner-suburbs" },
          { title: "Barossa & Surrounds", value: "barossa-and-surrounds" },
          { title: "Fleurieu Peninsula", value: "fleurieu-peninsula" },
          { title: "Eyre Peninsula", value: "eyre-peninsula" },
          { title: "Limestone Coast", value: "limestone-coast" },
          { title: "Yorke & Mid North", value: "yorke-and-mid-north" },
        ],
      },
    }),
    defineField({
      name: "suburbsIncluded",
      title: "Suburbs Included (Region Pages)",
      type: "array",
      of: [{ type: "string" }],
      description: "For region pages — all suburbs in this region. Helps Google match suburb searches without individual spoke pages.",
      options: { layout: "tags" },
    }),
    defineField({
      name: "suburbsServed",
      title: "Adjacent Suburbs Served",
      type: "array",
      of: [{ type: "string" }],
      description: "2-4 nearby suburbs mentioned in the body copy. E.g. 'Kensington', 'Magill', 'St Peters'. Drives local keyword coverage.",
      options: { layout: "tags" },
    }),
    defineField({
      name: "driveTimeMinutes",
      title: "Drive Time from St Marys (minutes)",
      type: "number",
      description: "Approximate drive time from Unit 1/3 Adelaide Terrace, St Marys SA 5042. Used in body copy and schema.",
      validation: (Rule) => Rule.min(1).max(180),
    }),
    defineField({
      name: "updatedAt",
      title: "Last Updated Date",
      type: "datetime",
      description: "Update whenever this page is edited. Used in LocalBusiness schema dateModified.",
    }),

    // ─── AEO CONTENT ───────────────────────────────────────────────────────────
    defineField({
      name: "answerCapsule",
      title: "Answer Capsule (TL;DR)",
      type: "text",
      rows: 3,
      description:
        "Direct 40-60 word answer to 'Does All Clutch & Brake service [suburb]?' — minimum 40 words for AI citation eligibility. Include suburb name, specific service types, address, and a concrete fact (e.g. years of experience, distance). This is what AI engines (Google AI, Perplexity, ChatGPT) will cite verbatim.",
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: "quickAnswers",
      title: "Quick Answers",
      type: "array",
      description:
        "3-5 suburb-specific questions with short answers. Prime AI snippet targets — each answer should be self-contained with specific data (distance, price range, service types, landmarks).",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "quickAnswer",
              title: "Quick Answer (1-2 sentences, specific data)",
              type: "text",
              rows: 2,
              description: "e.g. 'All Clutch & Brake is 12 minutes from Norwood via Fullarton Road — free quotes, same-day diagnostics.'",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "question", subtitle: "quickAnswer" },
          },
        },
      ],
    }),

    // ─── BODY ──────────────────────────────────────────────────────────────────
    defineField({
      name: "body",
      title: "Page Content",
      type: "array",
      description: "Full location page content. Use headings, tables, callouts, comparisons, and pull quotes for GEO/AEO signal.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Block Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet List", value: "bullet" },
            { title: "Numbered List", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
              { title: "Strikethrough", value: "strike-through" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    description: "External URL or internal path (e.g. /services/clutch-replacement)",
                    validation: (Rule: any) =>
                      Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
                  },
                  {
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },

        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Required for accessibility and SEO.",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "caption",
              type: "string",
              title: "Caption (optional)",
            },
          ],
        },

        {
          type: "object",
          name: "tableBlock",
          title: "Table",
          fields: [
            {
              name: "caption",
              title: "Table Caption (optional)",
              type: "string",
            },
            {
              name: "headers",
              title: "Column Headers",
              type: "array",
              of: [{ type: "string" }],
              description: "One entry per column. e.g. 'Service', 'Typical Cost', 'Time to Complete'",
              validation: (Rule: any) => Rule.min(1),
            },
            {
              name: "rows",
              title: "Rows",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "tableRow",
                  title: "Row",
                  fields: [
                    {
                      name: "cells",
                      title: "Cells",
                      type: "array",
                      of: [{ type: "string" }],
                      description: "One entry per cell, matching column order.",
                    },
                  ],
                  preview: {
                    select: { cells: "cells" },
                    prepare({ cells }: any) {
                      return { title: Array.isArray(cells) ? cells.join(" | ") : "Row" }
                    },
                  },
                },
              ],
              validation: (Rule: any) => Rule.min(1),
            },
          ],
          preview: {
            select: { title: "caption", headers: "headers" },
            prepare({ title, headers }: any) {
              return {
                title: title ?? "Table",
                subtitle: Array.isArray(headers) ? `Columns: ${headers.join(", ")}` : "",
              }
            },
          },
        },

        {
          type: "object",
          name: "callout",
          title: "Callout Block",
          fields: [
            {
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Info", value: "info" },
                  { title: "Tip", value: "tip" },
                  { title: "Warning", value: "warning" },
                  { title: "Danger", value: "danger" },
                ],
                layout: "radio",
              },
              initialValue: "info",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "heading",
              title: "Heading (optional)",
              type: "string",
            },
            {
              name: "body",
              title: "Body Text",
              type: "text",
              rows: 3,
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "heading", subtitle: "body", type: "type" },
            prepare({ title, subtitle, type }: any) {
              const icons: Record<string, string> = { info: "ℹ️", tip: "✅", warning: "⚠️", danger: "🚨" }
              return { title: `${icons[type] ?? "📌"} ${title ?? "Callout"}`, subtitle }
            },
          },
        },

        {
          type: "object",
          name: "comparisonBlock",
          title: "Comparison Block",
          fields: [
            {
              name: "heading",
              title: "Heading (optional)",
              type: "string",
              description: "e.g. 'OEM vs Aftermarket Clutch Kits'",
            },
            {
              name: "leftLabel",
              title: "Left Column Label",
              type: "string",
              initialValue: "Pros",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "rightLabel",
              title: "Right Column Label",
              type: "string",
              initialValue: "Cons",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "leftPoints",
              title: "Left Column Points",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule: any) => Rule.min(1),
            },
            {
              name: "rightPoints",
              title: "Right Column Points",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule: any) => Rule.min(1),
            },
          ],
          preview: {
            select: { title: "heading", left: "leftLabel", right: "rightLabel" },
            prepare({ title, left, right }: any) {
              return { title: title ?? "Comparison", subtitle: `${left ?? "Left"} vs ${right ?? "Right"}` }
            },
          },
        },

        {
          type: "object",
          name: "pullQuote",
          title: "Pull Quote",
          fields: [
            {
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 2,
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "attribution",
              title: "Attribution (optional)",
              type: "string",
              description: "e.g. 'Tony, Head Mechanic — All Clutch & Brake'",
            },
          ],
          preview: {
            select: { title: "quote", subtitle: "attribution" },
            prepare({ title, subtitle }: any) {
              return { title: `"${title}"`, subtitle }
            },
          },
        },

        {
          type: "object",
          name: "divider",
          title: "Horizontal Divider",
          fields: [
            {
              name: "style",
              title: "Style",
              type: "string",
              options: {
                list: [
                  { title: "Line", value: "line" },
                  { title: "Spaced", value: "spaced" },
                ],
                layout: "radio",
              },
              initialValue: "line",
            },
          ],
          preview: {
            prepare() {
              return { title: "— Divider —" }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ─── FAQ ───────────────────────────────────────────────────────────────────
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      description:
        "6-8 suburb-specific questions. These generate FAQPage schema — the primary source for AI citation and Google FAQ rich results. Each answer must be 40-80 words with specific data.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 4,
              description: "40-80 words. Direct answer first sentence, then supporting detail (distance, routes, service types, pricing context).",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
    }),

    // ─── RELATED & SOURCES ─────────────────────────────────────────────────────
    defineField({
      name: "relatedServices",
      title: "Related Service Pages",
      type: "array",
      description: "Link to the 9 core service pages. These display as internal link cards and pass PageRank to your highest-authority pages.",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({
      name: "internalLinks",
      title: "Internal Links / Related Pages",
      type: "array",
      description: "Additional internal links — blog posts, other location pages, or custom paths.",
      of: [
        {
          type: "object",
          name: "internalLinkReference",
          title: "Existing Page (search & select)",
          fields: [
            {
              name: "linkType",
              type: "string",
              hidden: true,
              initialValue: "reference",
            },
            {
              name: "page",
              title: "Page",
              type: "reference",
              to: [
                { type: "service" },
                { type: "post" },
                { type: "location" },
                { type: "page" },
              ],
              validation: (Rule) => Rule.required(),
            },
            {
              name: "labelOverride",
              title: "Label Override (optional)",
              type: "string",
            },
            {
              name: "description",
              title: "Short Description (optional)",
              type: "string",
            },
          ],
          preview: {
            select: { title: "labelOverride", refTitle: "page.title", subtitle: "description" },
            prepare({ title, refTitle, subtitle }: { title?: string; refTitle?: string; subtitle?: string }) {
              return { title: title || refTitle || "Linked page", subtitle: subtitle || "Reference link" }
            },
          },
        },
        {
          type: "object",
          name: "internalLinkCustom",
          title: "Custom Link (manual URL)",
          fields: [
            {
              name: "linkType",
              type: "string",
              hidden: true,
              initialValue: "custom",
            },
            {
              name: "label",
              title: "Link Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL / Path",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              title: "Short Description (optional)",
              type: "string",
            },
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "dataSources",
      title: "Data Sources & Citations",
      type: "array",
      description: "Sources used on this page — Google Maps drive times, ABS suburb data, consumer rights references. Shown as footnotes.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Source Label",
              type: "string",
              description: "e.g. 'Australian Competition and Consumer Commission'",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),

    // ─── CTA ───────────────────────────────────────────────────────────────────
    defineField({
      name: "ctaHeading",
      title: "End CTA Heading",
      type: "string",
      description: "Override the default CTA heading for this location. E.g. 'Norwood Drivers — Book a Free Clutch Check Today'.",
    }),
    defineField({
      name: "ctaBody",
      title: "End CTA Body Text",
      type: "text",
      rows: 2,
      description: "Override the default CTA body text. Leave empty to use the site default.",
    }),

    // ─── TAXONOMY ──────────────────────────────────────────────────────────────
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Topic tags for related content linking. E.g. 'clutch', 'brakes', 'south-adelaide'.",
      options: { layout: "tags" },
    }),
    defineField({
      name: "geoTags",
      title: "Location Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "All suburbs and regions this page targets. Include the main suburb plus adjacent suburbs from suburbsServed. Powers local SEO.",
      options: { layout: "tags" },
    }),

    // ─── SEO ───────────────────────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Browser tab title and Google results. Max 60 characters.",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Appears in Google search results under the title. Max 155 characters.",
      validation: (Rule) => Rule.max(155),
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "locationType",
    },
  },
})