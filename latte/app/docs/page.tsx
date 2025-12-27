import { SpltText } from "@/components/splt-text"
import { ArrowRight, Terminal, Send } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <section>
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-primary mb-6">
          <span className="h-1 w-8 bg-primary/20" />
          Overview
        </div>
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
          <SpltText text="The Future of" className="block" />
          <SpltText text="Brewing Packages" className="block text-primary" delay={0.1} />
        </h1>
        <p className="text-xl text-foreground/80 leading-relaxed font-medium">
          Latte is a next-generation CLI package manager designed for the modern web. By combining the efficiency of
          pnpm with built-in cryptocurrency support on the Mantle network, we're redefining how developers sustain the
          open-source ecosystem.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/20">
        <div className="p-8 bg-secondary/20 border border-border/40 group hover:border-primary transition-colors">
          <Terminal className="h-8 w-8 text-primary mb-6" />
          <h3 className="text-lg font-black uppercase tracking-tighter mb-3">pnpm-Style UX</h3>
          <p className="text-sm opacity-70 leading-relaxed">
            Fast, disk-efficient, and reliable. Global package store with local hard-links for instant installation.
          </p>
        </div>
        <div className="p-8 bg-secondary/20 border border-border/40 group hover:border-primary transition-colors">
          <Send className="h-8 w-8 text-primary mb-6" />
          <h3 className="text-lg font-black uppercase tracking-tighter mb-3">On-Chain Payments</h3>
          <p className="text-sm opacity-70 leading-relaxed">
            Native support for stablecoin donations via Mantle. Reward package maintainers directly from your workflow.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter border-b border-border/20 pb-4">Core Pillars</h2>
        <div className="space-y-6">
          <div className="flex gap-6 items-start">
            <div className="h-10 w-10 shrink-0 bg-primary/10 flex items-center justify-center font-black text-primary">
              01
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-tight mb-2">Efficiency First</h4>
              <p className="text-sm opacity-70">
                Avoid duplicate downloads and bloated node_modules. Latte optimizes every byte.
              </p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="h-10 w-10 shrink-0 bg-primary/10 flex items-center justify-center font-black text-primary">
              02
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-tight mb-2">Financial Sustainability</h4>
              <p className="text-sm opacity-70">
                Optional micro-donations integrated into the `add` command ensure a healthier OSS future.
              </p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <div className="h-10 w-10 shrink-0 bg-primary/10 flex items-center justify-center font-black text-primary">
              03
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-tight mb-2">Native CLI Power</h4>
              <p className="text-sm opacity-70">
                Beautiful terminal UI with color-coded progress bars and human-readable lockfiles.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-primary p-12 flex flex-col items-center text-center text-primary-foreground gap-6">
        <h3 className="text-3xl font-black uppercase tracking-tighter">Ready to brew?</h3>
        <p className="opacity-80 max-w-md text-sm">
          Jump into the installation guide to get the Latte CLI running on your machine.
        </p>
        <button className="px-8 py-4 bg-background text-foreground font-black uppercase tracking-widest text-xs hover:bg-background/90 transition-all">
          Getting Started <ArrowRight className="inline-block ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
