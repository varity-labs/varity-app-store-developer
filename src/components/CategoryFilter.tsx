"use client";

import { cn } from "@/lib/utils";
import { APP_CATEGORIES } from "@/lib/constants";

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const categories = ["All", ...APP_CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
            selected === category
              ? "bg-brand-500 text-slate-950"
              : "bg-transparent text-foreground-secondary hover:bg-background-quaternary hover:text-foreground"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
