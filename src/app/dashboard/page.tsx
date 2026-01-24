"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/Badge";
import { Plus, ExternalLink, Settings, Trash2, CheckCircle, Loader2, AlertCircle, Share2, PartyPopper, DollarSign, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import type { AppData } from "@/lib/constants";
import { useContract } from "@/hooks/useContract";

export default function DashboardPage() {
  const { authenticated, login, user } = useAuth();
  const [apps, setApps] = useState<AppData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dismissedCelebrations, setDismissedCelebrations] = useState<Set<string>>(new Set());

  const { getAppsByDeveloper, deactivateApp, isLoading: contractLoading } = useContract();

  // Fetch user's apps when authenticated
  useEffect(() => {
    async function fetchUserApps() {
      if (!authenticated || !user?.wallet?.address) {
        setApps([]);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedApps = await getAppsByDeveloper(user.wallet.address, 100);
        setApps(fetchedApps);
      } catch (error) {
        console.error("Error loading user apps:", error);
        setApps([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserApps();
  }, [authenticated, user?.wallet?.address, getAppsByDeveloper]);

  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-xl font-semibold text-slate-100">Developer Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to manage your applications.</p>
        <button
          onClick={login}
          className="mt-4 rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Calculate stats
  const liveAppsCount = apps.filter(app => app.isApproved && app.isActive).length;
  const pendingAppsCount = apps.filter(app => !app.isApproved && app.isActive).length;

  // Helper to format time ago
  const getTimeAgo = (timestamp: bigint) => {
    const now = Date.now();
    const createdAt = Number(timestamp) * 1000;
    const diff = now - createdAt;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header with Stats */}
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
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white shrink-0"
            aria-label="Submit a new application"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Application
          </Link>
        </div>

        {/* Stats Summary - only show if has apps */}
        {apps.length > 0 && (
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
        )}
      </header>

      {/* Revenue Overview - only show if has approved apps */}
      {liveAppsCount > 0 && (
        <section className="mt-8" aria-labelledby="revenue-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="revenue-heading" className="text-lg font-semibold text-slate-100">Revenue Overview</h2>
            <span className="text-xs text-slate-500">70% revenue share</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Total Revenue */}
            <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  All time
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-slate-100">$0.00</div>
                <div className="text-xs text-slate-500 mt-1">Total Earnings</div>
              </div>
            </div>

            {/* This Month */}
            <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-xs text-slate-500">January 2026</span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-slate-100">$0.00</div>
                <div className="text-xs text-slate-500 mt-1">This Month</div>
              </div>
            </div>

            {/* Active Subscribers */}
            <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-xs text-slate-500">Paying users</span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-slate-100">0</div>
                <div className="text-xs text-slate-500 mt-1">Active Subscribers</div>
              </div>
            </div>
          </div>

          {/* Revenue Note */}
          <div className="mt-4 rounded-lg border border-slate-800/50 bg-slate-900/30 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/10 flex-shrink-0">
                <DollarSign className="h-4 w-4 text-brand-400" />
              </div>
              <div>
                <p className="text-sm text-slate-300">
                  Revenue is collected automatically through on-chain payments with a 70/30 split.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Your 70% share is sent directly to your connected wallet. View transaction history on the{" "}
                  <a
                    href="https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-0.5"
                  >
                    block explorer
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Apps list */}
      <section className="mt-8" aria-labelledby="apps-heading">
        <h2 id="apps-heading" className="sr-only">Your Applications</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-800" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
            <div className="mx-auto max-w-md">
              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                <Plus className="h-8 w-8 text-slate-400" />
              </div>

              {/* Heading */}
              <h3 className="mt-6 text-lg font-semibold text-slate-200">Launch Your First Application</h3>
              <p className="mt-3 text-sm text-slate-400">
                Ready to join 100+ developers on Varity? Submit your app and get reviewed within 24 hours.
              </p>

              {/* CTA */}
              <Link
                href="/submit"
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-white hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                Submit Your First App
              </Link>

              {/* Benefits */}
              <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>24-hour review</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>70-85% cost savings</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Enterprise customers</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => (
              <AppRow
                key={app.id.toString()}
                app={app}
                celebrationDismissed={dismissedCelebrations.has(app.id.toString())}
                onDismissCelebration={() => {
                  setDismissedCelebrations(prev => new Set(prev).add(app.id.toString()));
                }}
                getTimeAgo={getTimeAgo}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AppRow({
  app,
  celebrationDismissed,
  onDismissCelebration,
  getTimeAgo
}: {
  app: AppData;
  celebrationDismissed: boolean;
  onDismissCelebration: () => void;
  getTimeAgo: (timestamp: bigint) => string;
}) {
  const { deactivateApp, isLoading: contractLoading } = useContract();
  const { user } = useAuth();
  const [isDeactivating, setIsDeactivating] = useState(false);

  const getStatusBadge = () => {
    if (!app.isActive) {
      return <Badge variant="warning">Inactive</Badge>;
    }
    if (app.isApproved) {
      return <Badge variant="success">Approved</Badge>;
    }
    return <Badge variant="default">Pending Review</Badge>;
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate this application? It will be removed from the marketplace.")) {
      return;
    }

    setIsDeactivating(true);
    try {
      await deactivateApp(app.id);
      // Refresh apps list after successful deactivation
      window.location.reload();
    } catch (error) {
      console.error("Deactivate error:", error);
      alert(error instanceof Error ? error.message : "Failed to deactivate application");
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleShare = () => {
    const appUrl = `${window.location.origin}/app/${app.id}`;
    if (navigator.share) {
      navigator.share({
        title: app.name,
        text: app.description,
        url: appUrl,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(appUrl);
        alert("Link copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(appUrl);
      alert("Link copied to clipboard!");
    }
  };

  // Show approval celebration
  const showCelebration = app.isApproved && app.isActive && !celebrationDismissed;

  // Show pending review state
  const showPending = !app.isApproved && app.isActive;

  // Show rejection encouragement (assuming inactive + not approved = rejected)
  const showRejection = !app.isApproved && !app.isActive;

  return (
    <div className="space-y-3">
      {/* Approval Celebration Banner */}
      {showCelebration && (
        <div className="relative overflow-hidden rounded-lg border border-emerald-900/50 bg-gradient-to-r from-emerald-950/50 to-emerald-900/20 p-4">
          {/* Confetti effect using emoji */}
          <div className="absolute top-2 left-4 text-2xl animate-bounce">🎉</div>
          <div className="absolute top-1 right-8 text-xl animate-bounce" style={{ animationDelay: '0.1s' }}>✨</div>
          <div className="absolute top-3 right-16 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <PartyPopper className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-emerald-400">Congratulations! Your app is live!</h3>
              <p className="mt-1 text-sm text-emerald-400/80">
                {app.name} has been approved and is now visible in the App Store.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/app/${app.id}`}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-400"
                >
                  View Your Listing
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-md border border-emerald-500 bg-transparent px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/10"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
              </div>
            </div>
            <button
              onClick={onDismissCelebration}
              className="flex-shrink-0 text-emerald-400/60 transition-colors hover:text-emerald-400"
              aria-label="Dismiss"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>
      )}

      {/* Pending Review State */}
      {showPending && (
        <div className="rounded-lg border border-blue-900/50 bg-blue-950/30 p-4">
          <div className="flex items-start gap-3">
            <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin text-blue-400" />
            <div className="flex-1 min-w-0">
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

      {/* Rejection Encouragement */}
      {showRejection && (
        <div className="rounded-lg border border-orange-900/50 bg-orange-950/30 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-orange-400" />
            <div className="flex-1 min-w-0">
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
                  Update & Resubmit
                </Link>
                <a
                  href="https://docs.varity.so/guidelines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-orange-500 bg-transparent px-4 py-2 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/10"
                >
                  View Guidelines
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App Card */}
      <div className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-5 sm:flex-row sm:items-center">
        {/* Logo */}
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
          {app.logoUrl ? (
            <Image src={app.logoUrl} alt={app.name} fill className="object-cover" />
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
            {getStatusBadge()}
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-slate-500">{app.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={app.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-slate-800 p-2 text-slate-500 transition-colors hover:border-slate-700 hover:text-slate-300"
            title="Open application"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <Link
            href={`/dashboard/edit/${app.id.toString()}`}
            className="rounded-md border border-slate-800 p-2 text-slate-500 transition-colors hover:border-slate-700 hover:text-slate-300"
            title="Edit application"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDeactivate}
            disabled={isDeactivating || contractLoading}
            className="rounded-md border border-slate-800 p-2 text-slate-500 transition-colors hover:border-red-900 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            title="Deactivate application"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
