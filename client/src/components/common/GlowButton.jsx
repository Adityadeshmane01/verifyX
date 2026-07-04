import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { forwardRef } from "react";
export const GlowButton = forwardRef(({
  className,
  ...props
}, ref) => <Button ref={ref} className={cn("bg-primary text-primary-foreground hover:bg-primary/90 font-semibold", "transition-all duration-300 hover:glow-primary hover:-translate-y-0.5", className)} {...props} />);
GlowButton.displayName = "GlowButton";