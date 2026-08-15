import crypto from "crypto"

/**
 * Server-only auth helpers for the custom /cms admin panel.
 *
 * This is intentionally independent from Sanity's own login system used by
 * /studio. Sessions here are a signed cookie issued by our own server, never
 * touching Sanity's auth at all.
 *
 * Security properties:
 * - The passcode itself never leaves the server and is never included in
 *   any response sent to the browser.
 * - The session token is an HMAC signature over (a hash of the current
 *   passcode + an expiry timestamp), signed with a server-only secret.
 *   Because the passcode's hash is baked into the token, rotating
 *   CMS_ACCESS_PASSCODE automatically invalidates every previously issued
 *   session the moment the app picks up the new value (e.g. after a
 *   redeploy) — no session database needed.
 */

export const CMS_SESSION_COOKIE = "cms_session"
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12 // 12 hours

function getPasscode(): string {
  const passcode = process.env.CMS_ACCESS_PASSCODE
  if (!passcode) {
    throw new Error("CMS_ACCESS_PASSCODE is not set")
  }
  return passcode
}

/**
 * Derives a stable secret from the passcode itself. This means we don't need
 * a separate signing-secret env var, while still ensuring that changing the
 * passcode invalidates all previously signed tokens.
 */
function getSigningSecret(): string {
  return crypto.createHash("sha256").update(getPasscode()).digest("hex")
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSigningSecret()).update(payload).digest("hex")
}

/** Constant-time string comparison to avoid timing attacks on the passcode check. */
function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    // Compare against a same-length dummy so we don't leak length via early return timing.
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  return crypto.timingSafeEqual(bufA, bufB)
}

export function verifyPasscode(submitted: string): boolean {
  if (!submitted) return false
  return timingSafeEqual(submitted, getPasscode())
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_DURATION_MS
  const payload = `${expiresAt}`
  const signature = sign(payload)
  return `${payload}.${signature}`
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return false

  const expectedSignature = sign(payload)
  if (!timingSafeEqual(signature, expectedSignature)) return false

  const expiresAt = Number(payload)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false

  return true
}

export const SESSION_MAX_AGE_SECONDS = Math.floor(SESSION_DURATION_MS / 1000)
