"use client";

import { Search, X, Filter, CheckSquare, Check } from "lucide-react";

/**
 * AdminFilters - Search bar, category filter, bulk action controls,
 * and keyboard-shortcuts hint for the admin review panel.
 */

// ── Props ──────────────────────────────────────────────────────────────────

export interface AdminFiltersProps {
  /** Current search input value */
  searchQuery: string;
  /** Callback when search input changes */
  onSearchChange: (query: string) => void;

  /** Currently selected category filter value */
  categoryFilter: string;
  /** Callback when category filter changes */
  onCategoryFilterChange: (category: string) => void;

  /** Whether the filter dropdown is visible */
  showFilters: boolean;
  /** Toggle visibility of the filter dropdown */
  onToggleFilters: () => void;

  /** Number of currently selected apps (for bulk actions) */
  selectedCount: number;
  /** Whether the bulk actions dropdown is visible */
  showBulkActions: boolean;
  /** Toggle visibility of the bulk actions dropdown */
  onToggleBulkActions: () => void;

  /** Bulk-approve all selected apps */
  onBulkApprove: () => void;
  /** Open reject modal for all selected apps */
  onBulkReject: () => void;
  /** Deselect all selected apps */
  onDeselectAll: () => void;

  /** Whether any contract interaction is loading */
  isLoading: boolean;

  /** Total number of filtered apps (used to decide if shortcuts hint shows) */
  filteredCount: number;
}

// ── Component ──────────────────────────────────────────────────────────────

export function AdminFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  showFilters,
  onToggleFilters,
  selectedCount,
  showBulkActions,
  onToggleBulkActions,
  onBulkApprove,
  onBulkReject,
  onDeselectAll,
  isLoading,
  filteredCount,
}: AdminFiltersProps) {
  return (
    <>
      {/* Search and filter bar */}
      <div
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        role="search"
        aria-label="Filter pending applications"
      >
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by name, description, or developer..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search pending applications"
            className="w-full rounded-md border border-slate-800 bg-slate-900 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter toggle + bulk actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            aria-expanded={showFilters}
            aria-controls="admin-category-filter"
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              categoryFilter !== "all"
                ? "border-emerald-900 bg-emerald-950/50 text-emerald-400"
                : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filter
            {categoryFilter !== "all" && <span className="ml-1 text-xs">(1)</span>}
          </button>

          {selectedCount > 0 && (
            <button
              onClick={onToggleBulkActions}
              aria-expanded={showBulkActions}
              aria-controls="admin-bulk-actions"
              className="inline-flex items-center gap-2 rounded-md border border-amber-900 bg-amber-950/50 px-3 py-2 text-sm font-medium text-amber-400 transition-colors hover:border-amber-800"
            >
              <CheckSquare className="h-4 w-4" aria-hidden="true" />
              {selectedCount} selected
            </button>
          )}
        </div>
      </div>

      {/* Category filter dropdown */}
      {showFilters && (
        <div id="admin-category-filter" className="mt-3 rounded-lg border border-slate-800 bg-slate-900/50 p-4" role="group" aria-label="Category filter">
          <label htmlFor="admin-category-select" className="text-sm font-medium text-slate-300">
            Category
          </label>
          <select
            id="admin-category-select"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="defi">DeFi</option>
            <option value="gaming">Gaming</option>
            <option value="nft">NFT</option>
            <option value="social">Social</option>
            <option value="tools">Tools</option>
            <option value="dao">DAO</option>
            <option value="marketplace">Marketplace</option>
            <option value="other">Other</option>
          </select>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => {
                onCategoryFilterChange("all");
                onToggleFilters();
              }}
              className="rounded-md border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-slate-700"
            >
              Clear
            </button>
            <button
              onClick={onToggleFilters}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Bulk actions dropdown */}
      {showBulkActions && (
        <div id="admin-bulk-actions" className="mt-3 rounded-lg border border-amber-900 bg-amber-950/50 p-4" role="group" aria-label="Bulk actions">
          <h3 className="text-sm font-medium text-amber-300">Bulk Actions</h3>
          <p className="mt-1 text-xs text-amber-400/80">
            {selectedCount} app{selectedCount !== 1 ? "s" : ""} selected
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={onBulkApprove}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Approve All
            </button>
            <button
              onClick={onBulkReject}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-md border border-red-900 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Reject All
            </button>
            <button
              onClick={onDeselectAll}
              className="ml-auto rounded-md border border-slate-800 px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {filteredCount > 0 && (
        <div className="mt-4 rounded-lg border border-blue-900/50 bg-blue-950/20 p-3" role="note" aria-label="Keyboard shortcuts">
          <p className="text-xs text-blue-400">
            <strong>Keyboard shortcuts:</strong>{" "}
            <kbd className="rounded bg-blue-900/30 px-1 py-0.5">A</kbd> Approve |{" "}
            <kbd className="rounded bg-blue-900/30 px-1 py-0.5">R</kbd> Reject |{" "}
            <kbd className="rounded bg-blue-900/30 px-1 py-0.5">N</kbd>/<kbd className="rounded bg-blue-900/30 px-1 py-0.5">&darr;</kbd> Next |{" "}
            <kbd className="rounded bg-blue-900/30 px-1 py-0.5">P</kbd>/<kbd className="rounded bg-blue-900/30 px-1 py-0.5">&uarr;</kbd> Previous |{" "}
            <kbd className="rounded bg-blue-900/30 px-1 py-0.5">Space</kbd> Select |{" "}
            <kbd className="rounded bg-blue-900/30 px-1 py-0.5">F</kbd> Feature |{" "}
            <kbd className="rounded bg-blue-900/30 px-1 py-0.5">Esc</kbd> Close modal
          </p>
        </div>
      )}
    </>
  );
}
