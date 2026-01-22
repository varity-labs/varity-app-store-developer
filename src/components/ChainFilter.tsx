"use client";

import { ChevronDown } from "lucide-react";
import { SUPPORTED_CHAINS } from "@/lib/constants";

interface ChainFilterProps {
  selected: number | null;
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

export function ChainFilter({ selected, onChange }: ChainFilterProps) {
  return (
    <div className="relative">
      <select
        value={selected ?? "all"}
        onChange={(e) =>
          onChange(e.target.value === "all" ? null : Number(e.target.value))
        }
        className="appearance-none rounded-lg border border-border bg-background-secondary px-4 py-2 pr-10 text-sm font-medium text-foreground transition-all duration-200 hover:border-border-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        <option value="all">All Networks</option>
        {SUPPORTED_CHAINS.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {networkDisplayNames[chain.id] || chain.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
    </div>
  );
}
