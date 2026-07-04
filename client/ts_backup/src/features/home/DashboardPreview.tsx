import { SectionWrapper } from "@/components/common/SectionWrapper";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DASHBOARD_STATS, RECENT_VERIFICATIONS, TREND_DATA } from "@/lib/constants";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DashboardPreview() {
  return (
    <SectionWrapper id="developers">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Dashboard</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          A command center for your team.
        </h2>
      </div>
      <div className="mt-16 overflow-hidden rounded-3xl border bg-[var(--color-surface)] p-4 md:p-6 shadow-2xl">
        <div className="grid gap-4 md:grid-cols-3">
          {DASHBOARD_STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Verification Trends</h3>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <span className="text-xs text-primary">+18.2%</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.85 0.19 138)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="oklch(0.85 0.19 138)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#171F1C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="verifications" stroke="oklch(0.85 0.19 138)" strokeWidth={2} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold">Recent Verifications</h3>
            <ul className="space-y-3">
              {RECENT_VERIFICATIONS.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.doc} · {r.date}</div>
                  </div>
                  <StatusBadge status={r.status as "Verified" | "Pending" | "Failed"} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}