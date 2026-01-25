/**
 * Central type exports for Varity Developer Portal
 *
 * This module provides a single import point for all shared types across the application.
 * Import types from here rather than from individual modules for consistency.
 *
 * @example
 * ```typescript
 * import type {
 *   AppData,
 *   AppCategory,
 *   TransactionStatus,
 *   ValidationResult,
 *   GitHubRepo,
 * } from "@/lib/types";
 * ```
 */

// ============================================================================
// App & Contract Types
// ============================================================================

/**
 * Core app data interface matching contract storage
 */
export type { AppData, AppCategory, AppStatus } from "./constants";

/**
 * Contract-related types for blockchain interactions
 */
export type { RegistryABI } from "./contracts";

/**
 * Data transformation types for contract <-> UI conversion
 */
export type {
  ContractApp,
  ContractAppInput,
  ContractAppTuple,
  UIApp,
  ValidationResult as DataValidationResult,
} from "./transforms";

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Form validation types for app submission and update
 */
export type {
  ValidationResult as FormValidationResult,
  AppFormData,
  AppUpdateFormData,
} from "./validation";

// ============================================================================
// Transaction Types
// ============================================================================

/**
 * Transaction status types for tracking blockchain operations
 */
export type {
  TransactionStatus,
  TransactionState,
  LegacyTransactionStatus,
} from "./transactions";

// ============================================================================
// GitHub Types
// ============================================================================

/**
 * GitHub API response types
 */
export type { GitHubRepo, GitHubUser } from "./github";

/**
 * GitHub context types (re-exported for convenience)
 */
export type { GitHubOrg, RateLimitInfo } from "../contexts/GithubContext";

// ============================================================================
// UI Component Types
// ============================================================================

/**
 * Toast notification types
 */
export type { ToastType } from "../components/Toast";

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * Transaction status hook return type
 */
export type { UseTransactionStatusReturn } from "../hooks/useTransactionStatus";

// ============================================================================
// Constants Re-exports (for convenience)
// ============================================================================

export {
  VARITY_L3,
  APP_CATEGORIES,
  SUPPORTED_CHAINS,
  APP_STATUS,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  VALIDATION,
} from "./constants";

// ============================================================================
// Utility Type Helpers
// ============================================================================

/**
 * Ethereum address type (0x-prefixed, 40 hex characters)
 */
export type Address = `0x${string}`;

/**
 * Transaction hash type (0x-prefixed, 64 hex characters)
 */
export type TransactionHash = `0x${string}`;

/**
 * App ID type (uint64 represented as bigint)
 */
export type AppId = bigint;

/**
 * Chain ID type (uint256 represented as bigint)
 */
export type ChainId = bigint;

/**
 * Timestamp type (Unix timestamp in seconds as bigint)
 */
export type Timestamp = bigint;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper
 */
export type Optional<T> = T | undefined;

/**
 * Make specific keys required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific keys optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extract only the keys that are of a specific type
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Deep partial type (makes all nested properties optional)
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Async function return type unwrapper
 */
export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> =
  T extends (...args: unknown[]) => Promise<infer R> ? R : never;
