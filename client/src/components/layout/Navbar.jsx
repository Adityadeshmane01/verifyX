import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "../common/Logo";
import { GlowButton } from "../common/GlowButton";
import { Button } from "../ui/button";
import { NAV_LINKS } from "../../lib/constants";
import { cn } from "../../lib/utils";
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "border-b bg-background/70 backdrop-blur-xl" : "bg-transparent")}>
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Logo />
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(l => <li key={l.label}>
              <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            </li>)}
        </ul>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" className="text-sm">
            <Link to="/login">Login</Link>
          </Button>
          <GlowButton asChild>
            <Link to="/register">Start Free</Link>
          </GlowButton>
        </div>
        <button aria-label="Open menu" onClick={() => setOpen(v => !v)} className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>
      {open && <div className="border-t bg-background/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map(l => <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                {l.label}
              </a>)}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="ghost" className="flex-1">
                <Link to="/login">Login</Link>
              </Button>
              <GlowButton asChild className="flex-1">
                <Link to="/register">Start Free</Link>
              </GlowButton>
            </div>
          </div>
        </div>}
    </header>;
}