"use client";

import Image from "next/image";
import { Badge } from "@/components/Badge";
import { Check, X, Star, ExternalLink, Loader2, CheckSquare, Square, Zap } from "lucide-react";
import type { AppData } from "@/lib/constants";

/**
 * AppReviewCard - Renders a single application submission for admin review.
 * Displays app metadata, selection state, focus indicator, and action buttons.
 */

// ── Props ──────────────────────────────────────────────────────────────────

export interface AppReviewCardProps {
  /** Application data from the contract */
  app: AppData;
  /** Whether this card is currently selected for bulk actions */
  isSelected: boolean;
  /** Whether this card has keyboard focus */
  isFocused: boolean;
  /** Whether this app is currently being processed (approve/reject/feature) */
  isProcessing: boolean;
  /** Whether any contract interaction is globally loading */
  isContractLoading: boolean;
  /** Total count of filtered apps (to disable "Approve & Next" when only 1) */
  filteredCount: number;

  /** Toggle selection state of this app */
  onToggleSelection: (appId: string) => void;
  /** Approve this app */
  onApprove: (appId: string, andNext?: boolean) => void;
  /** Open the rejection modal for this app */
  onReject: (appId: string) => void;
  /** Feature this app */
  onFeature: (appId: string) => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function AppReviewCard({
  app,
  isSelected,
  isFocused,
  isProcessing,
  isContractLoading,
  filteredCount,
  onToggleSelection,
  onApprove,
  onReject,
  onFeature,
}: AppReviewCardProps) {
  const appId = app.id.toString();
  const actionsDisabled = isProcessing || isContractLoading;

  return (
    <article
      className={`rounded-lg border p-5 transition-all ${
        isFocused
          ? "border-blue-700 bg-blue-950/30 shadow-lg shadow-blue-900/20"
          : isSelected
          ? "border-amber-800 bg-amber-950/20"
          : "border-slate-800 bg-slate-900/50"
      }`}
      aria-label={`Review ${app.name}`}
      aria-current={isFocused ? "true" : undefined}
      tabIndex={isFocused ? 0 : -1}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Selection checkbox */}
        <button
          onClick={() => onToggleSelection(appId)}
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 transition-colors hover:border-slate-700"
          aria-label={isSelected ? `Deselect ${app.name}` : `Select ${app.name}`}
          aria-pressed={isSelected}
        >
          {isSelected ? (
            <CheckSquare className="h-6 w-6 text-amber-400" aria-hidden="true" />
          ) : (
            <Square className="h-6 w-6 text-slate-600" aria-hidden="true" />
          )}
        </button>

        {/* Logo */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800" aria-hidden="true">
          {app.logoUrl ? (
            <Image src={app.logoUrl} alt="" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-600">
              {app.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium text-slate-100">{app.name}</h3>
            <Badge variant="default">{app.category}</Badge>
            {app.builtWithVarity && <Badge variant="success">Verified</Badge>}
            {isFocused && (
              <Badge variant="info">
                <span className="text-xs">Focused</span>
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">{app.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>Developer: {app.developer.slice(0, 10)}...</span>
            <a
              href={app.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              View App
            </a>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800/50 pt-4" role="group" aria-label={`Actions for ${app.name}`}>
        <button
          onClick={() => onApprove(appId, false)}
          disabled={actionsDisabled}
          aria-busy={isProcessing}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="h-4 w-4" aria-hidden="true" />
          )}
          {isProcessing ? "Approving..." : "Approve"}
        </button>
        <button
          onClick={() => onApprove(appId, true)}
          disabled={actionsDisabled || filteredCount === 1}
          title="Approve and move to next app"
          className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="h-4 w-4" aria-hidden="true" />
          Approve &amp; Next
        </button>
        <button
          onClick={() => onReject(appId)}
          disabled={actionsDisabled}
          className="inline-flex items-center gap-2 rounded-md border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Reject
        </button>
        <button
          onClick={() => onFeature(appId)}
          disabled={actionsDisabled}
          aria-busy={isProcessing}
          className="inline-flex items-center gap-2 rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Star className="h-4 w-4" aria-hidden="true" />
          )}
          Feature
        </button>
      </div>
    </article>
  );
}
