import { PlaceholderSection } from "@/components/cms/placeholder-section"

export default function BlogPage() {
  return (
    <PlaceholderSection
      title="Blog"
      description="Blog posts — list + create + edit + delete. Posts reference Authors, so keep that relationship in mind."
      schemaTypes={["post"]}
    />
  )
}
