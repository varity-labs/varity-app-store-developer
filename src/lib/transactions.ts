/**
 * Transaction utility functions for handling blockchain interactions
 * Provides gas estimation, transaction waiting, and error handling
 */

import { estimateGas, waitForReceipt } from "thirdweb";
import type { PreparedTransaction, ThirdwebClient, Chain } from "thirdweb";
import type { Account } from "thirdweb/wallets";
import type { TransactionReceipt } from "thirdweb/transaction";

// ============================================================================
// Transaction Status Types (Discriminated Union)
// ============================================================================

/**
 * Comprehensive transaction status type using discriminated unions
 * Provides type-safe status tracking throughout the transaction lifecycle
 */
export type TransactionStatus =
  | { status: "idle" }
  | { status: "preparing" }
  | { status: "pending"; hash: `0x${string}` }
  | { status: "confirming"; hash: `0x${string}` }
  | { status: "success"; hash: `0x${string}`; receipt: TransactionReceipt }
  | { status: "error"; error: Error; hash?: `0x${string}` };

/**
 * Estimate gas for a transaction
 * @param transaction - Prepared transaction
 * @returns Estimated gas limit as bigint
 */
export async function estimateTransactionGas(
  transaction: PreparedTransaction
): Promise<bigint> {
  try {
    const gasLimit = await estimateGas({
      transaction,
    });
    return gasLimit;
  } catch (error) {
    console.error("Gas estimation failed:", error);
    throw new Error("Failed to estimate gas. Please try again.");
  }
}

/**
 * Wait for transaction confirmation
 * @param client - Thirdweb client
 * @param chain - Chain configuration
 * @param transactionHash - Transaction hash
 * @returns Transaction receipt
 */
export async function waitForTransaction(
  client: ThirdwebClient,
  chain: Chain,
  transactionHash: `0x${string}`
): Promise<TransactionReceipt> {
  try {
    const receipt = await waitForReceipt({
      client,
      chain,
      transactionHash,
    });
    return receipt;
  } catch (error) {
    console.error("Transaction confirmation failed:", error);
    throw new Error("Transaction failed to confirm. Please check the explorer.");
  }
}

/**
 * Wait for transaction confirmation with retry mechanism
 * @param client - Thirdweb client
 * @param chain - Chain configuration
 * @param transactionHash - Transaction hash
 * @param options - Retry options
 * @returns Transaction receipt
 */
export async function waitForTransactionWithRetry(
  client: ThirdwebClient,
  chain: Chain,
  transactionHash: `0x${string}`,
  options?: { maxRetries?: number; retryDelay?: number }
): Promise<TransactionReceipt> {
  const maxRetries = options?.maxRetries ?? 3;
  const retryDelay = options?.retryDelay ?? 2000; // 2 seconds default

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const receipt = await waitForReceipt({
        client,
        chain,
        transactionHash,
      });
      return receipt;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `Transaction confirmation attempt ${attempt + 1}/${maxRetries + 1} failed:`,
        error
      );

      // Don't wait after the last attempt
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  console.error("All transaction confirmation attempts failed:", lastError);
  throw new Error(
    "Transaction failed to confirm after multiple attempts. Please check the explorer."
  );
}

/**
 * Parse and format transaction errors for user-friendly display
 * @param error - Error object from transaction
 * @returns User-friendly error message
 */
export function handleTransactionError(error: unknown): string {
  if (!error) return "Unknown error occurred";

  const errorMessage = error instanceof Error ? error.message : String(error);

  // User rejected transaction
  if (
    errorMessage.includes("user rejected") ||
    errorMessage.includes("User denied") ||
    errorMessage.includes("rejected")
  ) {
    return "Transaction was canceled. Please try again and approve the transaction in your wallet.";
  }

  // Insufficient funds
  if (
    errorMessage.includes("insufficient funds") ||
    errorMessage.includes("insufficient balance")
  ) {
    return "Insufficient funds to complete this transaction. Please ensure you have enough USDC in your wallet.";
  }

  // Network errors
  if (
    errorMessage.includes("network") ||
    errorMessage.includes("connection") ||
    errorMessage.includes("timeout")
  ) {
    return "Network error. Please check your connection and try again.";
  }

  // Wrong network
  if (
    errorMessage.includes("chain") ||
    errorMessage.includes("network mismatch")
  ) {
    return "Please switch to Varity L3 network (Chain ID: 33529).";
  }

  // Contract errors
  if (errorMessage.includes("execution reverted")) {
    // Try to extract revert reason
    const match = errorMessage.match(/reason: (.+?)(?:\n|$)/);
    if (match) {
      return `Transaction failed: ${match[1]}`;
    }
    return "Transaction failed. Please verify your submission details and try again.";
  }

  // Gas estimation failed
  if (errorMessage.includes("gas")) {
    return "Unable to estimate transaction cost. The transaction may fail. Please try again.";
  }

  // Admin/permission errors (common in registry contract)
  if (
    errorMessage.includes("Unauthorized") ||
    errorMessage.includes("not authorized") ||
    errorMessage.includes("not admin")
  ) {
    return "You don't have permission to perform this action. Please ensure you're using the correct account.";
  }

  // App not found errors
  if (errorMessage.includes("App not found")) {
    return "Application not found. It may have been removed or deactivated.";
  }

  // Already approved/rejected
  if (errorMessage.includes("already approved")) {
    return "This application has already been approved and is live in the marketplace.";
  }

  if (errorMessage.includes("already rejected")) {
    return "This application has already been rejected.";
  }

  // Not the developer
  if (errorMessage.includes("Only developer")) {
    return "Only the application developer can perform this action.";
  }

  // Default error message
  return errorMessage.length > 200
    ? "Transaction failed. Please try again or contact support."
    : errorMessage;
}

/**
 * Format gas estimate for display
 * @param gasLimit - Gas limit in wei
 * @param gasPrice - Gas price in wei (optional)
 * @returns Formatted string for display
 */
export function formatGasEstimate(
  gasLimit: bigint,
  gasPrice?: bigint
): string {
  const gas = Number(gasLimit);

  if (gasPrice) {
    const cost = (gasLimit * gasPrice) / BigInt(10 ** 6); // Convert to USDC (6 decimals)
    return `~${gas.toLocaleString()} gas (~$${(Number(cost) / 10 ** 6).toFixed(4)} USDC)`;
  }

  return `~${gas.toLocaleString()} gas`;
}

/**
 * Legacy transaction state machine types (for backward compatibility)
 * @deprecated Use TransactionStatus discriminated union instead
 */
export type TransactionState =
  | "idle"
  | "preparing"
  | "awaiting_approval"
  | "pending"
  | "confirming"
  | "success"
  | "error";

/**
 * Legacy transaction status interface (for backward compatibility)
 * @deprecated Use TransactionStatus discriminated union instead
 */
export interface LegacyTransactionStatus {
  state: TransactionState;
  hash?: string;
  error?: string;
  gasEstimate?: bigint;
}

// ============================================================================
// User-Friendly Error Messages
// ============================================================================

/**
 * Get a user-friendly error message from a blockchain error
 * This is an alias for handleTransactionError for API consistency
 *
 * @param error - Error object from transaction (can be Error, string, or unknown)
 * @returns User-friendly error message string
 *
 * @example
 * ```typescript
 * try {
 *   await sendTransaction(tx);
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   toast.error(message);
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return "Unknown error occurred";

  const errorMessage = error instanceof Error ? error.message : String(error);

  // User rejected transaction (most common)
  if (
    errorMessage.toLowerCase().includes("user rejected") ||
    errorMessage.toLowerCase().includes("user denied") ||
    errorMessage.toLowerCase().includes("rejected the request") ||
    errorMessage.includes("ACTION_REJECTED")
  ) {
    return "Transaction was canceled. Please try again and approve the transaction in your wallet.";
  }

  // Insufficient funds for gas
  if (
    errorMessage.toLowerCase().includes("insufficient funds") ||
    errorMessage.toLowerCase().includes("insufficient balance") ||
    errorMessage.includes("INSUFFICIENT_FUNDS")
  ) {
    return "Insufficient funds to complete this transaction. Please ensure you have enough tokens for gas fees.";
  }

  // Gas estimation failed
  if (
    errorMessage.toLowerCase().includes("gas estimation failed") ||
    errorMessage.toLowerCase().includes("cannot estimate gas") ||
    errorMessage.includes("UNPREDICTABLE_GAS_LIMIT")
  ) {
    return "Unable to estimate gas. The transaction may fail. Please verify your input and try again.";
  }

  // Contract reverted
  if (
    errorMessage.toLowerCase().includes("execution reverted") ||
    errorMessage.includes("CALL_EXCEPTION")
  ) {
    // Try to extract revert reason
    const reasonMatch = errorMessage.match(/reason[:\s]*["']?([^"'\n]+)["']?/i);
    if (reasonMatch) {
      return `Transaction failed: ${reasonMatch[1].trim()}`;
    }
    // Try to extract error message from custom error
    const errorMatch = errorMessage.match(/error[:\s]*["']?([^"'\n]+)["']?/i);
    if (errorMatch) {
      return `Transaction failed: ${errorMatch[1].trim()}`;
    }
    return "Transaction failed. The contract rejected the operation. Please verify your input and try again.";
  }

  // Network/connection errors
  if (
    errorMessage.toLowerCase().includes("network") ||
    errorMessage.toLowerCase().includes("connection") ||
    errorMessage.toLowerCase().includes("fetch failed") ||
    errorMessage.includes("NETWORK_ERROR")
  ) {
    return "Network error. Please check your internet connection and try again.";
  }

  // Timeout errors
  if (
    errorMessage.toLowerCase().includes("timeout") ||
    errorMessage.includes("TIMEOUT")
  ) {
    return "Request timed out. The network may be congested. Please try again.";
  }

  // Nonce errors
  if (
    errorMessage.toLowerCase().includes("nonce") ||
    errorMessage.includes("NONCE_EXPIRED")
  ) {
    return "Transaction conflict detected. Please refresh the page and try again.";
  }

  // Wrong network/chain
  if (
    errorMessage.toLowerCase().includes("chain") ||
    errorMessage.toLowerCase().includes("network mismatch") ||
    errorMessage.toLowerCase().includes("wrong network")
  ) {
    return "Please switch to Varity L3 network (Chain ID: 33529).";
  }

  // Transaction replacement/underpriced
  if (
    errorMessage.toLowerCase().includes("replacement transaction underpriced") ||
    errorMessage.toLowerCase().includes("transaction underpriced")
  ) {
    return "Transaction fee too low. Please try again with a higher gas price.";
  }

  // Admin/permission errors (common in registry contract)
  if (
    errorMessage.includes("Unauthorized") ||
    errorMessage.toLowerCase().includes("not authorized") ||
    errorMessage.toLowerCase().includes("not admin") ||
    errorMessage.toLowerCase().includes("access denied")
  ) {
    return "You don't have permission to perform this action. Please ensure you're using the correct account.";
  }

  // App-specific errors
  if (errorMessage.includes("App not found")) {
    return "Application not found. It may have been removed or deactivated.";
  }
  if (errorMessage.includes("already approved")) {
    return "This application has already been approved and is live in the marketplace.";
  }
  if (errorMessage.includes("already rejected")) {
    return "This application has already been rejected.";
  }
  if (errorMessage.includes("Only developer")) {
    return "Only the application developer can perform this action.";
  }

  // Default: return original message if short enough, otherwise generic
  return errorMessage.length > 200
    ? "Transaction failed. Please try again or contact support if the problem persists."
    : errorMessage;
}

// ============================================================================
// Transaction Status Hook Helpers
// ============================================================================

/**
 * Initial idle state for TransactionStatus
 */
export const IDLE_STATUS: TransactionStatus = { status: "idle" };

/**
 * Create a preparing status
 */
export function createPreparingStatus(): TransactionStatus {
  return { status: "preparing" };
}

/**
 * Create a pending status with hash
 */
export function createPendingStatus(hash: `0x${string}`): TransactionStatus {
  return { status: "pending", hash };
}

/**
 * Create a confirming status with hash
 */
export function createConfirmingStatus(hash: `0x${string}`): TransactionStatus {
  return { status: "confirming", hash };
}

/**
 * Create a success status with hash and receipt
 */
export function createSuccessStatus(
  hash: `0x${string}`,
  receipt: TransactionReceipt
): TransactionStatus {
  return { status: "success", hash, receipt };
}

/**
 * Create an error status
 */
export function createErrorStatus(
  error: unknown,
  hash?: `0x${string}`
): TransactionStatus {
  const normalizedError = error instanceof Error ? error : new Error(String(error));
  return hash
    ? { status: "error", error: normalizedError, hash }
    : { status: "error", error: normalizedError };
}

/**
 * Type guard to check if transaction is in a loading state
 */
export function isTransactionLoading(status: TransactionStatus): boolean {
  return (
    status.status === "preparing" ||
    status.status === "pending" ||
    status.status === "confirming"
  );
}

/**
 * Type guard to check if transaction completed (success or error)
 */
export function isTransactionComplete(status: TransactionStatus): boolean {
  return status.status === "success" || status.status === "error";
}

/**
 * Get the transaction hash from any status that has one
 */
export function getTransactionHash(
  status: TransactionStatus
): `0x${string}` | undefined {
  if (
    status.status === "pending" ||
    status.status === "confirming" ||
    status.status === "success"
  ) {
    return status.hash;
  }
  if (status.status === "error" && status.hash) {
    return status.hash;
  }
  return undefined;
}

/**
 * Get a human-readable description of the current status
 */
export function getStatusMessage(status: TransactionStatus): string {
  switch (status.status) {
    case "idle":
      return "Ready to submit";
    case "preparing":
      return "Preparing transaction...";
    case "pending":
      return "Waiting for wallet approval...";
    case "confirming":
      return "Confirming transaction...";
    case "success":
      return "Transaction successful!";
    case "error":
      return getErrorMessage(status.error);
  }
}
