import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AuthorForm } from "@/components/cms/author-form"

export default function NewAuthorPage() {
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
        <h1 className="text-2xl font-semibold text-foreground">New author</h1>
        <p className="text-sm text-muted-foreground">Publishing creates the author directly in Sanity.</p>
      </div>

      <AuthorForm
        mode="create"
        initialValues={{
          id: "",
          name: "",
          role: "",
          bio: "",
          credentials: "",
          slug: "",
          photoAlt: "",
          photoUrl: null,
        }}
      />
    </div>
  )
}
