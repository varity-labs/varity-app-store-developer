/**
 * Thirdweb client configuration for Varity App Store
 *
 * This module provides the thirdweb client instance and chain configurations
 * for interacting with the Varity L3 network and other supported chains.
 *
 * @module lib/thirdweb
 */
import { createThirdwebClient, defineChain } from "thirdweb";

/**
 * Varity L3 chain configuration constants
 */
export const VARITY_L3_CONFIG = {
  chainId: 33529,
  name: "Varity L3 Testnet",
  rpc: "https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz",
  explorer: "https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz",
  nativeCurrency: {
    name: "Bridged USDC",
    symbol: "USDC",
    decimals: 6, // CRITICAL: USDC uses 6 decimals, NOT 18
  },
  testnet: true,
} as const;

/**
 * Check if thirdweb is properly configured with a client ID
 * @returns {boolean} True if NEXT_PUBLIC_THIRDWEB_CLIENT_ID is set
 */
export function isThirdwebConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
}

/**
 * Get the thirdweb client ID, with fallback to hardcoded public value
 * @returns {string} The thirdweb client ID
 */
function getClientId(): string {
  const envClientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
  // Fallback to hardcoded client ID for static export reliability - this is a public value
  return envClientId || "acb17e07e34ab2b8317aa40cbb1b5e1d";
}

/**
 * Thirdweb client instance for Varity App Store
 *
 * Uses the function-based v5 API pattern. The client ID is loaded from
 * NEXT_PUBLIC_THIRDWEB_CLIENT_ID environment variable with a fallback
 * to a hardcoded public value for static export reliability.
 *
 * @example
 * ```typescript
 * import { thirdwebClient } from '@/lib/thirdweb';
 * const contract = getContract({ client: thirdwebClient, ... });
 * ```
 */
export const thirdwebClient = createThirdwebClient({
  clientId: getClientId(),
});

/**
 * Get thirdweb client with validation
 *
 * Use this function when you need to ensure the client is properly
 * configured before use, particularly in server-side contexts.
 *
 * @returns {ReturnType<typeof createThirdwebClient>} The thirdweb client instance
 * @throws {Error} If thirdweb client ID is not configured (no env var and fallback fails)
 *
 * @example
 * ```typescript
 * try {
 *   const client = getThirdwebClient();
 *   // Use client...
 * } catch (error) {
 *   console.error('Thirdweb not configured:', error);
 * }
 * ```
 */
export function getThirdwebClient() {
  const clientId = getClientId();
  if (!clientId) {
    throw new Error(
      "Thirdweb client ID not configured. Set NEXT_PUBLIC_THIRDWEB_CLIENT_ID environment variable."
    );
  }
  return thirdwebClient;
}

/**
 * Varity L3 Testnet chain definition
 *
 * This is the primary chain for Varity App Store deployments.
 * Uses Bridged USDC as the native currency with 6 decimals.
 *
 * @example
 * ```typescript
 * import { varityL3 } from '@/lib/thirdweb';
 * const contract = getContract({
 *   client: thirdwebClient,
 *   chain: varityL3,
 *   address: "0x..."
 * });
 * ```
 */
export const varityL3 = defineChain({
  id: VARITY_L3_CONFIG.chainId,
  name: VARITY_L3_CONFIG.name,
  nativeCurrency: VARITY_L3_CONFIG.nativeCurrency,
  rpc: VARITY_L3_CONFIG.rpc,
  blockExplorers: [
    {
      name: "Varity Explorer",
      url: VARITY_L3_CONFIG.explorer,
    },
  ],
  testnet: VARITY_L3_CONFIG.testnet,
});

/**
 * Arbitrum Sepolia testnet chain definition
 */
export const arbitrumSepolia = defineChain({
  id: 421614,
  name: "Arbitrum Sepolia",
  rpc: "https://sepolia-rollup.arbitrum.io/rpc",
  testnet: true,
});

/**
 * Arbitrum One mainnet chain definition
 */
export const arbitrumOne = defineChain({
  id: 42161,
  name: "Arbitrum One",
  rpc: "https://arb1.arbitrum.io/rpc",
});

/**
 * Base mainnet chain definition
 */
export const baseChain = defineChain({
  id: 8453,
  name: "Base",
  rpc: "https://mainnet.base.org",
});

/**
 * Polygon mainnet chain definition
 */
export const polygonChain = defineChain({
  id: 137,
  name: "Polygon",
  rpc: "https://polygon-rpc.com",
});

/**
 * Optimism mainnet chain definition
 */
export const optimismChain = defineChain({
  id: 10,
  name: "Optimism",
  rpc: "https://mainnet.optimism.io",
});

/**
 * All supported chains for app deployment
 *
 * Includes Varity L3 (primary), Arbitrum Sepolia (testnet),
 * and major L2 mainnets (Arbitrum One, Base, Polygon, Optimism).
 */
export const supportedChains = [
  varityL3,
  arbitrumSepolia,
  arbitrumOne,
  baseChain,
  polygonChain,
  optimismChain,
];

/**
 * Map of chain IDs to chain definitions for quick lookup
 */
export const chainById = new Map(
  supportedChains.map((chain) => [chain.id, chain])
);

/**
 * Validate a chain ID is supported
 * @param {number} chainId - The chain ID to validate
 * @returns {boolean} True if the chain ID is in the supported chains list
 */
export function isValidChainId(chainId: number): boolean {
  return chainById.has(chainId);
}

/**
 * Get chain definition by chain ID
 *
 * @param {number} chainId - The chain ID to look up
 * @returns {ReturnType<typeof defineChain>} The chain definition, defaults to varityL3 if not found
 *
 * @example
 * ```typescript
 * const chain = getChainById(33529); // Returns varityL3
 * const chain = getChainById(8453);  // Returns baseChain
 * const chain = getChainById(999);   // Returns varityL3 (fallback)
 * ```
 */
export function getChainById(chainId: number) {
  return chainById.get(chainId) || varityL3;
}

/**
 * Get chain definition by chain ID with validation
 *
 * Unlike getChainById, this function throws an error if the chain ID is not supported.
 *
 * @param {number} chainId - The chain ID to look up
 * @returns {ReturnType<typeof defineChain>} The chain definition
 * @throws {Error} If the chain ID is not in the supported chains list
 *
 * @example
 * ```typescript
 * try {
 *   const chain = getChainByIdStrict(33529); // Returns varityL3
 * } catch (error) {
 *   console.error('Unsupported chain');
 * }
 * ```
 */
export function getChainByIdStrict(chainId: number) {
  const chain = chainById.get(chainId);
  if (!chain) {
    throw new Error(
      `Unsupported chain ID: ${chainId}. Supported chains: ${supportedChains.map((c) => `${c.name} (${c.id})`).join(", ")}`
    );
  }
  return chain;
}
