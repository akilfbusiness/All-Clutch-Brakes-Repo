// Post schema — the core content type for AEO/GEO blog posts
// Modelled on the CompGeek architecture: TL;DR box, quick answers per section,
// read time, related posts, data sources, and end CTA block.
// Every field maps directly to schema.org Article for structured data.

import { defineField, defineType } from "sanity"

export const postSchema = defineType({
  name: "post",
  title: "Blog",
  type: "document",
  fields: [
    // ─── CORE ──────────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Title (H1)",
      type: "string",
      description:
        "The post headline — used as the H1 on the page. Make it keyword-rich and specific (e.g. 'Clutch Replacement Cost Adelaide 2026').",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "Auto-generated from the title. Becomes the URL: /blog/[slug]",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Clutch Care", value: "Clutch Care" },
          { title: "Brake Safety", value: "Brake Safety" },
          { title: "Transmission", value: "Transmission" },
          { title: "How-To Guides", value: "How-To Guides" },
          { title: "Pricing & Costs", value: "Pricing & Costs" },
          { title: "Maintenance Tips", value: "Maintenance Tips" },
          { title: "Industry News", value: "Industry News" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      description: "Used in Article schema datePublished field.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last Updated Date",
      type: "datetime",
      description:
        "Update this whenever you edit the post. Used in Article schema dateModified and shown as 'Updated' on the page.",
    }),
    defineField({
      name: "readTimeMinutes",
      title: "Estimated Read Time (minutes)",
      type: "number",
      description:
        "Displayed as 'X min read' on the post card and hero. Rough guide: 200 words = 1 minute.",
      validation: (Rule) => Rule.min(1).max(60),
    }),
    defineField({
      name: "heroImage",
      title: "Hero / Featured Image",
      type: "image",
      description:
        "Main image for the post. Also used for Open Graph / social sharing. Recommended: 1200x630px.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Describe the image for screen readers and search engines.",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption (optional)",
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Used to link related posts and for topical authority. E.g. 'clutch', 'adelaide', 'manual-transmission'.",
      options: { layout: "tags" },
    }),
    defineField({
      name: "geoTags",
      title: "Location Tags",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Cities and regions this post is relevant to. E.g. 'Adelaide', 'South Australia', 'Edwardstown'. Powers local SEO.",
      options: { layout: "tags" },
    }),

    // ─── AEO CONTENT ───────────────────────────────────────────────────────────
    defineField({
      name: "answerCapsule",
      title: "Answer Capsule (TL;DR)",
      type: "text",
      rows: 3,
      description:
        "A direct 20-40 word answer to the post's core question. This is the text AI engines (ChatGPT, Google AI) will cite verbatim. Make it a complete, standalone sentence with specific data.",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "quickAnswers",
      title: "Quick Answers",
      type: "array",
      description:
        "2-5 key questions with short bolded answers. These are prime AI snippet targets — each answer should be self-contained (1-2 sentences with specific data).",
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
              description:
                "e.g. 'Clutch replacement in Adelaide costs $800–$2,500 depending on vehicle type and whether the flywheel needs machining.'",
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
      title: "Article Body",
      type: "array",
      description:
        "The full post content. Full creative freedom — headings, tables, callouts, comparisons, embeds, pull quotes, dividers, and more.",
      of: [
        // ── Standard rich text block ──────────────────────────────────────────
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
                    description: "Paste an external URL or internal path (e.g. /services/clutch-replacement)",
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

        // ── Image with caption + alt ──────────────────────────────────────────
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

        // ── Table (native custom block) ───────────────────────────────────────
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
              description: "One entry per column header. e.g. 'Vehicle Type', 'Cost Range', 'Labour Time'",
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

        // ── Callout Block ────────────────────────────────────────────────────
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

        // ── Comparison Block (Pros / Cons) ───────────────────────────────────
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

        // ── YouTube Embed ─────────────────────────────────────────────────────
        {
          type: "object",
          name: "youtubeEmbed",
          title: "YouTube Video",
          fields: [
            {
              name: "url",
              title: "YouTube URL",
              type: "url",
              description: "Paste the full YouTube URL (e.g. https://www.youtube.com/watch?v=xxxxx)",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "caption",
              title: "Caption (optional)",
              type: "string",
            },
          ],
          preview: {
            select: { title: "url", subtitle: "caption" },
            prepare({ title, subtitle }: any) {
              return { title: "YouTube Video", subtitle: subtitle ?? title }
            },
          },
        },

        // ── Pull Quote ────────────────────────────────────────────────────────
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
              description: "e.g. 'John Smith, Head Mechanic'",
            },
          ],
          preview: {
            select: { title: "quote", subtitle: "attribution" },
            prepare({ title, subtitle }: any) {
              return { title: `"${title}"`, subtitle }
            },
          },
        },

        // ── Horizontal Divider ────────────────────────────────────────────────
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
    }),

    // ─── FAQ ───────────────────────────────────────────────────────────────────
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      description:
        "3-8 questions and detailed answers. These generate FAQPage schema — the main source for AI citation and Google FAQ rich results.",
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
              description: "Write a complete answer (2-5 sentences). Include specific data, prices, or steps.",
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
      name: "relatedPosts",
      title: "Related Blog Posts (rich cards)",
      type: "array",
      description:
        "Select related blog posts to display as rich cards (with thumbnail and read time) at the bottom of this post. No limit — add as many as relevant.",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
        },
      ],
    }),
    defineField({
      name: "internalLinks",
      title: "Internal Links / Related Pages",
      type: "array",
      description:
        "Link to any page on the site for internal linking and topical authority. Use 'Existing Page' to search and select from your services, blog posts, and location pages — the URL resolves automatically. Use 'Custom Link' for any URL you want to enter manually (external pages, /contact, anchor links, etc.).",
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
              description: "Search by title — links to services, blog posts, location pages, and more.",
              to: [
                { type: "service" },
                { type: "post" },
                { type: "location" },
                { type: "page" },
              ],
              validation: Rule => Rule.required(),
            },
            {
              name: "labelOverride",
              title: "Label Override (optional)",
              type: "string",
              description: "Leave blank to use the page title. Fill in to override the link text.",
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
              validation: Rule => Rule.required(),
            },
            {
              name: "url",
              title: "URL / Path",
              type: "string",
              description: "Relative path or full URL",
              validation: Rule => Rule.required(),
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
      description:
        "List the sources used in this post (government sites, manufacturer specs, industry reports). Shown as a references section at the end.",
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

    // ─── END CTA ───────────────────────────────────────────────────────────────
    defineField({
      name: "ctaHeading",
      title: "End CTA Heading",
      type: "string",
      description:
        "Override the default CTA heading at the bottom of this post. Leave empty to use the site default.",
    }),
    defineField({
      name: "ctaBody",
      title: "End CTA Body Text",
      type: "text",
      rows: 2,
      description: "Override the default CTA body text. Leave empty to use the site default.",
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
    defineField({
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description:
        "Override hero image for social sharing. Leave empty to use the hero image. Recommended: 1200x630px.",
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "heroImage",
    },
  },

  orderings: [
    {
      title: "Published Date (Newest First)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
})
