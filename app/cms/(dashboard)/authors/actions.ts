"use server"

import { revalidatePath } from "next/cache"
import { requireCmsSession } from "@/lib/cms-auth"
import { sanityWriteClient } from "@/sanity/write-client"

export interface AuthorFormValues {
  name: string
  role: string
  bio: string
  credentials: string
  slug: string
  photoAlt: string
}

export interface AuthorActionResult {
  ok: boolean
  error?: string
  id?: string
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function buildAuthorDoc(values: AuthorFormValues) {
  const name = values.name.trim()
  const slugSource = values.slug.trim() || name
  return {
    name,
    role: values.role.trim() || undefined,
    bio: values.bio.trim() || undefined,
    credentials: values.credentials.trim() || undefined,
    slug: slugSource ? { _type: "slug", current: slugify(slugSource) } : undefined,
  }
}

/**
 * Uploads a new photo asset to Sanity and returns an image field value
 * ready to be patched onto an author document. Runs entirely server-side —
 * the write token never reaches the browser.
 */
export async function uploadAuthorPhoto(formData: FormData): Promise<AuthorActionResult & { assetRef?: string }> {
  await requireCmsSession()

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file provided." }
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "File must be an image." }
  }
  if (file.size > 8 * 1024 * 1024) {
    return { ok: false, error: "Image must be smaller than 8MB." }
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const asset = await sanityWriteClient.assets.upload("image", Buffer.from(arrayBuffer), {
      filename: file.name,
      contentType: file.type,
    })
    return { ok: true, assetRef: asset._id }
  } catch {
    return { ok: false, error: "Failed to upload image. Please try again." }
  }
}

export async function createAuthor(values: AuthorFormValues, assetRef?: string): Promise<AuthorActionResult> {
  await requireCmsSession()

  const name = values.name.trim()
  if (!name) {
    return { ok: false, error: "Full name is required." }
  }

  try {
    const doc = buildAuthorDoc(values)
    const created = await sanityWriteClient.create({
      _type: "author",
      ...doc,
      ...(assetRef
        ? {
            photo: {
              _type: "image",
              asset: { _type: "reference", _ref: assetRef },
              alt: values.photoAlt.trim() || undefined,
            },
          }
        : {}),
    })

    revalidatePath("/cms/authors")
    revalidatePath("/", "layout")
    return { ok: true, id: created._id }
  } catch {
    return { ok: false, error: "Failed to create author. Please try again." }
  }
}

export async function updateAuthor(
  id: string,
  values: AuthorFormValues,
  assetRef?: string,
): Promise<AuthorActionResult> {
  await requireCmsSession()

  const name = values.name.trim()
  if (!name) {
    return { ok: false, error: "Full name is required." }
  }

  try {
    const doc = buildAuthorDoc(values)
    let patch = sanityWriteClient.patch(id).set(doc)

    if (assetRef) {
      patch = patch.set({
        photo: {
          _type: "image",
          asset: { _type: "reference", _ref: assetRef },
          alt: values.photoAlt.trim() || undefined,
        },
      })
    } else if (values.photoAlt.trim()) {
      // Alt text changed but photo itself did not — patch only the alt field.
      patch = patch.set({ "photo.alt": values.photoAlt.trim() })
    }

    await patch.commit()

    revalidatePath("/cms/authors")
    revalidatePath(`/cms/authors/${id}`)
    revalidatePath("/", "layout")
    return { ok: true, id }
  } catch {
    return { ok: false, error: "Failed to save changes. Please try again." }
  }
}

export async function removeAuthorPhoto(id: string): Promise<AuthorActionResult> {
  await requireCmsSession()

  try {
    await sanityWriteClient.patch(id).unset(["photo"]).commit()
    revalidatePath("/cms/authors")
    revalidatePath(`/cms/authors/${id}`)
    revalidatePath("/", "layout")
    return { ok: true, id }
  } catch {
    return { ok: false, error: "Failed to remove photo. Please try again." }
  }
}

export async function deleteAuthor(id: string): Promise<AuthorActionResult> {
  await requireCmsSession()

  try {
    await sanityWriteClient.delete(id)
    revalidatePath("/cms/authors")
    revalidatePath("/", "layout")
    return { ok: true, id }
  } catch (err: any) {
    // Sanity throws if the document is referenced elsewhere (e.g. an
    // Article still points to this author) — surface that clearly instead
    // of a generic failure.
    if (err?.message?.includes("referenced")) {
      return {
        ok: false,
        error: "This author is referenced by one or more articles and can't be deleted until those are updated.",
      }
    }
    return { ok: false, error: "Failed to delete author. Please try again." }
  }
}
