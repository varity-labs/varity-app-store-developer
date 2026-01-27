"use client";

import { useState, useCallback } from "react";
import { Plus, X, Loader2, AlertCircle, ImageIcon } from "lucide-react";
import { VALIDATION } from "@/lib/constants";
import { sanitizeUrl } from "@/lib/security";
import type { AppFormData } from "@/lib/validation";

/** Status of an image preview */
type ImageStatus = "loading" | "loaded" | "error";

/** Props for the ScreenshotsField component */
export interface ScreenshotsFieldProps {
  /** Current form data (screenshots array and other fields) */
  formData: AppFormData;
  /** Callback to update form data */
  setFormData: React.Dispatch<React.SetStateAction<AppFormData>>;
  /** Callback for validation error reporting */
  onError?: (message: string) => void;
}

/** Props for the individual screenshot preview thumbnail */
interface ScreenshotPreviewProps {
  /** The URL of the screenshot */
  url: string;
  /** Index of this screenshot in the list */
  index: number;
  /** Callback to remove this screenshot */
  onRemove: (index: number) => void;
}

/**
 * Individual screenshot preview with loading/error states.
 * Displays a thumbnail preview of the image with status indicators.
 */
function ScreenshotPreview({ url, index, onRemove }: ScreenshotPreviewProps) {
  const [status, setStatus] = useState<ImageStatus>("loading");

  const handleLoad = useCallback(() => {
    setStatus("loaded");
  }, []);

  const handleError = useCallback(() => {
    setStatus("error");
  }, []);

  return (
    <li
      className="flex items-center gap-3 rounded border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm"
    >
      {/* Thumbnail preview container */}
      <div
        className="relative h-[60px] w-[80px] flex-shrink-0 overflow-hidden rounded border border-slate-700 bg-slate-800"
        aria-label={`Screenshot ${index + 1} preview`}
      >
        {/* Loading state */}
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <Loader2
              className="h-5 w-5 animate-spin text-slate-500"
              aria-hidden="true"
            />
            <span className="sr-only">Loading image preview</span>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800"
            role="alert"
            aria-label="Image failed to load"
          >
            <AlertCircle className="h-4 w-4 text-red-400" aria-hidden="true" />
            <span className="mt-1 text-[10px] text-red-400">Failed</span>
          </div>
        )}

        {/* Image element - always rendered for loading/loaded states */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={`Screenshot ${index + 1} preview`}
          className={`h-full w-full object-cover transition-opacity duration-200 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      </div>

      {/* URL display */}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-slate-400" title={url}>
          {url}
        </span>
        {status === "error" && (
          <span className="text-xs text-red-400">
            Image could not be loaded - check the URL
          </span>
        )}
        {status === "loaded" && (
          <span className="text-xs text-green-500">
            Image loaded successfully
          </span>
        )}
      </div>

      {/* Status indicator and remove button */}
      <div className="flex items-center gap-2">
        {/* Status icon */}
        {status === "loading" && (
          <span className="text-xs text-slate-500">Loading...</span>
        )}
        {status === "error" && (
          <span
            className="rounded bg-red-500/10 px-2 py-0.5 text-xs text-red-400"
            aria-label="Image load failed"
          >
            Error
          </span>
        )}
        {status === "loaded" && (
          <ImageIcon
            className="h-4 w-4 text-green-500"
            aria-label="Image loaded successfully"
          />
        )}

        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          aria-label={`Remove screenshot ${index + 1}${status === "error" ? " (failed to load)" : ""}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

/**
 * Screenshots URL input field with add/remove functionality and image previews.
 *
 * Handles:
 * - URL input with sanitization via the security module
 * - Adding screenshots up to the VALIDATION.MAX_SCREENSHOTS limit
 * - Removing individual screenshots from the list
 * - Displaying thumbnail previews with loading/error states
 * - Accessible feedback for screen readers
 */
export default function ScreenshotsField({ formData, setFormData, onError }: ScreenshotsFieldProps) {
  const [screenshotInput, setScreenshotInput] = useState("");

  const addScreenshot = useCallback(() => {
    if (screenshotInput && formData.screenshots.length < VALIDATION.MAX_SCREENSHOTS) {
      // Security: Validate URL before adding
      const sanitizedUrl = sanitizeUrl(screenshotInput);
      if (!sanitizedUrl) {
        onError?.("Please enter a valid screenshot URL (must be http or https).");
        return;
      }

      // Check for duplicate URLs
      if (formData.screenshots.includes(sanitizedUrl)) {
        onError?.("This screenshot URL has already been added.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, sanitizedUrl],
      }));
      setScreenshotInput("");
    }
  }, [screenshotInput, formData.screenshots, onError, setFormData]);

  const removeScreenshot = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  }, [setFormData]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addScreenshot();
    }
  }, [addScreenshot]);

  return (
    <fieldset>
      <legend className="block text-sm font-medium text-slate-200">
        Screenshots <span className="text-slate-500">(Optional, {formData.screenshots.length}/{VALIDATION.MAX_SCREENSHOTS})</span>
      </legend>
      <p className="mt-1 text-xs text-slate-500">
        Screenshots increase conversions by 3x. Show users what makes your app great.
      </p>
      <div className="mt-2 flex gap-2">
        <input
          type="url"
          value={screenshotInput}
          onChange={(e) => setScreenshotInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://myapp.com/screenshot-1.png"
          className="flex-1 rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
          disabled={formData.screenshots.length >= VALIDATION.MAX_SCREENSHOTS}
          aria-label="Screenshot URL"
          aria-describedby="screenshot-hint"
        />
        <button
          type="button"
          onClick={addScreenshot}
          disabled={!screenshotInput || formData.screenshots.length >= VALIDATION.MAX_SCREENSHOTS}
          className="rounded-md border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Add screenshot"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p id="screenshot-hint" className="mt-1 text-xs text-slate-600">
        Enter a URL and press Enter or click the plus button. A preview will appear below.
      </p>
      {formData.screenshots.length > 0 && (
        <ul className="mt-3 space-y-2" aria-label="Added screenshots" role="list">
          {formData.screenshots.map((url, index) => (
            <ScreenshotPreview
              key={`${url}-${index}`}
              url={url}
              index={index}
              onRemove={removeScreenshot}
            />
          ))}
        </ul>
      )}
    </fieldset>
  );
}
