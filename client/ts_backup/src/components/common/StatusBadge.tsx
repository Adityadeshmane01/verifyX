import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

type Status = "Verified" | "Pending" | "Failed";

const map: Record<Status, { cls: string; icon: typeof CheckCircle2 }> = {
  Verified: { cls: "bg-primary/10 text-primary border-primary/30", icon: CheckCircle2 },
  Pending: { cls: "bg-warning/10 text-[var(--color-warning)] border-[var(--color-warning)]/30", icon: Clock },
  Failed: { cls: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
};

export function StatusBadge({ status }: { status: Status }) {
  const { cls, icon: Icon } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cls,
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}
