"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider } from "@/contexts/ToastContext";

// Privy App ID - same as user portal for consistent auth
const PRIVY_APP_ID = "cm6f5z5og0g91t0pbulwvf5o2";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#14B8A6",
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
