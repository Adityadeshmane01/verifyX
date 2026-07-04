import { TRUSTED_COMPANIES } from "../../lib/constants";
export function TrustedBy() {
  return <section className="border-y bg-[var(--color-surface)]/60 py-14">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Trusted by teams at
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 overflow-x-auto md:gap-x-16">
          {TRUSTED_COMPANIES.map(c => <span key={c} className="whitespace-nowrap text-base font-semibold tracking-tight text-muted-foreground/70">
              {c}
            </span>)}
        </div>
      </div>
    </section>;
}