import type { ReactNode } from "react"
import { CmsTopBar } from "@/components/cms/cms-top-bar"
import { CmsNav } from "@/components/cms/cms-nav"
import { Toaster } from "@/components/ui/sonner"

export default function CmsDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-muted sm:overflow-hidden">
      <CmsTopBar />
      <div className="flex flex-1 flex-col overflow-y-auto sm:flex-row sm:overflow-hidden">
        <CmsNav />
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
          <div className="mx-auto max-w-4xl">{children}</div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
