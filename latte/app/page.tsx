import { SpltText } from "@/components/splt-text"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Twitter, Coffee, Box, ShieldCheck, Wallet, Terminal } from "lucide-react"
import Link from "next/link"

export default function LattePage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tighter uppercase group cursor-pointer">
          <Coffee className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
          <span>Latte</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#usage" className="hover:text-primary transition-colors">
            Usage
          </Link>
          <Link href="#mantle" className="hover:text-primary transition-colors">
            Mantle
          </Link>
          <Link href="/docs" className="hover:text-primary transition-colors">
            Docs
          </Link>
          <Link href="https://github.com" className="hover:text-primary transition-colors">
            GitHub
          </Link>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="hidden md:flex rounded-none border-primary/20 hover:bg-primary/5 bg-transparent"
        >
          v1.0.0
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 pt-32 pb-20">
        <div className="max-w-6xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] uppercase tracking-[0.2em] font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now on Mantle Network
          </div>

          <h1 className="text-[10vw] md:text-[7vw] leading-[0.85] font-black tracking-tighter uppercase mb-10">
            <SpltText text="Brew better" className="block text-primary" />
            <SpltText text="packages" className="block" delay={0.15} />
            <SpltText text="with Latte." className="block text-accent" delay={0.3} />
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 items-end">
            <p className="text-lg md:text-xl max-w-xl leading-relaxed font-medium text-foreground/80">
              A modern CLI package manager that works like npm with pnpm-style UX, featuring
              <span className="text-primary italic"> optional cryptocurrency donations</span> on the Mantle network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                asChild
                size="lg"
                className="rounded-none px-10 py-8 text-base uppercase tracking-widest font-bold shadow-[8px_8px_0px_0px_rgba(139,94,60,0.2)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
              >
                <Link href="/docs/installation">
                  Install CLI <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-none px-10 py-8 text-base uppercase tracking-widest font-bold border-2 bg-transparent"
              >
                <Link href="/docs">Docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Terminal Demo */}
      <section id="usage" className="px-6 md:px-12 py-24 bg-secondary/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                <SpltText text="CLI First" />
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Initialize projects, add dependencies, and handle on-chain payments directly from your terminal. Latte
                provides a beautiful, color-coded experience that makes package management a joy.
              </p>
              <ul className="space-y-4 font-mono text-sm">
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full" /> latte init
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full" /> latte add express
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full" /> latte set-price my-pkg
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-[#1a120b] text-[#f5ebe0] rounded-lg shadow-2xl overflow-hidden font-mono text-sm md:text-base border border-primary/20">
                <div className="bg-[#2b1d0e] px-4 py-2 flex items-center justify-between border-b border-primary/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-[10px] uppercase tracking-widest opacity-40">latte-cli --zsh</div>
                </div>
                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">❯</span>
                    <span>latte add framer-motion</span>
                  </div>
                  <div className="space-y-1 opacity-90">
                    <div className="text-accent flex gap-2">
                      <Box className="h-4 w-4" /> <span>Resolving dependencies...</span>
                    </div>
                    <div className="text-muted-foreground ml-6">✔ framer-motion@11.0.0</div>
                    <div className="flex gap-2 items-center">
                      <span className="text-primary">⠹</span> <span>Extracting packages...</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 border-l-2 border-primary p-4 rounded-r mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="h-4 w-4 text-primary" />
                      <span className="font-bold text-xs uppercase tracking-wider text-primary">Optional Donation</span>
                    </div>
                    <p className="text-xs opacity-80 mb-3">
                      Support the creators of <span className="text-accent">framer-motion</span> with 2 USDT on Mantle.
                    </p>
                    <div className="h-20 w-20 bg-white p-1 rounded-sm">
                      <div className="w-full h-full bg-black opacity-20" /> {/* QR Placeholder */}
                    </div>
                  </div>
                  <div className="text-green-400">✔ Successfully brewed framer-motion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="px-6 md:px-12 py-32 border-t border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[240px]">
          <div className="md:col-span-2 md:row-span-2 bg-primary p-12 flex flex-col justify-end text-primary-foreground">
            <Box className="h-12 w-12 mb-6" />
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 leading-none">
              pnpm-Style
              <br />
              Efficiency
            </h3>
            <p className="text-lg opacity-80 leading-relaxed max-w-sm">
              Global content-addressable storage means you never download the same package twice. Lightning fast,
              disk-efficient, and reliable.
            </p>
          </div>

          <div className="md:col-span-2 bg-secondary p-8 flex flex-col justify-center border border-border">
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-2">Mantle Native</h4>
            <p className="text-sm text-secondary-foreground/70">
              Integrated stablecoin payments via Mantle Network. Low fees, instant finality, and on-chain verification
              for package creators.
            </p>
          </div>

          <div className="bg-background border-2 border-primary/20 p-8 flex flex-col justify-center group hover:border-primary transition-colors">
            <ShieldCheck className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold uppercase tracking-tighter mb-1">Secure</h4>
            <p className="text-xs opacity-60">Checksum verification for every single bit.</p>
          </div>

          <div className="bg-background border-2 border-primary/20 p-8 flex flex-col justify-center group hover:border-primary transition-colors">
            <Terminal className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold uppercase tracking-tighter mb-1">Clean UX</h4>
            <p className="text-xs opacity-60">Human-readable locks and perfect CLI output.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-24 bg-foreground text-background">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-3xl font-bold tracking-tighter uppercase mb-6">
              <Coffee className="h-8 w-8 text-accent" />
              <span>Latte</span>
            </div>
            <p className="text-background/60 leading-relaxed italic">
              "The coffee-powered package manager that gives back to the community, one block at a time."
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm uppercase tracking-widest font-bold">
            <div className="flex flex-col gap-4">
              <span className="text-accent/40 mb-2">Docs</span>
              <Link href="#" className="hover:text-accent transition-colors">
                CLI
              </Link>
              <Link href="#" className="hover:text-accent transition-colors">
                API
              </Link>
              <Link href="#" className="hover:text-accent transition-colors">
                Mantle
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-accent/40 mb-2">Social</span>
              <Link href="#" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Twitter className="h-4 w-4" /> X
              </Link>
              <Link href="#" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Github className="h-4 w-4" /> Git
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.4em] opacity-40">
          <span>© 2025 Latte Package Manager. Built on Mantle.</span>
          <span>Terms • Privacy • ISC License</span>
        </div>
      </footer>
    </main>
  )
}
