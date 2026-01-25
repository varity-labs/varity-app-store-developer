"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/Badge";
import {
  ExternalLink,
  Settings,
  Trash2,
  CheckCircle,
  Loader2,
  AlertCircle,
  Share2,
  PartyPopper,
  RotateCcw,
} from "lucide-react";
import type { AppData } from "@/lib/constants";
import { useDeactivateAppMutation } from "@/hooks/useContract";
import type { ToastType } from "@/components/Toast";

// ============================================================================
// Types
// ============================================================================

/**
 * Props for the AppRow component.
 */
export interface AppRowProps {
  /** The application data to display */
  app: AppData;
  /** Whether the celebration banner has been dismissed */
  celebrationDismissed: boolean;
  /** Callback to dismiss the celebration banner */
  onDismissCelebration: () => void;
  /** Callback to show a toast notification */
  onToast?: (type: ToastType, title: string, message?: string) => void;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Formats a Unix timestamp (in seconds as bigint) into a human-readable
 * relative time string, e.g. "3 days ago", "2 hours ago", "just now".
 */
function getTimeAgo(timestamp: bigint): string {
  const now = Date.now();
  const createdAt = Number(timestamp) * 1000;
  const diff = now - createdAt;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "just now";
}

/**
 * Returns a Badge component reflecting the app's current status.
 */
function StatusBadge({ app }: { app: AppData }) {
  if (!app.isActive) {
    return <Badge variant="warning">Inactive</Badge>;
  }
  if (app.isApproved) {
    return <Badge variant="success">Approved</Badge>;
  }
  return <Badge variant="default">Pending Review</Badge>;
}

// ============================================================================
// Component
// ============================================================================

/**
 * AppRow displays a single application in the developer dashboard.
 *
 * Features:
 * - Approval celebration banner with share action
 * - Pending review state with submission time
 * - Rejection/needs-revision encouragement with edit link
 * - App card with logo, name, description, status badge
 * - Action buttons: open URL, edit, deactivate
 * - Uses React Query mutation for deactivation (no page reload)
 * - Toast notifications instead of browser alerts
 */
export function AppRow({
  app,
  celebrationDismissed,
  onDismissCelebration,
  onToast,
}: AppRowProps) {
  const deactivateMutation = useDeactivateAppMutation();
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Derived display states
  const showCelebration = app.isApproved && app.isActive && !celebrationDismissed;
  const showPending = !app.isApproved && app.isActive;
  const showRejection = !app.isApproved && !app.isActive;

  /**
   * Handles deactivation of the app via React Query mutation.
   * On success, queries are automatically invalidated -- no page reload needed.
   */
  const handleDeactivate = useCallback(async () => {
    if (
      !confirm(
        "Are you sure you want to deactivate this application? It will be removed from the marketplace."
      )
    ) {
      return;
    }

    setIsDeactivating(true);
    try {
      await deactivateMutation.mutateAsync(app.id);
      onToast?.("success", "App Deactivated", `${app.name} has been removed from the marketplace.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to deactivate application";
      onToast?.("error", "Deactivation Failed", message);
    } finally {
      setIsDeactivating(false);
    }
  }, [app.id, app.name, deactivateMutation, onToast]);

  /**
   * Handles sharing the app link via the Web Share API or clipboard fallback.
   */
  const handleShare = useCallback(() => {
    const appUrl = `${window.location.origin}/app/${app.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: app.name,
          text: app.description,
          url: appUrl,
        })
        .catch(() => {
          navigator.clipboard.writeText(appUrl);
          onToast?.("info", "Link Copied", "App link copied to clipboard.");
        });
    } else {
      navigator.clipboard.writeText(appUrl);
      onToast?.("info", "Link Copied", "App link copied to clipboard.");
    }
  }, [app.id, app.name, app.description, onToast]);

  return (
    <div className="space-y-3" role="article" aria-label={`Application: ${app.name}`}>
      {/* ----------------------------------------------------------------- */}
      {/* Approval Celebration Banner                                       */}
      {/* ----------------------------------------------------------------- */}
      {showCelebration && (
        <div className="relative overflow-hidden rounded-lg border border-emerald-900/50 bg-gradient-to-r from-emerald-950/50 to-emerald-900/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <PartyPopper className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-emerald-400">
                Congratulations! Your app is live!
              </h3>
              <p className="mt-1 text-sm text-emerald-400/80">
                {app.name} has been approved and is now visible in the App Store.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/app/${app.id}`}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
                >
                  View Your Listing
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-md border border-emerald-500 bg-transparent px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/10"
                >
                  <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Share
                </button>
              </div>
            </div>
            <button
              onClick={onDismissCelebration}
              className="flex-shrink-0 text-emerald-400/60 transition-colors hover:text-emerald-400"
              aria-label="Dismiss celebration banner"
            >
              <span className="text-xl" aria-hidden="true">
                &times;
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Pending Review State                                              */}
      {/* ----------------------------------------------------------------- */}
      {showPending && (
        <div className="rounded-lg border border-blue-900/50 bg-blue-950/30 p-4">
          <div className="flex items-start gap-3">
            <Loader2
              className="h-5 w-5 flex-shrink-0 animate-spin text-blue-400"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-blue-400">Under Review</h4>
              <p className="mt-1 text-sm text-blue-400/80">
                Your app is being reviewed by our team. Average review time: 24 hours.
              </p>
              <p className="mt-1 text-xs text-blue-400/60">
                Submitted {getTimeAgo(app.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Rejection / Needs Revision Encouragement                          */}
      {/* ----------------------------------------------------------------- */}
      {showRejection && (
        <div className="rounded-lg border border-orange-900/50 bg-orange-950/30 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="h-5 w-5 flex-shrink-0 text-orange-400"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-orange-400">Needs Revision</h4>
              <p className="mt-1 text-sm text-orange-400/80">
                Your application needs some updates before it can be approved.
              </p>
              <p className="mt-2 text-sm text-orange-300">
                Don&apos;t worry! Most apps are approved after addressing feedback.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/edit/${app.id.toString()}`}
                  className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Update &amp; Resubmit
                </Link>
                <a
                  href="https://docs.varity.so/guidelines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-orange-500 bg-transparent px-4 py-2 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/10"
                >
                  View Guidelines
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* App Card                                                          */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-5 sm:flex-row sm:items-center">
        {/* Logo */}
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
          {app.logoUrl ? (
            <Image
              src={app.logoUrl}
              alt={`${app.name} logo`}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-600">
              {app.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium text-slate-100">{app.name}</h3>
            <StatusBadge app={app} />
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-slate-500">{app.description}</p>
          <p className="mt-1 text-xs text-slate-600">
            {app.category} &middot; Submitted {getTimeAgo(app.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2" role="group" aria-label={`Actions for ${app.name}`}>
          <a
            href={app.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-slate-800 p-2 text-slate-500 transition-colors hover:border-slate-700 hover:text-slate-300"
            title="Open application"
            aria-label={`Open ${app.name} in new tab`}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <Link
            href={`/dashboard/edit/${app.id.toString()}`}
            className="rounded-md border border-slate-800 p-2 text-slate-500 transition-colors hover:border-slate-700 hover:text-slate-300"
            title="Edit application"
            aria-label={`Edit ${app.name}`}
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </Link>
          {app.isActive ? (
            <button
              onClick={handleDeactivate}
              disabled={isDeactivating || deactivateMutation.isPending}
              className="rounded-md border border-slate-800 p-2 text-slate-500 transition-colors hover:border-red-900 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              title="Deactivate application"
              aria-label={`Deactivate ${app.name}`}
            >
              {isDeactivating ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          ) : (
            <span
              className="rounded-md border border-slate-800/50 p-2 text-slate-700 cursor-default"
              title="App is inactive"
              aria-label={`${app.name} is inactive`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
