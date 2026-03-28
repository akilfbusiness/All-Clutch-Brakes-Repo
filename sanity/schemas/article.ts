// Article schema — the core content type for AEO/GEO articles
// Every field maps directly to a schema.org Article property
// so structured data is generated from real content, not hardcoded

import { defineField, defineType } from "sanity"

export const articleSchema = defineType({
  name: "article",
  title: "Articles",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The article headline — also used as the H1 on the page.",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "Auto-generated from the title. This becomes the URL: /articles/[slug]",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answerCapsule",
      title: "Answer Capsule",
      type: "text",
      rows: 2,
      description:
        "A direct 20-30 word answer to the article's core question. This is the text AI engines will cite. Make it a complete, standalone sentence.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "body",
      title: "Article Body",
      type: "array",
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
              description: "Describe the image for screen readers and search engines.",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      description: "3-5 questions and answers. These generate FAQPage schema for AI engines.",
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
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "NDIS Guides", value: "ndis-guides" },
          { title: "Services", value: "services" },
          { title: "Locations", value: "locations" },
          { title: "Tips & Support", value: "tips-support" },
          { title: "News", value: "news" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Used to link related articles. E.g. 'SIL', 'northern-adelaide', 'personal-care'",
      options: { layout: "tags" },
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
      description: "Used in Article schema dateModified field. Update this whenever you edit the article.",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Appears in the browser tab and Google results. Max 60 characters.",
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
      description: "Appears when this article is shared on social media or cited by AI. Recommended: 1200x630px",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "ogImage",
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
