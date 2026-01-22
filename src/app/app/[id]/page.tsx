"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/Badge";
import { ArrowLeft, ExternalLink, Github, Calendar, User, AlertCircle } from "lucide-react";
import type { AppData } from "@/lib/constants";
import { formatDate, truncateAddress } from "@/lib/utils";
import { useContract } from "@/hooks/useContract";

// User-friendly network names
const networkNames: Record<number, string> = {
  33529: "Varity Network",
  421614: "Arbitrum Test",
  42161: "Arbitrum",
  8453: "Base",
  137: "Polygon",
  10: "Optimism",
  1: "Ethereum",
};

export default function AppDetailPage() {
  const params = useParams();
  const appId = params.id as string;
  const [app, setApp] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getApp, getAppScreenshots } = useContract();

  useEffect(() => {
    async function fetchApp() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch app data from contract
        const appData = await getApp(BigInt(appId));

        if (!appData) {
          setError("Application not found");
          setApp(null);
          return;
        }

        // Fetch screenshots if any
        let screenshots: string[] = [];
        if (Number(appData.screenshotCount) > 0) {
          screenshots = await getAppScreenshots(BigInt(appId), Number(appData.screenshotCount));
        }

        setApp({
          ...appData,
          screenshots: screenshots.length > 0 ? screenshots : undefined,
        });
      } catch (err) {
        console.error("Failed to fetch app:", err);
        setError(err instanceof Error ? err.message : "Failed to load application");
        setApp(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (appId) {
      fetchApp();
    }
  }, [appId, getApp, getAppScreenshots]);

  if (isLoading) {
    return <AppDetailSkeleton />;
  }

  if (!app) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-slate-800/50">
          <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-12 w-12 text-foreground-muted" />
            <h1 className="mt-4 text-xl font-semibold text-foreground">Application Not Found</h1>
            <p className="mt-2 text-foreground-secondary">
              The application you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-slate-950 transition-colors hover:bg-brand-400"
            >
              Browse Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const networkName = networkNames[Number(app.chainId)] || "Unknown";

  return (
    <div className="min-h-screen">
      {/* Back link */}
      <div className="border-b border-slate-800/50">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Logo */}
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800 sm:h-28 sm:w-28">
            {app.logoUrl ? (
              <Image
                src={app.logoUrl}
                alt={`${app.name} application logo`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-slate-600" aria-hidden="true">
                {app.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">
              {app.name}
            </h1>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="default">{app.category}</Badge>
              <Badge variant="secondary">{networkName}</Badge>
              {app.builtWithVarity && (
                <Badge variant="success">Verified</Badge>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={app.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
                aria-label={`Open ${app.name} application in new tab`}
              >
                Open Application
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              {app.githubUrl && (
                <a
                  href={app.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                  aria-label={`View ${app.name} source code on GitHub`}
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  View Source
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-100">About</h2>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
              {app.description}
            </div>

            {/* Screenshots placeholder */}
            {app.screenshots && app.screenshots.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-slate-100">Screenshots</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {app.screenshots.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video overflow-hidden rounded-lg bg-slate-800"
                    >
                      <Image
                        src={url}
                        alt={`${app.name} screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-sm font-semibold text-slate-200">Details</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                  <div>
                    <dt className="text-slate-500">Developer</dt>
                    <dd className="mt-1 font-mono text-slate-300">
                      {truncateAddress(app.developer, 6)}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
                  <div>
                    <dt className="text-slate-500">Published</dt>
                    <dd className="mt-1 text-slate-300">
                      {formatDate(app.createdAt)}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* External links */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-sm font-semibold text-slate-200">Links</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href={app.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-400 transition-colors hover:text-slate-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Application Website
                  </a>
                </li>
                {app.githubUrl && (
                  <li>
                    <a
                      href={app.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-400 transition-colors hover:text-slate-200"
                    >
                      <Github className="h-4 w-4" />
                      Source Code
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Back link */}
      <div className="border-b border-slate-800/50">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-slate-800 animate-pulse sm:h-28 sm:w-28" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-64 rounded bg-slate-800 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-slate-800 animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-slate-800 animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-40 rounded-md bg-slate-800 animate-pulse" />
              <div className="h-10 w-32 rounded-md bg-slate-800 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-24 rounded bg-slate-800 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-800 animate-pulse" />
              <div className="h-4 w-full rounded bg-slate-800 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-slate-800 animate-pulse" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 space-y-4">
              <div className="h-5 w-16 rounded bg-slate-800 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-slate-800 animate-pulse" />
                <div className="h-4 w-full rounded bg-slate-800 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
