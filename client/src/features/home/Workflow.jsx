import { SectionWrapper } from "../../components/common/SectionWrapper";
import { WORKFLOW_STEPS } from "../../lib/constants";
export function Workflow() {
  return <SectionWrapper id="solutions" alt>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Workflow</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          From upload to verified in seconds.
        </h2>
      </div>
      <div className="relative mt-16">
        <div className="absolute left-1/2 top-12 hidden h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        <ol className="relative grid gap-8 md:grid-cols-5 md:gap-4">
          {WORKFLOW_STEPS.map((s, i) => <li key={s.label} className="group flex flex-col items-center text-center">
              <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border bg-card transition-all duration-300 group-hover:border-primary/60 group-hover:glow-primary">
                <s.icon className="h-5 w-5 text-primary" />
                <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-semibold">{s.label}</h3>
              <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </li>)}
        </ol>
      </div>
    </SectionWrapper>;
}