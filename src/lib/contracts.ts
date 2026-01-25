/**
 * Smart contract configuration for Varity App Registry
 *
 * This module provides the contract address, ABI, and helper functions for
 * interacting with the VarityAppRegistry smart contract deployed on Varity L3.
 *
 * @module contracts
 * @see https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x52d4f28ebe20fad743bbef9daa61bfe3ce91eb74
 */

import { getContract } from "thirdweb";
import { getBytecode } from "thirdweb/contract";
import { getAddress, isAddress } from "thirdweb/utils";
import { thirdwebClient, varityL3 } from "./thirdweb";

// ============================================================================
// Network Configuration
// ============================================================================

/**
 * Varity L3 network configuration constants
 * Used for validation and consistency across the application
 */
export const VARITY_L3_CONFIG = {
  /** Chain ID for Varity L3 Testnet */
  CHAIN_ID: 33529,
  /** RPC endpoint URL */
  RPC_URL: "https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz",
  /** Block explorer URL */
  EXPLORER_URL: "https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz",
  /** Native currency symbol (Bridged USDC) */
  NATIVE_CURRENCY: "USDC",
  /** Native currency decimals (USDC uses 6, not 18!) */
  NATIVE_DECIMALS: 6,
} as const;

// ============================================================================
// Contract Address Configuration
// ============================================================================

/**
 * Validates an Ethereum address and returns the checksummed version
 * @param address - The address to validate
 * @returns The checksummed address
 * @throws Error if the address is invalid
 */
function validateAndChecksumAddress(address: string): `0x${string}` {
  if (!isAddress(address)) {
    throw new Error(`Invalid Ethereum address: ${address}`);
  }
  return getAddress(address);
}

/**
 * Raw contract address from environment or default
 * @internal
 */
const RAW_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_VARITY_REGISTRY_ADDRESS ||
  "0x52d4f28ebe20fad743bbef9daa61bfe3ce91eb74";

/**
 * Varity App Registry contract address on Varity L3 Testnet
 *
 * This is the checksummed address of the deployed VarityAppRegistry contract.
 * The contract manages app registration, approval, and discovery for the
 * Varity App Store ecosystem.
 *
 * @remarks
 * - Deployed on Varity L3 Testnet (Chain ID: 33529)
 * - Deployer wallet: 0x20B7d1426649D9a573ba7Fd10592456264220cbF
 * - Contract type: Stylus (Rust compiled to WASM)
 *
 * @see https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz/address/0x52d4f28ebe20fad743bbef9daa61bfe3ce91eb74
 *
 * @example
 * ```typescript
 * import { VARITY_APP_REGISTRY_ADDRESS } from '@/lib/contracts';
 *
 * console.log(`Contract at: ${VARITY_APP_REGISTRY_ADDRESS}`);
 * // Output: Contract at: 0x52d4f28ebe20fad743bbef9daa61bfe3ce91eb74
 * ```
 */
export const VARITY_APP_REGISTRY_ADDRESS: `0x${string}` =
  validateAndChecksumAddress(RAW_CONTRACT_ADDRESS);

// ============================================================================
// Contract Method Names (Type-Safe)
// ============================================================================

/**
 * Contract method names as a type-safe constant object
 *
 * These method names match the Stylus/Rust contract using snake_case convention.
 * Use these constants instead of string literals for type safety and IDE support.
 *
 * @remarks
 * - All method names follow Rust snake_case convention
 * - Read methods are view/pure functions (no gas cost)
 * - Write methods require a transaction and gas
 *
 * @example
 * ```typescript
 * import { CONTRACT_METHODS } from '@/lib/contracts';
 *
 * // Type-safe method access
 * const methodName = CONTRACT_METHODS.READ.GET_APP; // "get_app"
 * ```
 */
export const CONTRACT_METHODS = {
  /** Read-only methods (view functions, no gas cost) */
  READ: {
    /** Get a single app by ID */
    GET_APP: "get_app",
    /** Get all app IDs up to max_results */
    GET_ALL_APPS: "get_all_apps",
    /** Get apps filtered by category */
    GET_APPS_BY_CATEGORY: "get_apps_by_category",
    /** Get apps filtered by chain ID */
    GET_APPS_BY_CHAIN: "get_apps_by_chain",
    /** Get apps filtered by developer address */
    GET_APPS_BY_DEVELOPER: "get_apps_by_developer",
    /** Get featured app IDs */
    GET_FEATURED_APPS: "get_featured_apps",
    /** Get pending (unapproved) app IDs */
    GET_PENDING_APPS: "get_pending_apps",
    /** Get a specific screenshot URL by index */
    GET_APP_SCREENSHOT: "get_app_screenshot",
    /** Check if an address is an admin */
    IS_ADMIN: "is_admin",
    /** Get total number of registered apps */
    GET_TOTAL_APPS: "get_total_apps",
  },
  /** Write methods (require transaction, cost gas) */
  WRITE: {
    /** Register a new app */
    REGISTER_APP: "register_app",
    /** Update an existing app (developer only) */
    UPDATE_APP: "update_app",
    /** Deactivate an app (developer only) */
    DEACTIVATE_APP: "deactivate_app",
    /** Approve a pending app (admin only) */
    APPROVE_APP: "approve_app",
    /** Reject a pending app with reason (admin only) */
    REJECT_APP: "reject_app",
    /** Feature an approved app (admin only) */
    FEATURE_APP: "feature_app",
    /** Initialize the contract (one-time setup) */
    INITIALIZE: "initialize",
  },
  /** Contract events emitted on state changes */
  EVENTS: {
    /** Emitted when a new app is registered */
    APP_REGISTERED: "AppRegistered",
    /** Emitted when an app is approved */
    APP_APPROVED: "AppApproved",
    /** Emitted when an app is rejected */
    APP_REJECTED: "AppRejected",
    /** Emitted when an app is updated */
    APP_UPDATED: "AppUpdated",
    /** Emitted when an app is deactivated */
    APP_DEACTIVATED: "AppDeactivated",
    /** Emitted when an app is featured */
    APP_FEATURED: "AppFeatured",
  },
} as const;

/**
 * Type representing all read method names
 */
export type ReadMethodName =
  (typeof CONTRACT_METHODS.READ)[keyof typeof CONTRACT_METHODS.READ];

/**
 * Type representing all write method names
 */
export type WriteMethodName =
  (typeof CONTRACT_METHODS.WRITE)[keyof typeof CONTRACT_METHODS.WRITE];

/**
 * Type representing all event names
 */
export type EventName =
  (typeof CONTRACT_METHODS.EVENTS)[keyof typeof CONTRACT_METHODS.EVENTS];

/**
 * Type representing all contract method names (read + write)
 */
export type ContractMethodName = ReadMethodName | WriteMethodName;

// ============================================================================
// Network Validation
// ============================================================================

/**
 * Validates that the current network configuration matches Varity L3
 *
 * @param chainId - The chain ID to validate
 * @returns True if the chain ID matches Varity L3
 *
 * @example
 * ```typescript
 * import { isValidVarityL3Network } from '@/lib/contracts';
 *
 * if (!isValidVarityL3Network(wallet.chainId)) {
 *   console.warn('Please switch to Varity L3 network');
 * }
 * ```
 */
export function isValidVarityL3Network(chainId: number): boolean {
  return chainId === VARITY_L3_CONFIG.CHAIN_ID;
}

/**
 * Validates network configuration and throws if invalid
 *
 * @param chainId - The chain ID to validate
 * @throws Error if the chain ID does not match Varity L3
 *
 * @example
 * ```typescript
 * import { validateNetwork } from '@/lib/contracts';
 *
 * try {
 *   validateNetwork(wallet.chainId);
 *   // Proceed with contract interaction
 * } catch (error) {
 *   // Handle network mismatch
 * }
 * ```
 */
export function validateNetwork(chainId: number): void {
  if (!isValidVarityL3Network(chainId)) {
    throw new Error(
      `Invalid network. Expected Varity L3 (Chain ID: ${VARITY_L3_CONFIG.CHAIN_ID}), ` +
        `but got Chain ID: ${chainId}. Please switch to Varity L3 network.`
    );
  }
}

// ============================================================================
// Contract Instance
// ============================================================================

/**
 * Get the VarityAppRegistry contract instance
 *
 * Returns a thirdweb contract instance configured for the Varity App Registry.
 * This instance can be used with thirdweb's readContract and prepareContractCall
 * functions to interact with the contract.
 *
 * @returns A thirdweb Contract instance for the VarityAppRegistry
 *
 * @example
 * ```typescript
 * import { getRegistryContract } from '@/lib/contracts';
 * import { readContract } from 'thirdweb';
 *
 * const contract = getRegistryContract();
 * const totalApps = await readContract({
 *   contract,
 *   method: "get_total_apps",
 *   params: [],
 * });
 * ```
 */
export function getRegistryContract() {
  return getContract({
    client: thirdwebClient,
    chain: varityL3,
    address: VARITY_APP_REGISTRY_ADDRESS,
  });
}

// ============================================================================
// Contract Deployment Verification
// ============================================================================

/**
 * Check if the VarityAppRegistry contract is deployed at the configured address
 *
 * This function queries the blockchain to verify that there is bytecode
 * at the contract address, confirming the contract is deployed.
 *
 * @returns Promise that resolves to true if contract is deployed, false otherwise
 *
 * @example
 * ```typescript
 * import { isContractDeployed } from '@/lib/contracts';
 *
 * const deployed = await isContractDeployed();
 * if (!deployed) {
 *   console.error('Contract not deployed! Check address and network.');
 * }
 * ```
 */
export async function isContractDeployed(): Promise<boolean> {
  try {
    const contract = getRegistryContract();
    const bytecode = await getBytecode(contract);

    // Contract is deployed if bytecode exists and is not empty
    // Empty bytecode is "0x" (2 characters) or undefined
    return bytecode !== undefined && bytecode.length > 2;
  } catch (error) {
    console.error("Failed to check contract deployment:", error);
    return false;
  }
}

/**
 * Verify contract deployment and throw if not deployed
 *
 * @throws Error if contract is not deployed at the configured address
 *
 * @example
 * ```typescript
 * import { verifyContractDeployed } from '@/lib/contracts';
 *
 * await verifyContractDeployed();
 * // Contract is confirmed deployed, safe to proceed
 * ```
 */
export async function verifyContractDeployed(): Promise<void> {
  const deployed = await isContractDeployed();
  if (!deployed) {
    throw new Error(
      `VarityAppRegistry contract not found at address ${VARITY_APP_REGISTRY_ADDRESS} ` +
        `on Varity L3 (Chain ID: ${VARITY_L3_CONFIG.CHAIN_ID}). ` +
        `Please verify the contract address and network configuration.`
    );
  }
}

/**
 * Get the explorer URL for the contract
 *
 * @returns The full URL to view the contract on the Varity L3 block explorer
 *
 * @example
 * ```typescript
 * import { getContractExplorerUrl } from '@/lib/contracts';
 *
 * const url = getContractExplorerUrl();
 * console.log(`View contract: ${url}`);
 * ```
 */
export function getContractExplorerUrl(): string {
  return `${VARITY_L3_CONFIG.EXPLORER_URL}/address/${VARITY_APP_REGISTRY_ADDRESS}`;
}

// ============================================================================
// Contract ABI
// ============================================================================

/**
 * Contract ABI for the VarityAppRegistry (generated from Rust contract)
 *
 * This ABI defines all functions and events exposed by the VarityAppRegistry
 * smart contract. The contract is written in Rust using Stylus and compiled
 * to WASM for deployment on Varity L3 (Arbitrum Orbit rollup).
 *
 * @remarks
 * - Method names use snake_case (Rust convention)
 * - All uint64 types map to JavaScript bigint
 * - Address types should use checksummed format
 *
 * @see CONTRACT_METHODS for type-safe method name constants
 */
export const REGISTRY_ABI = [
  // ==================== Read Functions ====================
  /**
   * Get a single app by ID
   * @param app_id - The unique identifier of the app
   * @returns App data tuple containing all app fields
   */
  {
    name: "get_app",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "logo_url", type: "string" },
      { name: "category", type: "string" },
      { name: "chain_id", type: "uint256" },
      { name: "developer", type: "address" },
      { name: "is_active", type: "bool" },
      { name: "is_approved", type: "bool" },
      { name: "created_at", type: "uint256" },
      { name: "built_with_varity", type: "bool" },
      { name: "github_url", type: "string" },
      { name: "screenshot_count", type: "uint256" },
    ],
  },
  /**
   * Get all app IDs (paginated)
   * @param max_results - Maximum number of results to return
   * @returns Array of app IDs
   */
  {
    name: "get_all_apps",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  /**
   * Get apps filtered by category
   * @param category - Category name to filter by
   * @param max_results - Maximum number of results to return
   * @returns Array of app IDs matching the category
   */
  {
    name: "get_apps_by_category",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "category", type: "string" },
      { name: "max_results", type: "uint64" },
    ],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  /**
   * Get apps filtered by chain ID
   * @param chain_id - Chain ID to filter by
   * @param max_results - Maximum number of results to return
   * @returns Array of app IDs deployed on the specified chain
   */
  {
    name: "get_apps_by_chain",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "chain_id", type: "uint256" },
      { name: "max_results", type: "uint64" },
    ],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  /**
   * Get apps by developer address
   * @param developer - Developer address to filter by
   * @param max_results - Maximum number of results to return
   * @returns Array of app IDs owned by the developer
   */
  {
    name: "get_apps_by_developer",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "developer", type: "address" },
      { name: "max_results", type: "uint64" },
    ],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  /**
   * Get featured app IDs
   * @param max_results - Maximum number of results to return
   * @returns Array of featured app IDs
   */
  {
    name: "get_featured_apps",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  /**
   * Get pending (unapproved) app IDs
   * @param max_results - Maximum number of results to return
   * @returns Array of pending app IDs
   */
  {
    name: "get_pending_apps",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  /**
   * Get a specific screenshot URL by index
   * @param app_id - The app ID
   * @param index - Screenshot index (0-based)
   * @returns Screenshot URL
   */
  {
    name: "get_app_screenshot",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "index", type: "uint64" },
    ],
    outputs: [{ name: "url", type: "string" }],
  },
  /**
   * Check if an address is an admin
   * @param address - Address to check
   * @returns True if the address is an admin
   */
  {
    name: "is_admin",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "address", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  /**
   * Get the total number of registered apps
   * @returns Total app count
   */
  {
    name: "get_total_apps",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },

  // ==================== Write Functions ====================
  /**
   * Register a new app
   * @param name - App name (max 100 characters)
   * @param description - App description (max 1000 characters)
   * @param app_url - URL to the deployed app
   * @param logo_url - URL to the app logo
   * @param category - App category
   * @param chain_id - Chain ID where the app is deployed
   * @param built_with_varity - Whether the app was built with Varity
   * @param github_url - GitHub repository URL (optional)
   * @param screenshot_urls - Array of screenshot URLs (max 5)
   * @returns The new app ID
   */
  {
    name: "register_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "logo_url", type: "string" },
      { name: "category", type: "string" },
      { name: "chain_id", type: "uint256" },
      { name: "built_with_varity", type: "bool" },
      { name: "github_url", type: "string" },
      { name: "screenshot_urls", type: "string[]" },
    ],
    outputs: [{ name: "app_id", type: "uint64" }],
  },
  /**
   * Update an existing app (developer only)
   * @param app_id - The app ID to update
   * @param description - New description
   * @param app_url - New app URL
   * @param screenshot_urls - New screenshot URLs array
   */
  {
    name: "update_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "screenshot_urls", type: "string[]" },
    ],
    outputs: [],
  },
  /**
   * Deactivate an app (developer only)
   * @param app_id - The app ID to deactivate
   */
  {
    name: "deactivate_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
  },
  /**
   * Approve a pending app (admin only)
   * @param app_id - The app ID to approve
   */
  {
    name: "approve_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
  },
  /**
   * Reject a pending app with reason (admin only)
   * @param app_id - The app ID to reject
   * @param reason - Rejection reason for the developer
   */
  {
    name: "reject_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "reason", type: "string" },
    ],
    outputs: [],
  },
  /**
   * Feature an approved app (admin only)
   * @param app_id - The app ID to feature
   */
  {
    name: "feature_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
  },
  /**
   * Initialize the contract (one-time setup, deployer only)
   */
  {
    name: "initialize",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },

  // ==================== Events ====================
  /**
   * Emitted when a new app is registered
   */
  {
    name: "AppRegistered",
    type: "event",
    inputs: [
      { name: "app_id", type: "uint64", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "category", type: "string", indexed: false },
      { name: "chain_id", type: "uint64", indexed: false },
    ],
  },
  /**
   * Emitted when an app is approved
   */
  {
    name: "AppApproved",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
  /**
   * Emitted when an app is rejected
   */
  {
    name: "AppRejected",
    type: "event",
    inputs: [
      { name: "app_id", type: "uint64", indexed: true },
      { name: "reason", type: "string", indexed: false },
    ],
  },
  /**
   * Emitted when an app is updated
   */
  {
    name: "AppUpdated",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
  /**
   * Emitted when an app is deactivated
   */
  {
    name: "AppDeactivated",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
  /**
   * Emitted when an app is featured
   */
  {
    name: "AppFeatured",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
] as const;

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Type export for the complete Registry ABI
 *
 * Can be used for type inference when working with the contract ABI.
 *
 * @example
 * ```typescript
 * import type { RegistryABI } from '@/lib/contracts';
 *
 * function getMethodName<T extends RegistryABI[number]>(entry: T) {
 *   return entry.name;
 * }
 * ```
 */
export type RegistryABI = typeof REGISTRY_ABI;

/**
 * Type for a single ABI entry (function or event)
 */
export type RegistryABIEntry = RegistryABI[number];

/**
 * Type for the contract instance returned by getRegistryContract
 */
export type RegistryContract = ReturnType<typeof getRegistryContract>;
