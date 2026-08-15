# Handoff: Custom `/cms` Admin Panel — Remaining Content Types

## What this is

A custom, branded admin panel at `/cms` that lets non-technical staff edit
content in Sanity **without using Sanity Studio** (which still exists at
`/studio` and remains fully functional — both read/write the same dataset).

**Already built and verified working end-to-end:** authentication, session
handling, route protection, the dashboard shell, and a full CRUD example for
the `author` schema type. This file tells you exactly how that was built so
you can replicate the pattern for every remaining content type.

Do not touch `/studio` or its schema files' behavior — only add new
`/cms/**` routes, components, and Server Actions. The Sanity schema
(`sanity/schemas/*.ts`) is the source of truth for every field; do not
redesign it, just build UI that reads and writes it faithfully.

---

## 1. Architecture at a glance

```
app/
  cms/
    login/page.tsx              # passcode login form (already built, do not touch)
    (dashboard)/
      layout.tsx                 # shell: top bar + sidebar nav + Toaster (already built)
      page.tsx                   # dashboard home (already built)
      authors/                   # ← the reference implementation, copy this pattern
        page.tsx                 # list page (Server Component, reads Sanity directly)
        new/page.tsx             # create page
        [id]/page.tsx            # edit page
        actions.ts                # Server Actions: create/update/delete/upload
      site-settings/page.tsx     # ← placeholder, build this
      navigation/page.tsx        # ← placeholder, build this
      all-pages/page.tsx         # ← placeholder, build this
      pages/page.tsx             # ← placeholder, build this
      services/page.tsx          # ← placeholder, build this
      locations/page.tsx         # ← placeholder, build this
      blog/page.tsx               # ← placeholder, build this
      testimonials/page.tsx      # ← placeholder, build this
      promotions/page.tsx        # ← placeholder, build this
      certifications/page.tsx    # ← placeholder, build this
      gallery/page.tsx            # ← placeholder, build this
      about/page.tsx              # ← placeholder, build this (has 3 sub-types)
      products/page.tsx           # ← placeholder, build this (has 3 sub-types)
api/
  cms/login/route.ts             # login endpoint (already built, do not touch)
components/
  cms/
    cms-top-bar.tsx              # top bar with Log out (already built)
    cms-nav.tsx                  # sidebar nav — ALREADY has links to every section below
    placeholder-section.tsx      # generic "not built yet" card used by all placeholders
    author-form.tsx              # ← the reference implementation for a document form
lib/
  cms-auth.ts                    # session verify/create + requireCmsSession() guard
middleware.ts                    # protects /cms/** and /api/cms/** (already built)
sanity/
  client.ts                      # READ client (sanityFetch helper, ISR tags)
  write-client.ts                # WRITE client — server-only, never import into a Client Component
  image.ts                       # urlFor() helper for rendering Sanity images
  schemas/*.ts                   # source of truth for every field per type
  sanity.config.ts               # Studio desk structure — mirror this grouping in /cms nav
```

## 2. Authentication — how it works (do not rebuild this)

- `/cms/**` and `/api/cms/**` are protected by `middleware.ts`, which checks
  a signed session cookie (`cms_session`). No valid session → redirect to
  `/cms/login`.
- The session token is a signed HMAC token derived from `CMS_ACCESS_PASSCODE`
  (see `lib/cms-auth.ts`). It is completely separate from Sanity's own
  Studio login — the two systems don't interact.
- **Every Server Action that writes to Sanity MUST start with:**
  ```ts
  "use server"
  import { requireCmsSession } from "@/lib/cms-auth"

  export async function myAction(...) {
    await requireCmsSession()
    // ... your write logic
  }
  ```
  This is defense-in-depth: middleware already blocks unauthenticated page
  loads, but Server Actions are invoked via their own POST requests, so each
  one re-checks the session independently.
- You never need to touch login/session code again. Just call
  `requireCmsSession()` at the top of every new Server Action.

## 3. Reading data — the pattern

Server Components fetch directly from Sanity using the **read client**
(`sanity/client.ts`), never a client-side fetch, never an API route in
between:

```tsx
// app/cms/(dashboard)/authors/page.tsx (real code, already built)
import { sanityClient } from "@/sanity/client"

async function getAuthors() {
  return sanityClient.fetch(`*[_type == "author"] | order(name asc) {
    _id, name, role, photo
  }`)
}

export default async function AuthorsPage() {
  const authors = await getAuthors()
  // render list...
}
```

Use `sanityClient.fetch(query, params)` directly for `/cms` pages (not the
`sanityFetch()` wrapper in `client.ts` — that one is for the public site's
ISR caching and tags; the CMS should always show fresh data).

For a **singleton** type (site settings, navigation, "what we do") — fetch
by the fixed `documentId` used in `sanity.config.ts`'s desk structure, e.g.:

```ts
sanityClient.fetch(`*[_id == "siteSettings"][0]`)
```

Check `sanity.config.ts` for the exact `documentId` of each singleton
(`siteSettings`, `mainNavigation`, `whatWeDo`).

## 4. Writing data — the pattern

All writes go through `sanity/write-client.ts` (uses `SANITY_API_WRITE_TOKEN`,
server-only) inside a Server Actions file colocated with the route, e.g.
`app/cms/(dashboard)/services/actions.ts`. Copy the structure of
`app/cms/(dashboard)/authors/actions.ts`:

- `createX(values)` → `sanityWriteClient.create({ _type: "...", ...doc })`
- `updateX(id, values)` → `sanityWriteClient.patch(id).set(doc).commit()`
- `deleteX(id)` → `sanityWriteClient.delete(id)`, catch reference errors and
  surface a friendly message (see how `deleteAuthor` checks
  `err.message.includes("referenced")`)
- For singletons, there is no create/delete — only `updateX(values)` patching
  the fixed document ID. Use `.createIfNotExists()` + `.patch()` if the
  singleton document might not exist yet.
- Image uploads: accept a `FormData` with a `File`, validate
  `file.type.startsWith("image/")` and a size cap, then
  `sanityWriteClient.assets.upload("image", buffer, { filename, contentType })`
  and store the resulting `asset._id` as an image reference. See
  `uploadAuthorPhoto` in `authors/actions.ts` for the exact shape.
- Always call `revalidatePath(...)` for the `/cms` list/edit routes AND
  `revalidatePath("/", "layout")` so the public site picks up the change too.
- Slugs: reuse the `slugify()` helper pattern from `authors/actions.ts`
  (lowercase, strip non-alphanumerics, dashes) — auto-generate from the
  title/name field if the user leaves the slug blank.

## 5. Forms — the pattern

One Client Component per content type (e.g. `components/cms/service-form.tsx`),
modeled exactly on `components/cms/author-form.tsx`:

- `"use client"`, takes `mode: "create" | "edit"` and `initialValues`
- Local `useState` for all fields, one `updateField` helper
- Calls the Server Actions directly (no API route needed — Server Actions
  can be called from Client Components)
- On submit: upload any pending image first (if changed), then
  create/update, `toast.success(...)` from `sonner`, then `router.push()` or
  `router.refresh()`
- Edit mode gets a `Delete` button behind an `AlertDialog` confirmation
  (copy the exact markup from `author-form.tsx`)
- Render every field type using existing shadcn components already in the
  project: `Input` (text/string), `Textarea` (text blocks), file input +
  `Image` preview (images), and for arrays/objects you'll need to build
  small repeatable sub-sections (see §7 below for the bigger schemas).

List pages (`page.tsx`) are Server Components with a "New X" button linking
to `/cms/x/new`, and each row links to `/cms/x/[id]`. Copy
`app/cms/(dashboard)/authors/page.tsx`.

## 6. Navigation — already done, just fill in the pages

`components/cms/cms-nav.tsx` already has a link and icon for every section
below, matching the Studio sidebar exactly (see `sanity.config.ts`'s
`deskStructure`). You do not need to touch this file unless you're adding
sub-navigation inside "About" or "Products" (see §7).

Every placeholder page currently renders `<PlaceholderSection />` — replace
the body of each `page.tsx` with the real implementation. Leave the file
path and route the same so the nav links keep working.

## 7. Remaining content types — build order & notes

Simple, flat list types (**follow the Authors pattern almost exactly** —
list + new + [id] + actions.ts):

| Route | Schema type(s) | Notes |
|---|---|---|
| `/cms/testimonials` | `testimonial` | Simple — check schema for fields (likely name, quote, rating, maybe photo) |
| `/cms/certifications` | `certification` | Likely name, logo/image, maybe link |
| `/cms/promotions` | `promotion` | Check for date ranges / active toggle |
| `/cms/gallery` | `galleryImage` | Mostly image + caption/alt — simplest one |
| `/cms/locations` | `location` | Check schema — likely address, geo coords, hours (reuse patterns from Site Settings' hours field if similar) |
| `/cms/services` | `service` | Check schema for rich content / SEO fields |
| `/cms/blog` (posts) | `post` | **References `author`** — the form needs an author picker (fetch all authors, render as a `Select`) |
| `/cms/pages` | `page` | Generic pages — check schema, may have flexible content blocks/portable text |

Nested sections (need a sub-nav, each sub-item behaves like one of the list
types above once you're inside it):

| Route | Sub-sections | Notes |
|---|---|---|
| `/cms/about` | What We Do (`whatWeDo`, singleton), Projects (`project`, list), Meet Our Staff (`staff`, list) | Add local tabs or a secondary sidebar inside the About page |
| `/cms/products` | Featured Items & News (`featuredItem`, list), Brands (`brand`, list), Product Pages (`productPage`, list) | Same — needs its own sub-nav |

Singletons (**no list/create/delete — just one edit form, patch on save**):

| Route | Schema type | Notes |
|---|---|---|
| `/cms/navigation` | `navigation` (documentId: `mainNavigation`) | Likely an array of nav link objects — needs an "add/remove/reorder link" UI |
| `/cms/site-settings` | `siteSettings` (documentId: `siteSettings`) | **By far the largest schema (1185+ lines)** — see below |

### Site Settings — special handling

This schema is grouped into ~14 tabs in Studio itself (Business Details,
Home Page, Services Page, Locations Page, Blog Page, About Page, Contact
Page, Staff Page, Gallery Page, What We Do Page, Services, Locations,
Footer, SEO & Social). Read the full schema at
`sanity/schemas/siteSettings.ts` before starting (it's long — read it in
chunks, it uses Sanity's `group`/`fieldset` config which you should mirror
as UI tabs).

**Recommendation:** rather than one giant form, build:
1. A tab/section switcher inside `/cms/site-settings` mirroring the Studio
   groups (Business Details, Home Page, Footer, SEO, etc.)
2. Optionally, a small generic field renderer (given a field's Sanity type —
   `string`, `text`, `image`, `array of string`, `array of object`, `url`,
   `object`) render the right input — since this schema alone has 100+
   fields and hand-building each is very repetitive. Not required, but will
   save significant time here specifically.
3. Still one singleton document, one `updateSiteSettings(values)` Server
   Action — you can patch just the fields relevant to whichever tab is
   currently being edited, or patch the whole object on save.

## 8. Verifying your work

For every content type you build:
1. `npx tsc --noEmit` — confirm no new type errors
2. Load the real `/cms/<route>` in a browser with a valid session and
   confirm it shows real Sanity data (not mock data)
3. Create/edit/delete a real record, then reload the page fresh — confirm
   the change actually persisted (not just optimistic UI)
4. Open `/studio` and confirm the same document reflects your change —
   this is the proof that you're writing to the same dataset Studio uses,
   not something separate

## 9. Environment variables already available (do not ask the user to re-add)

`CMS_ACCESS_PASSCODE`, `NEXT_PUBLIC_SANITY_DATASET`,
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_READ_TOKEN`,
`SANITY_API_WRITE_TOKEN`, `SANITY_WEBHOOK_SECRET`.
