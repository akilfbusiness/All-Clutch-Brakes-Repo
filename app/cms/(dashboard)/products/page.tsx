import { PlaceholderSection } from "@/components/cms/placeholder-section"

export default function ProductsPage() {
  return (
    <PlaceholderSection
      title="Products"
      description="Nested section with three sub-areas, same as Studio: Featured Items & News (list), Brands (list), and Product Pages (list). Likely needs its own sub-nav once built."
      schemaTypes={["featuredItem", "brand", "productPage"]}
    />
  )
}
