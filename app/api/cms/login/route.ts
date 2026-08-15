import { type NextRequest, NextResponse } from "next/server"
import { CMS_SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, createSessionToken, verifyPasscode } from "@/lib/cms-auth"
import { clearAttempts, isRateLimited, recordFailedAttempt } from "@/lib/cms-rate-limit"

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
  }

  let passcode: string
  try {
    const body = await request.json()
    passcode = typeof body?.passcode === "string" ? body.passcode : ""
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!verifyPasscode(passcode)) {
    recordFailedAttempt(ip)
    return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 })
  }

  clearAttempts(ip)

  const token = createSessionToken()
  const response = NextResponse.json({ success: true })
  response.cookies.set(CMS_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  return response
}
