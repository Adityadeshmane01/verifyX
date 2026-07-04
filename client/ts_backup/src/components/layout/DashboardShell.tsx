import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, LayoutDashboard, ListChecks, Search, Settings, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/common/Logo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/verification", label: "Verifications", icon: ShieldCheck },
  { to: "/reports", label: "Reports", icon: ListChecks },
] as const;

export function DashboardShell({ children, title }: { children: ReactNode; title: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-60 shrink-0 border-r bg-[var(--color-surface)] md:flex md:flex-col">
        <div className="flex h-16 items-center px-6 border-b">
          <Logo />
        </div>
        <nav className="flex-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <a href="#" className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <Settings className="h-4 w-4" />
            Settings
          </a>
        </nav>
        <div className="border-t p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
            All systems operational
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-6 backdrop-blur-xl">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <h1 className="truncate text-base font-semibold">{title}</h1>
            <div className="relative hidden max-w-sm flex-1 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search verifications…" className="pl-9 bg-card border-border" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Notifications" className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-semibold">A</div>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
        <nav className="grid grid-cols-3 border-t bg-[var(--color-surface)] md:hidden">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn("flex flex-col items-center gap-1 py-3 text-xs", active ? "text-primary" : "text-muted-foreground")}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}