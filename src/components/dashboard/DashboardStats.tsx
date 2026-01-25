"use client";

import {
  CheckCircle,
  Loader2,
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
} from "lucide-react";
import type { AppData } from "@/lib/constants";

// ============================================================================
// Types
// ============================================================================

export interface DashboardStatsProps {
  /** The developer's apps to compute stats from */
  apps: AppData[];
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Returns the current month and year as a human-readable string.
 * e.g. "January 2026"
 */
function getCurrentMonthYear(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Inline stats summary showing live and pending app counts.
 * Only renders when the developer has at least one app.
 * Meant to be placed inside the header alongside the page title.
 */
export function StatsSummary({ apps }: { apps: AppData[] }) {
  const liveAppsCount = apps.filter((app) => app.isApproved && app.isActive).length;
  const pendingAppsCount = apps.filter((app) => !app.isApproved && app.isActive).length;

  if (apps.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-6" role="region" aria-label="Application statistics">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950/50">
          <CheckCircle className="h-5 w-5 text-emerald-400" aria-hidden="true" />
        </div>
        <div>
          <div className="text-lg font-semibold text-slate-100">{liveAppsCount}</div>
          <div className="text-xs text-slate-500">Live Apps</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950/50">
          <Loader2 className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div>
          <div className="text-lg font-semibold text-slate-100">{pendingAppsCount}</div>
          <div className="text-xs text-slate-500">Pending Review</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Revenue overview section with three metric cards and an explanatory note.
 * Only renders when the developer has at least one live app.
 * Should be placed outside the header as a sibling section element.
 */
export function RevenueOverview({ apps }: { apps: AppData[] }) {
  const liveAppsCount = apps.filter((app) => app.isApproved && app.isActive).length;

  if (liveAppsCount === 0) return null;

  return (
    <section className="mt-8" aria-labelledby="revenue-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="revenue-heading" className="text-lg font-semibold text-slate-100">
          Revenue Overview
        </h2>
        <span className="text-xs text-slate-500">70% revenue share</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Revenue */}
        <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <DollarSign className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              All time
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-100">$0.00</div>
            <div className="mt-1 text-xs text-slate-500">Total Earnings</div>
          </div>
        </div>

        {/* This Month */}
        <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <span className="text-xs text-slate-500">{getCurrentMonthYear()}</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-100">$0.00</div>
            <div className="mt-1 text-xs text-slate-500">This Month</div>
          </div>
        </div>

        {/* Active Subscribers */}
        <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-5">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-400" aria-hidden="true" />
            </div>
            <span className="text-xs text-slate-500">Paying users</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-slate-100">0</div>
            <div className="mt-1 text-xs text-slate-500">Active Subscribers</div>
          </div>
        </div>
      </div>

      {/* Revenue Note */}
      <div className="mt-4 rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-500/10">
            <DollarSign className="h-4 w-4 text-brand-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-slate-300">
              Revenue is collected automatically through on-chain payments with a 70/30 split.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Your 70% share is sent directly to your connected wallet. View transaction
              history on the{" "}
              <a
                href="https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-brand-400 hover:text-brand-300"
              >
                block explorer
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * DashboardStats renders two sections:
 * 1. StatsSummary - inline counters for live and pending apps
 * 2. RevenueOverview - revenue cards and explanation (only if live apps exist)
 *
 * Both sections are data-driven from the `apps` prop - no manual state needed.
 */
export function DashboardStats({ apps }: DashboardStatsProps) {
  return (
    <>
      <StatsSummary apps={apps} />
      <RevenueOverview apps={apps} />
    </>
  );
}
