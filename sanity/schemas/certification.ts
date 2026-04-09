// Certification schema — industry certifications, affiliations, and trust badges
// These appear in the footer and about page to build trust and credibility

import { defineField, defineType } from "sanity"

export const certificationSchema = defineType({
  name: "certification",
  title: "Certifications & Affiliations",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Certification Name",
      type: "string",
      description: "e.g. 'MTA Member', 'VACC Accredited', 'AAA Approved'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "abbreviation",
      title: "Abbreviation",
      type: "string",
      description: "Short form (e.g. 'MTA', 'VACC'). Optional.",
    }),
    defineField({
      name: "logo",
      title: "Logo / Badge",
      type: "image",
      description: "Upload the certification logo or badge. Transparent PNG recommended.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "What this certification means and why it matters to customers",
    }),
    defineField({
      name: "issuer",
      title: "Issuing Organization",
      type: "string",
      description: "e.g. 'Motor Trade Association of SA', 'Victorian Automobile Chamber of Commerce'",
    }),
    defineField({
      name: "externalLink",
      title: "External Link",
      type: "url",
      description: "Link to the issuing organization's website or verification page",
    }),
    defineField({
      name: "certificateNumber",
      title: "Certificate / Member Number",
      type: "string",
      description: "Your membership or certification number. Optional.",
    }),
    defineField({
      name: "dateObtained",
      title: "Date Obtained",
      type: "date",
      description: "When this certification was first obtained",
    }),
    defineField({
      name: "expiryDate",
      title: "Expiry Date",
      type: "date",
      description: "If applicable. Leave empty for certifications that don't expire.",
    }),
    defineField({
      name: "showInFooter",
      title: "Show in Footer",
      type: "boolean",
      description: "Display this certification badge in the footer trust section",
      initialValue: true,
    }),
    defineField({
      name: "showOnAboutPage",
      title: "Show on About Page",
      type: "boolean",
      description: "Display this certification on the About page",
      initialValue: true,
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Controls the order certifications appear. Lower number = appears first.",
      validation: (Rule) => Rule.integer().positive(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "issuer",
      media: "logo",
      expiryDate: "expiryDate",
    },
    prepare({ title, subtitle, media, expiryDate }) {
      const now = new Date()
      const expiry = expiryDate ? new Date(expiryDate) : null
      const isExpired = expiry && now > expiry
      const isExpiringSoon = expiry && now <= expiry && expiry.getTime() - now.getTime() < 90 * 24 * 60 * 60 * 1000 // 90 days

      return {
        title: `${title} ${isExpired ? "❌ EXPIRED" : isExpiringSoon ? "⚠️ Expiring Soon" : ""}`,
        subtitle: subtitle || "No issuer specified",
        media,
      }
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
    {
      title: "Date Obtained (Newest First)",
      name: "dateDesc",
      by: [{ field: "dateObtained", direction: "desc" }],
    },
  ],
})
