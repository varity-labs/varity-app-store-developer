"use client";

import type { AppFormData } from "@/lib/validation";

/** Props for the CompanyInfoFields component */
export interface CompanyInfoFieldsProps {
  /** Current form data */
  formData: AppFormData;
  /** Generic change handler for input elements */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

/**
 * Company information form fields (Company Name and Website URL).
 *
 * Renders a fieldset with two side-by-side fields for company name and website.
 * Both fields are optional but recommended.
 */
export default function CompanyInfoFields({ formData, handleChange }: CompanyInfoFieldsProps) {
  return (
    <fieldset className="border-t border-slate-800/50 pt-6">
      <legend className="text-sm font-medium text-slate-200 mb-1">Company Information</legend>
      <p className="text-xs text-slate-500 mb-4">Help users learn more about your organization</p>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-slate-200">
            Company Name <span className="text-amber-500 text-xs">(Recommended)</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g., Acme Inc."
            className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
          />
        </div>

        {/* Website URL */}
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-slate-200">
            Website URL <span className="text-amber-500 text-xs">(Recommended)</span>
          </label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://yourcompany.com"
            className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
          />
        </div>
      </div>
    </fieldset>
  );
}
