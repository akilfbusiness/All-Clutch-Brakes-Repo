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
        "The full post content. Use H2/H3 headings, bullet lists, bold for key facts. Tables can be added as custom blocks.",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "caption",
              type: "string",
              title: "Caption (optional)",
            },
          ],
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
      title: "Related Blog Posts",
      type: "array",
      description: "Link up to 4 related posts. Shown at the bottom of the post for internal linking.",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
        },
      ],
      validation: (Rule) => Rule.max(4),
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
