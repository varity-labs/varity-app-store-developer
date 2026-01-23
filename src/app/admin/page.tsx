"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/Badge";
import { Check, X, Star, ExternalLink, AlertTriangle, Loader2, Search, Filter, CheckSquare, Square, Zap } from "lucide-react";
import type { AppData } from "@/lib/constants";
import { useContract } from "@/hooks/useContract";
import { varityL3 } from "@/lib/thirdweb";

// Rejection reason templates
const REJECTION_TEMPLATES = [
  { label: "Select a template...", value: "" },
  { label: "Incomplete submission - Missing required information", value: "Your submission is incomplete. Please ensure all required fields are filled out, including app name, description, logo, and working demo URL." },
  { label: "Quality issues - Low quality or broken app", value: "We cannot approve this app due to quality concerns. The app appears broken, has significant bugs, or does not meet our minimum quality standards. Please fix these issues and resubmit." },
  { label: "Policy violation - Inappropriate content", value: "This app violates our marketplace policies regarding appropriate content. Please review our guidelines and ensure your app complies before resubmitting." },
  { label: "Spam or malicious content", value: "This submission appears to be spam or contains potentially malicious content. If you believe this is an error, please contact support." },
  { label: "Duplicate submission", value: "This app appears to be a duplicate of an existing submission. Please check your developer dashboard for existing submissions before creating new ones." },
  { label: "Non-functional demo URL", value: "The demo URL provided is not accessible or does not work properly. Please ensure your app is publicly accessible and functioning correctly before resubmitting." },
  { label: "Misleading information", value: "The information provided about this app is misleading or inaccurate. Please ensure all details (description, screenshots, features) accurately represent your app." },
  { label: "Custom reason", value: "CUSTOM" },
];

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
  const [showInitialize, setShowInitialize] = useState(false);
  const [initializeSuccess, setInitializeSuccess] = useState(false);

  // Filter apps based on search and category
  useEffect(() => {
    let filtered = [...pendingApps];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.developer.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(app => app.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    setFilteredApps(filtered);
    setFocusedIndex(0); // Reset focus when filters change
  }, [pendingApps, searchQuery, categoryFilter]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Don't trigger if modal is open
      if (showRejectModal) {
        if (e.key === "Escape") {
          setShowRejectModal(null);
          setRejectReason("");
          setSelectedTemplate("");
        }
        return;
      }

      const currentApp = filteredApps[focusedIndex];
      if (!currentApp) return;

      switch (e.key.toLowerCase()) {
        case "a":
          // Approve current app
          e.preventDefault();
          handleApprove(currentApp.id.toString());
          break;
        case "r":
          // Reject current app
          e.preventDefault();
          setShowRejectModal(currentApp.id.toString());
          break;
        case "n":
        case "arrowdown":
          // Next app
          e.preventDefault();
          setFocusedIndex((prev) => Math.min(prev + 1, filteredApps.length - 1));
          break;
        case "p":
        case "arrowup":
          // Previous app
          e.preventDefault();
          setFocusedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "f":
          // Feature current app
          e.preventDefault();
          handleFeature(currentApp.id.toString());
          break;
        case " ":
          // Toggle selection (for bulk actions)
          e.preventDefault();
          toggleAppSelection(currentApp.id.toString());
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [filteredApps, focusedIndex, showRejectModal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle app selection for bulk actions
  const toggleAppSelection = (appId: string) => {
    setSelectedApps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appId)) {
        newSet.delete(appId);
      } else {
        newSet.add(appId);
      }
      return newSet;
    });
  };

  // Select all apps
  const selectAllApps = () => {
    setSelectedApps(new Set(filteredApps.map(app => app.id.toString())));
  };

  // Deselect all apps
  const deselectAllApps = () => {
    setSelectedApps(new Set());
  };

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

        const rejectedTodayCount = allApps.filter(app => {
          return !app.isApproved && !app.isActive && Number(app.createdAt) > oneDayAgo;
        }).length;

        setApprovedToday(approvedTodayCount);
        setRejectedToday(rejectedTodayCount);
        setReviewedToday(approvedTodayCount + rejectedTodayCount);
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

  const handleApprove = async (appId: string, andNext = false) => {
    setProcessingId(appId);
    setErrorMessage(null);
    setSuccessMessage(null);
    resetState();

    try {
      // Call contract to approve app
      await approveApp(BigInt(appId));

      // Success - remove from pending list and show message
      setPendingApps((prev) => prev.filter((app) => app.id.toString() !== appId));
      setSelectedApps(prev => {
        const newSet = new Set(prev);
        newSet.delete(appId);
        return newSet;
      });
      setSuccessMessage("Application approved successfully!");

      // If "approve and next", move to next app
      if (andNext && filteredApps.length > 1) {
        // Focus stays on same index, which will now show the next app
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (error) {
      console.error("Approve error:", error);
      const message = error instanceof Error ? error.message : "Failed to approve application";
      setErrorMessage(message);
    } finally {
      setProcessingId(null);
    }
  };

  // Bulk approve selected apps
  const handleBulkApprove = async () => {
    if (selectedApps.size === 0) return;

    setShowBulkActions(false);
    const appIds = Array.from(selectedApps);

    for (const appId of appIds) {
      await handleApprove(appId);
      // Small delay between approvals to avoid overwhelming the network
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    deselectAllApps();
  };

  // Bulk reject selected apps
  const handleBulkReject = () => {
    if (selectedApps.size === 0) return;
    // Show reject modal for first selected app, then handle bulk
    const firstAppId = Array.from(selectedApps)[0];
    setShowRejectModal(firstAppId);
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
      // Call contract to reject app
      await rejectApp(BigInt(appId), rejectReason);

      // Success - remove from pending list and show message
      setPendingApps((prev) => prev.filter((app) => app.id.toString() !== appId));
      setSelectedApps(prev => {
        const newSet = new Set(prev);
        newSet.delete(appId);
        return newSet;
      });

      if (!isBulk) {
        setShowRejectModal(null);
        setRejectReason("");
        setSelectedTemplate("");
        setSuccessMessage("Application rejected successfully");
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (error) {
      console.error("Reject error:", error);
      const message = error instanceof Error ? error.message : "Failed to reject application";
      setErrorMessage(message);
    } finally {
      setProcessingId(null);
    }
  };

  // Handle bulk reject with same reason
  const handleBulkRejectConfirm = async () => {
    if (!rejectReason.trim() || selectedApps.size === 0) return;

    const appIds = Array.from(selectedApps);
    setShowRejectModal(null);

    for (const appId of appIds) {
      await handleReject(appId, true);
      // Small delay between rejections
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setRejectReason("");
    setSelectedTemplate("");
    deselectAllApps();
    setSuccessMessage(`${appIds.length} application(s) rejected successfully`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Handle template selection
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    const template = REJECTION_TEMPLATES.find(t => t.value === value);
    if (template && template.value !== "" && template.value !== "CUSTOM") {
      setRejectReason(template.value);
    } else if (template?.value === "CUSTOM") {
      setRejectReason("");
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
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-500">Pending Review</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">{pendingApps.length}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-500">Reviewed Today</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-400">{reviewedToday}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-500">Approved Today</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">{approvedToday}</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-500">Total Apps</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100">{totalApps}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, description, or developer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-slate-800 bg-slate-900 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter and bulk actions */}
        <div className="flex items-center gap-2">
          {/* Category filter */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              categoryFilter !== "all"
                ? "border-emerald-900 bg-emerald-950/50 text-emerald-400"
                : "border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filter
            {categoryFilter !== "all" && <span className="ml-1 text-xs">(1)</span>}
          </button>

          {/* Bulk actions */}
          {selectedApps.size > 0 && (
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="inline-flex items-center gap-2 rounded-md border border-amber-900 bg-amber-950/50 px-3 py-2 text-sm font-medium text-amber-400 transition-colors hover:border-amber-800"
            >
              <CheckSquare className="h-4 w-4" />
              {selectedApps.size} selected
            </button>
          )}
        </div>
      </div>

      {/* Filter dropdown */}
      {showFilters && (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <label className="text-sm font-medium text-slate-300">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
                setCategoryFilter("all");
                setShowFilters(false);
              }}
              className="rounded-md border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-slate-700"
            >
              Clear
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Bulk actions dropdown */}
      {showBulkActions && (
        <div className="mt-3 rounded-lg border border-amber-900 bg-amber-950/50 p-4">
          <h3 className="text-sm font-medium text-amber-300">Bulk Actions</h3>
          <p className="mt-1 text-xs text-amber-400/80">
            {selectedApps.size} app{selectedApps.size !== 1 ? "s" : ""} selected
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleBulkApprove}
              disabled={contractLoading}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Approve All
            </button>
            <button
              onClick={handleBulkReject}
              disabled={contractLoading}
              className="inline-flex items-center gap-2 rounded-md border border-red-900 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Reject All
            </button>
            <button
              onClick={deselectAllApps}
              className="ml-auto rounded-md border border-slate-800 px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      {filteredApps.length > 0 && (
        <div className="mt-4 rounded-lg border border-blue-900/50 bg-blue-950/20 p-3">
          <p className="text-xs text-blue-400">
            <strong>Keyboard shortcuts:</strong> A = Approve | R = Reject | N/↓ = Next | P/↑ = Previous | Space = Select | F = Feature | Esc = Close modal
          </p>
        </div>
      )}

      {/* Pending apps */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-100">
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
            >
              {selectedApps.size === filteredApps.length ? "Deselect all" : "Select all"}
            </button>
          )}
        </div>
        {isLoadingApps ? (
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-800" />
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          pendingApps.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
              <Check className="h-12 w-12 text-emerald-500" />
              <h3 className="mt-4 text-lg font-medium text-slate-200">All Caught Up!</h3>
              <p className="mt-2 text-sm text-slate-500">No pending applications to review. Great job maintaining marketplace quality!</p>

              {/* Enhanced stats when all caught up */}
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
            <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
              <Search className="h-8 w-8 text-slate-600" />
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
          <div className="mt-4 space-y-4">
            {filteredApps.map((app, index) => {
              const isSelected = selectedApps.has(app.id.toString());
              const isFocused = index === focusedIndex;
              const isProcessing = processingId === app.id.toString();

              return (
                <div
                  key={app.id.toString()}
                  className={`rounded-lg border p-5 transition-all ${
                    isFocused
                      ? "border-blue-700 bg-blue-950/30 shadow-lg shadow-blue-900/20"
                      : isSelected
                      ? "border-amber-800 bg-amber-950/20"
                      : "border-slate-800 bg-slate-900/50"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Selection checkbox */}
                    <button
                      onClick={() => toggleAppSelection(app.id.toString())}
                      className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 transition-colors hover:border-slate-700"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-6 w-6 text-amber-400" />
                      ) : (
                        <Square className="h-6 w-6 text-slate-600" />
                      )}
                    </button>

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
                        {isFocused && (
                          <Badge variant="info">
                            <span className="text-xs">← Focused</span>
                          </Badge>
                        )}
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
                      onClick={() => handleApprove(app.id.toString(), false)}
                      disabled={isProcessing || contractLoading}
                      className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      {isProcessing ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleApprove(app.id.toString(), true)}
                      disabled={isProcessing || contractLoading || filteredApps.length === 1}
                      className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Approve and move to next app"
                    >
                      <Zap className="h-4 w-4" />
                      Approve & Next
                    </button>
                    <button
                      onClick={() => setShowRejectModal(app.id.toString())}
                      disabled={isProcessing || contractLoading}
                      className="inline-flex items-center gap-2 rounded-md border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleFeature(app.id.toString())}
                      disabled={isProcessing || contractLoading}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                      Feature
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-lg font-medium text-slate-100">
              Reject Application{selectedApps.size > 1 ? "s" : ""}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {selectedApps.size > 1
                ? `This rejection reason will be applied to ${selectedApps.size} selected apps.`
                : "Please provide a reason for rejection. This will be shared with the developer."}
            </p>

            {/* Template dropdown */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-400">Quick Templates</label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
              >
                {REJECTION_TEMPLATES.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reason textarea */}
            <div className="mt-4">
              <label className="text-xs font-medium text-slate-400">
                Rejection Reason {selectedTemplate === "CUSTOM" && "(Custom)"}
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Reason for rejection..."
                className="mt-1.5 w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                {rejectReason.length} characters
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason("");
                  setSelectedTemplate("");
                }}
                className="rounded-md border border-slate-800 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedApps.size > 1) {
                    handleBulkRejectConfirm();
                  } else {
                    handleReject(showRejectModal);
                  }
                }}
                disabled={!rejectReason.trim() || processingId === showRejectModal || contractLoading}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingId === showRejectModal && <Loader2 className="h-4 w-4 animate-spin" />}
                {processingId === showRejectModal
                  ? "Rejecting..."
                  : selectedApps.size > 1
                  ? `Reject ${selectedApps.size} Apps`
                  : "Reject Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
