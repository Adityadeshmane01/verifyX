import { ArrowRight, BadgeCheck, ScanLine, Sparkles, Zap, Lock } from "lucide-react";
import { GlowButton } from "@/components/common/GlowButton";
import { Button } from "@/components/ui/button";
import { ScanBeam } from "@/components/common/ScanBeam";
import { useEffect, useState } from "react";

const checks = [
  "Document Extracted",
  "Face Matched",
  "Fraud Scan Clear",
  "Identity Verified",
];

export function Hero() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setVisible((v) => (v >= checks.length ? 0 : v + 1)), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0 bg-grid animate-drift opacity-60" aria-hidden />
      <div className="absolute inset-x-0 -top-24 mx-auto h-[400px] max-w-3xl rounded-full bg-primary/10 blur-[120px]" aria-hidden />
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Enterprise Identity Verification
          </div>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Verify identities.<br />
            Stop fraud.<br />
            <span className="text-primary">Build trust.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            The AI-powered KYC platform trusted by banks and fintechs to onboard customers in seconds, not days.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <GlowButton size="lg" asChild>
              <a href="/verification">
                Start Verification <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </GlowButton>
            <Button size="lg" variant="ghost" className="border">
              View Demo
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-3">
            {[
              { icon: Lock, label: "256-bit AES" },
              { icon: BadgeCheck, label: "99.7% Accuracy" },
              { icon: Zap, label: "50ms Response" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <t.icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-[var(--color-surface)] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Government of India</div>
                <div className="mt-1 text-sm font-semibold">Aadhaar Card</div>
              </div>
              <ScanLine className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-6 flex gap-4">
              <div className="h-24 w-20 rounded-lg bg-gradient-to-br from-muted to-card border" />
              <div className="flex-1 space-y-2">
                <div className="h-2 w-3/4 rounded bg-muted" />
                <div className="h-2 w-1/2 rounded bg-muted" />
                <div className="h-2 w-2/3 rounded bg-muted" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {[["Name", "Aarav Mehta"], ["DOB", "12 / 04 / 1992"], ["ID Number", "•••• •••• 4821"]].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-border/60 pb-2 text-xs">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono">{v}</span>
                </div>
              ))}
            </div>
            <div className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              Scanning
            </div>
            <ScanBeam />
          </div>

          <div className="mt-6 space-y-2 rounded-2xl border bg-card/60 p-4 backdrop-blur">
            {checks.map((c, i) => (
              <div
                key={c}
                className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                  i < visible ? "opacity-100 translate-x-0" : "opacity-40 -translate-x-1"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                    i < visible ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  <BadgeCheck className="h-3 w-3" />
                </span>
                <span className={i < visible ? "text-foreground" : "text-muted-foreground"}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}