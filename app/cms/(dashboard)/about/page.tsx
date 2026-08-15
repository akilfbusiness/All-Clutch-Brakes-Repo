import { PlaceholderSection } from "@/components/cms/placeholder-section"

export default function AboutPage() {
  return (
    <PlaceholderSection
      title="About"
      description="Nested section with three sub-areas, same as Studio: What We Do (singleton page), Projects (list), and Meet Our Staff (list). Likely needs its own sub-nav once built."
      schemaTypes={["whatWeDo", "project", "staff"]}
    />
  )
}
