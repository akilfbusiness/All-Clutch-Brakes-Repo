// Promotion schema — seasonal deals, specials, and limited-time offers
// These appear as banners on the homepage and service pages
// They auto-hide after the expiry date

import { defineField, defineType } from "sanity"

export const promotionSchema = defineType({
  name: "promotion",
  title: "Promotions & Specials",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Promotion Title",
      type: "string",
      description: "e.g. 'Summer Special: 15% Off Clutch Replacements'",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Details about the promotion. Keep it short and compelling.",
      validation: (Rule) => Rule.required().max(250),
    }),
    defineField({
      name: "discountType",
      title: "Discount Type",
      type: "string",
      options: {
        list: [
          { title: "Percentage Off (e.g. 15% off)", value: "percentage" },
          { title: "Dollar Amount (e.g. $50 off)", value: "dollar" },
          { title: "Free Service/Item", value: "free" },
          { title: "Package Deal", value: "package" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "discountValue",
      title: "Discount Value",
      type: "string",
      description: "e.g. '15%', '$50', 'Free brake inspection'. Used in banners and CTAs.",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      description: "When this promotion becomes active",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      description: "When this promotion expires. It will auto-hide after this date.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaLabel",
      title: "Call-to-Action Button Label",
      type: "string",
      description: "e.g. 'Claim This Offer', 'Book Now', 'Get Quote'",
      initialValue: "Learn More",
    }),
    defineField({
      name: "ctaLink",
      title: "Call-to-Action Link",
      type: "string",
      description: "Where the CTA button should link to (e.g. '/contact', '/services/clutch-replacement')",
      initialValue: "/contact",
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      description: "Show this promotion prominently on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "bannerStyle",
      title: "Banner Style",
      type: "string",
      description: "Visual style for the banner display",
      options: {
        list: [
          { title: "Default (Orange)", value: "default" },
          { title: "Urgent (Red)", value: "urgent" },
          { title: "Premium (Dark)", value: "premium" },
          { title: "Subtle (Light)", value: "subtle" },
        ],
      },
      initialValue: "default",
    }),
    defineField({
      name: "applicableServices",
      title: "Applicable Services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      description: "Link to specific services this promotion applies to. Leave empty for all services.",
    }),
    defineField({
      name: "termsAndConditions",
      title: "Terms & Conditions",
      type: "text",
      rows: 3,
      description: "Fine print, limitations, or conditions (e.g. 'Valid for new customers only')",
    }),
    defineField({
      name: "active",
      title: "Manually Active",
      type: "boolean",
      description: "Manually disable this promotion even if within the date range",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      discountValue: "discountValue",
      startDate: "startDate",
      endDate: "endDate",
      active: "active",
      featured: "featured",
    },
    prepare({ title, discountValue, startDate, endDate, active, featured }) {
      const now = new Date()
      const start = new Date(startDate)
      const end = new Date(endDate)
      const isLive = active && now >= start && now <= end

      return {
        title: `${title} ${featured ? "⭐" : ""} ${isLive ? "🟢 LIVE" : "⚪ Inactive"}`,
        subtitle: `${discountValue ? discountValue + " · " : ""}${startDate} to ${endDate}`,
      }
    },
  },
  orderings: [
    {
      title: "End Date (Soonest First)",
      name: "endDateAsc",
      by: [{ field: "endDate", direction: "asc" }],
    },
    {
      title: "Start Date (Newest First)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
})
