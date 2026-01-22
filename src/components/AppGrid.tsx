"use client";

import { AppCard } from "./AppCard";
import { Search } from "lucide-react";
import type { AppData } from "@/lib/constants";

interface AppGridProps {
  apps: AppData[];
  isLoading?: boolean;
}

export function AppGrid({ apps, isLoading }: AppGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <AppCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background-secondary/30 p-12 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10 border-2 border-brand-500/20">
          <Search className="h-8 w-8 text-brand-400" />
        </div>
        <h3 className="mt-6 text-heading-lg text-foreground">
          No Applications Found
        </h3>
        <p className="mt-3 max-w-md text-body-md text-foreground-secondary">
          Try adjusting your search or filters to discover more applications. New enterprise-grade apps are curated and added regularly.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background-tertiary px-6 h-11 text-sm font-medium text-foreground transition-all hover:bg-background-quaternary hover:border-brand-500"
        >
          Clear filters and refresh
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {apps.map((app) => (
        <AppCard key={app.id.toString()} app={app} />
      ))}
    </div>
  );
}

function AppCardSkeleton() {
  return (
    <div className="card flex flex-col">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl skeleton-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded skeleton-shimmer" />
          <div className="h-4 w-full rounded skeleton-shimmer" />
          <div className="h-4 w-2/3 rounded skeleton-shimmer" />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-6 w-20 rounded-full skeleton-shimmer" />
        <div className="h-6 w-16 rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}
