import { Construction } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function PlaceholderSection({
  title,
  description,
  schemaTypes,
}: {
  title: string
  description: string
  schemaTypes: string[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <Construction className="size-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">Not built yet</p>
          <p className="max-w-md text-sm text-muted-foreground">
            This section is a placeholder. It maps to the{" "}
            {schemaTypes.length === 1 ? (
              <code className="rounded bg-muted px-1 py-0.5 text-xs">{schemaTypes[0]}</code>
            ) : (
              <>
                {schemaTypes.map((type, i) => (
                  <span key={type}>
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">{type}</code>
                    {i < schemaTypes.length - 1 ? ", " : ""}
                  </span>
                ))}
              </>
            )}{" "}
            schema type{schemaTypes.length > 1 ? "s" : ""} in Sanity, following the same pattern as Authors.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
