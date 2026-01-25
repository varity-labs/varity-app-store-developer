"use client";

import { ChevronDown } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { useState } from "react";

/**
 * ChainFilter Component
 *
 * Dropdown filter for blockchain networks with tooltips and chain icons.
 * Includes keyboard navigation and ARIA labels for accessibility.
 *
 * @example
 * ```tsx
 * <ChainFilter selected={33529} onChange={setChainId} />
 * ```
 */

export interface ChainFilterProps {
  /** Selected chain ID (null for all chains) */
  selected: number | null;
  /** Callback when chain selection changes */
  onChange: (chainId: number | null) => void;
}

// User-friendly network names
const networkDisplayNames: Record<number, string> = {
  33529: "Varity Network",
  421614: "Arbitrum Test",
  42161: "Arbitrum",
  8453: "Base",
  137: "Polygon",
  10: "Optimism",
  1: "Ethereum",
};

// Chain details for tooltips
const chainDetails: Record<number, string> = {
  33529: "Varity L3 - Arbitrum Orbit Rollup",
  421614: "Arbitrum Sepolia Testnet",
  42161: "Arbitrum One - Ethereum Layer 2",
  8453: "Base - Coinbase Layer 2",
  137: "Polygon PoS - Ethereum Sidechain",
  10: "Optimism - Ethereum Layer 2",
  1: "Ethereum Mainnet",
};

// Chain color codes for visual indicators
const chainColors: Record<number, string> = {
  33529: "bg-brand-500",
  421614: "bg-blue-500",
  42161: "bg-blue-400",
  8453: "bg-indigo-500",
  137: "bg-purple-500",
  10: "bg-red-500",
  1: "bg-gray-500",
};

export function ChainFilter({ selected, onChange }: ChainFilterProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const selectedChainName = selected
    ? (networkDisplayNames[selected] || SUPPORTED_CHAINS.find(c => c.id === selected)?.name || "Unknown")
    : "All Networks";

  const selectedChainDetail = selected ? chainDetails[selected] : undefined;

  return (
    <div className="relative">
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        <select
          value={selected ?? "all"}
          onChange={(e) =>
            onChange(e.target.value === "all" ? null : Number(e.target.value))
          }
          aria-label="Filter by blockchain network"
          className="appearance-none rounded-lg border border-border bg-background-secondary px-4 py-2 pr-10 pl-9 text-sm font-medium text-foreground transition-all duration-200 hover:border-border-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <option value="all">All Networks</option>
          {SUPPORTED_CHAINS.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {networkDisplayNames[chain.id] || chain.name}
            </option>
          ))}
        </select>

        {/* Chain color indicator */}
        {selected && (
          <div
            className={`absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ${chainColors[selected] || 'bg-gray-500'}`}
            aria-hidden="true"
          />
        )}

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
          aria-hidden="true"
        />

        {/* Tooltip */}
        {showTooltip && selectedChainDetail && (
          <div
            className="absolute top-full left-0 mt-2 z-10 rounded-lg border border-border bg-background-tertiary px-3 py-2 text-xs text-foreground-secondary shadow-lg whitespace-nowrap animate-fade-in"
            role="tooltip"
          >
            {selectedChainDetail}
          </div>
        )}
      </div>
    </div>
  );
}
