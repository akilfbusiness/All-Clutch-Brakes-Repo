import { PlaceholderSection } from "@/components/cms/placeholder-section"

export default function AllPagesPage() {
  return (
    <PlaceholderSection
      title="All Pages"
      description="Combined, searchable view across every page-like document type — generic pages, services, locations, and blog posts."
      schemaTypes={["page", "service", "location", "post"]}
    />
  )
}
