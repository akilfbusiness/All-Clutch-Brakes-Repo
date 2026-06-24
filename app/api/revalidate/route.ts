// ISR Revalidation Webhook — Sanity calls this endpoint on every publish/update.
//
// Setup (one-time, done in Sanity Studio):
//   1. Go to sanity.io → your project → API → Webhooks
//   2. Create a new webhook:
//      - URL: https://your-domain.com/api/revalidate
//      - Trigger on: Create, Update, Delete
//      - Filter: leave blank (all document types)
//      - HTTP method: POST
//      - Secret: any random string — copy it into SANITY_WEBHOOK_SECRET env var
//
// What happens when you publish in the CMS:
//   Sanity → POST /api/revalidate → revalidateTag() → Next.js drops cache for
//   affected pages only → next visitor gets a fresh page within seconds.

import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

async function verifySignature(req: NextRequest, body: string): Promise<boolean> {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === "development") return true
    return false
  }

  const signature = req.headers.get("sanity-webhook-signature")
  if (!signature) return false

  // Sanity header format: "t=<timestamp>,v1=<hex_hmac_sha256>"
  const parts = Object.fromEntries(signature.split(",").map((p) => p.split("=")))
  const hexSignature = parts["v1"]
  const timestamp = parts["t"]
  if (!hexSignature || !timestamp) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  // Sanity signs: "<timestamp>.<body>"
  const payload = `${timestamp}.${body}`
  const expectedBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  const expectedHex = Array.from(new Uint8Array(expectedBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return expectedHex === hexSignature
}

export async function POST(req: NextRequest) {
  let body: string
  try {
    body = await req.text()
  } catch {
    return NextResponse.json({ message: "Could not read request body" }, { status: 400 })
  }

  const isValid = await verifySignature(req, body)
  if (!isValid) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 })
  }

  let payload: { _type?: string; slug?: { current?: string } }
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 })
  }

  const { _type, slug } = payload
  const slugValue = slug?.current ?? null

  switch (_type) {
    // Blog posts
    case "post":
      revalidateTag("posts")
      if (slugValue) revalidateTag(`post-${slugValue}`)
      break

    // Services
    case "service":
      revalidateTag("services")
      if (slugValue) revalidateTag(`service-${slugValue}`)
      break

    // Locations
    case "location":
      revalidateTag("locations")
      if (slugValue) revalidateTag(`location-${slugValue}`)
      break

    // Site-wide settings — affects every page
    case "siteSettings":
      revalidateTag("site-settings")
      break

    // Navigation changes affect header/footer on every page
    case "navigation":
      revalidateTag("navigation")
      revalidateTag("site-settings")
      break

    // Author updates may affect blog posts
    case "author":
      revalidateTag("posts")
      break

    // Testimonials — used on home page and testimonials page
    case "testimonial":
      revalidateTag("testimonials")
      break

    // Promotions — used on home page and promotions banner
    case "promotion":
      revalidateTag("promotions")
      break

    // Projects
    case "project":
      revalidateTag("projects")
      if (slugValue) revalidateTag(`project-${slugValue}`)
      break

    // Product pages
    case "productPage":
      revalidateTag("productPages")
      if (slugValue) revalidateTag(`productPage-${slugValue}`)
      break

    // Free-form pages (custom CMS pages rendered via app/[slug]/page.tsx)
    case "page":
      revalidateTag("pages")
      if (slugValue) revalidateTag(`page-${slugValue}`)
      break

    // What We Do page
    case "whatWeDo":
      revalidateTag("whatWeDo")
      break

    // Staff members
    case "staff":
      revalidateTag("staff")
      break

    // Brands
    case "brand":
      revalidateTag("brands")
      break

    // Gallery images
    case "galleryImage":
      revalidateTag("gallery")
      break

    // Certifications & affiliations
    case "certification":
      revalidateTag("certifications")
      break

    // Featured items
    case "featuredItem":
      revalidateTag("featuredItems")
      break

    default:
      // Unknown type — revalidate all tags as a safe fallback
      revalidateTag("posts")
      revalidateTag("services")
      revalidateTag("locations")
      revalidateTag("site-settings")
      revalidateTag("navigation")
      revalidateTag("testimonials")
      revalidateTag("promotions")
      revalidateTag("projects")
      revalidateTag("productPages")
      revalidateTag("pages")
      revalidateTag("whatWeDo")
      revalidateTag("staff")
      revalidateTag("brands")
      revalidateTag("gallery")
      revalidateTag("certifications")
      revalidateTag("featuredItems")
      break
  }

  return NextResponse.json({
    message: "Revalidation triggered",
    type: _type,
    slug: slugValue,
    timestamp: new Date().toISOString(),
  })
}
