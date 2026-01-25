"use client";

import { usePrivy, User } from "@privy-io/react-auth";
import { useMemo, useState, useCallback, useEffect, ReactNode, createElement } from "react";
import { useRouter } from "next/navigation";

/**
 * Authentication state returned by the useAuth hook.
 * Provides all necessary information and methods for managing user authentication.
 */
export interface AuthState {
  /**
   * Whether the user is currently authenticated.
   * This is true only when Privy has finished loading AND the user is logged in.
   */
  isAuthenticated: boolean;

  /**
   * Whether the authentication state is still being determined.
   * True while Privy is initializing or during login/logout operations.
   */
  isLoading: boolean;

  /**
   * The current authenticated user object from Privy.
   * Contains user details including linked accounts and wallet information.
   * Null if the user is not authenticated.
   */
  user: User | null;

  /**
   * The user's primary wallet address if available.
   * This is extracted from the user object for convenience.
   * Undefined if the user is not authenticated or has no wallet.
   */
  walletAddress: string | undefined;

  /**
   * The user's email address if available.
   * Undefined if the user is not authenticated or has no email linked.
   */
  email: string | undefined;

  /**
   * Any error that occurred during authentication operations.
   * Null if no error has occurred.
   */
  error: Error | null;

  /**
   * Opens the Privy login modal to authenticate the user.
   * Supports email, social, and wallet authentication methods.
   */
  login: () => void;

  /**
   * Logs the user out and clears their session.
   * Returns a promise that resolves when logout is complete.
   */
  logout: () => Promise<void>;

  /**
   * Alias for logout - signs the user out.
   * Provided for semantic clarity in components.
   */
  signOut: () => Promise<void>;

  /**
   * Clears any authentication error state.
   * Useful for dismissing error messages in the UI.
   */
  clearError: () => void;

  // ============================================
  // Backward Compatibility Properties
  // ============================================

  /**
   * @deprecated Use `isLoading` instead. This returns the inverse: `!isLoading`.
   * Whether Privy has finished initializing.
   */
  ready: boolean;

  /**
   * @deprecated Use `isAuthenticated` instead.
   * Alias for isAuthenticated for backward compatibility.
   */
  authenticated: boolean;
}

/**
 * Authentication hook wrapping Privy.
 * Provides user state, wallet info, and auth methods with proper memoization.
 *
 * @returns {AuthState} The current authentication state and methods
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isAuthenticated, isLoading, user, login, logout } = useAuth();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   if (!isAuthenticated) {
 *     return <button onClick={login}>Sign In</button>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {user?.email?.address}</p>
 *       <button onClick={logout}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthState {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [error, setError] = useState<Error | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Clear error when authentication state changes
  useEffect(() => {
    if (authenticated) {
      setError(null);
    }
  }, [authenticated]);

  /**
   * Wrapped logout function that tracks loading state and handles errors.
   */
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setError(null);
    try {
      await logout();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to sign out");
      setError(error);
      throw error;
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  /**
   * Wrapped login function that handles errors.
   */
  const handleLogin = useCallback(() => {
    setError(null);
    try {
      login();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to open login");
      setError(error);
    }
  }, [login]);

  /**
   * Clears any authentication error.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo<AuthState>(
    () => ({
      // Primary API
      isAuthenticated: authenticated,
      isLoading: !ready || isLoggingOut,
      user: user ?? null,
      walletAddress: user?.wallet?.address,
      email: user?.email?.address,
      error,
      login: handleLogin,
      logout: handleLogout,
      signOut: handleLogout,
      clearError,
      // Backward compatibility
      ready: ready && !isLoggingOut,
      authenticated,
    }),
    [ready, authenticated, user, error, isLoggingOut, handleLogin, handleLogout, clearError]
  );
}

/**
 * Props for the AuthGuard component.
 */
export interface AuthGuardProps {
  /** The content to render when authenticated */
  children: ReactNode;

  /**
   * Custom loading component to show while checking authentication.
   * Defaults to a centered loading spinner.
   */
  loadingComponent?: ReactNode;

  /**
   * Custom component to show when not authenticated.
   * If not provided, redirects to the home page.
   */
  fallback?: ReactNode;

  /**
   * URL to redirect to when not authenticated.
   * Only used if fallback is not provided.
   * Defaults to "/" (home page).
   */
  redirectTo?: string;

  /**
   * Callback fired when authentication check fails.
   * Useful for logging or analytics.
   */
  onUnauthenticated?: () => void;
}

/**
 * Default loading spinner component for AuthGuard.
 */
function DefaultLoadingSpinner() {
  return createElement(
    "div",
    {
      className: "flex min-h-[60vh] items-center justify-center",
      role: "status",
      "aria-label": "Loading authentication status",
    },
    createElement("div", {
      className:
        "h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-brand-500",
    }),
    createElement("span", { className: "sr-only" }, "Loading...")
  );
}

/**
 * AuthGuard component for protecting routes that require authentication.
 * Handles loading states, redirects, and provides customizable fallbacks.
 *
 * @example
 * ```tsx
 * // Basic usage - redirects to home if not authenticated
 * function ProtectedPage() {
 *   return (
 *     <AuthGuard>
 *       <DashboardContent />
 *     </AuthGuard>
 *   );
 * }
 *
 * // With custom loading and fallback
 * function ProtectedPage() {
 *   return (
 *     <AuthGuard
 *       loadingComponent={<CustomSpinner />}
 *       fallback={<SignInPrompt />}
 *     >
 *       <DashboardContent />
 *     </AuthGuard>
 *   );
 * }
 *
 * // With custom redirect
 * function ProtectedPage() {
 *   return (
 *     <AuthGuard redirectTo="/login">
 *       <DashboardContent />
 *     </AuthGuard>
 *   );
 * }
 * ```
 */
export function AuthGuard({
  children,
  loadingComponent,
  fallback,
  redirectTo = "/",
  onUnauthenticated,
}: AuthGuardProps): ReactNode {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

  // Handle redirect when not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !fallback) {
      onUnauthenticated?.();
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, fallback, redirectTo, router, onUnauthenticated]);

  // Show loading state
  if (isLoading) {
    return loadingComponent ?? createElement(DefaultLoadingSpinner);
  }

  // Show fallback or wait for redirect
  if (!isAuthenticated) {
    if (fallback) {
      onUnauthenticated?.();
      return fallback;
    }
    // Return loading while redirect happens
    return loadingComponent ?? createElement(DefaultLoadingSpinner);
  }

  // User is authenticated, render children
  return children;
}

/**
 * Higher-order component that wraps a component with AuthGuard.
 * Useful for protecting entire page components.
 *
 * @example
 * ```tsx
 * const ProtectedDashboard = withAuth(DashboardPage);
 *
 * // With options
 * const ProtectedDashboard = withAuth(DashboardPage, {
 *   redirectTo: "/login",
 *   loadingComponent: <CustomSpinner />,
 * });
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  guardProps?: Omit<AuthGuardProps, "children">
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    return createElement(
      AuthGuard,
      { ...guardProps, children: createElement(Component, props) }
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
}

// Re-export User type for convenience
export type { User };
