"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

// Hook to check Privy configuration at runtime (not build time)
export function usePrivyConfigured(): boolean {
  const [configured, setConfigured] = useState(true); // Assume configured initially

  useEffect(() => {
    // Check at runtime in browser
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    setConfigured(typeof appId === 'string' && appId.length > 0);
  }, []);

  return configured;
}

// Safe wrapper around usePrivy that handles cases where Privy context is not available
export function useAuth() {
  try {
    const privy = usePrivy();
    return {
      ready: privy.ready,
      authenticated: privy.authenticated,
      login: privy.login,
      logout: privy.logout,
      user: privy.user,
      privyConfigured: true,
    };
  } catch {
    // Privy context not available (no valid app ID or during SSR)
    return {
      ready: true,
      authenticated: false,
      login: () => {
        console.warn("Privy not configured. Set NEXT_PUBLIC_PRIVY_APP_ID.");
        alert("Sign-in is temporarily unavailable. Please try again later.");
      },
      logout: () => {},
      user: null,
      privyConfigured: false,
    };
  }
}

// For backwards compatibility - always return true to not disable buttons
// The actual check happens via usePrivyConfigured hook or Privy's own error handling
export const isPrivyConfigured = true;
