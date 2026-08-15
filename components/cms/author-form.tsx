"use client"

import { useRef, useState, type ChangeEvent, type FormEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ImagePlus, Loader2, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  type AuthorFormValues,
  createAuthor,
  deleteAuthor,
  removeAuthorPhoto,
  updateAuthor,
  uploadAuthorPhoto,
} from "@/app/cms/(dashboard)/authors/actions"

export interface AuthorFormInitialValues extends AuthorFormValues {
  id: string
  photoUrl: string | null
}

interface AuthorFormProps {
  mode: "create" | "edit"
  initialValues: AuthorFormInitialValues
}

export function AuthorForm({ mode, initialValues }: AuthorFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [values, setValues] = useState<AuthorFormValues>({
    name: initialValues.name,
    role: initialValues.role,
    bio: initialValues.bio,
    credentials: initialValues.credentials,
    slug: initialValues.slug,
    photoAlt: initialValues.photoAlt,
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialValues.photoUrl)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [photoRemoved, setPhotoRemoved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField<K extends keyof AuthorFormValues>(key: K, value: AuthorFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.")
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be smaller than 8MB.")
      return
    }

    setPendingFile(file)
    setPhotoRemoved(false)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function handleRemovePhoto() {
    setPendingFile(null)
    setPhotoPreview(null)
    setPhotoRemoved(true)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!values.name.trim()) {
      setError("Full name is required.")
      return
    }

    setIsSaving(true)
    try {
      let assetRef: string | undefined

      if (pendingFile) {
        const formData = new FormData()
        formData.set("file", pendingFile)
        const uploadResult = await uploadAuthorPhoto(formData)
        if (!uploadResult.ok || !uploadResult.assetRef) {
          setError(uploadResult.error || "Failed to upload photo.")
          setIsSaving(false)
          return
        }
        assetRef = uploadResult.assetRef
      }

      const result =
        mode === "create"
          ? await createAuthor(values, assetRef)
          : await updateAuthor(initialValues.id, values, assetRef)

      if (!result.ok) {
        setError(result.error || "Something went wrong. Please try again.")
        setIsSaving(false)
        return
      }

      // Photo removal (no new file, but the existing one was explicitly cleared)
      if (mode === "edit" && photoRemoved && !pendingFile) {
        await removeAuthorPhoto(initialValues.id)
      }

      toast.success(mode === "create" ? "Author published." : "Changes published.")

      if (mode === "create" && result.id) {
        router.push(`/cms/authors/${result.id}`)
      } else {
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deleteAuthor(initialValues.id)
      if (!result.ok) {
        toast.error(result.error || "Failed to delete author.")
        setIsDeleting(false)
        return
      }
      toast.success("Author deleted.")
      router.push("/cms/authors")
    } catch {
      toast.error("Failed to delete author.")
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-6 pt-6">
          {/* Photo */}
          <div className="flex flex-col gap-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-4">
              <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                {photoPreview ? (
                  <Image src={photoPreview || "/placeholder.svg"} alt="" fill className="object-cover" sizes="80px" />
                ) : (
                  <ImagePlus className="size-6 text-muted-foreground/40" aria-hidden="true" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving}
                  >
                    {photoPreview ? "Replace photo" : "Upload photo"}
                  </Button>
                  {photoPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePhoto}
                      disabled={isSaving}
                      className="text-muted-foreground"
                    >
                      <X className="size-4" />
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">PNG or JPG, up to 8MB.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="photoAlt">Photo alt text</Label>
            <Input
              id="photoAlt"
              value={values.photoAlt}
              onChange={(e) => updateField("photoAlt", e.target.value)}
              placeholder="e.g. John Smith, Head Mechanic at All Clutch & Brake"
              disabled={isSaving}
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
              disabled={isSaving}
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Role / Title</Label>
            <Input
              id="role"
              value={values.role}
              onChange={(e) => updateField("role", e.target.value)}
              placeholder="E.g. Head Mechanic, Brake & Clutch Specialist, Workshop Manager"
              disabled={isSaving}
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={values.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="Auto-generated from name if left blank"
              disabled={isSaving}
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Short Bio</Label>
            <Textarea
              id="bio"
              rows={3}
              value={values.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Appears below articles. Establishes credibility and E-E-A-T."
              disabled={isSaving}
            />
          </div>

          {/* Credentials */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="credentials">Credentials & Qualifications</Label>
            <Textarea
              id="credentials"
              rows={2}
              value={values.credentials}
              onChange={(e) => updateField("credentials", e.target.value)}
              placeholder="e.g. 20+ years in automotive, Licensed Brake & Clutch Specialist, Master Technician certified."
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            {mode === "create" ? "Publish author" : "Publish changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/cms/authors")} disabled={isSaving}>
            Cancel
          </Button>
        </div>

        {mode === "edit" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="ghost" className="text-destructive hover:text-destructive">
                <Trash2 className="size-4" />
                Delete author
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {initialValues.name || "this author"}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes the author from Sanity. This can&apos;t be undone. If this author is
                  referenced by any articles, the delete will be blocked until those are updated.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting && <Loader2 className="size-4 animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </form>
  )
}
