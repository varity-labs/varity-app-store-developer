"use client";

import { cn } from "@/lib/utils";
import { APP_CATEGORIES } from "@/lib/constants";
import { useEffect, useRef } from "react";

/**
 * CategoryFilter Component
 *
 * Filter buttons for application categories with keyboard navigation.
 * Supports arrow key navigation and displays optional count badges.
 *
 * @example
 * ```tsx
 * <CategoryFilter
 *   selected="All"
 *   onChange={setCategory}
 *   counts={{ "DeFi": 12, "Gaming": 8 }}
 * />
 * ```
 */

export interface CategoryFilterProps {
  /** Currently selected category */
  selected: string;
  /** Callback when category changes */
  onChange: (category: string) => void;
  /** Optional counts per category */
  counts?: Record<string, number>;
}

export function CategoryFilter({ selected, onChange, counts }: CategoryFilterProps) {
  const categories = ["All", ...APP_CATEGORIES];
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    buttonRefs.current = buttonRefs.current.slice(0, categories.length);
  }, [categories.length]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        nextIndex = (index + 1) % categories.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        nextIndex = (index - 1 + categories.length) % categories.length;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = categories.length - 1;
        break;
      default:
        return;
    }

    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Filter by category"
      className="flex flex-wrap gap-2"
    >
      {categories.map((category, index) => {
        const isSelected = selected === category;
        const count = counts?.[category];

        return (
          <button
            key={category}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            onClick={() => onChange(category)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 inline-flex items-center gap-2",
              isSelected
                ? "bg-brand-500 text-slate-950"
                : "bg-transparent text-foreground-secondary hover:bg-background-quaternary hover:text-foreground"
            )}
          >
            {category}
            {count !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold",
                  isSelected
                    ? "bg-slate-950/20 text-slate-950"
                    : "bg-background-quaternary text-foreground-muted"
                )}
                aria-label={`${count} apps`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
