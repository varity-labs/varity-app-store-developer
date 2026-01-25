"use client";

/**
 * AdminStats - Dashboard statistics cards for the admin panel.
 * Displays pending review, reviewed today, approved today, and total app counts.
 */

export interface AdminStatsData {
  /** Number of apps currently awaiting review */
  pendingCount: number;
  /** Number of apps reviewed (approved + rejected) in the last 24 hours */
  reviewedToday: number;
  /** Number of apps approved in the last 24 hours */
  approvedToday: number;
  /** Total number of apps registered in the contract */
  totalApps: number;
}

interface AdminStatsProps {
  stats: AdminStatsData;
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <section className="mt-6" aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        Review Statistics
      </h2>
      <div className="grid gap-4 sm:grid-cols-4" role="list" aria-label="Admin statistics">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4" role="listitem">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100" aria-label={`${stats.pendingCount} apps pending review`}>
            {stats.pendingCount}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4" role="listitem">
          <p className="text-sm text-slate-500">Reviewed Today</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-400" aria-label={`${stats.reviewedToday} apps reviewed today`}>
            {stats.reviewedToday}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4" role="listitem">
          <p className="text-sm text-slate-500">Approved Today</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100" aria-label={`${stats.approvedToday} apps approved today`}>
            {stats.approvedToday}
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4" role="listitem">
          <p className="text-sm text-slate-500">Total Apps</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100" aria-label={`${stats.totalApps} total apps`}>
            {stats.totalApps}
          </p>
        </div>
      </div>
    </section>
  );
}
