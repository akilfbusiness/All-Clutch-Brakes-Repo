"use client"

import { useState } from "react"
import { X, Tag } from "lucide-react"
import Link from "next/link"
import type { Promotion } from "@/sanity/queries"

interface PromotionsBannerProps {
  promotions: Promotion[]
}

export function PromotionsBanner({ promotions }: PromotionsBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (!promotions || promotions.length === 0 || dismissed) {
    return null
  }

  const promotion = promotions[0]

  const discountDisplay = promotion.discountValue
    ? promotion.discountType === "percentage"
      ? `${promotion.discountValue}% OFF`
      : promotion.discountType === "fixed"
        ? `$${promotion.discountValue} OFF`
        : promotion.discountValue
    : null

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="container flex min-h-12 items-center justify-center gap-3 px-4 py-3 text-center text-sm md:text-base">
        <Tag className="h-4 w-4 flex-shrink-0" />
        <div className="flex flex-wrap items-center justify-center gap-2">
          {discountDisplay && (
            <span className="font-bold">{discountDisplay}</span>
          )}
          <span className="text-balance">{promotion.description}</span>
          {promotion.ctaLabel && promotion.ctaLink && (
            <>
              <span className="hidden md:inline">—</span>
              <Link
                href={promotion.ctaLink}
                className="font-semibold underline underline-offset-4 hover:no-underline"
              >
                {promotion.ctaLabel}
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100 md:right-4"
          aria-label="Dismiss promotion"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
