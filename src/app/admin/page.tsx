"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/Badge";
import { Check, X, Star, ExternalLink, AlertTriangle, Loader2 } from "lucide-react";
import type { AppData } from "@/lib/constants";
import { useContract } from "@/hooks/useContract";
import { varityL3 } from "@/lib/thirdweb";

export default function AdminPage() {
  const { authenticated, login, user } = useAuth();
  const [pendingApps, setPendingApps] = useState<AppData[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [totalApps, setTotalApps] = useState(0);
  const [approvedToday, setApprovedToday] = useState(0);

  const {
    getPendingApps,
    isAdmin: checkIsAdmin,
    approveApp,
    rejectApp,
    featureApp,
    initialize,
    getTotalApps,
    getAllApps,
    isLoading: contractLoading,
    error: contractError,
    txHash,
    resetState,
    account,
  } = useContract();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInitialize, setShowInitialize] = useState(false);
  const [initializeSuccess, setInitializeSuccess] = useState(false);

  // Check if user is admin
  useEffect(() => {
    async function checkAdminStatus() {
      if (!authenticated || !user?.wallet?.address) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      setIsCheckingAdmin(true);
      try {
        const adminStatus = await checkIsAdmin(user.wallet.address);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    }

    checkAdminStatus();
  }, [authenticated, user?.wallet?.address]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch pending apps and stats if user is admin
  useEffect(() => {
    async function fetchPendingApps() {
      if (!isAdmin) {
        setPendingApps([]);
        return;
      }

      setIsLoadingApps(true);
      try {
        const apps = await getPendingApps(100);
        // Filter to only show pending (not approved) and active apps
        const pending = apps.filter(app => !app.isApproved && app.isActive);
        setPendingApps(pending);
      } catch (error) {
        console.error("Error loading pending apps:", error);
        setPendingApps([]);
      } finally {
        setIsLoadingApps(false);
      }
    }

    async function fetchStats() {
      if (!isAdmin) return;

      try {
        // Get total apps count
        const total = await getTotalApps();
        setTotalApps(total);

        // Get all approved apps to calculate "approved today"
        const allApps = await getAllApps(1000);
        const now = Math.floor(Date.now() / 1000);
        const oneDayAgo = now - 86400; // 24 hours in seconds

        const approvedTodayCount = allApps.filter(app => {
          return app.isApproved && Number(app.createdAt) > oneDayAgo;
        }).length;

        setApprovedToday(approvedTodayCount);
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    }

    if (!isCheckingAdmin && isAdmin) {
      fetchPendingApps();
      fetchStats();
    }
  }, [isAdmin, isCheckingAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInitialize = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setInitializeSuccess(false);
    resetState();

    try {
      await initialize();
      setInitializeSuccess(true);
      setSuccessMessage("Contract initialized successfully. You are now set as the marketplace admin.");
      setShowInitialize(false);
      setTimeout(() => {
        setSuccessMessage(null);
        window.location.reload(); // Reload to check admin status
      }, 3000);
    } catch (error) {
      console.error("Initialize error:", error);
      const message = error instanceof Error ? error.message : "Failed to initialize contract";
      setErrorMessage(message);
    }
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-xl font-semibold text-slate-100">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in with an admin account to access this page.</p>
        <button
          onClick={login}
          className="mt-4 rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (isCheckingAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-slate-300"></div>
        <p className="mt-4 text-sm text-slate-500">Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-lg text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="mt-4 text-xl font-semibold text-slate-100">Contract Needs Initialization</h1>
          <p className="mt-2 text-sm text-slate-500">
            The smart contract needs to be initialized. This is a one-time setup that will set your wallet as the first admin.
          </p>

          {/* Contract Info */}
          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-left">
            <h3 className="text-sm font-medium text-slate-200">What does this do?</h3>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              <li>• Sets your wallet ({account?.address?.slice(0, 10)}...) as contract owner</li>
              <li>• Adds you as the first admin</li>
              <li>• Enables app submission and approval features</li>
              <li>• Can only be done once (one-time setup)</li>
            </ul>
          </div>

          {/* Initialize Button */}
          <button
            onClick={handleInitialize}
            disabled={contractLoading}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {contractLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {contractLoading ? "Initializing Contract..." : "Initialize Contract Now"}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 rounded-lg border border-red-900 bg-red-950/50 p-3 text-left">
              <p className="text-xs text-red-400">{errorMessage}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 rounded-lg border border-emerald-900 bg-emerald-950/50 p-3 text-left">
              <p className="text-xs text-emerald-400">{successMessage}</p>
            </div>
          )}

          <Link
            href="/"
            className="mt-4 inline-block rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
          >
            Return to Browse
          </Link>
        </div>
      </div>
    );
  }

  const handleApprove = async (appId: string) => {
    setProcessingId(appId);
    setErrorMessage(null);
    setSuccessMessage(null);
    resetState();

    try {
      // Call contract to approve app
      await approveApp(BigInt(appId));

      // Success - remove from pending list and show message
      setPendingApps((prev) => prev.filter((app) => app.id.toString() !== appId));
      setSuccessMessage("Application approved successfully!");

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Approve error:", error);
      const message = error instanceof Error ? error.message : "Failed to approve application";
      setErrorMessage(message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (appId: string) => {
    if (!rejectReason.trim()) {
      setErrorMessage("Please provide a reason for rejection");
      return;
    }

    setProcessingId(appId);
    setErrorMessage(null);
    setSuccessMessage(null);
    resetState();

    try {
      // Call contract to reject app
      await rejectApp(BigInt(appId), rejectReason);

      // Success - remove from pending list and show message
      setPendingApps((prev) => prev.filter((app) => app.id.toString() !== appId));
      setShowRejectModal(null);
      setRejectReason("");
      setSuccessMessage("Application rejected successfully");

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Reject error:", error);
      const message = error instanceof Error ? error.message : "Failed to reject application";
      setErrorMessage(message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleFeature = async (appId: string) => {
    setProcessingId(appId);
    setErrorMessage(null);
    setSuccessMessage(null);
    resetState();

    try {
      // Call contract to feature app
      await featureApp(BigInt(appId));

      // Success - show message
      setSuccessMessage("Application featured successfully!");

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Feature error:", error);
      const message = error instanceof Error ? error.message : "Failed to feature application";
      setErrorMessage(message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review, approve, and manage application submissions to maintain marketplace quality.
        </p>
      </div>

      {/* Initialize Contract Button (one-time setup) */}
      {authenticated && !isCheckingAdmin && !isAdmin && (
        <div className="mt-6 rounded-lg border border-amber-900 bg-amber-950/50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-400">Contract Not Initialized</h3>
              <p className="mt-1 text-sm text-amber-400/80">
                The contract needs to be initialized. Click below to set yourself as the first admin.
              </p>
              <button
                onClick={handleInitialize}
                disabled={contractLoading}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {contractLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {contractLoading ? "Initializing..." : "Initialize Contract"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-emerald-900 bg-emerald-950/50 p-4">
          <Check className="h-5 w-5 flex-shrink-0 text-emerald-400" />
          <div className="flex-1">
            <h3 className="font-medium text-emerald-400">{successMessage}</h3>
            {txHash && varityL3.blockExplorers?.[0] && (
              <a
                href={`${varityL3.blockExplorers[0].url}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 underline"
              >
                View transaction
              </a>
            )}
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400/60 hover:text-emerald-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-900 bg-red-950/50 p-4">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-400" />
          <div className="flex-1">
            <h3 className="font-medium text-red-400">Error</h3>
            <p className="mt-1 text-sm text-red-400/80">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400/60 hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">{pendingApps.length}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-500">Approved Today</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">{approvedToday}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-500">Total Applications</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">{totalApps}</p>
        </div>
      </div>

      {/* Pending apps */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-slate-100">Pending Applications</h2>
        {isLoadingApps ? (
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-800" />
            ))}
          </div>
        ) : pendingApps.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
            <Check className="h-8 w-8 text-emerald-500" />
            <h3 className="mt-3 text-base font-medium text-slate-200">All Caught Up</h3>
            <p className="mt-1 text-sm text-slate-500">No pending applications to review. Great job maintaining marketplace quality!</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {pendingApps.map((app) => (
              <div
                key={app.id.toString()}
                className="rounded-lg border border-slate-800 bg-slate-900/50 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* Logo */}
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800">
                    {app.logoUrl ? (
                      <Image src={app.logoUrl} alt={app.name} fill className="object-cover" />
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
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{app.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span>Developer: {app.developer.slice(0, 10)}...</span>
                      <a
                        href={app.appUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View App
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-800/50 pt-4">
                  <button
                    onClick={() => handleApprove(app.id.toString())}
                    disabled={processingId === app.id.toString() || contractLoading}
                    className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processingId === app.id.toString() ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {processingId === app.id.toString() ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(app.id.toString())}
                    disabled={processingId === app.id.toString() || contractLoading}
                    className="inline-flex items-center gap-2 rounded-md border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleFeature(app.id.toString())}
                    disabled={processingId === app.id.toString() || contractLoading}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processingId === app.id.toString() ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                    {processingId === app.id.toString() ? "Featuring..." : "Feature"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-lg font-medium text-slate-100">Reject Application</h3>
            <p className="mt-2 text-sm text-slate-500">
              Please provide a reason for rejection. This will be shared with the developer.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Reason for rejection..."
              className="mt-4 w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason("");
                }}
                className="rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={!rejectReason.trim() || processingId === showRejectModal || contractLoading}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId === showRejectModal && <Loader2 className="h-4 w-4 animate-spin" />}
                {processingId === showRejectModal ? "Rejecting..." : "Reject Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
