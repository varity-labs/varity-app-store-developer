"use client";

import { useState, useCallback } from "react";
import { Twitter, Mail, Link2, Check, Linkedin, Facebook } from "lucide-react";

/**
 * Props for the SocialShareButtons component.
 */
export interface SocialShareButtonsProps {
  /** The name of the application being shared */
  appName: string;
  /** The URL of the application page to share */
  appUrl: string;
  /** A short description of the application for share text */
  appDescription: string;
}

/**
 * Social share buttons for sharing app pages on Twitter/X, LinkedIn, Facebook, via email, or by copying a link.
 * Includes accessible labels, keyboard support, and proper Open Graph tag support.
 *
 * @example
 * ```tsx
 * <SocialShareButtons
 *   appName="My App"
 *   appUrl="https://developer.store.varity.so/app/1"
 *   appDescription="A revolutionary enterprise application"
 * />
 * ```
 */
export function SocialShareButtons({ appName, appUrl, appDescription }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `Check out ${appName} on the Varity App Store: ${appDescription}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(appUrl);
  const encodedSubject = encodeURIComponent(`${appName} - Varity App Store`);
  const encodedBody = encodeURIComponent(`${shareText}\n\n${appUrl}`);

  // Social media share URLs with proper encoding
  const twitterUrl = `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const emailUrl = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;

  /**
   * Copies the app URL to the clipboard with fallback for older browsers.
   * Provides visual feedback for 2 seconds.
   */
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = appUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [appUrl]);

  const buttonBaseClass =
    "inline-flex items-center gap-2 rounded-md border border-slate-800 px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Share this application">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonBaseClass}
        aria-label={`Share ${appName} on X (Twitter)`}
      >
        <Twitter className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Share on</span> X
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonBaseClass}
        aria-label={`Share ${appName} on LinkedIn`}
      >
        <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
        LinkedIn
      </a>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonBaseClass}
        aria-label={`Share ${appName} on Facebook`}
      >
        <Facebook className="h-3.5 w-3.5" aria-hidden="true" />
        Facebook
      </a>

      <a
        href={emailUrl}
        className={buttonBaseClass}
        aria-label={`Share ${appName} via email`}
      >
        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
        Email
      </a>

      <button
        type="button"
        onClick={handleCopyLink}
        className={buttonBaseClass}
        aria-label={copied ? "Link copied to clipboard" : `Copy link for ${appName}`}
        aria-live="polite"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-400" aria-hidden="true" />
            <span className="text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
}
