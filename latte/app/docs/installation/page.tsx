import { Terminal, Copy } from "lucide-react"

export default function InstallationPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-primary mb-6">
          <span className="h-1 w-8 bg-primary/20" />
          Getting Started
        </div>
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">Installation</h1>
        <p className="text-xl text-foreground/80 leading-relaxed font-medium">
          Get the Latte CLI running in seconds. We provide a simple installation script for Unix-based systems and a
          native installer for Windows.
        </p>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-black uppercase tracking-tighter">Automatic Install</h3>
        <p className="text-sm opacity-70">
          The fastest way to install Latte is via our shell script. Open your terminal and run:
        </p>
        <div className="bg-[#1a120b] text-accent p-6 font-mono text-sm relative group">
          <code className="block overflow-x-auto whitespace-pre">curl -fsSL https://latte.sh/install | sh</code>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-black uppercase tracking-tighter">Global via NPM</h3>
        <p className="text-sm opacity-70">
          Alternatively, you can install it globally using your existing package manager:
        </p>
        <div className="bg-[#1a120b] text-accent p-6 font-mono text-sm relative group">
          <code className="block overflow-x-auto whitespace-pre">npm install -g @latte-sh/cli</code>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </section>

      <div className="p-8 border-l-4 border-primary bg-secondary/20">
        <h4 className="font-bold uppercase tracking-tight text-primary mb-2 flex items-center gap-2">
          <Terminal className="h-4 w-4" /> Post-Installation
        </h4>
        <p className="text-sm opacity-70">
          After installation, restart your terminal or source your shell profile. Run{" "}
          <code className="bg-primary/10 px-1 font-bold text-primary">latte --version</code> to verify the installation.
        </p>
      </div>
    </div>
  )
}
