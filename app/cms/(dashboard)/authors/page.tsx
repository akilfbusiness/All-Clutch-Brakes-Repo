import Image from "next/image"
import { Users } from "lucide-react"
import { sanityClient } from "@/sanity/client"
import { urlFor } from "@/sanity/image"
import { Card, CardContent } from "@/components/ui/card"

interface CmsAuthorListItem {
  _id: string
  name: string
  role?: string
  slug?: { current?: string }
  photo?: { asset?: { _ref?: string } } | null
}

const AUTHORS_LIST_QUERY = /* groq */ `
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    role,
    slug,
    photo
  }
`

async function getAuthors() {
  // Direct server-side read using the read-only Sanity client — no data or
  // token is ever sent to the browser. This is a fresh, uncached read
  // (no Next.js "revalidate"/"tags") so the CMS always shows current data.
  return sanityClient.fetch<CmsAuthorListItem[]>(AUTHORS_LIST_QUERY, {}, { cache: "no-store" })
}

export default async function CmsAuthorsPage() {
  const authors = await getAuthors()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Authors</h1>
          <p className="text-sm text-muted-foreground">
            {authors.length} {authors.length === 1 ? "author" : "authors"} in Sanity.
          </p>
        </div>
      </div>

      {authors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Users className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No authors yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {authors.map((author) => (
            <Card key={author._id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                  {author.photo?.asset ? (
                    <Image
                      src={urlFor(author.photo).width(96).height(96).fit("crop").url()}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Users className="size-5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="font-medium text-foreground">{author.name}</span>
                  {author.role && <span className="text-sm text-muted-foreground">{author.role}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Editing, creating, and deleting authors will be added in the next step.
      </p>
    </div>
  )
}
