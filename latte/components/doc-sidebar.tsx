"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

const DOCS_NAV = [
  {
    title: "Overview",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Key Features", href: "/docs/features" },
      { title: "Architecture", href: "/docs/architecture" },
    ],
  },
  {
    title: "Getting Started",
    items: [
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quickstart" },
      { title: "CLI Reference", href: "/docs/cli" },
    ],
  },
  {
    title: "On-Chain Payments",
    items: [
      { title: "Mantle Integration", href: "/docs/mantle" },
      { title: "Setting Prices", href: "/docs/pricing" },
      { title: "Receiving Donations", href: "/docs/donations" },
    ],
  },
  {
    title: "For Package Developers",
    items: [
      { title: "Publishing", href: "/docs/publishing" },
      { title: "Management", href: "/docs/management" },
      { title: "Versioning", href: "/docs/versioning" },
    ],
  },
]

export function DocSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border/40 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto hidden md:block px-6 py-10 scrollbar-none">
      <div className="space-y-8">
        {DOCS_NAV.map((section) => (
          <div key={section.title}>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/60 mb-4">{section.title}</h4>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between py-1.5 text-xs font-medium tracking-wide transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary font-bold" : "text-foreground/60",
                  )}
                >
                  {item.title}
                  {pathname === item.href && <ChevronRight className="h-3 w-3" />}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
