"use client";

import { useState, useCallback, useMemo } from "react";
import type { TransactionReceipt } from "thirdweb/transaction";
import type { TransactionStatus } from "@/lib/transactions";
import {
  IDLE_STATUS,
  createPreparingStatus,
  createPendingStatus,
  createConfirmingStatus,
  createSuccessStatus,
  createErrorStatus,
  isTransactionLoading,
  isTransactionComplete,
  getTransactionHash,
  getStatusMessage,
} from "@/lib/transactions";

/**
 * Return type for the useTransactionStatus hook
 */
export interface UseTransactionStatusReturn {
  /** Current transaction status */
  status: TransactionStatus;

  /** Whether the transaction is in a loading state (preparing, pending, or confirming) */
  isLoading: boolean;

  /** Whether the transaction has completed (success or error) */
  isComplete: boolean;

  /** Whether the transaction was successful */
  isSuccess: boolean;

  /** Whether the transaction errored */
  isError: boolean;

  /** Whether the status is idle (not started) */
  isIdle: boolean;

  /** The transaction hash, if available */
  hash: `0x${string}` | undefined;

  /** Human-readable status message */
  message: string;

  /** Transition to preparing state */
  prepare: () => void;

  /** Transition to pending state (after wallet popup, before user confirms) */
  submit: (hash: `0x${string}`) => void;

  /** Transition to confirming state (after user confirms, waiting for blockchain) */
  confirm: (hash: `0x${string}`) => void;

  /** Transition to success state */
  success: (hash: `0x${string}`, receipt: TransactionReceipt) => void;

  /** Transition to error state */
  error: (err: unknown, hash?: `0x${string}`) => void;

  /** Reset to idle state */
  reset: () => void;
}

/**
 * Hook for managing transaction status with a state machine pattern
 *
 * Provides a clean API for tracking blockchain transaction lifecycle:
 * idle -> preparing -> pending -> confirming -> success/error
 *
 * @example
 * ```typescript
 * function SubmitButton() {
 *   const tx = useTransactionStatus();
 *   const { sendTransaction } = useSendTransaction();
 *
 *   const handleSubmit = async () => {
 *     tx.prepare();
 *     try {
 *       const result = await sendTransaction(preparedTx);
 *       tx.submit(result.transactionHash);
 *
 *       tx.confirm(result.transactionHash);
 *       const receipt = await waitForReceipt({ ... });
 *
 *       tx.success(result.transactionHash, receipt);
 *     } catch (err) {
 *       tx.error(err);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleSubmit} disabled={tx.isLoading}>
 *       {tx.message}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTransactionStatus(): UseTransactionStatusReturn {
  const [status, setStatus] = useState<TransactionStatus>(IDLE_STATUS);

  // Transition methods
  const prepare = useCallback(() => {
    setStatus(createPreparingStatus());
  }, []);

  const submit = useCallback((hash: `0x${string}`) => {
    setStatus(createPendingStatus(hash));
  }, []);

  const confirm = useCallback((hash: `0x${string}`) => {
    setStatus(createConfirmingStatus(hash));
  }, []);

  const success = useCallback((hash: `0x${string}`, receipt: TransactionReceipt) => {
    setStatus(createSuccessStatus(hash, receipt));
  }, []);

  const error = useCallback((err: unknown, hash?: `0x${string}`) => {
    setStatus(createErrorStatus(err, hash));
  }, []);

  const reset = useCallback(() => {
    setStatus(IDLE_STATUS);
  }, []);

  // Derived state
  const derivedState = useMemo(
    () => ({
      isLoading: isTransactionLoading(status),
      isComplete: isTransactionComplete(status),
      isSuccess: status.status === "success",
      isError: status.status === "error",
      isIdle: status.status === "idle",
      hash: getTransactionHash(status),
      message: getStatusMessage(status),
    }),
    [status]
  );

  return {
    status,
    ...derivedState,
    prepare,
    submit,
    confirm,
    success,
    error,
    reset,
  };
}

export default useTransactionStatus;
