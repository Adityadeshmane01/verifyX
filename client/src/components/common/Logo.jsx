import { Link } from "@tanstack/react-router";
export function Logo() {
  return <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
      <span className="relative">
        Verify<span className="text-primary">X</span>
        <span className="absolute -right-2 top-1 h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
      </span>
    </Link>;
}