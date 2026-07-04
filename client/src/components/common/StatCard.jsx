export function StatCard({
  label,
  value,
  delta
}) {
  const positive = delta?.startsWith("+");
  return <div className="rounded-2xl border bg-card p-7 transition-colors hover:border-primary/30">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-3 text-3xl font-bold tracking-tight">{value}</div>
      {delta && <div className={`mt-2 text-xs ${positive ? "text-primary" : "text-muted-foreground"}`}>
          {delta} vs last week
        </div>}
    </div>;
}