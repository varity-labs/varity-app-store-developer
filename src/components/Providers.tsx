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

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Catches and handles React component errors
 *
 * This component wraps the entire application to catch JavaScript errors anywhere
 * in the component tree, log those errors, and display a fallback UI instead of
 * the component tree that crashed.
 *
 * Features:
 * - Catches errors in child components during rendering, lifecycle methods, and constructors
 * - Displays user-friendly error message with retry option
 * - Logs detailed error information for debugging
 * - Provides component stack trace for error investigation
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * Update state when an error is caught
   * This lifecycle method is called during the "render" phase
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * Log error details when error is caught
   * This lifecycle method is called during the "commit" phase
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console with full details
    console.error("=== ErrorBoundary caught an error ===");
    console.error("Error:", error);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    console.error("Component Stack:", errorInfo.componentStack);
    console.error("=====================================");

    // Store error info in state for display
    this.setState({ errorInfo });

    // In production, you would send this to an error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  /**
   * Reset error state and retry rendering
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

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
              <div className="flex gap-2 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-600 transition-colors"
                >
                  Reload Page
                </button>
              </div>
              {process.env.NODE_ENV === "development" && this.state.errorInfo && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
                    Error Details (Dev Only)
                  </summary>
                  <pre className="mt-2 max-h-64 overflow-auto rounded bg-gray-950 p-2 text-xs text-gray-300">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Providers - Root provider hierarchy for the application
 *
 * This component establishes the provider hierarchy for the entire application.
 * The order of providers is critical and follows this structure:
 *
 * 1. ErrorBoundary (outermost)
 *    - Catches all React errors in the component tree
 *    - Must wrap everything to catch errors from all providers
 *
 * 2. QueryClientProvider (React Query)
 *    - Provides data fetching, caching, and state management
 *    - Must wrap Thirdweb and other providers that use queries
 *
 * 3. ThirdwebProvider
 *    - Provides blockchain connection and contract interaction utilities
 *    - Requires QueryClient for hooks like useReadContract
 *
 * 4. PrivyProvider
 *    - Provides authentication (email, social, wallet)
 *    - Creates embedded wallets for users
 *    - Must wrap providers that depend on authentication
 *
 * 5. ToastProvider
 *    - Provides toast notification system
 *    - Needs access to auth state for user-specific notifications
 *
 * 6. GithubProvider
 *    - Provides GitHub OAuth integration and repository access
 *    - Depends on Privy authentication for GitHub linking
 *    - Uses React Query for data fetching (repositories, orgs)
 *
 * @param children - The application component tree to wrap
 * @returns The complete provider hierarchy
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize React Query client with optimized defaults
  // Using useState ensures single instance across re-renders
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
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
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
            <ToastProvider>
              <GithubProvider>{children}</GithubProvider>
            </ToastProvider>
          </PrivyProvider>
        </ThirdwebProvider>

        {/* React Query DevTools - Development only */}
        {/* Provides visual debugging for React Query cache and queries */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
