"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * SearchBar Component
 *
 * Search input with debouncing, clear button, and loading indicator.
 * Automatically debounces user input by 300ms to reduce API calls.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   isLoading={false}
 *   resultCount={42}
 * />
 * ```
 */

export interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Callback when search value changes (debounced by 300ms) */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether search is in progress */
  isLoading?: boolean;
  /** Number of results found (for ARIA live region) */
  resultCount?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search applications...",
  isLoading = false,
  resultCount,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce the onChange callback (300ms)
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

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="relative group">
        <Search
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted pointer-events-none transition-colors group-focus-within:text-brand-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-14 rounded-xl border border-border bg-background-secondary pl-12 pr-12 text-body-md text-foreground placeholder:text-foreground-muted transition-all duration-200 hover:border-border-muted focus:border-brand-500 focus:bg-background-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm focus:shadow-md"
          aria-label="Search applications"
          aria-describedby={resultCount !== undefined ? "search-results-count" : undefined}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 text-brand-400 animate-spin" aria-label="Searching..." />
          </div>
        )}
        {localValue && !isLoading && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-foreground-muted transition-all hover:bg-background-quaternary hover:text-foreground animate-scale-in"
            aria-label="Clear search"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ARIA live region for result count */}
      {resultCount !== undefined && (
        <div
          id="search-results-count"
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {resultCount} {resultCount === 1 ? 'result' : 'results'} found
        </div>
      )}
    </div>
  );
}
