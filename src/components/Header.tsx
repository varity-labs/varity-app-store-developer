"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
import FocusTrap from "focus-trap-react";
import { useAuth } from "@/hooks/useAuth";
import { useContract } from "@/hooks/useContract";
import { cn } from "@/lib/utils";

/**
 * Navigation item interface
 */
interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const navigation: NavItem[] = [
  { label: "Submit", href: "/submit" },
  { label: "Docs", href: "https://docs.varity.so", external: true },
  { label: "GitHub", href: "https://github.com/varity-labs", external: true },
];

/**
 * Header component with full accessibility support
 *
 * Features:
 * - Skip-to-content link (WCAG 2.1 AAA)
 * - Focus trap in mobile menu
 * - Memoized admin check for performance
 * - Full ARIA labels and keyboard navigation
 * - Responsive design with mobile menu
 */
export function Header() {
  const { ready, authenticated, login, logout, user } = useAuth();
  const { isAdmin: checkIsAdmin } = useContract();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  // Handle scroll state for glass effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Memoized admin status check
   *
   * This check is memoized to prevent unnecessary re-renders when the user
   * address hasn't changed. The admin check involves async blockchain calls
   * that should be cached based on the wallet address.
   */
  const userAddress = user?.wallet?.address;
  const adminCheckMemoized = React.useMemo(() => {
    return async () => {
      if (!authenticated || !userAddress) {
        return false;
      }

      try {
        const adminStatus = await checkIsAdmin(userAddress);
        return adminStatus;
      } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
    };
  }, [authenticated, userAddress, checkIsAdmin]);

  // Execute admin check when user/auth state changes
  React.useEffect(() => {
    adminCheckMemoized().then(setIsAdmin);
  }, [adminCheckMemoized]);

  const displayName = user?.email?.address
    ? user.email.address.split("@")[0]
    : user?.wallet?.address
      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
      : null;

  // Handle Escape key to close mobile menu
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Skip to main content link - WCAG 2.1 AAA */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-brand-500 focus:text-slate-950 focus:rounded-md focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "glass py-3" : "py-4 bg-transparent"
        )}
        role="banner"
      >
        <div className="section-container">
          <nav className="flex items-center justify-between" aria-label="Main navigation">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background rounded-md"
              aria-label="Varity Developer Portal home"
            >
              <Image
                src="/logo/varity-logo-color.svg"
                alt=""
                width={32}
                height={32}
                priority
                className="object-contain"
                aria-hidden="true"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-xl font-bold tracking-tight text-foreground">
                  Varity
                </span>
                <span className="text-sm font-medium text-foreground-secondary">
                  Developer Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Primary navigation">
              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                    aria-label={`${item.label} (opens in new tab)`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                  >
                    {item.label}
                  </Link>
                )
              )}
              {authenticated && (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                >
                  Dashboard
                </Link>
              )}
              {authenticated && isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right Side - CTAs */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                {authenticated ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground-secondary" aria-label={`Signed in as ${displayName}`}>
                      {displayName}
                    </span>
                    <button
                      onClick={logout}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-8 px-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                      aria-label="Sign out of your account"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={login}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-out h-10 px-5 py-2 bg-brand-500 text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_40px_rgba(20,184,166,0.3)] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Sign in to your account"
                  >
                    Sign In
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-foreground-secondary hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu with Focus Trap */}
      {isMobileMenuOpen && (
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false,
            allowOutsideClick: true,
            escapeDeactivates: true,
            onDeactivate: () => setIsMobileMenuOpen(false),
          }}
        >
          <div
            id="mobile-menu"
            className="fixed inset-0 z-40 pt-20 bg-background lg:hidden animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="section-container py-8">
              <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
                {navigation.map((item) =>
                  item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3 text-lg font-medium text-foreground-secondary hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                      aria-label={`${item.label} (opens in new tab)`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3 text-lg font-medium text-foreground-secondary hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                    >
                      {item.label}
                    </Link>
                  )
                )}
                {authenticated && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 text-lg font-medium text-foreground-secondary hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                  >
                    Dashboard
                  </Link>
                )}
                {authenticated && isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 text-lg font-medium text-foreground-secondary hover:text-foreground transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                  >
                    Admin
                  </Link>
                )}

                <div className="flex flex-col gap-3 pt-4 border-t border-border">
                  {authenticated ? (
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary h-12 px-8 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                      aria-label="Sign out of your account"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        login();
                        setIsMobileMenuOpen(false);
                      }}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-semibold transition-all duration-200 ease-out h-12 px-8 bg-brand-500 text-slate-950 hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-background"
                      aria-label="Sign in to your account"
                    >
                      Sign In
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </FocusTrap>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
