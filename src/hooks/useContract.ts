"use client";

import { useState, useCallback } from "react";
import { getContract, readContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { thirdwebClient, varityL3 } from "@/lib/thirdweb";
import type { AppData } from "@/lib/constants";
import { handleTransactionError, waitForTransaction } from "@/lib/transactions";
import { REGISTRY_ABI, VARITY_APP_REGISTRY_ADDRESS } from "@/lib/contracts";

// Get contract instance using the centralized ABI and address
function getContractInstance() {
  return getContract({
    client: thirdwebClient,
    address: VARITY_APP_REGISTRY_ADDRESS,
    chain: varityL3,
    abi: REGISTRY_ABI,
  });
}

// Parse contract app data to AppData interface
function parseAppData(
  id: bigint,
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
): AppData {
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
 * Hook for reading and writing to contract
 * Uses thirdweb v5 function-based API
 * Method names use snake_case to match the Stylus/Rust contract ABI
 */
export function useContract() {
  const contract = getContractInstance();
  const account = useActiveAccount();

  // Transaction state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  /**
   * Get a single app by ID
   */
  const getApp = useCallback(
    async (appId: bigint): Promise<AppData | null> => {
      try {
        const result = await readContract({
          contract,
          method: "get_app",
          params: [appId],
        });

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
        ] = result as [string, string, string, string, string, bigint, string, boolean, boolean, bigint, boolean, string, bigint];

        return parseAppData(
          appId, // Use the passed appId since get_app doesn't return id in outputs
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
          screenshotCount
        );
      } catch (error) {
        console.error("Error fetching app:", error);
        return null;
      }
    },
    [contract]
  );

  /**
   * Get all approved and active apps
   */
  const getAllApps = useCallback(
    async (maxResults: number = 100): Promise<AppData[]> => {
      try {
        // Get app IDs
        const appIds = await readContract({
          contract,
          method: "get_all_apps",
          params: [BigInt(maxResults)],
        });

        if (!appIds || appIds.length === 0) {
          return [];
        }

        // Fetch all app details in parallel
        const apps = await Promise.all(
          (appIds as bigint[]).map((id) => getApp(id))
        );

        // Filter out null results
        return apps.filter((app): app is AppData => app !== null);
      } catch (error) {
        console.error("Error fetching all apps:", error);
        return [];
      }
    },
    [contract, getApp]
  );

  /**
   * Get apps by developer address
   */
  const getAppsByDeveloper = useCallback(
    async (developerAddress: string, maxResults: number = 100): Promise<AppData[]> => {
      try {
        // Get app IDs for developer
        const appIds = await readContract({
          contract,
          method: "get_apps_by_developer",
          params: [developerAddress as `0x${string}`, BigInt(maxResults)],
        });

        if (!appIds || appIds.length === 0) {
          return [];
        }

        // Fetch all app details in parallel
        const apps = await Promise.all(
          (appIds as bigint[]).map((id) => getApp(id))
        );

        // Filter out null results
        return apps.filter((app): app is AppData => app !== null);
      } catch (error) {
        console.error("Error fetching apps by developer:", error);
        return [];
      }
    },
    [contract, getApp]
  );

  /**
   * Get pending apps (admin only)
   */
  const getPendingApps = useCallback(
    async (maxResults: number = 100): Promise<AppData[]> => {
      try {
        // Get pending app IDs
        const appIds = await readContract({
          contract,
          method: "get_pending_apps",
          params: [BigInt(maxResults)],
        });

        if (!appIds || appIds.length === 0) {
          return [];
        }

        // Fetch all app details in parallel
        const apps = await Promise.all(
          (appIds as bigint[]).map((id) => getApp(id))
        );

        // Filter out null results
        return apps.filter((app): app is AppData => app !== null);
      } catch (error) {
        console.error("Error fetching pending apps:", error);
        return [];
      }
    },
    [contract, getApp]
  );

  /**
   * Get screenshots for an app
   */
  const getAppScreenshots = useCallback(
    async (appId: bigint, screenshotCount: number): Promise<string[]> => {
      try {
        const screenshots = await Promise.all(
          Array.from({ length: screenshotCount }, (_, i) =>
            readContract({
              contract,
              method: "get_app_screenshot",
              params: [appId, BigInt(i)],
            })
          )
        );

        return screenshots as string[];
      } catch (error) {
        console.error("Error fetching screenshots:", error);
        return [];
      }
    },
    [contract]
  );

  /**
   * Check if address is admin
   */
  const isAdmin = useCallback(
    async (address: string): Promise<boolean> => {
      try {
        const result = await readContract({
          contract,
          method: "is_admin",
          params: [address as `0x${string}`],
        });

        return result as boolean;
      } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
    },
    [contract]
  );

  /**
   * Get total number of apps
   */
  const getTotalApps = useCallback(async (): Promise<number> => {
    try {
      const result = await readContract({
        contract,
        method: "get_total_apps",
        params: [],
      });

      return Number(result);
    } catch (error) {
      console.error("Error fetching total apps:", error);
      return 0;
    }
  }, [contract]);

  /**
   * WRITE FUNCTIONS
   */

  /**
   * Register a new app
   * @param appData - Application data
   * @returns Transaction result with app ID
   */
  const registerApp = useCallback(
    async (appData: {
      name: string;
      description: string;
      appUrl: string;
      logoUrl: string;
      category: string;
      chainId: number;
      builtWithVarity: boolean;
      githubUrl: string;
      screenshots: string[];
    }) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);
      setTxHash(null);

      try {
        // Prepare the contract call
        const transaction = prepareContractCall({
          contract,
          method: "register_app",
          params: [
            appData.name,
            appData.description,
            appData.appUrl,
            appData.logoUrl,
            appData.category,
            BigInt(appData.chainId),
            appData.builtWithVarity,
            appData.githubUrl,
            appData.screenshots,
          ],
        });

        // Send transaction
        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);

        // Wait for transaction confirmation
        const receipt = await waitForTransaction(
          thirdwebClient,
          varityL3,
          result.transactionHash as `0x${string}`
        );

        setIsLoading(false);
        return { ...result, receipt };
      } catch (err) {
        const errorMessage = handleTransactionError(err);
        setError(errorMessage);
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    },
    [account, contract]
  );

  /**
   * Approve an app (admin only)
   * @param appId - ID of the app to approve
   * @returns Transaction result with receipt
   */
  const approveApp = useCallback(
    async (appId: bigint) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);
      setTxHash(null);

      try {
        const transaction = prepareContractCall({
          contract,
          method: "approve_app",
          params: [appId],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);

        // Wait for transaction confirmation
        const receipt = await waitForTransaction(
          thirdwebClient,
          varityL3,
          result.transactionHash as `0x${string}`
        );

        setIsLoading(false);
        return { ...result, receipt };
      } catch (err) {
        const errorMessage = handleTransactionError(err);
        setError(errorMessage);
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    },
    [account, contract]
  );

  /**
   * Reject an app (admin only)
   * @param appId - ID of the app to reject
   * @param reason - Reason for rejection
   * @returns Transaction result with receipt
   */
  const rejectApp = useCallback(
    async (appId: bigint, reason: string) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);
      setTxHash(null);

      try {
        const transaction = prepareContractCall({
          contract,
          method: "reject_app",
          params: [appId, reason],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);

        // Wait for transaction confirmation
        const receipt = await waitForTransaction(
          thirdwebClient,
          varityL3,
          result.transactionHash as `0x${string}`
        );

        setIsLoading(false);
        return { ...result, receipt };
      } catch (err) {
        const errorMessage = handleTransactionError(err);
        setError(errorMessage);
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    },
    [account, contract]
  );

  /**
   * Update an app (developer only)
   * @param appId - ID of the app
   * @param description - Updated description
   * @param appUrl - Updated app URL
   * @param screenshots - Updated screenshot URLs
   * @returns Transaction result with receipt
   */
  const updateApp = useCallback(
    async (
      appId: bigint,
      description: string,
      appUrl: string,
      screenshots: string[]
    ) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);
      setTxHash(null);

      try {
        const transaction = prepareContractCall({
          contract,
          method: "update_app",
          params: [appId, description, appUrl, screenshots],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);

        // Wait for transaction confirmation
        const receipt = await waitForTransaction(
          thirdwebClient,
          varityL3,
          result.transactionHash as `0x${string}`
        );

        setIsLoading(false);
        return { ...result, receipt };
      } catch (err) {
        const errorMessage = handleTransactionError(err);
        setError(errorMessage);
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    },
    [account, contract]
  );

  /**
   * Deactivate an app (developer only)
   * @param appId - ID of the app to deactivate
   * @returns Transaction result with receipt
   */
  const deactivateApp = useCallback(
    async (appId: bigint) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);
      setTxHash(null);

      try {
        const transaction = prepareContractCall({
          contract,
          method: "deactivate_app",
          params: [appId],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);

        // Wait for transaction confirmation
        const receipt = await waitForTransaction(
          thirdwebClient,
          varityL3,
          result.transactionHash as `0x${string}`
        );

        setIsLoading(false);
        return { ...result, receipt };
      } catch (err) {
        const errorMessage = handleTransactionError(err);
        setError(errorMessage);
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    },
    [account, contract]
  );

  /**
   * Feature an app (admin only)
   * @param appId - ID of the app to feature
   * @returns Transaction result with receipt
   */
  const featureApp = useCallback(
    async (appId: bigint) => {
      if (!account) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);
      setTxHash(null);

      try {
        const transaction = prepareContractCall({
          contract,
          method: "feature_app",
          params: [appId],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);

        // Wait for transaction confirmation
        const receipt = await waitForTransaction(
          thirdwebClient,
          varityL3,
          result.transactionHash as `0x${string}`
        );

        setIsLoading(false);
        return { ...result, receipt };
      } catch (err) {
        const errorMessage = handleTransactionError(err);
        setError(errorMessage);
        setIsLoading(false);
        throw new Error(errorMessage);
      }
    },
    [account, contract]
  );

  /**
   * Reset transaction state
   */
  const resetState = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setTxHash(null);
  }, []);

  /**
   * Initialize contract (one-time setup)
   * Sets deployer as first admin
   * @returns Transaction result with receipt
   */
  const initialize = useCallback(async () => {
    if (!account) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const transaction = prepareContractCall({
        contract,
        method: "initialize",
        params: [],
      });

      const result = await sendTransaction({
        transaction,
        account,
      });

      setTxHash(result.transactionHash);

      // Wait for transaction confirmation
      const receipt = await waitForTransaction(
        thirdwebClient,
        varityL3,
        result.transactionHash as `0x${string}`
      );

      setIsLoading(false);
      return { ...result, receipt };
    } catch (err) {
      const errorMessage = handleTransactionError(err);
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  }, [account, contract]);

  return {
    // Contract instance
    contract,

    // Read operations
    getApp,
    getAllApps,
    getAppsByDeveloper,
    getPendingApps,
    getAppScreenshots,
    isAdmin,
    getTotalApps,

    // Write operations
    registerApp,
    approveApp,
    rejectApp,
    updateApp,
    deactivateApp,
    featureApp,
    initialize,

    // Transaction state
    isLoading,
    error,
    txHash,
    resetState,

    // Account info
    account,
    isConnected: !!account,
  };
}
