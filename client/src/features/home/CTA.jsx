import { GlowButton } from "../../components/common/GlowButton";
import { Link } from "@tanstack/react-router";
export function CTA() {
  return <section className="relative overflow-hidden border-y bg-[var(--color-surface)] py-28">
      <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Ready to verify with confidence?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Start with 100 free verifications. No credit card required.
        </p>
        <div className="mt-8 inline-block">
          <GlowButton size="lg" asChild className="px-8">
            <Link to="/register">Get Started Free</Link>
          </GlowButton>
        </div>
      </div>
    </section>;
}