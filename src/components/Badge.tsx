"use client";

import { cn } from "@/lib/utils";
import { forwardRef, memo } from "react";

/**
 * Badge Component
 *
 * A versatile badge component for displaying labels, status indicators, and tags.
 * Fully accessible with ARIA support and keyboard navigation.
 * Memoized for optimal performance in lists.
 *
 * @example
 * ```tsx
 * <Badge variant="success" size="md">Verified</Badge>
 * <Badge variant="default" size="sm">New</Badge>
 * <Badge variant="gradient" size="lg">Premium</Badge>
 * <Badge variant="danger" size="md" icon={<AlertCircle className="h-3 w-3" />}>Error</Badge>
 * ```
 */

/** Visual style variants for the badge */
export type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline"
  | "gradient";

/** Size variants for the badge */
export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Content to display inside the badge */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Optional icon to display before the text */
  icon?: React.ReactNode;
  /** Whether the badge is interactive (button-like) */
  interactive?: boolean;
  /** Whether to show a subtle pulse animation (for live/active states) */
  pulse?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Size-specific styles */
const sizeStyles: Record<BadgeSize, string> = {
  xs: "px-1.5 py-0.5 text-[9px] gap-0.5",
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-3 py-1 text-xs gap-1.5",
  lg: "px-4 py-1.5 text-sm gap-2",
};

/** Icon size classes based on badge size */
const iconSizeStyles: Record<BadgeSize, string> = {
  xs: "[&>svg]:h-2.5 [&>svg]:w-2.5",
  sm: "[&>svg]:h-3 [&>svg]:w-3",
  md: "[&>svg]:h-3.5 [&>svg]:w-3.5",
  lg: "[&>svg]:h-4 [&>svg]:w-4",
};

/** Variant-specific styles */
const variantStyles: Record<BadgeVariant, string> = {
  default:
    "border-brand-500/20 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 hover:border-brand-500/30",
  secondary:
    "border-border bg-background-tertiary text-foreground-secondary hover:bg-background-quaternary hover:border-border-muted",
  success:
    "border-success/20 bg-success/10 text-success hover:bg-success/20 hover:border-success/30",
  warning:
    "border-warning/20 bg-warning/10 text-warning hover:bg-warning/20 hover:border-warning/30",
  danger:
    "border-error/20 bg-error/10 text-error hover:bg-error/20 hover:border-error/30",
  info: "border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30",
  outline:
    "border-border bg-transparent text-foreground-secondary hover:border-brand-500 hover:text-brand-400 hover:bg-brand-500/5",
  gradient:
    "border-transparent bg-gradient-to-r from-brand-500/10 to-electric-400/10 text-brand-400 hover:from-brand-500/20 hover:to-electric-400/20",
};

/**
 * Badge component with multiple variants, sizes, and accessibility features.
 * Memoized for optimal performance in lists.
 */
export const Badge = memo(
  forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
    {
      children,
      variant = "default",
      size = "md",
      icon,
      interactive = false,
      pulse = false,
      className,
      ...props
    },
    ref
  ) {
    return (
      <span
        ref={ref}
        role={interactive ? "button" : "status"}
        tabIndex={interactive ? 0 : undefined}
        aria-label={typeof children === "string" ? children : undefined}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-full border font-semibold",
          "transition-all duration-200 ease-out",
          "select-none whitespace-nowrap",
          // Size
          sizeStyles[size],
          iconSizeStyles[size],
          // Variant
          variantStyles[variant],
          // Interactive styles
          interactive && [
            "cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "active:scale-95",
          ],
          // Pulse animation
          pulse && "animate-pulse",
          className
        )}
        {...props}
      >
        {icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  })
);

Badge.displayName = "Badge";

/**
 * Badge group for displaying multiple badges together
 */
export interface BadgeGroupProps {
  children: React.ReactNode;
  /** Gap between badges */
  gap?: "xs" | "sm" | "md";
  /** Whether to wrap badges on overflow */
  wrap?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const gapStyles: Record<"xs" | "sm" | "md", string> = {
  xs: "gap-1",
  sm: "gap-1.5",
  md: "gap-2",
};

export const BadgeGroup = memo(function BadgeGroup({
  children,
  gap = "sm",
  wrap = true,
  className,
}: BadgeGroupProps) {
  return (
    <div
      role="group"
      aria-label="Badge group"
      className={cn(
        "inline-flex items-center",
        gapStyles[gap],
        wrap && "flex-wrap",
        className
      )}
    >
      {children}
    </div>
  );
});

BadgeGroup.displayName = "BadgeGroup";

// Export types for external use
export type { BadgeProps as BadgeComponentProps };
