import type React from "react"
import { DocSidebar } from "@/components/doc-sidebar"
import { Coffee, Search, Github } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Documentation Header - No border bottom as requested */}
      <header className="fixed top-0 w-full z-50 px-6 py-5 md:px-12 flex justify-between items-center bg-background/95 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tighter uppercase group">
            <Coffee className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform" />
            <span>Latte</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold opacity-60">
            <Link href="/" className="hover:text-primary transition-colors italic">
              Landing
            </Link>
            <span className="text-primary/20">/</span>
            <span className="text-foreground">Documentation</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-40" />
            <Suspense fallback={<div>Loading...</div>}>
              <input
                placeholder="Search docs..."
                className="bg-secondary/40 border-none text-xs rounded-none pl-10 pr-4 py-2 w-64 focus:ring-1 focus:ring-primary/20 transition-all outline-none uppercase tracking-tighter font-medium"
              />
            </Suspense>
          </div>
          <Button variant="ghost" size="icon" className="rounded-none">
            <Github className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="flex pt-20 max-w-[1440px] mx-auto">
        <DocSidebar />
        <main className="flex-1 px-6 py-10 md:px-16 lg:px-24">
          <div className="max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
