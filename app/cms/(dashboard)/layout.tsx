import type { ReactNode } from "react"
import { CmsTopBar } from "@/components/cms/cms-top-bar"

export default function CmsDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-muted/30">
      <CmsTopBar />
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  )
}
