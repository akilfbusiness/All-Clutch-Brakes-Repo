// ISR Revalidation Webhook — Sanity calls this endpoint automatically
// whenever content is published or updated in the Studio.
//
// How it works:
// 1. You configure a webhook in Sanity (sanity.io → your project → API → Webhooks)
// 2. Point the webhook URL to: https://ashardisabilitycare.com.au/api/revalidate
// 3. Set the secret to match SANITY_WEBHOOK_SECRET in your environment variables
// 4. Whenever you save content in Sanity, this endpoint fires and rebuilds
//    only the affected pages — not the entire site.
//
// Supported document types and their cache tags:
// - article   → revalidates "articles" tag + individual "article-{slug}" tag
// - service   → revalidates "services" tag + individual "service-{slug}" tag
// - location  → revalidates "locations" tag + individual "location-{slug}" tag
// - siteSettings → revalidates global "site-settings" tag

import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

// Simple HMAC-SHA256 signature verification to ensure the request
// genuinely comes from Sanity and not an unauthorised third party
async function verifySignature(req: NextRequest, body: string): Promise<boolean> {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    // If no secret is set, skip verification in development only
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

  // Verify the request is genuinely from Sanity
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

  // Revalidate the appropriate cache tags based on which document type changed
  switch (_type) {
    case "article":
      revalidateTag("articles")
      if (slug?.current) {
        revalidateTag(`article-${slug.current}`)
      }
      break

    case "service":
      revalidateTag("services")
      if (slug?.current) {
        revalidateTag(`service-${slug.current}`)
      }
      break

    case "location":
      revalidateTag("locations")
      if (slug?.current) {
        revalidateTag(`location-${slug.current}`)
      }
      break

    case "siteSettings":
      revalidateTag("site-settings")
      break

    default:
      // Unknown document type — revalidate everything as a safe fallback
      revalidateTag("articles")
      revalidateTag("services")
      revalidateTag("locations")
      revalidateTag("site-settings")
  }

  return NextResponse.json({
    message: "Revalidation triggered",
    type: _type,
    slug: slug?.current ?? null,
    timestamp: new Date().toISOString(),
  })
}
