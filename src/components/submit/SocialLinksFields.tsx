"use client";

import type { AppFormData } from "@/lib/validation";

/** Props for the SocialLinksFields component */
export interface SocialLinksFieldsProps {
  /** Current form data */
  formData: AppFormData;
  /** Generic change handler for input elements */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

/**
 * Social links form fields (Twitter Handle and LinkedIn URL).
 *
 * Renders a fieldset with two side-by-side fields for social presence.
 * Twitter field includes an @ prefix indicator.
 * Both fields are optional but recommended.
 */
export default function SocialLinksFields({ formData, handleChange }: SocialLinksFieldsProps) {
  return (
    <fieldset className="border-t border-slate-800/50 pt-6">
      <legend className="text-sm font-medium text-slate-200 mb-1">Social Links</legend>
      <p className="text-xs text-slate-500 mb-4">Connect with your users on social platforms</p>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Twitter Handle */}
        <div>
          <label htmlFor="twitterHandle" className="block text-sm font-medium text-slate-200">
            Twitter Handle <span className="text-amber-500 text-xs">(Recommended)</span>
          </label>
          <div className="mt-2 flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-slate-800 bg-slate-800 px-3 text-sm text-slate-400">
              @
            </span>
            <input
              type="text"
              id="twitterHandle"
              name="twitterHandle"
              value={formData.twitterHandle}
              onChange={handleChange}
              placeholder="yourcompany"
              className="w-full rounded-r-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
            />
          </div>
        </div>

        {/* LinkedIn URL */}
        <div>
          <label htmlFor="linkedinUrl" className="block text-sm font-medium text-slate-200">
            LinkedIn URL <span className="text-amber-500 text-xs">(Recommended)</span>
          </label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/company/yourcompany"
            className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
          />
        </div>
      </div>
    </fieldset>
  );
}
