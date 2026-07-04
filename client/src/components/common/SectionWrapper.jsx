import { cn } from "../../lib/utils";
export function SectionWrapper({
  id,
  children,
  className,
  alt = false
}) {
  return <section id={id} className={cn("w-full px-6 py-28 md:py-32", alt && "bg-(--color-surface)", className)}>
      <div className="mx-auto w-full max-w-300">{children}</div>
    </section>;
}