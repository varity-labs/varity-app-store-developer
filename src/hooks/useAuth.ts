"use client";

import { usePrivy, User } from "@privy-io/react-auth";

/**
 * Return type for the useAuth hook
 */
export interface UseAuthReturn {
  /** Whether Privy has finished initializing */
  ready: boolean;
  /** Whether the user is currently authenticated */
  authenticated: boolean;
  /** Function to open the login modal */
  login: () => void;
  /** Function to log the user out */
  logout: () => Promise<void>;
  /** The current user object, or null if not authenticated */
  user: User | null;
}

/**
 * A thin wrapper around usePrivy that provides authentication state and methods.
 * This hook must be used within a PrivyProvider context.
 */
export function useAuth(): UseAuthReturn {
  const { ready, authenticated, login, logout, user } = usePrivy();

  return {
    ready,
    authenticated,
    login,
    logout,
    user,
  };
}
