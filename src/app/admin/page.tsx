"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Check, X, AlertTriangle, Loader2, Search } from "lucide-react";
import type { AppData } from "@/lib/constants";
import { useContract } from "@/hooks/useContract";
import { varityL3 } from "@/lib/thirdweb";

import { AdminStats } from "@/components/admin/AdminStats";
import type { AdminStatsData } from "@/components/admin/AdminStats";
import { AdminFilters } from "@/components/admin/AdminFilters";
import { AppReviewCard } from "@/components/admin/AppReviewCard";
import { RejectModal, REJECTION_TEMPLATES } from "@/components/admin/RejectModal";

export default function AdminPage() {
  const { authenticated, login, user } = useAuth();
  const [pendingApps, setPendingApps] = useState<AppData[]>([]);
  const [filteredApps, setFilteredApps] = useState<AppData[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [contractInitialized, setContractInitialized] = useState<boolean | null>(null);
  const [totalApps, setTotalApps] = useState(0);
  const [approvedToday, setApprovedToday] = useState(0);
  const [rejectedToday, setRejectedToday] = useState(0);
  const [reviewedToday, setReviewedToday] = useState(0);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Bulk selection state
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Current focused app index for keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState(0);

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
  const [initializeSuccess, setInitializeSuccess] = useState(false);

  // ── Derived stats object for AdminStats ────────────────────────────────

  const statsData: AdminStatsData = {
    pendingCount: pendingApps.length,
    reviewedToday,
    approvedToday,
    totalApps,
  };

  // ── Filter apps based on search and category ──────────────────────────

  useEffect(() => {
    let filtered = [...pendingApps];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.developer.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (app) => app.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredApps(filtered);
    setFocusedIndex(0);
  }, [pendingApps, searchQuery, categoryFilter]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (showRejectModal) {
        // Escape is handled by RejectModal internally
        return;
      }

      const currentApp = filteredApps[focusedIndex];
      if (!currentApp) return;

      switch (e.key.toLowerCase()) {
        case "a":
          e.preventDefault();
          handleApprove(currentApp.id.toString());
          break;
        case "r":
          e.preventDefault();
          setShowRejectModal(currentApp.id.toString());
          break;
        case "n":
        case "arrowdown":
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, filteredApps.length - 1));
          break;
        case "p":
        case "arrowup":
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "f":
          e.preventDefault();
          handleFeature(currentApp.id.toString());
          break;
        case " ":
          e.preventDefault();
          toggleAppSelection(currentApp.id.toString());
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [filteredApps, focusedIndex, showRejectModal]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Selection helpers ──────────────────────────────────────────────────

  const toggleAppSelection = useCallback((appId: string) => {
    setSelectedApps((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) {
        next.delete(appId);
      } else {
        next.add(appId);
      }
      return next;
    });
  }, []);

  const selectAllApps = useCallback(() => {
    setSelectedApps(new Set(filteredApps.map((app) => app.id.toString())));
  }, [filteredApps]);

  const deselectAllApps = useCallback(() => {
    setSelectedApps(new Set());
  }, []);

  // ── Admin & contract checks ────────────────────────────────────────────

  useEffect(() => {
    async function checkAdminStatus() {
      if (!authenticated || !user?.wallet?.address) {
        setIsAdmin(false);
        setIsCheckingAdmin(false);
        return;
      }

      setIsCheckingAdmin(true);
      try {
        await getTotalApps();
        setContractInitialized(true);
        const adminStatus = await checkIsAdmin(user.wallet.address);
        setIsAdmin(adminStatus);
      } catch {
        setContractInitialized(false);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    }

    checkAdminStatus();
  }, [authenticated, user?.wallet?.address]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch pending apps and stats ───────────────────────────────────────

  useEffect(() => {
    async function fetchPendingApps() {
      if (!isAdmin) {
        setPendingApps([]);
        return;
      }

      setIsLoadingApps(true);
      try {
        const apps = await getPendingApps(100);
        const pending = apps.filter((app) => !app.isApproved && app.isActive);
        setPendingApps(pending);
      } catch {
        setPendingApps([]);
      } finally {
        setIsLoadingApps(false);
      }
    }

    async function fetchStats() {
      if (!isAdmin) return;

      try {
        const total = await getTotalApps();
        setTotalApps(total);

        const allApps = await getAllApps(1000);
        const now = Math.floor(Date.now() / 1000);
        const oneDayAgo = now - 86400;

        const approvedTodayCount = allApps.filter(
          (app) => app.isApproved && Number(app.createdAt) > oneDayAgo
        ).length;

        const rejectedTodayCount = allApps.filter(
          (app) => !app.isApproved && !app.isActive && Number(app.createdAt) > oneDayAgo
        ).length;

        setApprovedToday(approvedTodayCount);
        setRejectedToday(rejectedTodayCount);
        setReviewedToday(approvedTodayCount + rejectedTodayCount);
      } catch {
        // Stats are non-critical; fail silently
      }
    }

    if (!isCheckingAdmin && isAdmin) {
      fetchPendingApps();
      fetchStats();
    }
  }, [isAdmin, isCheckingAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Contract action handlers ───────────────────────────────────────────

  const handleInitialize = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setInitializeSuccess(false);
    resetState();

    try {
      await initialize();
      setInitializeSuccess(true);
      setSuccessMessage("Contract initialized successfully. You are now set as the marketplace admin.");
      setTimeout(() => {
        setSuccessMessage(null);
        window.location.reload();
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to initialize contract";
      setErrorMessage(message);
    }
  };

  const handleApprove = async (appId: string, andNext = false) => {
    setProcessingId(appId);
    setErrorMessage(null);
    setSuccessMessage(null);
    resetState();

    try {
      await approveApp(BigInt(appId));

      setPendingApps((prev) => prev.filter((app) => app.id.toString() !== appId));
      setSelectedApps((prev) => {
        const next = new Set(prev);
        next.delete(appId);
        return next;
      });
      setSuccessMessage("Application approved successfully!");

      if (andNext && filteredApps.length > 1) {
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to approve application";
      setErrorMessage(message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (appId: string, isBulk = false) => {
    if (!rejectReason.trim()) {
      setErrorMessage("Please provide a reason for rejection");
      return;
    }

    setProcessingId(appId);
    setErrorMessage(null);
    setSuccessMessage(null);
    resetState();

    try {
      await rejectApp(BigInt(appId), rejectReason);

      setPendingApps((prev) => prev.filter((app) => app.id.toString() !== appId));
      setSelectedApps((prev) => {
        const next = new Set(prev);
        next.delete(appId);
        return next;
      });

      if (!isBulk) {
        setShowRejectModal(null);
        setRejectReason("");
        setSelectedTemplate("");
        setSuccessMessage("Application rejected successfully");
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (error) {
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
      await featureApp(BigInt(appId));
      setSuccessMessage("Application featured successfully!");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to feature application";
      setErrorMessage(message);
    } finally {
      setProcessingId(null);
    }
  };

  // ── Bulk actions ───────────────────────────────────────────────────────

  const handleBulkApprove = async () => {
    if (selectedApps.size === 0) return;
    setShowBulkActions(false);
    const appIds = Array.from(selectedApps);

    for (const appId of appIds) {
      await handleApprove(appId);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    deselectAllApps();
  };

  const handleBulkReject = () => {
    if (selectedApps.size === 0) return;
    const firstAppId = Array.from(selectedApps)[0];
    setShowRejectModal(firstAppId);
  };

  const handleBulkRejectConfirm = async () => {
    if (!rejectReason.trim() || selectedApps.size === 0) return;

    const appIds = Array.from(selectedApps);
    setShowRejectModal(null);

    for (const appId of appIds) {
      await handleReject(appId, true);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setRejectReason("");
    setSelectedTemplate("");
    deselectAllApps();
    setSuccessMessage(`${appIds.length} application(s) rejected successfully`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // ── Template selection for RejectModal ─────────────────────────────────

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    const template = REJECTION_TEMPLATES.find((t) => t.value === value);
    if (template && template.value !== "" && template.value !== "CUSTOM") {
      setRejectReason(template.value);
    } else if (template?.value === "CUSTOM") {
      setRejectReason("");
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  // RENDER - Early returns for auth / permission states
  // ══════════════════════════════════════════════════════════════════════

  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4" role="status">
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4" role="status" aria-label="Checking permissions">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-slate-300" aria-hidden="true" />
        <p className="mt-4 text-sm text-slate-500">Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin && contractInitialized) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4" role="alert">
        <div className="mx-auto max-w-lg text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-slate-100">Access Denied</h1>
          <p className="mt-2 text-sm text-slate-500">
            Your wallet ({account?.address?.slice(0, 10)}...) is not authorized to access the admin panel.
            Only approved administrators can review and manage application submissions.
          </p>
          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-left">
            <h3 className="text-sm font-medium text-slate-200">Need admin access?</h3>
            <p className="mt-2 text-xs text-slate-400">
              Contact the contract owner or an existing admin to grant you admin privileges.
            </p>
          </div>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin && !contractInitialized) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="mx-auto max-w-lg text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-slate-100">Contract Needs Initialization</h1>
          <p className="mt-2 text-sm text-slate-500">
            The smart contract needs to be initialized. This is a one-time setup that will set your wallet as the first admin.
          </p>
          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-left">
            <h3 className="text-sm font-medium text-slate-200">What does this do?</h3>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              <li>Sets your wallet ({account?.address?.slice(0, 10)}...) as contract owner</li>
              <li>Adds you as the first admin</li>
              <li>Enables app submission and approval features</li>
              <li>Can only be done once (one-time setup)</li>
            </ul>
          </div>
          <button
            onClick={handleInitialize}
            disabled={contractLoading}
            aria-busy={contractLoading}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {contractLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {contractLoading ? "Initializing Contract..." : "Initialize Contract Now"}
          </button>
          {errorMessage && (
            <div className="mt-4 rounded-lg border border-red-900 bg-red-950/50 p-3 text-left" role="alert">
              <p className="text-xs text-red-400">{errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div className="mt-4 rounded-lg border border-emerald-900 bg-emerald-950/50 p-3 text-left" role="status">
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

  // ══════════════════════════════════════════════════════════════════════
  // MAIN ADMIN DASHBOARD
  // ══════════════════════════════════════════════════════════════════════

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8" role="main" aria-label="Admin dashboard">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review, approve, and manage application submissions to maintain marketplace quality.
        </p>
      </header>

      {/* Initialize Contract Banner (edge case: admin flag set but contract not ready) */}
      {authenticated && !isCheckingAdmin && !isAdmin && (
        <div className="mt-6 rounded-lg border border-amber-900 bg-amber-950/50 p-4" role="alert">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-400">Contract Not Initialized</h3>
              <p className="mt-1 text-sm text-amber-400/80">
                The contract needs to be initialized. Click below to set yourself as the first admin.
              </p>
              <button
                onClick={handleInitialize}
                disabled={contractLoading}
                aria-busy={contractLoading}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {contractLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {contractLoading ? "Initializing..." : "Initialize Contract"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification banners */}
      {successMessage && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-emerald-900 bg-emerald-950/50 p-4" role="status" aria-live="polite">
          <Check className="h-5 w-5 flex-shrink-0 text-emerald-400" aria-hidden="true" />
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
            aria-label="Dismiss success message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-900 bg-red-950/50 p-4" role="alert" aria-live="assertive">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-400" aria-hidden="true" />
          <div className="flex-1">
            <h3 className="font-medium text-red-400">Error</h3>
            <p className="mt-1 text-sm text-red-400/80">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400/60 hover:text-red-400"
            aria-label="Dismiss error message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats cards */}
      <AdminStats stats={statsData} />

      {/* Search, filters, bulk actions, shortcuts hint */}
      <AdminFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((v) => !v)}
        selectedCount={selectedApps.size}
        showBulkActions={showBulkActions}
        onToggleBulkActions={() => setShowBulkActions((v) => !v)}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        onDeselectAll={deselectAllApps}
        isLoading={contractLoading}
        filteredCount={filteredApps.length}
      />

      {/* Pending applications list */}
      <section className="mt-8" aria-labelledby="pending-heading">
        <div className="flex items-center justify-between">
          <h2 id="pending-heading" className="text-lg font-medium text-slate-100">
            Pending Applications
            {filteredApps.length !== pendingApps.length && (
              <span className="ml-2 text-sm text-slate-500">
                ({filteredApps.length} of {pendingApps.length})
              </span>
            )}
          </h2>
          {filteredApps.length > 0 && (
            <button
              onClick={() => {
                if (selectedApps.size === filteredApps.length) {
                  deselectAllApps();
                } else {
                  selectAllApps();
                }
              }}
              className="text-sm text-slate-400 hover:text-slate-200"
              aria-label={
                selectedApps.size === filteredApps.length
                  ? "Deselect all applications"
                  : "Select all applications"
              }
            >
              {selectedApps.size === filteredApps.length ? "Deselect all" : "Select all"}
            </button>
          )}
        </div>

        {isLoadingApps ? (
          <div className="mt-4 space-y-4" role="status" aria-label="Loading applications">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-800" />
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          pendingApps.length === 0 ? (
            /* All caught up */
            <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
              <Check className="h-12 w-12 text-emerald-500" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-medium text-slate-200">All Caught Up!</h3>
              <p className="mt-2 text-sm text-slate-500">
                No pending applications to review. Great job maintaining marketplace quality!
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-4">
                  <p className="text-xs text-emerald-400/80">Today</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-400">{reviewedToday}</p>
                  <p className="mt-0.5 text-xs text-emerald-400/60">reviewed</p>
                </div>
                <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-4">
                  <p className="text-xs text-blue-400/80">Total</p>
                  <p className="mt-1 text-2xl font-semibold text-blue-400">{totalApps}</p>
                  <p className="mt-0.5 text-xs text-blue-400/60">apps</p>
                </div>
                <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4">
                  <p className="text-xs text-amber-400/80">Pending</p>
                  <p className="mt-1 text-2xl font-semibold text-amber-400">0</p>
                  <p className="mt-0.5 text-xs text-amber-400/60">apps</p>
                </div>
              </div>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
              >
                Browse Store
              </Link>
            </div>
          ) : (
            /* No filter results */
            <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
              <Search className="h-8 w-8 text-slate-600" aria-hidden="true" />
              <h3 className="mt-3 text-base font-medium text-slate-200">No Results Found</h3>
              <p className="mt-1 text-sm text-slate-500">
                No apps match your search or filter criteria. Try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                }}
                className="mt-4 rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700"
              >
                Clear Filters
              </button>
            </div>
          )
        ) : (
          <div className="mt-4 space-y-4" role="list" aria-label="Pending applications for review">
            {filteredApps.map((app, index) => (
              <AppReviewCard
                key={app.id.toString()}
                app={app}
                isSelected={selectedApps.has(app.id.toString())}
                isFocused={index === focusedIndex}
                isProcessing={processingId === app.id.toString()}
                isContractLoading={contractLoading}
                filteredCount={filteredApps.length}
                onToggleSelection={toggleAppSelection}
                onApprove={handleApprove}
                onReject={(appId) => setShowRejectModal(appId)}
                onFeature={handleFeature}
              />
            ))}
          </div>
        )}
      </section>

      {/* Reject modal */}
      <RejectModal
        isOpen={!!showRejectModal}
        bulkCount={selectedApps.size > 1 ? selectedApps.size : 1}
        rejectReason={rejectReason}
        onRejectReasonChange={setRejectReason}
        selectedTemplate={selectedTemplate}
        onTemplateChange={handleTemplateChange}
        isProcessing={!!showRejectModal && processingId === showRejectModal}
        onConfirm={() => {
          if (selectedApps.size > 1) {
            handleBulkRejectConfirm();
          } else if (showRejectModal) {
            handleReject(showRejectModal);
          }
        }}
        onCancel={() => {
          setShowRejectModal(null);
          setRejectReason("");
          setSelectedTemplate("");
        }}
      />
    </div>
  );
}
