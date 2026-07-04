import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionWrapper({
  id,
  children,
  className,
  alt = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  alt?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "w-full px-6 py-28 md:py-32",
        alt && "bg-[var(--color-surface)]",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  );
}
