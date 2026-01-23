"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "success" | "warning" | "info" | "outline" | "gradient";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200",
        // Variant styles matching marketing website
        variant === "default" && "border-brand-500/20 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 hover:border-brand-500/30",
        variant === "secondary" && "border-border bg-background-tertiary text-foreground-secondary hover:bg-background-quaternary hover:border-border-muted",
        variant === "success" && "border-success/20 bg-success/10 text-success hover:bg-success/20 hover:border-success/30",
        variant === "warning" && "border-warning/20 bg-warning/10 text-warning hover:bg-warning/20 hover:border-warning/30",
        variant === "info" && "border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30",
        variant === "outline" && "border-border text-foreground-secondary hover:border-brand-500 hover:text-brand-400",
        variant === "gradient" && "border-transparent bg-gradient-to-r from-brand-500/10 to-electric-400/10 text-brand-400 hover:from-brand-500/20 hover:to-electric-400/20",
        className
      )}
    >
      {children}
    </span>
  );
}
