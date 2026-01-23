"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ToastProvider } from "@/contexts/ToastContext";

// Get Privy app ID - must be a valid ID or Privy will throw
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

// Debug: Log Privy configuration status
if (typeof window !== 'undefined') {
  console.log('[Varity] Privy App ID configured:', !!PRIVY_APP_ID);
  if (!PRIVY_APP_ID) {
    console.warn('[Varity] NEXT_PUBLIC_PRIVY_APP_ID is not set. Sign-in will not work.');
    console.warn('[Varity] Make sure environment variables are set in your hosting platform and rebuild.');
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render children without Privy during SSR or if no valid app ID
  if (!mounted || !PRIVY_APP_ID) {
    return (
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryClientProvider>
      </ThirdwebProvider>
    );
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#14B8A6", // Varity brand teal
          logo: "/logo/varity-logo-color.svg",
        },
        loginMethods: ["email", "wallet", "google", "github"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryClientProvider>
      </ThirdwebProvider>
    </PrivyProvider>
  );
}
