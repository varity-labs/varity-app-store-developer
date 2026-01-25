/**
 * Footer Component
 *
 * Semantic footer component with WCAG accessibility standards.
 * Includes navigation links, social media links, and company information.
 *
 * Accessibility Features:
 * - role="contentinfo" for WCAG landmark
 * - SR-only heading for social links
 * - ARIA labels on external links
 * - Proper semantic HTML structure
 * - Keyboard navigation support
 *
 * @component
 * @example
 * ```tsx
 * <Footer />
 * ```
 */

import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Github, Youtube } from "lucide-react";

/**
 * Custom Discord icon (not available in lucide-react)
 * @param props - Component props
 * @param props.className - Optional CSS classes
 * @returns Discord SVG icon
 */
function DiscordIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

/**
 * Custom Reddit icon (not available in lucide-react)
 * @param props - Component props
 * @param props.className - Optional CSS classes
 * @returns Reddit SVG icon
 */
function RedditIcon({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

/**
 * Social media links configuration
 * Each link includes label, URL, and icon component
 */
const socialLinks = [
  { label: "Twitter", href: "https://x.com/VarityHQ", icon: Twitter },
  { label: "Discord", href: "https://discord.gg/Uhjx6yhJ", icon: DiscordIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/varity-labs", icon: Linkedin },
  { label: "GitHub", href: "https://github.com/varity-labs", icon: Github },
  { label: "Reddit", href: "https://www.reddit.com/r/varityHQ", icon: RedditIcon },
  { label: "YouTube", href: "https://www.youtube.com/@VarityHQ", icon: Youtube },
] as const;

/**
 * Footer component with WCAG accessibility compliance
 * @returns Footer component with navigation and social links
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="border-t border-border bg-background">
      <div className="section-container py-16">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 rounded-md transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background">
              <Image
                src="/logo/varity-logo-color.svg"
                alt=""
                width={32}
                height={32}
                className="object-contain"
                aria-hidden="true"
              />
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Varity
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-body-sm text-foreground-secondary">
              The curated marketplace for enterprise-grade Web3 applications. Deploy with confidence and save 70-85% compared to traditional cloud providers.
            </p>

            {/* Social Media Links */}
            <nav aria-label="Social media links">
              <h2 className="sr-only">Follow us on social media</h2>
              <div className="mt-6 flex items-center gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md p-1 text-foreground-muted transition-all duration-200 hover:text-brand-400 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                      aria-label={`Follow us on ${social.label} - Opens in new tab`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Developer Portal */}
          <nav aria-label="Developer portal navigation">
            <h3 className="text-overline text-foreground-muted">
              Developer Portal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/submit"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                >
                  Submit Application
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="Documentation - Opens in new tab"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/varity-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="GitHub - Opens in new tab"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company navigation">
            <h3 className="text-overline text-foreground-muted">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://www.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="Varity.so - Opens in new tab"
                >
                  Varity.so
                </a>
              </li>
              <li>
                <a
                  href="https://store.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="App Store - Opens in new tab"
                >
                  App Store
                </a>
              </li>
              <li>
                <a
                  href="https://www.varity.so/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="Privacy Policy - Opens in new tab"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://www.varity.so/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="Terms of Service - Opens in new tab"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support navigation">
            <h3 className="text-overline text-foreground-muted">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://store.varity.so/help"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="Help Center - Opens in new tab"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="Network Status - Opens in new tab"
                >
                  Network Status
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/Uhjx6yhJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="Contact Us - Opens in new tab"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@varity.so"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
                  aria-label="Email us at hello@varity.so"
                >
                  hello@varity.so
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Copyright and Attribution */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-caption text-foreground-muted">
            &copy; {currentYear} Varity Labs, Inc. All rights reserved.
          </p>
          <a
            href="https://www.varity.so"
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption text-foreground-muted transition-colors hover:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-background"
            aria-label="Built with Varity - Opens in new tab"
          >
            Built with Varity
          </a>
        </div>
      </div>
    </footer>
  );
}
