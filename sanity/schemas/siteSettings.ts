// Site Settings schema — global business information
// Stored once in Sanity, used everywhere including LocalBusiness schema
// This means updating the phone number in Sanity updates it site-wide

import { defineField, defineType } from "sanity"

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — only one document of this type should ever exist
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      initialValue: "Ashar Disability Care",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone Numbers",
      type: "array",
      of: [{ type: "string" }],
      description: "All contact phone numbers for the business.",
      initialValue: ["0425760172", "0425409849"],
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      initialValue: "info@ashardc.com.au",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        { name: "street", title: "Street", type: "string", initialValue: "2 Yangoura Ct" },
        { name: "suburb", title: "Suburb", type: "string", initialValue: "Surrey Downs" },
        { name: "state", title: "State", type: "string", initialValue: "SA" },
        { name: "postcode", title: "Postcode", type: "string", initialValue: "5126" },
        { name: "country", title: "Country", type: "string", initialValue: "Australia" },
      ],
    }),
    defineField({
      name: "businessHours",
      title: "Business Hours",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "days", title: "Days", type: "string" },
            { name: "hours", title: "Hours", type: "string" },
          ],
          preview: {
            select: { title: "days", subtitle: "hours" },
          },
        },
      ],
      initialValue: [
        { days: "Monday - Friday", hours: "9:00 AM - 5:00 PM" },
        { days: "24/7 Support", hours: "Available" },
      ],
    }),
    defineField({
      name: "ndisRegistrationId",
      title: "NDIS Registration ID",
      type: "string",
      initialValue: "4-1C342A6",
    }),
    defineField({
      name: "abn",
      title: "ABN",
      type: "string",
      initialValue: "11656510075",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      fields: [
        { name: "facebook", title: "Facebook URL", type: "url" },
        { name: "instagram", title: "Instagram URL", type: "url" },
        { name: "linkedin", title: "LinkedIn URL", type: "url" },
      ],
    }),
  ],
  preview: {
    select: { title: "businessName" },
  },
})
