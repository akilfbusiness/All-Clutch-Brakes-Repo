"use client"

import { trackCall } from "@/lib/track-call"

interface PhoneLinkProps {
  phone: string
  label?: string
  className?: string
  children: React.ReactNode
}

export function PhoneLink({ phone, label, className, children }: PhoneLinkProps) {
  return (
    <a
      href={`tel:${phone.replace(/\s/g, "")}`}
      className={className}
      onClick={() => trackCall(label)}
    >
      {children}
    </a>
  )
}
