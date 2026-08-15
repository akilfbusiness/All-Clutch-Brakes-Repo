import { NextResponse } from "next/server"
import { CMS_SESSION_COOKIE } from "@/lib/cms-auth"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(CMS_SESSION_COOKIE)
  return response
}
