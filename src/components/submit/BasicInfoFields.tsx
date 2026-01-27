"use client";

import { APP_CATEGORIES, VALIDATION } from "@/lib/constants";
import type { AppFormData } from "@/lib/validation";

/** Props for the BasicInfoFields component */
export interface BasicInfoFieldsProps {
  /** Current form data */
  formData: AppFormData;
  /** Generic change handler for input elements */
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  /** Callback when a field loses focus (for validation) */
  handleBlur: (fieldName: string) => void;
  /** Get error message for a field (if any) */
  getFieldError: (fieldName: string) => string | undefined;
  /** Get input className with validation styling */
  getInputClassName: (fieldName: string, baseClass: string) => string;
}

/**
 * Basic application information form fields.
 *
 * Includes:
 * - Application Name (required)
 * - Description (required)
 * - Application URL (required)
 * - Logo URL (optional)
 * - Category (required)
 * - Network (read-only, defaults to Varity L3)
 *
 * All fields include proper labels, help text, validation, and accessibility attributes.
 */
export default function BasicInfoFields({
  formData,
  handleChange,
  handleBlur,
  getFieldError,
  getInputClassName,
}: BasicInfoFieldsProps) {
  return (
    <fieldset>
      <legend className="sr-only">Basic Application Information</legend>

      <div className="space-y-6">
        {/* Application Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-200">
            Application Name <span className="text-red-400" aria-label="required">*</span>
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Choose a clear, descriptive name that users will recognize
          </p>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            maxLength={VALIDATION.NAME_MAX_LENGTH}
            placeholder="e.g., Enterprise Analytics Dashboard"
            className={getInputClassName("name", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
            required
            aria-required="true"
            aria-invalid={!!getFieldError("name")}
            aria-describedby={getFieldError("name") ? "name-error" : "name-hint"}
          />
          <div className="mt-1 flex items-center justify-between">
            {getFieldError("name") ? (
              <p id="name-error" className="text-xs text-red-400" role="alert">
                {getFieldError("name")}
              </p>
            ) : (
              <p id="name-hint" className="text-xs text-slate-500">
                {formData.name.length}/{VALIDATION.NAME_MAX_LENGTH} characters
              </p>
            )}
            <p className={`text-xs ${
              formData.name.length >= VALIDATION.NAME_MIN_LENGTH
                ? "text-emerald-400"
                : formData.name.length > 0
                ? "text-amber-400"
                : "text-slate-500"
            }`}>
              {formData.name.length >= VALIDATION.NAME_MIN_LENGTH
                ? `${VALIDATION.NAME_MIN_LENGTH}+ minimum met`
                : `${formData.name.length}/${VALIDATION.NAME_MIN_LENGTH} minimum`}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-200">
            Description <span className="text-red-400" aria-label="required">*</span>
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Explain what your application does and who it&apos;s for. This appears on your app card.
          </p>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={() => handleBlur("description")}
            maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
            rows={5}
            placeholder="e.g., A real-time analytics dashboard for enterprise teams to track metrics, visualize data, and make data-driven decisions. Built for high-scale operations with 70-85% lower infrastructure costs."
            className={getInputClassName("description", "mt-2 w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
            required
            aria-required="true"
            aria-invalid={!!getFieldError("description")}
            aria-describedby={getFieldError("description") ? "description-error" : "description-hint"}
          />
          <div className="mt-1 flex items-center justify-between">
            {getFieldError("description") ? (
              <p id="description-error" className="text-xs text-red-400" role="alert">
                {getFieldError("description")}
              </p>
            ) : (
              <p id="description-hint" className="text-xs text-slate-500">
                Tip: Focus on benefits, not just features
              </p>
            )}
            <div className="flex items-center gap-3">
              <p className={`text-xs ${
                formData.description.length >= VALIDATION.DESCRIPTION_MIN_LENGTH
                  ? "text-emerald-400"
                  : formData.description.length > 0
                  ? "text-amber-400"
                  : "text-slate-500"
              }`}>
                {formData.description.length >= VALIDATION.DESCRIPTION_MIN_LENGTH
                  ? `${VALIDATION.DESCRIPTION_MIN_LENGTH}+ minimum met`
                  : `${formData.description.length}/${VALIDATION.DESCRIPTION_MIN_LENGTH} minimum`}
              </p>
              <p className="text-xs text-slate-500">
                {formData.description.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH}
              </p>
            </div>
          </div>
        </div>

        {/* Application URL */}
        <div>
          <label htmlFor="appUrl" className="block text-sm font-medium text-slate-200">
            Application URL <span className="text-red-400" aria-label="required">*</span>
          </label>
          <p className="mt-1 text-xs text-slate-500">
            The live URL where users can access your application
          </p>
          <input
            type="url"
            id="appUrl"
            name="appUrl"
            value={formData.appUrl}
            onChange={handleChange}
            onBlur={() => handleBlur("appUrl")}
            placeholder="https://myapp.varity.so"
            className={getInputClassName("appUrl", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
            required
            aria-required="true"
            aria-invalid={!!getFieldError("appUrl")}
            aria-describedby={getFieldError("appUrl") ? "appUrl-error" : undefined}
          />
          {getFieldError("appUrl") && (
            <p id="appUrl-error" className="mt-1 text-xs text-red-400" role="alert">
              {getFieldError("appUrl")}
            </p>
          )}
        </div>

        {/* Logo URL */}
        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-200">
            Logo URL <span className="text-slate-500">(Optional)</span>
          </label>
          <p className="mt-1 text-xs text-slate-500">
            Your app&apos;s logo makes a strong first impression
          </p>
          <input
            type="url"
            id="logoUrl"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            onBlur={() => handleBlur("logoUrl")}
            placeholder="https://myapp.com/logo.png"
            className={getInputClassName("logoUrl", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
            aria-invalid={!!getFieldError("logoUrl")}
            aria-describedby={getFieldError("logoUrl") ? "logoUrl-error" : "logoUrl-hint"}
          />
          {getFieldError("logoUrl") ? (
            <p id="logoUrl-error" className="mt-1 text-xs text-red-400" role="alert">
              {getFieldError("logoUrl")}
            </p>
          ) : (
            <p id="logoUrl-hint" className="mt-1 text-xs text-slate-500">
              Square image recommended (256x256px minimum). PNG with transparent background works best.
            </p>
          )}
        </div>

        {/* Category and Network */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-200">
              Category <span className="text-red-400" aria-label="required">*</span>
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Help users find your app in the right category
            </p>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={() => handleBlur("category")}
              className={getInputClassName("category", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
              required
              aria-required="true"
              aria-invalid={!!getFieldError("category")}
              aria-describedby={getFieldError("category") ? "category-error" : undefined}
            >
              <option value="">Select category</option>
              {APP_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {getFieldError("category") && (
              <p id="category-error" className="mt-1 text-xs text-red-400" role="alert">
                {getFieldError("category")}
              </p>
            )}
          </div>

          {/* Network (read-only) */}
          <div>
            <label htmlFor="chainId" className="block text-sm font-medium text-slate-200">
              Hosted Network
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Your app will be hosted on the Varity Network
            </p>
            <div
              className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 flex items-center gap-2"
              role="status"
              aria-label="Hosted on Varity Network"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
              Varity Network
            </div>
            <input type="hidden" name="chainId" value={33529} />
          </div>
        </div>
      </div>
    </fieldset>
  );
}
