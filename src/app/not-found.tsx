"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

/**
 * Custom 404 Not Found page
 *
 * Provides a user-friendly error page with navigation options
 * when users visit non-existent routes.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md">
        {/* Error Code */}
        <h1 className="text-display-xl text-foreground font-bold">404</h1>

        {/* Error Message */}
        <h2 className="mt-4 text-heading-xl text-foreground">Page not found</h2>
        <p className="mt-3 text-body-md text-foreground-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Navigation Options */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-base font-semibold text-slate-950 transition-colors hover:bg-brand-400"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Go to Homepage
          </Link>
          <button
            onClick={() => typeof window !== "undefined" && window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-background-secondary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-foreground-muted">
          Need help?{" "}
          <a
            href="https://discord.gg/Uhjx6yhJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
