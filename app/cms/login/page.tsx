"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const REQUEST_TIMEOUT_MS = 10_000

export default function CmsLoginPage() {
  const [passcode, setPasscode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(data?.error || "Something went wrong. Please try again.")
        setIsSubmitting(false)
        return
      }

      // Use a full page navigation (not client-side router.push) so the
      // browser re-requests /cms as a fresh top-level document load,
      // guaranteeing the just-set session cookie is sent and read by the
      // server before anything renders. This is more robust than a
      // client-side transition, especially inside embedded/preview contexts.
      window.location.href = "/cms"
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("The request took too long. Please try again.")
      } else {
        setError("Unable to reach the server. Please try again.")
      }
      setIsSubmitting(false)
    } finally {
      clearTimeout(timeoutId)
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
