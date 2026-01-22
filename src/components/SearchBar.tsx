"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search applications...",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative w-full max-w-lg group">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted pointer-events-none transition-colors group-focus-within:text-brand-400" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 rounded-xl border border-border bg-background-secondary pl-12 pr-12 text-body-md text-foreground placeholder:text-foreground-muted transition-all duration-200 hover:border-border-muted focus:border-brand-500 focus:bg-background-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm focus:shadow-md"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue("");
            onChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-foreground-muted transition-all hover:bg-background-quaternary hover:text-foreground animate-scale-in"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
