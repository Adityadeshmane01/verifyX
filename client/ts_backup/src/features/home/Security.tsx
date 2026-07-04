import { SectionWrapper } from "@/components/common/SectionWrapper";
import { COMPLIANCE_ITEMS } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";

export function Security() {
  return (
    <SectionWrapper alt>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" aria-hidden />
            <div className="relative inline-flex h-40 w-40 items-center justify-center rounded-full border bg-card animate-pulse-glow">
              <div className="absolute inset-3 rounded-full border border-primary/30" />
              <div className="absolute inset-6 rounded-full border border-primary/20" />
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Security</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Enterprise-grade security.
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Data is encrypted in transit and at rest. Regional residency controls, granular RBAC, and full audit trails for every decision.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            {COMPLIANCE_ITEMS.map((c) => (
              <div key={c.label} className="flex items-center gap-3 rounded-xl border bg-card/40 px-4 py-3 transition-colors hover:border-primary/30">
                <c.icon className="h-4 w-4 text-primary" />
                <span className="text-sm">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}