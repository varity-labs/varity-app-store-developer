"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { VALIDATION } from "@/lib/constants";
import { sanitizeUrl } from "@/lib/security";
import type { AppFormData } from "@/lib/validation";

/** Props for the ScreenshotsField component */
export interface ScreenshotsFieldProps {
  /** Current form data (screenshots array and other fields) */
  formData: AppFormData;
  /** Callback to update form data */
  setFormData: React.Dispatch<React.SetStateAction<AppFormData>>;
  /** Callback for validation error reporting */
  onError?: (message: string) => void;
}

/**
 * Screenshots URL input field with add/remove functionality.
 *
 * Handles:
 * - URL input with sanitization via the security module
 * - Adding screenshots up to the VALIDATION.MAX_SCREENSHOTS limit
 * - Removing individual screenshots from the list
 * - Displaying the current screenshot URL list
 */
export default function ScreenshotsField({ formData, setFormData, onError }: ScreenshotsFieldProps) {
  const [screenshotInput, setScreenshotInput] = useState("");

  const addScreenshot = () => {
    if (screenshotInput && formData.screenshots.length < VALIDATION.MAX_SCREENSHOTS) {
      // Security: Validate URL before adding
      const sanitizedUrl = sanitizeUrl(screenshotInput);
      if (!sanitizedUrl) {
        onError?.("Please enter a valid screenshot URL (must be http or https).");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, sanitizedUrl],
      }));
      setScreenshotInput("");
    }
  };

  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addScreenshot();
    }
  };

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
      {formData.screenshots.length > 0 && (
        <ul className="mt-3 space-y-2" aria-label="Added screenshots">
          {formData.screenshots.map((url, index) => (
            <li
              key={index}
              className="flex items-center gap-2 rounded border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm"
            >
              <span className="flex-1 truncate text-slate-400">{url}</span>
              <button
                type="button"
                onClick={() => removeScreenshot(index)}
                className="text-slate-500 hover:text-slate-300"
                aria-label={`Remove screenshot ${index + 1}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
}
