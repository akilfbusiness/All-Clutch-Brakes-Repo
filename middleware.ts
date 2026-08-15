import { type NextRequest, NextResponse } from "next/server"
import { CMS_SESSION_COOKIE, verifySessionToken } from "@/lib/cms-auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isLoginPage = pathname === "/cms/login"
  const isLoginApi = pathname === "/api/cms/login"

  if (isLoginPage || isLoginApi) {
    return NextResponse.next()
  }

  const token = request.cookies.get(CMS_SESSION_COOKIE)?.value
  const isAuthenticated = verifySessionToken(token)

  if (!isAuthenticated) {
    if (pathname.startsWith("/api/cms")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const loginUrl = new URL("/cms/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Uses Node's crypto module (via lib/cms-auth) so this middleware runs on the
// Node.js runtime rather than the default Edge runtime.
export const runtime = "nodejs"

export const config = {
  matcher: ["/cms/:path*", "/api/cms/:path*"],
}
