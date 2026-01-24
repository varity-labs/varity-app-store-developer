/**
 * Transaction utility functions for handling blockchain interactions
 * Provides gas estimation, transaction waiting, and error handling
 */

import { estimateGas, waitForReceipt } from "thirdweb";
import type { PreparedTransaction, ThirdwebClient, Chain } from "thirdweb";
import type { Account } from "thirdweb/wallets";
import type { TransactionReceipt } from "thirdweb/transaction";

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
 * Transaction state machine types
 */
export type TransactionState =
  | "idle"
  | "preparing"
  | "awaiting_approval"
  | "pending"
  | "confirming"
  | "success"
  | "error";

export interface TransactionStatus {
  state: TransactionState;
  hash?: string;
  error?: string;
  gasEstimate?: bigint;
}
