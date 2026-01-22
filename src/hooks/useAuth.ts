"use client";

import { usePrivy } from "@privy-io/react-auth";

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
    };
  } catch {
    // Privy context not available (no valid app ID or during SSR)
    return {
      ready: true,
      authenticated: false,
      login: () => {
        console.warn("Privy not configured. Set NEXT_PUBLIC_PRIVY_APP_ID.");
      },
      logout: () => {},
      user: null,
    };
  }
}
