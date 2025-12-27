export default function PublishingPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section>
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black text-primary mb-6">
          <span className="h-1 w-8 bg-primary/20" />
          For Developers
        </div>
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
          Publishing <br />
          <span className="text-primary">to Latte</span>
        </h1>
        <p className="text-xl text-foreground/80 leading-relaxed font-medium">
          Share your code with the world and enable sustainable development with Mantle-native monetization.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6">
        <div className="p-10 border border-border/40 bg-secondary/10 space-y-4">
          <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center font-black text-xl mb-4">
            1
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">Prepare Package</h3>
          <p className="text-sm opacity-70">
            Ensure your <code className="bg-secondary/40 px-1">package.json</code> includes the required Latte fields,
            including your Mantle wallet address for donations.
          </p>
          <div className="bg-[#1a120b] p-6 font-mono text-[10px] text-accent mt-4">
            {`{
  "name": "my-cool-pkg",
  "version": "1.0.0",
  "latte": {
    "wallet": "0x123...abc",
    "suggestedDonation": "1.00"
  }
}`}
          </div>
        </div>

        <div className="p-10 border border-border/40 bg-secondary/10 space-y-4">
          <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center font-black text-xl mb-4">
            2
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">Login & Auth</h3>
          <p className="text-sm opacity-70">Authenticate your CLI session using your secure token.</p>
          <div className="bg-[#1a120b] p-4 font-mono text-xs text-accent">latte login</div>
        </div>

        <div className="p-10 border border-border/40 bg-primary text-primary-foreground space-y-4">
          <div className="h-12 w-12 bg-background text-primary flex items-center justify-center font-black text-xl mb-4">
            3
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">Ship It</h3>
          <p className="text-sm opacity-80">Publish your package to the Latte registry in one command.</p>
          <div className="bg-background/10 p-4 font-mono text-xs text-primary-foreground border border-white/20">
            latte publish
          </div>
        </div>
      </div>
    </div>
  )
}
