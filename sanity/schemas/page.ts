// Generic Page schema — for pages that aren't services, locations, or articles
// Examples: About, Contact, Privacy Policy, Terms, custom landing pages

import { defineType, defineField } from "sanity"

export const pageSchema = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    // === Content Group ===
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      description: "The main title of the page. Used in the browser tab and as the H1.",
      validation: (Rule) => Rule.required().max(70),
      group: "content",
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "The URL path for this page (e.g., 'about-us' becomes /about-us).",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      description: "Optional heading that appears in the hero section. Falls back to Page Title if empty.",
      group: "content",
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "text",
      rows: 2,
      description: "Short description below the hero heading.",
      group: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      description: "Optional hero/banner image for the page.",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Page Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
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
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                  {
                    name: "openInNewTab",
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
              description: "Describe the image for accessibility and SEO.",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
      description: "The main content of the page. Supports rich text and images.",
      group: "content",
    }),

    // === SEO Group ===
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "SEO title. If empty, falls back to Page Title.",
      validation: (Rule) => Rule.max(70),
      group: "seo",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "SEO description for search engines. 150-160 characters ideal.",
      validation: (Rule) => Rule.max(160),
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description: "Image shown when the page is shared on social media.",
      group: "seo",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Search Engines",
      type: "boolean",
      description: "If enabled, search engines will not index this page.",
      initialValue: false,
      group: "seo",
    }),

    // === Settings Group ===
    defineField({
      name: "category",
      title: "Page Category",
      type: "string",
      description: "Helps organise pages in the CMS. Does not affect the URL.",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Legal", value: "legal" },
          { title: "Landing Page", value: "landing" },
          { title: "Support", value: "support" },
        ],
        layout: "dropdown",
      },
      initialValue: "general",
      group: "settings",
    }),
    defineField({
      name: "showInSitemap",
      title: "Show in Sitemap",
      type: "boolean",
      description: "Include this page in the XML sitemap.",
      initialValue: true,
      group: "settings",
    }),
    defineField({
      name: "publishedAt",
      title: "Publish Date",
      type: "datetime",
      description: "Optional publish date for sorting/display purposes.",
      group: "settings",
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      category: "category",
      media: "heroImage",
    },
    prepare({ title, slug, category, media }) {
      return {
        title: title || "Untitled Page",
        subtitle: `/${slug || "no-slug"} • ${category || "general"}`,
        media,
      }
    },
  },
})
