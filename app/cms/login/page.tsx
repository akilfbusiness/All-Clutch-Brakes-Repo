"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CmsLoginPage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data?.error || "Something went wrong. Please try again.")
        setIsSubmitting(false)
        return
      }

      router.push("/cms")
      router.refresh()
    } catch {
      setError("Unable to reach the server. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">All Clutch & Brake CMS</CardTitle>
          <CardDescription>Enter the access passcode to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="passcode">Passcode</Label>
              <Input
                id="passcode"
                name="passcode"
                type="password"
                autoComplete="off"
                autoFocus
                required
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                aria-invalid={error ? true : undefined}
              />
            </div>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Checking..." : "Log in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
