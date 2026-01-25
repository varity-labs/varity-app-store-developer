"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAppsByDeveloper } from "@/hooks/useContract";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { AppRow } from "@/components/dashboard/AppRow";
import { StatsSummary, RevenueOverview } from "@/components/dashboard/DashboardStats";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ToastContainer, type ToastType } from "@/components/Toast";

// ============================================================================
// Loading Skeleton
// ============================================================================

/**
 * Skeleton placeholder shown while apps are loading from the contract.
 */
function DashboardSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading applications">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Logo skeleton */}
            <div className="h-14 w-14 flex-shrink-0 animate-pulse rounded-lg bg-slate-800" />
            {/* Content skeleton */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-5 w-48 animate-pulse rounded bg-slate-800" />
              <div className="h-4 w-72 animate-pulse rounded bg-slate-800/60" />
              <div className="h-3 w-36 animate-pulse rounded bg-slate-800/40" />
            </div>
            {/* Action buttons skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 animate-pulse rounded-md bg-slate-800" />
              <div className="h-9 w-9 animate-pulse rounded-md bg-slate-800" />
              <div className="h-9 w-9 animate-pulse rounded-md bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading your applications...</span>
    </div>
  );
}

// ============================================================================
// Error State
// ============================================================================

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/**
 * Error state shown when fetching apps fails.
 */
function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="rounded-lg border border-red-900/50 bg-red-950/20 p-8 text-center"
      role="alert"
    >
      <AlertCircle className="mx-auto h-10 w-10 text-red-400" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-semibold text-slate-200">
        Failed to Load Applications
      </h3>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-slate-100"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try Again
      </button>
    </div>
  );
}

// ============================================================================
// Main Dashboard Page
// ============================================================================

export default function DashboardPage() {
  const { authenticated, login, user } = useAuth();
  const [dismissedCelebrations, setDismissedCelebrations] = useState<Set<string>>(
    new Set()
  );

  // Toast state
  const [toasts, setToasts] = useState<
    Array<{ id: string; type: ToastType; title: string; message?: string }>
  >([]);

  // Use React Query hook for fetching developer's apps
  const walletAddress = user?.wallet?.address;
  const {
    data: apps = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAppsByDeveloper(walletAddress, 100);

  // Toast management
  const addToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Unauthenticated state ──────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-xl font-semibold text-slate-100">Developer Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to manage your applications.
        </p>
        <button
          onClick={login}
          className="mt-4 rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
        >
          Sign In
        </button>
      </div>
    );
  }

  // ── Authenticated dashboard ────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">My Applications</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your submitted applications and track their approval status.
            </p>
          </div>
          <Link
            href="/submit"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
            aria-label="Submit a new application"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Application
          </Link>
        </div>

        {/* Stats summary (live/pending counters) */}
        {!isLoading && apps.length > 0 && <StatsSummary apps={apps} />}
      </header>

      {/* Revenue overview - only when there are live apps */}
      {!isLoading && apps.length > 0 && <RevenueOverview apps={apps} />}

      {/* Apps list */}
      <section className="mt-8" aria-labelledby="apps-heading">
        <h2 id="apps-heading" className="sr-only">
          Your Applications
        </h2>

        {isLoading ? (
          <DashboardSkeleton />
        ) : isError ? (
          <ErrorState
            message={
              error instanceof Error
                ? error.message
                : "Could not load your applications. Please check your connection and try again."
            }
            onRetry={() => refetch()}
          />
        ) : apps.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {apps.map((app) => (
              <AppRow
                key={app.id.toString()}
                app={app}
                celebrationDismissed={dismissedCelebrations.has(app.id.toString())}
                onDismissCelebration={() => {
                  setDismissedCelebrations(
                    (prev) => new Set(prev).add(app.id.toString())
                  );
                }}
                onToast={addToast}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
