import { SectionWrapper } from "../../components/common/SectionWrapper";
import { FeatureCard } from "../../components/common/FeatureCard";
import { FEATURES } from "../../lib/constants";
export function Features() {
  return <SectionWrapper id="platform">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Platform</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Everything you need to verify, in one API.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Composable building blocks for KYC, KYB, and ongoing monitoring.
        </p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
      </div>
    </SectionWrapper>;
}