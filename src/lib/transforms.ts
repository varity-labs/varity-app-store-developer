/**
 * Data transformation utilities for Varity Developer Portal
 *
 * This module provides utilities for converting between contract data formats
 * and UI-friendly formats, ensuring consistent data flow throughout the application.
 *
 * Data Flow Architecture:
 * ┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
 * │  Smart Contract │────▶│  Transformation  │────▶│   UI Components │
 * │   (Raw Data)    │     │     Layer        │     │   (Display)     │
 * └─────────────────┘     └──────────────────┘     └─────────────────┘
 *
 * Contract → UI: Use transformAppFromContract() to convert raw blockchain data
 * UI → Contract: Use transformAppToContract() to prepare data for transactions
 */

import type { AppData, AppCategory, SUPPORTED_CHAINS } from "./constants";

// ============================================================================
// Contract Data Types (Raw blockchain format)
// ============================================================================

/**
 * Raw app data as returned from the smart contract
 * Uses snake_case naming to match Rust/Stylus contract ABI
 */
export interface ContractApp {
  id: bigint;
  name: string;
  description: string;
  app_url: string;
  logo_url: string;
  category: string;
  chain_id: bigint;
  developer: string;
  is_active: boolean;
  is_approved: boolean;
  created_at: bigint;
  built_with_varity: boolean;
  github_url: string;
  screenshot_count: bigint;
}

/**
 * Input format for registering or updating an app on the contract
 */
export interface ContractAppInput {
  name: string;
  description: string;
  app_url: string;
  logo_url: string;
  category: string;
  chain_id: bigint;
  built_with_varity: boolean;
  github_url: string;
  screenshot_urls: string[];
}

/**
 * Tuple format as returned by get_app contract method
 */
export type ContractAppTuple = [
  name: string,
  description: string,
  appUrl: string,
  logoUrl: string,
  category: string,
  chainId: bigint,
  developer: string,
  isActive: boolean,
  isApproved: boolean,
  createdAt: bigint,
  builtWithVarity: boolean,
  githubUrl: string,
  screenshotCount: bigint
];

// ============================================================================
// UI Data Types (Display-friendly format)
// ============================================================================

/**
 * UI-friendly app data with transformed fields
 * Extends AppData with computed display properties
 */
export interface UIApp extends AppData {
  /** Formatted creation date string */
  formattedDate: string;
  /** Truncated developer address for display */
  displayAddress: string;
  /** Chain name for display */
  chainName: string;
  /** Status label for display */
  statusLabel: "Pending" | "Approved" | "Rejected" | "Inactive";
}

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Transform raw contract app tuple to AppData format
 *
 * This is the primary transformation function used after reading from the contract.
 * It converts the tuple format returned by get_app into a structured AppData object.
 *
 * @param id - The app ID (passed separately as get_app doesn't return id)
 * @param tuple - Raw tuple data from contract
 * @returns Structured AppData object
 *
 * @example
 * ```typescript
 * const result = await readContract({ contract, method: "get_app", params: [appId] });
 * const app = transformAppTupleToAppData(appId, result as ContractAppTuple);
 * ```
 */
export function transformAppTupleToAppData(
  id: bigint,
  tuple: ContractAppTuple
): AppData {
  const [
    name,
    description,
    appUrl,
    logoUrl,
    category,
    chainId,
    developer,
    isActive,
    isApproved,
    createdAt,
    builtWithVarity,
    githubUrl,
    screenshotCount,
  ] = tuple;

  return {
    id,
    name,
    description,
    appUrl,
    logoUrl,
    category,
    chainId,
    developer: developer as `0x${string}`,
    isActive,
    isApproved,
    createdAt,
    builtWithVarity,
    githubUrl,
    screenshotCount,
  };
}

/**
 * Transform ContractApp object to AppData format
 *
 * Use this when you have a structured contract app object (e.g., from event parsing).
 *
 * @param contractApp - Raw contract app data with snake_case fields
 * @returns Structured AppData object with camelCase fields
 */
export function transformAppFromContract(contractApp: ContractApp): AppData {
  return {
    id: contractApp.id,
    name: contractApp.name,
    description: contractApp.description,
    appUrl: contractApp.app_url,
    logoUrl: contractApp.logo_url,
    category: contractApp.category,
    chainId: contractApp.chain_id,
    developer: contractApp.developer as `0x${string}`,
    isActive: contractApp.is_active,
    isApproved: contractApp.is_approved,
    createdAt: contractApp.created_at,
    builtWithVarity: contractApp.built_with_varity,
    githubUrl: contractApp.github_url,
    screenshotCount: contractApp.screenshot_count,
  };
}

/**
 * Transform UI app data to contract input format
 *
 * Prepares app data for blockchain transactions (register_app, update_app).
 *
 * @param appData - Partial app data from UI form
 * @param screenshots - Array of screenshot URLs
 * @returns Contract-ready input format
 */
export function transformAppToContract(
  appData: Partial<AppData>,
  screenshots: string[] = []
): ContractAppInput {
  return {
    name: appData.name || "",
    description: appData.description || "",
    app_url: appData.appUrl || "",
    logo_url: appData.logoUrl || "",
    category: appData.category || "Other",
    chain_id: appData.chainId ?? BigInt(33529), // Default to Varity L3
    built_with_varity: appData.builtWithVarity ?? false,
    github_url: appData.githubUrl || "",
    screenshot_urls: screenshots,
  };
}

/**
 * Transform AppData to UI-friendly format with display properties
 *
 * Adds computed display properties for rendering in components.
 *
 * @param app - App data from contract
 * @param chainMap - Optional chain ID to name mapping
 * @returns UI-friendly app with display properties
 */
export function transformAppToUI(
  app: AppData,
  chainMap?: Map<number, string>
): UIApp {
  const defaultChainMap = new Map([
    [33529, "Varity L3"],
    [421614, "Arbitrum Sepolia"],
    [42161, "Arbitrum One"],
    [1, "Ethereum"],
    [137, "Polygon"],
    [10, "Optimism"],
    [8453, "Base"],
  ]);

  const chainLookup = chainMap || defaultChainMap;

  return {
    ...app,
    formattedDate: formatDate(app.createdAt),
    displayAddress: formatAddress(app.developer),
    chainName: chainLookup.get(Number(app.chainId)) || `Chain ${app.chainId}`,
    statusLabel: getStatusLabel(app),
  };
}

// ============================================================================
// Display Formatting Utilities
// ============================================================================

/**
 * Format wallet address for display (0x1234...5678)
 *
 * @param address - Full Ethereum address
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Truncated address string
 *
 * @example
 * ```typescript
 * formatAddress("0x1234567890abcdef1234567890abcdef12345678")
 * // Returns: "0x1234...5678"
 * ```
 */
export function formatAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return "";
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format blockchain timestamp to human-readable date
 *
 * @param timestamp - Unix timestamp (seconds) as bigint or number
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDate(1706140800n)
 * // Returns: "Jan 25, 2024"
 * ```
 */
export function formatDate(
  timestamp: bigint | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  const date = new Date(ts * 1000);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options || defaultOptions);
}

/**
 * Format blockchain timestamp to relative time (e.g., "2 days ago")
 *
 * @param timestamp - Unix timestamp (seconds) as bigint or number
 * @returns Relative time string
 *
 * @example
 * ```typescript
 * formatRelativeDate(BigInt(Date.now() / 1000 - 86400))
 * // Returns: "1 day ago"
 * ```
 */
export function formatRelativeDate(timestamp: bigint | number): string {
  const ts = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  const now = Math.floor(Date.now() / 1000);
  const diff = now - ts;

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

/**
 * Format a number with thousand separators
 *
 * @param value - Number to format
 * @param locale - Locale for formatting (default: "en-US")
 * @returns Formatted number string
 */
export function formatNumber(value: number | bigint, locale: string = "en-US"): string {
  const num = typeof value === "bigint" ? Number(value) : value;
  return num.toLocaleString(locale);
}

/**
 * Format USDC amount (6 decimals) to human-readable string
 *
 * @param amount - Amount in smallest unit (6 decimals)
 * @param showSymbol - Whether to show USDC symbol
 * @returns Formatted amount string
 *
 * @example
 * ```typescript
 * formatUSDC(1000000n) // Returns: "1.00 USDC"
 * formatUSDC(1234567n, false) // Returns: "1.23"
 * ```
 */
export function formatUSDC(amount: bigint, showSymbol: boolean = true): string {
  const value = Number(amount) / 1_000_000;
  const formatted = value.toFixed(2);
  return showSymbol ? `${formatted} USDC` : formatted;
}

// ============================================================================
// Status Utilities
// ============================================================================

/**
 * Get human-readable status label for an app
 *
 * @param app - App data object
 * @returns Status label string
 */
export function getStatusLabel(
  app: Pick<AppData, "isApproved" | "isActive">
): "Pending" | "Approved" | "Rejected" | "Inactive" {
  if (!app.isActive) return "Inactive";
  if (app.isApproved) return "Approved";
  return "Pending";
}

/**
 * Get status color class for styling
 *
 * @param app - App data object
 * @returns Tailwind CSS color class
 */
export function getStatusColor(
  app: Pick<AppData, "isApproved" | "isActive">
): string {
  const status = getStatusLabel(app);
  switch (status) {
    case "Approved":
      return "text-emerald-400";
    case "Pending":
      return "text-yellow-400";
    case "Inactive":
      return "text-slate-400";
    case "Rejected":
      return "text-red-400";
    default:
      return "text-slate-400";
  }
}

/**
 * Get status badge classes for UI display
 *
 * @param app - App data object
 * @returns Object with bg and text Tailwind classes
 */
export function getStatusBadgeClasses(
  app: Pick<AppData, "isApproved" | "isActive">
): { bg: string; text: string } {
  const status = getStatusLabel(app);
  switch (status) {
    case "Approved":
      return { bg: "bg-emerald-900/50", text: "text-emerald-400" };
    case "Pending":
      return { bg: "bg-yellow-900/50", text: "text-yellow-400" };
    case "Inactive":
      return { bg: "bg-slate-800/50", text: "text-slate-400" };
    case "Rejected":
      return { bg: "bg-red-900/50", text: "text-red-400" };
    default:
      return { bg: "bg-slate-800/50", text: "text-slate-400" };
  }
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate app data before submission
 *
 * @param appData - Partial app data to validate
 * @returns Validation result with any errors
 */
export function validateAppData(appData: Partial<AppData>): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!appData.name?.trim()) {
    errors.push("App name is required");
  } else if (appData.name.length > 100) {
    errors.push("App name must be 100 characters or less");
  }

  if (!appData.description?.trim()) {
    errors.push("Description is required");
  } else if (appData.description.length > 1000) {
    errors.push("Description must be 1000 characters or less");
  }

  if (!appData.appUrl?.trim()) {
    errors.push("App URL is required");
  } else if (!isValidUrl(appData.appUrl)) {
    errors.push("App URL must be a valid URL");
  }

  if (!appData.logoUrl?.trim()) {
    errors.push("Logo URL is required");
  } else if (!isValidUrl(appData.logoUrl)) {
    errors.push("Logo URL must be a valid URL");
  }

  if (!appData.category?.trim()) {
    errors.push("Category is required");
  }

  // Optional but validate if provided
  if (appData.githubUrl && !isValidUrl(appData.githubUrl)) {
    errors.push("GitHub URL must be a valid URL");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate URL format
 *
 * @param url - URL string to validate
 * @returns Whether the URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Ethereum address format
 *
 * @param address - Address string to validate
 * @returns Whether the address is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// ============================================================================
// Array Transformation Utilities
// ============================================================================

/**
 * Transform an array of apps with optional filtering and sorting
 *
 * @param apps - Array of apps to transform
 * @param options - Transform options
 * @returns Transformed and filtered apps
 */
export function transformAppList(
  apps: AppData[],
  options?: {
    filterCategory?: string;
    filterChainId?: number;
    filterApproved?: boolean;
    filterActive?: boolean;
    sortBy?: "name" | "createdAt" | "category";
    sortOrder?: "asc" | "desc";
  }
): AppData[] {
  let result = [...apps];

  // Apply filters
  if (options?.filterCategory) {
    result = result.filter((app) => app.category === options.filterCategory);
  }
  if (options?.filterChainId !== undefined) {
    result = result.filter((app) => Number(app.chainId) === options.filterChainId);
  }
  if (options?.filterApproved !== undefined) {
    result = result.filter((app) => app.isApproved === options.filterApproved);
  }
  if (options?.filterActive !== undefined) {
    result = result.filter((app) => app.isActive === options.filterActive);
  }

  // Apply sorting
  if (options?.sortBy) {
    const order = options.sortOrder === "desc" ? -1 : 1;
    result.sort((a, b) => {
      switch (options.sortBy) {
        case "name":
          return order * a.name.localeCompare(b.name);
        case "createdAt":
          return order * (Number(a.createdAt) - Number(b.createdAt));
        case "category":
          return order * a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }

  return result;
}

/**
 * Group apps by category
 *
 * @param apps - Array of apps to group
 * @returns Map of category to apps
 */
export function groupAppsByCategory(apps: AppData[]): Map<string, AppData[]> {
  const grouped = new Map<string, AppData[]>();

  for (const app of apps) {
    const category = app.category || "Other";
    const existing = grouped.get(category) || [];
    grouped.set(category, [...existing, app]);
  }

  return grouped;
}

/**
 * Group apps by chain ID
 *
 * @param apps - Array of apps to group
 * @returns Map of chain ID to apps
 */
export function groupAppsByChain(apps: AppData[]): Map<number, AppData[]> {
  const grouped = new Map<number, AppData[]>();

  for (const app of apps) {
    const chainId = Number(app.chainId);
    const existing = grouped.get(chainId) || [];
    grouped.set(chainId, [...existing, app]);
  }

  return grouped;
}
