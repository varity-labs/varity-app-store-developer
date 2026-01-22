"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/Badge";
import { Plus, ExternalLink, Settings, Trash2 } from "lucide-react";
import type { AppData } from "@/lib/constants";
import { useContract } from "@/hooks/useContract";

export default function DashboardPage() {
  const { authenticated, login, user } = useAuth();
  const [apps, setApps] = useState<AppData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">My Applications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your submitted applications and track their approval status.
          </p>
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
        >
          <Plus className="h-4 w-4" />
          New Application
        </Link>
      </div>

      {/* Apps list */}
      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-800" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center">
            <h3 className="text-base font-medium text-slate-200">No Applications Yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              Submit your first application to join the curated marketplace and reach enterprise customers.
            </p>
            <Link
              href="/submit"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
            >
              <Plus className="h-4 w-4" />
              Submit Application
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => (
              <AppRow key={app.id.toString()} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppRow({ app }: { app: AppData }) {
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

  return (
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
  );
}
