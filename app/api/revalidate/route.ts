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
    // Allow in development without a secret
    if (process.env.NODE_ENV === "development") return true
    return false
  }

  const signature = req.headers.get("sanity-webhook-signature")
  if (!signature) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  )

  const [, signatureBase64] = signature.split(",")
  const signatureBuffer = Buffer.from(signatureBase64, "base64")

  return crypto.subtle.verify("HMAC", key, signatureBuffer, encoder.encode(body))
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

    default:
      // Unknown type — revalidate everything as a safe fallback
      revalidateTag("posts")
      revalidateTag("services")
      revalidateTag("locations")
      revalidateTag("site-settings")
      revalidateTag("navigation")
      break
  }

  return NextResponse.json({
    message: "Revalidation triggered",
    type: _type,
    slug: slugValue,
    timestamp: new Date().toISOString(),
  })
}
