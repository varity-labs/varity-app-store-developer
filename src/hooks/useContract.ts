"use client";

import { useState, useEffect, useCallback } from "react";
import { getContract, readContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { thirdwebClient, varityL3 } from "@/lib/thirdweb";
import type { AppData } from "@/lib/constants";
import { handleTransactionError } from "@/lib/transactions";

// Contract address on Varity L3
const CONTRACT_ADDRESS = "0x3faa42a8639fcb076160d553e8d6e05add7d97a5";

// Contract ABI for read functions
const CONTRACT_ABI = [
  // get_app(app_id: u64) -> (u64, string, string, string, string, string, u64, address, bool, bool, u64, bool, string, u64)
  {
    type: "function",
    name: "getApp",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [
      { name: "id", type: "uint64" },
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "logo_url", type: "string" },
      { name: "category", type: "string" },
      { name: "chain_id", type: "uint64" },
      { name: "developer", type: "address" },
      { name: "is_active", type: "bool" },
      { name: "is_approved", type: "bool" },
      { name: "created_at", type: "uint64" },
      { name: "built_with_varity", type: "bool" },
      { name: "github_url", type: "string" },
      { name: "screenshot_count", type: "uint64" },
    ],
    stateMutability: "view",
  },
  // get_all_apps(max_results: u64) -> Vec<u64>
  {
    type: "function",
    name: "getAllApps",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
    stateMutability: "view",
  },
  // get_apps_by_developer(developer: address, max_results: u64) -> Vec<u64>
  {
    type: "function",
    name: "getAppsByDeveloper",
    inputs: [
      { name: "developer", type: "address" },
      { name: "max_results", type: "uint64" },
    ],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
    stateMutability: "view",
  },
  // get_pending_apps(max_results: u64) -> Vec<u64>
  {
    type: "function",
    name: "getPendingApps",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
    stateMutability: "view",
  },
  // get_app_screenshot(app_id: u64, index: u64) -> string
  {
    type: "function",
    name: "getAppScreenshot",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "index", type: "uint64" },
    ],
    outputs: [{ name: "url", type: "string" }],
    stateMutability: "view",
  },
  // is_admin(address: address) -> bool
  {
    type: "function",
    name: "isAdmin",
    inputs: [{ name: "address", type: "address" }],
    outputs: [{ name: "is_admin", type: "bool" }],
    stateMutability: "view",
  },
  // get_total_apps() -> u64
  {
    type: "function",
    name: "getTotalApps",
    inputs: [],
    outputs: [{ name: "total", type: "uint64" }],
    stateMutability: "view",
  },
  // register_app - write function
  {
    type: "function",
    name: "registerApp",
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
    stateMutability: "nonpayable",
  },
  // approve_app - write function
  {
    type: "function",
    name: "approveApp",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // reject_app - write function
  {
    type: "function",
    name: "rejectApp",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "reason", type: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // feature_app - write function
  {
    type: "function",
    name: "featureApp",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // update_app - write function
  {
    type: "function",
    name: "updateApp",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "screenshot_urls", type: "string[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // deactivate_app - write function
  {
    type: "function",
    name: "deactivateApp",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // initialize - one-time setup function
  {
    type: "function",
    name: "initialize",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

// Get contract instance
function getContractInstance() {
  return getContract({
    client: thirdwebClient,
    address: CONTRACT_ADDRESS,
    chain: varityL3,
    abi: CONTRACT_ABI,
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
          method: "getApp",
          params: [appId],
        });

        const [
          id,
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
        ] = result as [bigint, string, string, string, string, string, bigint, string, boolean, boolean, bigint, boolean, string, bigint];

        return parseAppData(
          id,
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
          method: "getAllApps",
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
          method: "getAppsByDeveloper",
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
          method: "getPendingApps",
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
              method: "getAppScreenshot",
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
          method: "isAdmin",
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
        method: "getTotalApps",
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
          method: "registerApp",
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
        setIsLoading(false);
        return result;
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
   * @returns Transaction result
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
          method: "approveApp",
          params: [appId],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);
        setIsLoading(false);
        return result;
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
   * @returns Transaction result
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
          method: "rejectApp",
          params: [appId, reason],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);
        setIsLoading(false);
        return result;
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
   * @returns Transaction result
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
          method: "updateApp",
          params: [appId, description, appUrl, screenshots],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);
        setIsLoading(false);
        return result;
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
   * @returns Transaction result
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
          method: "deactivateApp",
          params: [appId],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);
        setIsLoading(false);
        return result;
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
   * @returns Transaction result
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
          method: "featureApp",
          params: [appId],
        });

        const result = await sendTransaction({
          transaction,
          account,
        });

        setTxHash(result.transactionHash);
        setIsLoading(false);
        return result;
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
      setIsLoading(false);
      return result;
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
