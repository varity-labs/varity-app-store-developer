"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "./Badge";
import { ArrowUpRight, CheckCircle } from "lucide-react";
import type { AppData } from "@/lib/constants";
import { useState } from "react";

/**
 * AppCard Component
 *
 * Displays an application card with logo, name, description, and metadata.
 * Includes hover animations, image loading states, and microdata for SEO.
 *
 * @example
 * ```tsx
 * <AppCard app={appData} />
 * ```
 */

export interface AppCardProps {
  /** Application data to display */
  app: AppData;
}

// User-friendly network names
const networkNames: Record<number, string> = {
  33529: "Varity",
  421614: "Arbitrum Test",
  42161: "Arbitrum",
  8453: "Base",
  137: "Polygon",
  10: "Optimism",
  1: "Ethereum",
};

export function AppCard({ app }: AppCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const networkId = Number(app.chainId);
  const networkName = networkNames[networkId] || "Other";

  return (
    <Link
      href={`/app/${app.id.toString()}`}
      className="group card card-hover relative flex flex-col transform transition-all duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`View details for ${app.name} - ${app.category} application${app.builtWithVarity ? ", Verified" : ""}`}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      {/* Logo & Name */}
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-background-tertiary">
          {app.logoUrl && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 skeleton-shimmer" />
              )}
              <Image
                src={app.logoUrl}
                alt={`${app.name} logo`}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                itemProp="image"
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-bold text-brand-400" aria-hidden="true">
              {app.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="truncate text-heading-md text-foreground transition-colors group-hover:text-brand-400"
              itemProp="name"
            >
              {app.name}
            </h3>
            {app.builtWithVarity && (
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-brand-500" aria-label="Verified application" />
            )}
          </div>
          <p
            className="mt-1.5 line-clamp-2 text-body-sm text-foreground-secondary"
            itemProp="description"
          >
            {app.description}
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-5 flex flex-wrap items-center gap-2" itemProp="applicationCategory">
        <Badge variant="default">
          {app.category}
        </Badge>
        <Badge variant="secondary">{networkName}</Badge>
        {app.builtWithVarity && (
          <Badge variant="success">Verified</Badge>
        )}
      </div>

      {/* Hover indicator */}
      <div className="absolute right-5 top-5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="h-5 w-5 text-brand-400" aria-hidden="true" />
      </div>
    </Link>
  );
}
