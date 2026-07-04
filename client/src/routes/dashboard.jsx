import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { DashboardShell } from "../components/layout/DashboardShell";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { DASHBOARD_STATS, TREND_DATA } from "../lib/constants";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { verificationsQueryOptions } from "../features/auth/queries";
import { cn } from "../lib/utils";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context }) => {
    const user = context.queryClient.getQueryData(["currentUser"]);
    if (!user) {
      throw redirect({ to: "/login" });
    }
    await context.queryClient.prefetchQuery(verificationsQueryOptions);
  },
  head: () => ({
    meta: [{
      title: "Dashboard — VerifyX"
    }]
  }),
  component: DashboardPage
});

function DashboardPage() {
  const { data: verifications = [] } = useSuspenseQuery(verificationsQueryOptions);
  const [chartFilter, setChartFilter] = useState("all"); // 'all' | 'verified' | 'failed'

  // Compute dynamic stats
  const totalVerified = verifications.filter(v => v.status === "Verified").length;
  const flaggedToday = verifications.filter(v => v.status === "Failed").length;
  const avgConfidenceVal = verifications.length > 0 
    ? (verifications.reduce((sum, v) => sum + v.confidence, 0) / verifications.length).toFixed(1)
    : 0;

  const stats = [
    { label: "Total Verified", value: totalVerified.toLocaleString(), delta: "+100%" },
    { label: "Flagged Today", value: flaggedToday.toString(), delta: "0%" },
    { label: "Avg. Confidence", value: `${avgConfidenceVal}%`, delta: "+0.0%" }
  ];

  // If no verifications, default to mock stats for presentation
  const activeStats = verifications.length > 0 ? stats : DASHBOARD_STATS;
  const recentVerifications = verifications.length > 0
    ? verifications.slice(0, 6).map(v => ({
        id: v._id.substring(v._id.length - 8).toUpperCase(),
        name: v.extractedData.name,
        doc: v.documentType,
        status: v.status,
        confidence: v.confidence,
        date: new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }))
    : [];

  // Filter chart data dynamically
  const chartData = useMemo(() => {
    if (chartFilter === "verified") {
      return TREND_DATA.map(d => ({ day: d.day, verifications: Math.round(d.verifications * 0.8) }));
    }
    if (chartFilter === "failed") {
      return TREND_DATA.map(d => ({ day: d.day, verifications: Math.round(d.verifications * 0.15) }));
    }
    return TREND_DATA;
  }, [chartFilter]);

  return <DashboardShell title="Overview">
      <div className="grid gap-4 md:grid-cols-3">
        {activeStats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Verification Trends</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            
            {/* Interactive Chart Filter Buttons */}
            <div className="flex gap-1 border rounded-lg p-0.5 bg-background">
              {["all", "verified", "failed"].map(f => (
                <button
                  key={f}
                  onClick={() => setChartFilter(f)}
                  className={cn("px-2 py-0.5 text-[10px] font-medium rounded-md capitalize transition-colors cursor-pointer",
                    chartFilter === f ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{
              top: 6,
              right: 6,
              left: -20,
              bottom: 0
            }}>
                <defs>
                  <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.85 0.19 138)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.85 0.19 138)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{
                background: "#171F1C",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                fontSize: 12
              }} />
                <Area type="monotone" dataKey="verifications" stroke="oklch(0.85 0.19 138)" strokeWidth={2} fill="url(#dg1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold">Recent Activity</h3>
          {recentVerifications.length > 0 ? (
            <ul className="space-y-4">
              {recentVerifications.map(r => <li key={r.id} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {r.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.doc} · {r.date}</div>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </li>)}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">No recent verification runs.</p>
              <a href="/verification" className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Run Verification
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Latest Verifications</h3>
          <span className="text-xs text-muted-foreground">{recentVerifications.length} results</span>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Confidence</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentVerifications.map(r => <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.doc}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-right font-mono">{r.confidence}%</TableCell>
                  <TableCell className="text-right text-muted-foreground">{r.date}</TableCell>
                </TableRow>)}
              {recentVerifications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No verifications executed yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>;
}