"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/Badge";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { ArrowLeft, ExternalLink, Github, Calendar, User, AlertCircle, ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import type { AppData } from "@/lib/constants";
import { formatDate, truncateAddress } from "@/lib/utils";
import { sanitizeInput, sanitizeUrl } from "@/lib/security";
import { useContract } from "@/hooks/useContract";
import { useAuth } from "@/hooks/useAuth";
import { StructuredData, createAppDetailPageSchema, type AppSchemaData } from "@/components/StructuredData";

/** User-friendly network display names */
const networkNames: Record<number, string> = {
  33529: "Varity Network",
  421614: "Arbitrum Test",
  42161: "Arbitrum",
  8453: "Base",
  137: "Polygon",
  10: "Optimism",
  1: "Ethereum",
};

/**
 * Breadcrumb navigation component for the app detail page.
 * Renders a semantic <nav> with an ordered list of breadcrumb items.
 */
function Breadcrumbs({ appName }: { appName?: string }) {
  return (
    <nav className="border-b border-slate-800/50" aria-label="Breadcrumb">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-2 text-sm text-slate-400" role="list">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:rounded"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-slate-600">/</li>
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:rounded"
            >
              Apps
            </Link>
          </li>
          {appName && (
            <>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li>
                <span className="text-slate-200 font-medium" aria-current="page">
                  {appName}
                </span>
              </li>
            </>
          )}
        </ol>
      </div>
    </nav>
  );
}

/**
 * Screenshot gallery with keyboard navigation and lightbox-style viewing.
 * Supports left/right arrow keys, focus management, and error handling.
 *
 * Features:
 * - Keyboard navigation (left/right arrows)
 * - Image error handling with fallback
 * - Lazy loading for performance
 * - Accessible ARIA labels and roles
 */
function ScreenshotGallery({ screenshots, appName }: { screenshots: string[]; appName: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const galleryRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const sanitizedScreenshots = screenshots
    .map((url) => sanitizeUrl(url))
    .filter((url): url is string => url !== null);

  const handleImageError = useCallback((index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : sanitizedScreenshots.length - 1));
  }, [sanitizedScreenshots.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < sanitizedScreenshots.length - 1 ? prev + 1 : 0));
  }, [sanitizedScreenshots.length]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  if (sanitizedScreenshots.length === 0) return null;

  return (
    <section className="mt-8" aria-labelledby="screenshots-heading">
      <h2 id="screenshots-heading" className="text-lg font-semibold text-slate-100">
        Screenshots
      </h2>

      {/* Main screenshot display */}
      <div
        ref={galleryRef}
        className="relative mt-4 aspect-video overflow-hidden rounded-lg bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        role="region"
        aria-label={`Screenshot ${selectedIndex + 1} of ${sanitizedScreenshots.length}`}
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {imageErrors.has(selectedIndex) ? (
          <div className="flex h-full w-full items-center justify-center text-slate-500">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 mb-2" aria-hidden="true" />
              <p>Failed to load screenshot</p>
            </div>
          </div>
        ) : (
          <Image
            src={sanitizedScreenshots[selectedIndex]}
            alt={`${appName} screenshot ${selectedIndex + 1} of ${sanitizedScreenshots.length}`}
            fill
            className="object-contain"
            loading={selectedIndex === 0 ? "eager" : "lazy"}
            itemProp="screenshot"
            sizes="(max-width: 768px) 100vw, 672px"
            onError={() => handleImageError(selectedIndex)}
            quality={90}
          />
        )}

        {/* Navigation arrows (only show if more than 1 screenshot) */}
        {sanitizedScreenshots.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 p-2 text-slate-300 backdrop-blur-sm transition-colors hover:bg-slate-900/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/70 p-2 text-slate-300 backdrop-blur-sm transition-colors hover:bg-slate-900/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Next screenshot"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Indicator dots */}
            <div
              className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
              role="tablist"
              aria-label="Screenshot navigation"
            >
              {sanitizedScreenshots.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === selectedIndex}
                  aria-label={`View screenshot ${index + 1}`}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    index === selectedIndex
                      ? "w-6 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip (for 3+ screenshots) */}
      {sanitizedScreenshots.length >= 3 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Screenshot thumbnails">
          {sanitizedScreenshots.map((url, index) => (
            <button
              key={index}
              ref={(el) => { thumbnailRefs.current[index] = el; }}
              type="button"
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`View screenshot ${index + 1}`}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                index === selectedIndex
                  ? "ring-2 ring-brand-500 opacity-100"
                  : "opacity-50 hover:opacity-75"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              {imageErrors.has(index) ? (
                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-600">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                </div>
              ) : (
                <Image
                  src={url}
                  alt={`${appName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="96px"
                  onError={() => handleImageError(index)}
                  quality={75}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * App detail page displaying comprehensive information about a single application.
 * Includes structured data, breadcrumb navigation, social sharing, and accessibility features.
 */
export default function AppDetailPage() {
  const params = useParams();
  const appId = params.id as string;
  const [app, setApp] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  const { getApp, getAppScreenshots } = useContract();
  const { walletAddress } = useAuth();

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

  // Loading state with skeleton
  if (isLoading) {
    return <AppDetailSkeleton />;
  }

  // Error state: app not found or fetch failed
  if (error || !app) {
    return (
      <div className="min-h-screen" role="main" aria-label="Application not found">
        <Breadcrumbs />
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center" role="alert">
            <AlertCircle className="h-12 w-12 text-foreground-muted" aria-hidden="true" />
            <h1 className="mt-4 text-xl font-semibold text-foreground">
              {error === "Application not found" ? "Application Not Found" : "Error Loading Application"}
            </h1>
            <p className="mt-2 max-w-md text-foreground-secondary">
              {error === "Application not found"
                ? "The application you're looking for doesn't exist or has been removed."
                : "Something went wrong while loading this application. Please try again later."}
            </p>
            {error && error !== "Application not found" && (
              <p className="mt-1 text-xs text-slate-500">Error: {sanitizeInput(error)}</p>
            )}
            <div className="mt-6 flex gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-medium text-slate-950 transition-colors hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                aria-label="Go back to browse all applications"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Browse Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sanitize displayed content
  const safeName = sanitizeInput(app.name);
  const safeDescription = sanitizeInput(app.description);
  const safeCategory = sanitizeInput(app.category);
  const safeAppUrl = sanitizeUrl(app.appUrl) || "#";
  const safeGithubUrl = app.githubUrl ? sanitizeUrl(app.githubUrl) : null;
  const safeLogoUrl = app.logoUrl ? sanitizeUrl(app.logoUrl) : null;

  const networkName = networkNames[Number(app.chainId)] || "Unknown";
  const isDeveloper = walletAddress?.toLowerCase() === app.developer.toLowerCase();
  const appPageUrl = `https://developer.store.varity.so/app/${appId}`;

  // Prepare structured data for the app
  const appSchemaData: AppSchemaData = {
    id: appId,
    name: safeName,
    description: safeDescription,
    appUrl: safeAppUrl,
    logoUrl: safeLogoUrl || "https://developer.store.varity.so/logo/varity-logo-color.svg",
    category: safeCategory,
    developer: app.developer,
    screenshots: app.screenshots,
    datePublished: new Date(Number(app.createdAt) * 1000).toISOString(),
  };

  const structuredData = createAppDetailPageSchema(appSchemaData, appId);

  return (
    <>
      <StructuredData data={structuredData} id={`app-${appId}-schema`} />
      <article
        className="min-h-screen"
        itemScope
        itemType="https://schema.org/SoftwareApplication"
      >
        {/* Breadcrumb navigation */}
        <Breadcrumbs appName={safeName} />

        {/* Main content */}
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8" role="main" aria-label={`${safeName} application details`}>
          {/* Developer dashboard link */}
          {isDeveloper && (
            <div className="mb-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-md border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-400 transition-colors hover:bg-brand-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                aria-label="Go back to your Developer Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Back to Dashboard
              </Link>
            </div>
          )}

          {/* Header section */}
          <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Logo */}
            <figure className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800 sm:h-28 sm:w-28">
              {safeLogoUrl && !logoError ? (
                <Image
                  src={safeLogoUrl}
                  alt={`${safeName} application logo`}
                  fill
                  className="object-cover"
                  itemProp="image"
                  priority
                  sizes="(max-width: 640px) 96px, 112px"
                  onError={() => setLogoError(true)}
                  quality={90}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-4xl font-semibold text-slate-600"
                  aria-hidden="true"
                >
                  {safeName.charAt(0).toUpperCase()}
                </div>
              )}
            </figure>

            {/* Info */}
            <div className="flex-1">
              <h1
                className="text-2xl font-semibold text-slate-100 sm:text-3xl"
                itemProp="name"
              >
                {safeName}
              </h1>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="default">
                  <span itemProp="applicationCategory">{safeCategory}</span>
                </Badge>
                <Badge variant="secondary">{networkName}</Badge>
                {app.builtWithVarity && <Badge variant="success">Verified</Badge>}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={safeAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  aria-label={`Open ${safeName} application in new tab`}
                  itemProp="url"
                >
                  Open Application
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
                {safeGithubUrl && (
                  <a
                    href={safeGithubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    aria-label={`View ${safeName} source code on GitHub`}
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    View Source
                  </a>
                )}
              </div>

              {/* Social Share */}
              <div className="mt-6">
                <div className="text-xs font-medium text-slate-500 mb-2">Share this app</div>
                <SocialShareButtons
                  appName={safeName}
                  appUrl={appPageUrl}
                  appDescription={
                    safeDescription.length > 120
                      ? safeDescription.slice(0, 117) + "..."
                      : safeDescription
                  }
                />
              </div>
            </div>
          </header>

          {/* Details grid */}
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {/* Description section */}
            <section className="lg:col-span-2" aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-lg font-semibold text-slate-100">
                About
              </h2>
              <p
                className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-400"
                itemProp="description"
              >
                {safeDescription}
              </p>

              {/* Screenshots gallery */}
              {app.screenshots && app.screenshots.length > 0 && (
                <ScreenshotGallery screenshots={app.screenshots} appName={safeName} />
              )}
            </section>

            {/* Sidebar */}
            <aside className="space-y-6" aria-label="Application details sidebar">
              {/* Metadata */}
              <section
                className="rounded-lg border border-slate-800 bg-slate-900/50 p-5"
                aria-labelledby="details-heading"
              >
                <h3 id="details-heading" className="text-sm font-semibold text-slate-200">
                  Details
                </h3>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <User
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-slate-500">Developer</dt>
                      <dd
                        className="mt-1 font-mono text-slate-300"
                        itemProp="author"
                        itemScope
                        itemType="https://schema.org/Organization"
                      >
                        <span itemProp="name">{truncateAddress(app.developer, 6)}</span>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-slate-500">Published</dt>
                      <dd className="mt-1 text-slate-300">
                        <time
                          dateTime={new Date(Number(app.createdAt) * 1000).toISOString()}
                          itemProp="datePublished"
                        >
                          {formatDate(app.createdAt)}
                        </time>
                      </dd>
                    </div>
                  </div>
                </dl>
              </section>

              {/* External links */}
              <section
                className="rounded-lg border border-slate-800 bg-slate-900/50 p-5"
                aria-labelledby="links-heading"
              >
                <h3 id="links-heading" className="text-sm font-semibold text-slate-200">
                  Links
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a
                      href={safeAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:rounded"
                      aria-label={`Visit ${safeName} application website`}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Application Website
                    </a>
                  </li>
                  {safeGithubUrl && (
                    <li>
                      <a
                        href={safeGithubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:rounded"
                        aria-label={`View ${safeName} source code on GitHub`}
                      >
                        <Github className="h-4 w-4" aria-hidden="true" />
                        Source Code
                      </a>
                    </li>
                  )}
                </ul>
              </section>

              {/* Share section in sidebar */}
              <section
                className="rounded-lg border border-slate-800 bg-slate-900/50 p-5"
                aria-labelledby="share-heading"
              >
                <h3 id="share-heading" className="text-sm font-semibold text-slate-200">
                  Share
                </h3>
                <div className="mt-4">
                  <SocialShareButtons
                    appName={safeName}
                    appUrl={appPageUrl}
                    appDescription={
                      safeDescription.length > 120
                        ? safeDescription.slice(0, 117) + "..."
                        : safeDescription
                    }
                  />
                </div>
              </section>
            </aside>
          </div>
        </div>
        <meta itemProp="operatingSystem" content="Web" />
        <meta itemProp="applicationSubCategory" content="Enterprise Software" />
      </article>
    </>
  );
}

/**
 * Loading skeleton for the app detail page.
 * Provides visual placeholder while data loads from the blockchain.
 */
function AppDetailSkeleton() {
  return (
    <div className="min-h-screen" role="main" aria-label="Loading application details" aria-busy="true">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-slate-800/50">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-10 rounded bg-slate-800 animate-pulse" />
            <div className="h-4 w-2 rounded bg-slate-800/50" aria-hidden="true" />
            <div className="h-4 w-10 rounded bg-slate-800 animate-pulse" />
            <div className="h-4 w-2 rounded bg-slate-800/50" aria-hidden="true" />
            <div className="h-4 w-24 rounded bg-slate-800 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div
            className="h-24 w-24 flex-shrink-0 rounded-xl bg-slate-800 animate-pulse sm:h-28 sm:w-28"
            aria-hidden="true"
          />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-64 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-slate-800 animate-pulse" aria-hidden="true" />
              <div className="h-6 w-20 rounded-full bg-slate-800 animate-pulse" aria-hidden="true" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-40 rounded-md bg-slate-800 animate-pulse" aria-hidden="true" />
              <div className="h-10 w-32 rounded-md bg-slate-800 animate-pulse" aria-hidden="true" />
            </div>
            {/* Share buttons skeleton */}
            <div className="flex gap-2">
              <div className="h-9 w-24 rounded-md bg-slate-800 animate-pulse" aria-hidden="true" />
              <div className="h-9 w-20 rounded-md bg-slate-800 animate-pulse" aria-hidden="true" />
              <div className="h-9 w-24 rounded-md bg-slate-800 animate-pulse" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Content skeleton */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-24 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-800 animate-pulse" aria-hidden="true" />
              <div className="h-4 w-full rounded bg-slate-800 animate-pulse" aria-hidden="true" />
              <div className="h-4 w-3/4 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
              <div className="h-4 w-5/6 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
            </div>
            {/* Screenshot placeholder */}
            <div className="mt-4 aspect-video rounded-lg bg-slate-800 animate-pulse" aria-hidden="true" />
          </div>
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 space-y-4">
              <div className="h-5 w-16 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
              <div className="space-y-3">
                <div className="h-4 w-full rounded bg-slate-800 animate-pulse" aria-hidden="true" />
                <div className="h-4 w-full rounded bg-slate-800 animate-pulse" aria-hidden="true" />
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 space-y-4">
              <div className="h-5 w-14 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
                <div className="h-4 w-2/3 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 space-y-4">
              <div className="h-5 w-14 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
              <div className="flex gap-2">
                <div className="h-9 w-20 rounded-md bg-slate-800 animate-pulse" aria-hidden="true" />
                <div className="h-9 w-16 rounded-md bg-slate-800 animate-pulse" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader loading announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        Loading application details, please wait...
      </div>
    </div>
  );
}
