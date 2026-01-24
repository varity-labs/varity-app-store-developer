"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useContract } from "@/hooks/useContract";
import { cn } from "@/lib/utils";

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

export function Header() {
  const { ready, authenticated, login, logout, user } = useAuth();
  const { isAdmin: checkIsAdmin } = useContract();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is admin
  React.useEffect(() => {
    async function checkAdminStatus() {
      if (!authenticated || !user?.wallet?.address) {
        setIsAdmin(false);
        return;
      }

      try {
        const adminStatus = await checkIsAdmin(user.wallet.address);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    }

    checkAdminStatus();
  }, [authenticated, user?.wallet?.address, checkIsAdmin]);

  const displayName = user?.email?.address
    ? user.email.address.split("@")[0]
    : user?.wallet?.address
      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
      : null;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "glass py-3" : "py-4 bg-transparent"
        )}
      >
        <div className="section-container">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo/varity-logo-color.svg"
                alt="Varity"
                width={32}
                height={32}
                priority
                className="object-contain"
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
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
              {authenticated && (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              )}
              {authenticated && isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
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
                    <span className="text-sm text-foreground-secondary">
                      {displayName}
                    </span>
                    <button
                      onClick={logout}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-8 px-3"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={login}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 ease-out h-10 px-5 py-2 bg-brand-500 text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_40px_rgba(20,184,166,0.3)]"
                  >
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-foreground-secondary hover:text-foreground transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 pt-20 bg-background lg:hidden animate-fade-in">
          <div className="section-container py-8">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 text-lg font-medium text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 text-lg font-medium text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
              {authenticated && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 text-lg font-medium text-foreground-secondary hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
              )}
              {authenticated && isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 text-lg font-medium text-foreground-secondary hover:text-foreground transition-colors"
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
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary h-12 px-8"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      login();
                      setIsMobileMenuOpen(false);
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-semibold transition-all duration-200 ease-out h-12 px-8 bg-brand-500 text-slate-950 hover:bg-brand-400"
                  >
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
