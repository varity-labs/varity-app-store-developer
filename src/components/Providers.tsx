"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState, Component, ErrorInfo, ReactNode } from "react";
import { ToastProvider } from "@/contexts/ToastContext";
import { GithubProvider } from "@/contexts/GithubContext";

// Privy App ID - same for all Varity apps (app store and packages)
const PRIVY_APP_ID = "cmhwbozxu004fjr0cicfz0tf8";

// Error Boundary Component for catching React errors
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
            <div className="max-w-md rounded-lg bg-gray-800 p-6 text-center">
              <h2 className="mb-2 text-xl font-semibold text-red-400">
                Something went wrong
              </h2>
              <p className="mb-4 text-gray-400">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds - data considered fresh
            gcTime: 5 * 60 * 1000, // 5 minutes - garbage collection time (formerly cacheTime)
            retry: 3, // Retry failed requests 3 times
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff: 1s, 2s, 4s, max 30s
            refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
          },
        },
      })
  );

  return (
    <ErrorBoundary>
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
              <GithubProvider>{children}</GithubProvider>
            </ToastProvider>
            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </ThirdwebProvider>
      </PrivyProvider>
    </ErrorBoundary>
  );
}
