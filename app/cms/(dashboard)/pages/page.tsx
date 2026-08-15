import { PlaceholderSection } from "@/components/cms/placeholder-section"

export default function PagesPage() {
  return (
    <PlaceholderSection
      title="Pages"
      description="Generic standalone pages (list + create + edit + delete)."
      schemaTypes={["page"]}
    />
  )
}
