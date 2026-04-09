import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/image"
import type { Certification } from "@/sanity/queries"

interface CertificationsDisplayProps {
  certifications: Certification[]
  variant?: "footer" | "page"
}

export function CertificationsDisplay({
  certifications,
  variant = "footer",
}: CertificationsDisplayProps) {
  if (!certifications || certifications.length === 0) {
    return null
  }

  const isFooter = variant === "footer"

  return (
    <div className={isFooter ? "space-y-3" : "space-y-6"}>
      {!isFooter && (
        <h3 className="text-lg font-semibold">Certifications & Affiliations</h3>
      )}
      
      <div className={`flex flex-wrap items-center ${isFooter ? "gap-4" : "gap-6"}`}>
        {certifications.map((cert) => {
          const content = (
            <div
              key={cert._id}
              className={`flex flex-col items-center gap-2 ${
                isFooter ? "opacity-70 hover:opacity-100" : ""
              } transition-opacity`}
            >
              {cert.logo && (
                <div className={`relative ${isFooter ? "h-12 w-20" : "h-16 w-28"}`}>
                  <Image
                    src={urlFor(cert.logo).width(200).height(100).url()}
                    alt={cert.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              {!isFooter && (
                <p className="text-center text-sm font-medium">{cert.name}</p>
              )}
            </div>
          )

          if (cert.externalLink) {
            return (
              <Link
                key={cert._id}
                href={cert.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                {content}
              </Link>
            )
          }

          return content
        })}
      </div>

      {!isFooter && (
        <p className="text-sm text-muted-foreground">
          Trusted and certified by industry-leading organizations
        </p>
      )}
    </div>
  )
}
