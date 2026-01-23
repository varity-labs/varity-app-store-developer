"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ToastProvider } from "@/contexts/ToastContext";

// Privy App ID - hardcoded for static export reliability
// This is a public value (NEXT_PUBLIC_ prefix) so it's safe to include in client code
const PRIVY_APP_ID = "cm6f5z5og0g91t0pbulwvf5o2";

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
