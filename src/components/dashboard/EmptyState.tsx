"use client";

import Link from "next/link";
import { Plus, CheckCircle } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface EmptyStateProps {
  /** Optional custom message for the heading */
  heading?: string;
  /** Optional custom description */
  description?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * EmptyState is displayed on the dashboard when the developer has no apps yet.
 *
 * It shows:
 * - An icon
 * - An encouraging heading and description
 * - A primary CTA to submit a first app
 * - Three benefit highlights
 */
export function EmptyState({
  heading = "Launch Your First Application",
  description = "Ready to join 100+ developers on Varity? Submit your app and get reviewed within 24 hours.",
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
      <div className="mx-auto max-w-md">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
          <Plus className="h-8 w-8 text-slate-400" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h3 className="mt-6 text-lg font-semibold text-slate-200">{heading}</h3>
        <p className="mt-3 text-sm text-slate-400">{description}</p>

        {/* CTA */}
        <Link
          href="/submit"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-white hover:shadow-lg"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Submit Your First App
        </Link>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>24-hour review</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>70-85% cost savings</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <span>Enterprise customers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
