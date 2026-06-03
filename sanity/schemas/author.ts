// Author schema — used in Article schema for E-E-A-T signals
// Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
// requires real identifiable authors on health/disability content

import { defineField, defineType } from "sanity"

export const authorSchema = defineType({
  name: "author",
  title: "Authors",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      description: "E.g. 'Head Mechanic', 'Brake & Clutch Specialist', 'Workshop Manager'",
    }),
    defineField({
      name: "bio",
      title: "Short Bio",
      type: "text",
      rows: 3,
      description: "Appears below articles. Establishes credibility and E-E-A-T.",
    }),
    defineField({
      name: "credentials",
      title: "Credentials & Qualifications",
      type: "text",
      rows: 2,
      description:
        "E-E-A-T trust signal. List qualifications, years of experience, and certifications. e.g. '20+ years in automotive, Licensed Brake & Clutch Specialist, Master Technician certified.'",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "e.g. 'John Smith, Head Mechanic at All Clutch & Brake'",
        },
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "photo",
    },
  },
})
