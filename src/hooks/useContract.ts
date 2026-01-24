"use client";

import { useState, useCallback } from "react";
import { getContract, readContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { thirdwebClient, varityL3 } from "@/lib/thirdweb";
import type { AppData } from "@/lib/constants";
import { handleTransactionError, waitForTransaction } from "@/lib/transactions";
import { REGISTRY_ABI, VARITY_APP_REGISTRY_ADDRESS } from "@/lib/contracts";

// ============================================================================
// Query Keys - centralized for consistency and easy invalidation
// ============================================================================
export const contractQueryKeys = {
  all: ["contract"] as const,
  app: (appId: bigint) => [...contractQueryKeys.all, "app", appId.toString()] as const,
  allApps: (maxResults: number) => [...contractQueryKeys.all, "allApps", maxResults] as const,
  appsByDeveloper: (address: string, maxResults: number) =>
    [...contractQueryKeys.all, "appsByDeveloper", address, maxResults] as const,
  pendingApps: (maxResults: number) => [...contractQueryKeys.all, "pendingApps", maxResults] as const,
  appScreenshots: (appId: bigint, count: number) =>
    [...contractQueryKeys.all, "screenshots", appId.toString(), count] as const,
  isAdmin: (address: string) => [...contractQueryKeys.all, "isAdmin", address] as const,
  totalApps: () => [...contractQueryKeys.all, "totalApps"] as const,
};

// ============================================================================
// Stale Time Configuration
// ============================================================================
const STALE_TIMES = {
  appDetails: 30 * 1000, // 30 seconds - app details change occasionally
  allApps: 60 * 1000, // 1 minute - list changes infrequently
  developerApps: 30 * 1000, // 30 seconds - developer may submit new apps
  pendingApps: 30 * 1000, // 30 seconds - admins need fresh data
  screenshots: 5 * 60 * 1000, // 5 minutes - screenshots rarely change
  isAdmin: 10 * 60 * 1000, // 10 minutes - admin status changes very rarely
  totalApps: 60 * 1000, // 1 minute - total changes infrequently
} as const;

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

// ============================================================================
// Standalone Fetch Functions (for use with React Query)
// ============================================================================

/**
 * Fetch a single app by ID (standalone function)
 */
async function fetchApp(appId: bigint): Promise<AppData | null> {
  const contract = getContractInstance();
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
      appId,
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
}

/**
 * Fetch all approved and active apps (standalone function)
 */
async function fetchAllApps(maxResults: number = 100): Promise<AppData[]> {
  const contract = getContractInstance();
  try {
    const appIds = await readContract({
      contract,
      method: "get_all_apps",
      params: [BigInt(maxResults)],
    });

    if (!appIds || appIds.length === 0) {
      return [];
    }

    const apps = await Promise.all(
      (appIds as bigint[]).map((id) => fetchApp(id))
    );

    return apps.filter((app): app is AppData => app !== null);
  } catch (error) {
    console.error("Error fetching all apps:", error);
    return [];
  }
}

/**
 * Fetch apps by developer address (standalone function)
 */
async function fetchAppsByDeveloper(developerAddress: string, maxResults: number = 100): Promise<AppData[]> {
  const contract = getContractInstance();
  try {
    const appIds = await readContract({
      contract,
      method: "get_apps_by_developer",
      params: [developerAddress as `0x${string}`, BigInt(maxResults)],
    });

    if (!appIds || appIds.length === 0) {
      return [];
    }

    const apps = await Promise.all(
      (appIds as bigint[]).map((id) => fetchApp(id))
    );

    return apps.filter((app): app is AppData => app !== null);
  } catch (error) {
    console.error("Error fetching apps by developer:", error);
    return [];
  }
}

/**
 * Fetch pending apps (standalone function)
 */
async function fetchPendingApps(maxResults: number = 100): Promise<AppData[]> {
  const contract = getContractInstance();
  try {
    const appIds = await readContract({
      contract,
      method: "get_pending_apps",
      params: [BigInt(maxResults)],
    });

    if (!appIds || appIds.length === 0) {
      return [];
    }

    const apps = await Promise.all(
      (appIds as bigint[]).map((id) => fetchApp(id))
    );

    return apps.filter((app): app is AppData => app !== null);
  } catch (error) {
    console.error("Error fetching pending apps:", error);
    return [];
  }
}

/**
 * Fetch screenshots for an app (standalone function)
 */
async function fetchAppScreenshots(appId: bigint, screenshotCount: number): Promise<string[]> {
  const contract = getContractInstance();
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
}

/**
 * Check if address is admin (standalone function)
 */
async function fetchIsAdmin(address: string): Promise<boolean> {
  const contract = getContractInstance();
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
}

/**
 * Get total number of apps (standalone function)
 */
async function fetchTotalApps(): Promise<number> {
  const contract = getContractInstance();
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
}

// ============================================================================
// React Query Hooks
// ============================================================================

/**
 * React Query hook for fetching a single app by ID
 * @param appId - The app ID to fetch
 * @returns Query result with app data, loading state, and error
 */
export function useApp(appId: bigint | undefined) {
  return useQuery({
    queryKey: contractQueryKeys.app(appId ?? BigInt(0)),
    queryFn: () => fetchApp(appId!),
    enabled: appId !== undefined && appId >= BigInt(0),
    staleTime: STALE_TIMES.appDetails,
  });
}

/**
 * React Query hook for fetching all approved and active apps
 * @param maxResults - Maximum number of apps to fetch (default: 100)
 * @returns Query result with apps array, loading state, and error
 */
export function useAllApps(maxResults: number = 100) {
  return useQuery({
    queryKey: contractQueryKeys.allApps(maxResults),
    queryFn: () => fetchAllApps(maxResults),
    staleTime: STALE_TIMES.allApps,
  });
}

/**
 * React Query hook for fetching apps by developer address
 * @param address - Developer's wallet address
 * @param maxResults - Maximum number of apps to fetch (default: 100)
 * @returns Query result with apps array, loading state, and error
 */
export function useAppsByDeveloper(address: string | undefined, maxResults: number = 100) {
  return useQuery({
    queryKey: contractQueryKeys.appsByDeveloper(address ?? "", maxResults),
    queryFn: () => fetchAppsByDeveloper(address!, maxResults),
    enabled: !!address && address.startsWith("0x"),
    staleTime: STALE_TIMES.developerApps,
  });
}

/**
 * React Query hook for fetching pending apps (admin only)
 * @param maxResults - Maximum number of apps to fetch (default: 100)
 * @returns Query result with pending apps array, loading state, and error
 */
export function usePendingApps(maxResults: number = 100) {
  return useQuery({
    queryKey: contractQueryKeys.pendingApps(maxResults),
    queryFn: () => fetchPendingApps(maxResults),
    staleTime: STALE_TIMES.pendingApps,
  });
}

/**
 * React Query hook for fetching app screenshots
 * @param appId - The app ID
 * @param screenshotCount - Number of screenshots to fetch
 * @returns Query result with screenshots array, loading state, and error
 */
export function useAppScreenshots(appId: bigint | undefined, screenshotCount: number) {
  return useQuery({
    queryKey: contractQueryKeys.appScreenshots(appId ?? BigInt(0), screenshotCount),
    queryFn: () => fetchAppScreenshots(appId!, screenshotCount),
    enabled: appId !== undefined && screenshotCount > 0,
    staleTime: STALE_TIMES.screenshots,
  });
}

/**
 * React Query hook for checking admin status
 * @param address - Address to check
 * @returns Query result with boolean admin status, loading state, and error
 */
export function useIsAdmin(address: string | undefined) {
  return useQuery({
    queryKey: contractQueryKeys.isAdmin(address ?? ""),
    queryFn: () => fetchIsAdmin(address!),
    enabled: !!address && address.startsWith("0x"),
    staleTime: STALE_TIMES.isAdmin,
  });
}

/**
 * React Query hook for fetching total number of apps
 * @returns Query result with total apps count, loading state, and error
 */
export function useTotalApps() {
  return useQuery({
    queryKey: contractQueryKeys.totalApps(),
    queryFn: fetchTotalApps,
    staleTime: STALE_TIMES.totalApps,
  });
}

// ============================================================================
// React Query Mutation Hooks with Query Invalidation
// ============================================================================

interface RegisterAppData {
  name: string;
  description: string;
  appUrl: string;
  logoUrl: string;
  category: string;
  chainId: number;
  builtWithVarity: boolean;
  githubUrl: string;
  screenshots: string[];
}

/**
 * React Query mutation hook for registering a new app
 * Automatically invalidates relevant queries on success
 */
export function useRegisterAppMutation() {
  const queryClient = useQueryClient();
  const { registerApp, account } = useContract();

  return useMutation({
    mutationFn: (appData: RegisterAppData) => registerApp(appData),
    onSuccess: () => {
      // Invalidate all app lists and total count
      queryClient.invalidateQueries({ queryKey: contractQueryKeys.all });
      // Specifically invalidate developer apps if we have the account
      if (account?.address) {
        queryClient.invalidateQueries({
          queryKey: ["contract", "appsByDeveloper", account.address],
        });
      }
    },
  });
}

/**
 * React Query mutation hook for updating an app
 * Automatically invalidates the specific app and developer apps on success
 */
export function useUpdateAppMutation() {
  const queryClient = useQueryClient();
  const { updateApp, account } = useContract();

  return useMutation({
    mutationFn: ({
      appId,
      description,
      appUrl,
      screenshots,
    }: {
      appId: bigint;
      description: string;
      appUrl: string;
      screenshots: string[];
    }) => updateApp(appId, description, appUrl, screenshots),
    onSuccess: (_, variables) => {
      // Invalidate the specific app
      queryClient.invalidateQueries({
        queryKey: contractQueryKeys.app(variables.appId),
      });
      // Invalidate developer apps list
      if (account?.address) {
        queryClient.invalidateQueries({
          queryKey: ["contract", "appsByDeveloper", account.address],
        });
      }
      // Invalidate all apps list (in case visibility changed)
      queryClient.invalidateQueries({
        queryKey: ["contract", "allApps"],
      });
    },
  });
}

/**
 * React Query mutation hook for approving an app (admin only)
 * Automatically invalidates relevant queries on success
 */
export function useApproveAppMutation() {
  const queryClient = useQueryClient();
  const { approveApp } = useContract();

  return useMutation({
    mutationFn: (appId: bigint) => approveApp(appId),
    onSuccess: (_, appId) => {
      // Invalidate the specific app
      queryClient.invalidateQueries({
        queryKey: contractQueryKeys.app(appId),
      });
      // Invalidate pending apps list
      queryClient.invalidateQueries({
        queryKey: ["contract", "pendingApps"],
      });
      // Invalidate all apps list (newly approved app should appear)
      queryClient.invalidateQueries({
        queryKey: ["contract", "allApps"],
      });
    },
  });
}

/**
 * React Query mutation hook for rejecting an app (admin only)
 * Automatically invalidates relevant queries on success
 */
export function useRejectAppMutation() {
  const queryClient = useQueryClient();
  const { rejectApp } = useContract();

  return useMutation({
    mutationFn: ({ appId, reason }: { appId: bigint; reason: string }) =>
      rejectApp(appId, reason),
    onSuccess: (_, variables) => {
      // Invalidate the specific app
      queryClient.invalidateQueries({
        queryKey: contractQueryKeys.app(variables.appId),
      });
      // Invalidate pending apps list
      queryClient.invalidateQueries({
        queryKey: ["contract", "pendingApps"],
      });
    },
  });
}

/**
 * React Query mutation hook for deactivating an app
 * Automatically invalidates relevant queries on success
 */
export function useDeactivateAppMutation() {
  const queryClient = useQueryClient();
  const { deactivateApp, account } = useContract();

  return useMutation({
    mutationFn: (appId: bigint) => deactivateApp(appId),
    onSuccess: (_, appId) => {
      // Invalidate the specific app
      queryClient.invalidateQueries({
        queryKey: contractQueryKeys.app(appId),
      });
      // Invalidate developer apps list
      if (account?.address) {
        queryClient.invalidateQueries({
          queryKey: ["contract", "appsByDeveloper", account.address],
        });
      }
      // Invalidate all apps list
      queryClient.invalidateQueries({
        queryKey: ["contract", "allApps"],
      });
    },
  });
}

/**
 * React Query mutation hook for featuring an app (admin only)
 * Automatically invalidates relevant queries on success
 */
export function useFeatureAppMutation() {
  const queryClient = useQueryClient();
  const { featureApp } = useContract();

  return useMutation({
    mutationFn: (appId: bigint) => featureApp(appId),
    onSuccess: (_, appId) => {
      // Invalidate the specific app
      queryClient.invalidateQueries({
        queryKey: contractQueryKeys.app(appId),
      });
      // Invalidate all apps list
      queryClient.invalidateQueries({
        queryKey: ["contract", "allApps"],
      });
    },
  });
}

/**
 * Hook to get query client for manual invalidation
 * Useful when you need to invalidate queries outside of mutation hooks
 */
export function useContractQueryClient() {
  const queryClient = useQueryClient();

  return {
    queryClient,
    invalidateApp: (appId: bigint) =>
      queryClient.invalidateQueries({ queryKey: contractQueryKeys.app(appId) }),
    invalidateAllApps: () =>
      queryClient.invalidateQueries({ queryKey: ["contract", "allApps"] }),
    invalidateDeveloperApps: (address: string) =>
      queryClient.invalidateQueries({
        queryKey: ["contract", "appsByDeveloper", address],
      }),
    invalidatePendingApps: () =>
      queryClient.invalidateQueries({ queryKey: ["contract", "pendingApps"] }),
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: contractQueryKeys.all }),
  };
}
