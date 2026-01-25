"use client";

import type { AppFormData } from "@/lib/validation";

/** Props for the LegalDocsFields component */
export interface LegalDocsFieldsProps {
  /** Current form data */
  formData: AppFormData;
  /** Generic change handler for input elements */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

/**
 * Legal documents form fields (Support Email, Privacy Policy URL, Terms of Service URL).
 *
 * Renders a fieldset with support email (full-width) and two side-by-side URL fields.
 * All fields are optional but recommended for trust and compliance.
 */
export default function LegalDocsFields({ formData, handleChange }: LegalDocsFieldsProps) {
  return (
    <fieldset className="border-t border-slate-800/50 pt-6">
      <legend className="text-sm font-medium text-slate-200 mb-1">Legal Documents</legend>
      <p className="text-xs text-slate-500 mb-4">Build trust with transparency about your policies</p>

      <div className="space-y-4">
        {/* Support Email */}
        <div>
          <label htmlFor="supportEmail" className="block text-sm font-medium text-slate-200">
            Support Email <span className="text-amber-500 text-xs">(Recommended)</span>
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Where users can reach you for support
          </p>
          <input
            type="email"
            id="supportEmail"
            name="supportEmail"
            value={formData.supportEmail}
            onChange={handleChange}
            placeholder="support@yourcompany.com"
            className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Privacy Policy URL */}
          <div>
            <label htmlFor="privacyPolicyUrl" className="block text-sm font-medium text-slate-200">
              Privacy Policy URL <span className="text-amber-500 text-xs">(Recommended)</span>
            </label>
            <input
              type="url"
              id="privacyPolicyUrl"
              name="privacyPolicyUrl"
              value={formData.privacyPolicyUrl}
              onChange={handleChange}
              placeholder="https://yourcompany.com/privacy"
              className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
            />
          </div>

          {/* Terms of Service URL */}
          <div>
            <label htmlFor="termsOfServiceUrl" className="block text-sm font-medium text-slate-200">
              Terms of Service URL <span className="text-amber-500 text-xs">(Recommended)</span>
            </label>
            <input
              type="url"
              id="termsOfServiceUrl"
              name="termsOfServiceUrl"
              value={formData.termsOfServiceUrl}
              onChange={handleChange}
              placeholder="https://yourcompany.com/terms"
              className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
}
