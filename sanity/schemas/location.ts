// Location schema — covers both region pages and Tier 1 suburb pages
// The "locationType" field distinguishes between them

import { defineField, defineType } from "sanity"

export const locationSchema = defineType({
  name: "location",
  title: "Locations",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Full-viewport background image shown in the hero section of this location page. Leave empty for a plain background.",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Background Video",
      type: "file",
      description: "Optional looping background video for this location page hero. Upload an MP4 (H.264, 1080p, 5–15 MB, no audio).",
      options: { accept: "video/mp4,video/webm" },
    }),
    defineField({
      name: "title",
      title: "Location Name",
      type: "string",
      description: "E.g. 'Northern Adelaide' or 'Elizabeth'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "This becomes the URL: /locations/[slug]",
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
          { title: "Suburb (individual Tier 1 suburb)", value: "suburb" },
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
      title: "Suburbs Included",
      type: "array",
      of: [{ type: "string" }],
      description:
        "For region pages — list every suburb in this region. This is how Google finds those suburb searches without individual pages.",
      options: { layout: "tags" },
    }),
    defineField({
      name: "answerCapsule",
      title: "Answer Capsule",
      type: "text",
      rows: 2,
      description: "Direct answer to 'Does All Clutch & Brake service [location]?' — 20-30 words.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "body",
      title: "Page Content",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      description: "Location-specific FAQs. E.g. 'Is there SIL accommodation in Elizabeth?'",
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
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(155),
    }),
    defineField({
      name: "internalLinks",
      title: "Internal Links / Related Pages",
      type: "array",
      description:
        "Link to any page on the site for internal linking. Use 'Existing Page' to search and select — URL resolves automatically. Use 'Custom Link' for manual URLs.",
      of: [
        {
          type: "object",
          name: "internalLinkReference",
          title: "Existing Page (search & select)",
          fields: [
            { name: "linkType", type: "string", hidden: true, initialValue: "reference" },
            {
              name: "page",
              title: "Page",
              type: "reference",
              to: [{ type: "service" }, { type: "post" }, { type: "location" }, { type: "page" }],
              validation: Rule => Rule.required(),
            },
            { name: "labelOverride", title: "Label Override (optional)", type: "string" },
            { name: "description", title: "Short Description (optional)", type: "string" },
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
            { name: "linkType", type: "string", hidden: true, initialValue: "custom" },
            { name: "label", title: "Link Label", type: "string", validation: Rule => Rule.required() },
            { name: "url", title: "URL / Path", type: "string", validation: Rule => Rule.required() },
            { name: "description", title: "Short Description (optional)", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "locationType",
    },
  },
})
