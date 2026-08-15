"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CmsTopBar() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await fetch("/api/cms/logout", { method: "POST" })
    } finally {
      router.push("/cms/login")
      router.refresh()
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/cms" className="font-semibold text-foreground">
          All Clutch & Brake CMS
        </Link>
        <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
          <LogOut className="size-4" />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </header>
  )
}
