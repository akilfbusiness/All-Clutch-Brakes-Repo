"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle, AlertCircle } from "lucide-react"
import { WEBHOOK_STATIC } from "@/lib/form-config"

export interface StaticContactFormProps {
  /** Services to show in the dropdown — "Product Enquiry" and "General Enquiry" are always appended */
  serviceOptions?: string[]
  /** Shown above the heading. Defaults to "Free Quote" */
  eyebrow?: string
  /** Main heading. Defaults to "Send an Enquiry" */
  heading?: string
  /** Subheading copy. Pass false to hide it entirely */
  subheading?: string | false
  /** Show the border/card wrapper. Defaults to true */
  showCard?: boolean
}

const ease = [0.22, 1, 0.36, 1] as const

export function StaticContactForm({
  serviceOptions = [],
  eyebrow = "Free Quote",
  heading = "Send an Enquiry",
  subheading,
  showCard = true,
}: StaticContactFormProps) {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  // Merge caller-supplied services with the always-present tail options,
  // deduplicating so "Product Enquiry" / "General Enquiry" only appear once.
  const tailOptions = ["Product Enquiry", "General Enquiry"]
  const merged = [
    ...serviceOptions.filter((s) => !tailOptions.includes(s)),
    ...tailOptions,
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormStatus("submitting")

    const formData = new FormData(e.currentTarget)
    const payload = {
      name:    formData.get("name") as string,
      phone:   formData.get("phone") as string,
      email:   formData.get("email") as string,
      suburb:  formData.get("suburb") as string,
      service: formData.get("service") as string,
      message: formData.get("message") as string,
      submittedAt: new Date().toISOString(),
    }

    try {
      const res = await fetch(WEBHOOK_STATIC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setFormStatus("success")
      ;(e.target as HTMLFormElement).reset()
    } catch {
      setFormStatus("error")
    }
  }

  const defaultSubheading =
    "Have a question or need to book your vehicle? Fill out the form and our team will get back to you as soon as possible."

  const cardClass = showCard
    ? "border border-border p-8 md:p-10 relative overflow-hidden"
    : "relative"

  return (
    <div className={cardClass}>
      {showCard && <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />}

      <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-4">{eyebrow}</p>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">{heading}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        {subheading === false ? null : (subheading ?? defaultSubheading)}
      </p>

      {formStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 border border-green-500/30 bg-green-500/5 px-5 py-4 mb-6"
        >
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-foreground">Enquiry sent!</p>
            <p className="text-xs text-muted-foreground mt-0.5">We&apos;ll get back to you as soon as possible.</p>
          </div>
        </motion.div>
      )}

      {formStatus === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 border border-red-500/30 bg-red-500/5 px-5 py-4 mb-6"
        >
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-foreground">Something went wrong</p>
            <p className="text-xs text-muted-foreground mt-0.5">Please try again or call us directly.</p>
          </div>
        </motion.div>
      )}

      <form className="space-y-5" aria-label="Contact enquiry form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div>
          <label htmlFor="scf-name" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            id="scf-name" name="name" type="text" autoComplete="name" required
            placeholder="Your full name"
            className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/35 transition-colors duration-200"
          />
        </div>

        {/* Phone + Email */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="scf-phone" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
              Phone <span className="text-accent">*</span>
            </label>
            <input
              id="scf-phone" name="phone" type="tel" autoComplete="tel" required
              placeholder="Your phone number"
              className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/35 transition-colors duration-200"
            />
          </div>
          <div>
            <label htmlFor="scf-email" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
              Email <span className="text-accent">*</span>
            </label>
            <input
              id="scf-email" name="email" type="email" autoComplete="email" required
              placeholder="Your email address"
              className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/35 transition-colors duration-200"
            />
          </div>
        </div>

        {/* Suburb */}
        <div>
          <label htmlFor="scf-suburb" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
            Suburb / Location
          </label>
          <input
            id="scf-suburb" name="suburb" type="text" autoComplete="address-level2"
            placeholder="Your suburb or town"
            className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/35 transition-colors duration-200"
          />
        </div>

        {/* Service select */}
        <div>
          <label htmlFor="scf-service" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
            Service Interested In
          </label>
          <select
            id="scf-service" name="service"
            className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground transition-colors duration-200 appearance-none cursor-pointer"
          >
            <option value="">Select a service</option>
            {merged.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="scf-message" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            id="scf-message" name="message" rows={5} required
            placeholder="Tell us about your vehicle and what you need help with"
            className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/35 transition-colors duration-200 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={formStatus === "submitting"}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm py-4 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {formStatus === "submitting" ? "Sending…" : "Send Enquiry"}
        </button>

        <p className="text-[11px] text-muted-foreground/50 text-center leading-relaxed">
          By submitting you agree to our{" "}
          <Link href="/privacy-policy" className="text-accent/70 hover:text-accent transition-colors">
            Privacy Policy
          </Link>
          . We will only use your information to respond to your enquiry.
        </p>
      </form>
    </div>
  )
}
