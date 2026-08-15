import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { sanityClient } from "@/sanity/client"
import { urlFor } from "@/sanity/image"
import { AuthorForm } from "@/components/cms/author-form"

interface CmsAuthorDetail {
  _id: string
  name: string
  role?: string
  bio?: string
  credentials?: string
  slug?: { current?: string }
  photo?: { asset?: { _ref?: string }; alt?: string } | null
}

const AUTHOR_QUERY = /* groq */ `
  *[_type == "author" && _id == $id][0] {
    _id,
    name,
    role,
    bio,
    credentials,
    slug,
    photo
  }
`

async function getAuthor(id: string) {
  return sanityClient.fetch<CmsAuthorDetail | null>(AUTHOR_QUERY, { id }, { cache: "no-store" })
}

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = await getAuthor(id)

  if (!author) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link
          href="/cms/authors"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to authors
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">Edit author</h1>
        <p className="text-sm text-muted-foreground">Changes publish directly to Sanity and the live site.</p>
      </div>

      <AuthorForm
        mode="edit"
        initialValues={{
          id: author._id,
          name: author.name || "",
          role: author.role || "",
          bio: author.bio || "",
          credentials: author.credentials || "",
          slug: author.slug?.current || "",
          photoAlt: author.photo?.alt || "",
          photoUrl: author.photo?.asset ? urlFor(author.photo).width(160).height(160).fit("crop").url() : null,
        }}
      />
    </div>
  )
}
