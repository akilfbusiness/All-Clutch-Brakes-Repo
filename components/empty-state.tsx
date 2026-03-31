// Empty state component shown when no content exists in CMS
import { AlertCircle } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  ctaText?: string
  ctaHref?: string
}

export default function EmptyState({ title, description, ctaText, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="rounded-full bg-zinc-100 p-4 mb-6">
        <AlertCircle className="w-8 h-8 text-zinc-400" />
      </div>
      <h3 className="text-xl font-semibold text-zinc-900 mb-2 text-center">{title}</h3>
      <p className="text-zinc-600 text-center max-w-md mb-6">{description}</p>
      {ctaText && ctaHref && (
        <a
          href={ctaHref}
          className="inline-block px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          {ctaText}
        </a>
      )}
    </div>
  )
}
