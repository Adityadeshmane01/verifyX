export function FeatureCard({
  icon: Icon,
  title,
  desc
}) {
  return <div className="group rounded-2xl border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>;
}