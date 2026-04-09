import { defineField, defineType } from "sanity"

export const projectSchema = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g. 'AP6 Valiant Build', 'S13.5 Track Car', 'Tiga Race Car'",
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "This becomes the URL: /projects/[slug]",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) =>
        Rule.required().assetRequired().custom((asset: any) => {
          if (asset?.asset?._ref) return true
          if (asset?.asset?.size && asset.asset.size > 5 * 1024 * 1024) {
            return "Image must be less than 5MB. Please compress your image before uploading."
          }
          return true
        }),
      description: "Main image shown in the projects grid and at the top of the project page. Max file size: 5MB.",
    }),
    defineField({
      name: "gallery",
      title: "Project Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional caption for this image.",
            },
          ],
          validation: (Rule) =>
            Rule.custom((asset: any) => {
              if (!asset) return true
              if (asset?.asset?._ref) return true
              if (asset?.asset?.size && asset.asset.size > 5 * 1024 * 1024) {
                return "Image must be less than 5MB. Please compress your image before uploading."
              }
              return true
            }),
        },
      ],
      description: "Additional project photos — before, during, after, detail shots, etc. Max file size per image: 5MB.",
    }),
    defineField({
      name: "description",
      title: "Project Description",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
      description: "Detailed description of the project, the work done, and the outcome.",
    }),
    defineField({
      name: "tags",
      title: "Project Tags / Categories",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g. 'Clutch Replacement', 'Transmission Build', 'Custom Work', 'Race Preparation'",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the order projects appear. Lower number = appears first.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "featuredImage",
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
})
