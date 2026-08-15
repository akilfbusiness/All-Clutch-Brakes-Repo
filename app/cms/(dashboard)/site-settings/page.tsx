import { PlaceholderSection } from "@/components/cms/placeholder-section"

export default function SiteSettingsPage() {
  return (
    <PlaceholderSection
      title="Site Settings"
      description="Business details, page content (Home, Services, Locations, Blog, About, Contact, Staff, Gallery, What We Do), footer, and SEO & social — one singleton document with many grouped tabs."
      schemaTypes={["siteSettings"]}
    />
  )
}
