"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertCircle, CheckCircle, Loader2, Save, Clock, Rocket } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useContract } from "@/hooks/useContract";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { APP_CATEGORIES, VALIDATION } from "@/lib/constants";
import { varityL3 } from "@/lib/thirdweb";
import { sendAppSubmissionEmail } from "@/lib/web3forms";
import { validateAppSubmission, type AppFormData, type ValidationResult } from "@/lib/validation";
import {
  sanitizeFormData,
  checkRateLimit,
  incrementRateLimit,
  RATE_LIMITS,
  isContentSafe,
} from "@/lib/security";

// Extracted components
import GitHubIntegration from "@/components/submit/GitHubIntegration";
import BasicInfoFields from "@/components/submit/BasicInfoFields";
import CompanyInfoFields from "@/components/submit/CompanyInfoFields";
import SocialLinksFields from "@/components/submit/SocialLinksFields";
import LegalDocsFields from "@/components/submit/LegalDocsFields";
import ScreenshotsField from "@/components/submit/ScreenshotsField";
import SubmitProgress, { SUBMIT_STEPS } from "@/components/submit/SubmitProgress";
import BenefitsSidebar from "@/components/submit/BenefitsSidebar";

/**
 * Form data interface for app submission
 * Extends the validation module's AppFormData interface
 */
interface FormData extends AppFormData {}

/**
 * Initial form state with default values
 * Defaults to Varity Network (chainId: 33529) and builtWithVarity: true
 */
const initialFormData: FormData = {
  name: "",
  description: "",
  appUrl: "",
  logoUrl: "",
  category: "",
  chainId: 33529, // Default to Varity Network
  builtWithVarity: true,
  githubUrl: "",
  screenshots: [],
  // Company Information
  companyName: "",
  websiteUrl: "",
  // Social Links
  twitterHandle: "",
  linkedinUrl: "",
  // Legal Documents
  privacyPolicyUrl: "",
  supportEmail: "",
  termsOfServiceUrl: "",
};

/**
 * Formats a Twitter handle by removing the @ prefix if present
 * @param handle - Twitter handle (with or without @)
 * @returns Cleaned handle without @ prefix
 */
const formatTwitterHandle = (handle: string): string => {
  return handle.startsWith("@") ? handle.slice(1) : handle;
};

/**
 * LocalStorage key for draft persistence
 */
const FORM_STORAGE_KEY = "varity-app-submit-draft";

/**
 * Submit Page - Application submission form for Varity App Store
 *
 * OPTIMIZED FOR CONVERSION - Goal: 100+ apps in Week 1
 *
 * Features:
 * - Multi-step wizard (reduces cognitive load)
 * - Progress indicator with encouraging copy
 * - Benefits sidebar with social proof
 * - Early adopter urgency elements
 * - Minimal required fields for MVP
 * - Auto-save with prominent "Save & Continue Later"
 * - GitHub integration for quick import
 */
export default function SubmitPage() {
  const router = useRouter();
  const { authenticated, login } = useAuth();
  const { registerApp, isLoading, error: contractError, txHash, resetState, account } = useContract();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);

  // Form persistence hook - saves draft to localStorage
  const {
    data: formData,
    setData: setFormData,
    isDirty,
    hasDraft,
    lastSaved,
    clearDraft,
    resetForm,
  } = useFormPersistence<FormData>(FORM_STORAGE_KEY, initialFormData);

  // Unsaved changes warning
  const { safeNavigate, confirmLeave } = useUnsavedChangesWarning(
    isDirty,
    "You have unsaved changes to your application. Are you sure you want to leave?"
  );

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Field-level validation errors and touched state
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Real-time validation using the validation module
  const validationResult = useMemo((): ValidationResult => {
    return validateAppSubmission(formData);
  }, [formData]);

  // Check if Step 1 (required fields) is valid
  const isStep1Valid = useMemo(() => {
    return (
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.appUrl.trim() !== "" &&
      formData.category !== ""
    );
  }, [formData.name, formData.description, formData.appUrl, formData.category]);

  // Get error for a specific field (only if touched)
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    if (!touchedFields.has(fieldName)) return undefined;
    return validationResult.errors[fieldName];
  }, [touchedFields, validationResult.errors]);

  // Mark field as touched on blur
  const handleBlur = useCallback((fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  }, []);

  // Input class helper for validation styling
  const getInputClassName = useCallback((fieldName: string, baseClass: string) => {
    const error = getFieldError(fieldName);
    if (error) {
      return baseClass.replace("border-slate-800", "border-red-500/50").replace("focus:border-slate-600", "focus:border-red-500");
    }
    return baseClass;
  }, [getFieldError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Handle cancel with confirmation
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirmLeave()) {
      clearDraft();
      router.push("/");
    }
  };

  // Error callback for child components (e.g. ScreenshotsField)
  const handleComponentError = useCallback((message: string) => {
    setErrorMessage(message);
    setSubmitStatus("error");
  }, []);

  // Step navigation
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate required fields before proceeding
      setTouchedFields(new Set(["name", "description", "appUrl", "category"]));
      if (!isStep1Valid) {
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, SUBMIT_STEPS.length));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authenticated) {
      login();
      return;
    }

    // Check wallet connection
    if (!account) {
      setErrorMessage("Please connect your wallet to submit an application.");
      setSubmitStatus("error");
      return;
    }

    // Mark all required fields as touched to show errors
    setTouchedFields(new Set(["name", "description", "appUrl", "category"]));

    // Use the validation module for comprehensive validation
    const validation = validateAppSubmission(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setErrorMessage(firstError || "Please fix the errors in the form.");
      setSubmitStatus("error");
      return;
    }

    // Security: Check rate limiting
    const rateLimitCheck = checkRateLimit("submit", RATE_LIMITS.submit);
    if (rateLimitCheck.isLimited) {
      const waitSeconds = Math.ceil(rateLimitCheck.remainingMs / 1000);
      setErrorMessage(`Too many submissions. Please wait ${waitSeconds} seconds before trying again.`);
      setSubmitStatus("error");
      return;
    }

    // Security: Check for potentially dangerous content
    if (!isContentSafe(formData.name) || !isContentSafe(formData.description)) {
      setErrorMessage("Invalid characters detected in your submission. Please remove any scripts or special formatting.");
      setSubmitStatus("error");
      return;
    }

    // Reset previous state
    resetState();
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // Security: Increment rate limit counter
      incrementRateLimit("submit", RATE_LIMITS.submit);

      // Security: Sanitize all form data before any external calls
      const sanitizedData = sanitizeFormData({
        name: formData.name,
        description: formData.description,
        appUrl: formData.appUrl,
        logoUrl: formData.logoUrl,
        category: formData.category,
        githubUrl: formData.githubUrl,
        companyName: formData.companyName,
        websiteUrl: formData.websiteUrl,
        twitterHandle: formData.twitterHandle,
        linkedinUrl: formData.linkedinUrl,
        privacyPolicyUrl: formData.privacyPolicyUrl,
        supportEmail: formData.supportEmail,
        termsOfServiceUrl: formData.termsOfServiceUrl,
        screenshots: formData.screenshots,
      });

      // STEP 1: Send email notification via Web3Forms BEFORE blockchain call
      const emailResult = await sendAppSubmissionEmail({
        appName: sanitizedData.name,
        description: sanitizedData.description,
        appUrl: sanitizedData.appUrl,
        category: sanitizedData.category,
        developerAddress: account.address,
        logoUrl: sanitizedData.logoUrl || undefined,
        chainId: formData.chainId,
        githubUrl: sanitizedData.githubUrl || undefined,
        builtWithVarity: formData.builtWithVarity,
        screenshots: (sanitizedData.screenshots as string[]).length > 0 ? (sanitizedData.screenshots as string[]).filter(Boolean) : undefined,
        companyName: sanitizedData.companyName || undefined,
        websiteUrl: sanitizedData.websiteUrl || undefined,
        twitterHandle: sanitizedData.twitterHandle ? formatTwitterHandle(sanitizedData.twitterHandle) : undefined,
        linkedinUrl: sanitizedData.linkedinUrl || undefined,
        privacyPolicyUrl: sanitizedData.privacyPolicyUrl || undefined,
        supportEmail: sanitizedData.supportEmail || undefined,
        termsOfServiceUrl: sanitizedData.termsOfServiceUrl || undefined,
      });

      if (!emailResult.success) {
        console.warn("Web3Forms notification failed:", emailResult.message);
        // Continue anyway - email failure shouldn't block submission
      }

      // STEP 2: Prepare metadata JSON for additional fields (using sanitized data)
      const metadata = {
        companyName: sanitizedData.companyName || undefined,
        websiteUrl: sanitizedData.websiteUrl || undefined,
        twitterHandle: sanitizedData.twitterHandle ? formatTwitterHandle(sanitizedData.twitterHandle) : undefined,
        linkedinUrl: sanitizedData.linkedinUrl || undefined,
        privacyPolicyUrl: sanitizedData.privacyPolicyUrl || undefined,
        supportEmail: sanitizedData.supportEmail || undefined,
        termsOfServiceUrl: sanitizedData.termsOfServiceUrl || undefined,
      };

      // Filter out undefined values
      const cleanMetadata = Object.fromEntries(
        Object.entries(metadata).filter(([, v]) => v !== undefined)
      );

      // Append metadata to description if there are any extra fields (using sanitized description)
      const descriptionWithMetadata = Object.keys(cleanMetadata).length > 0
        ? `${sanitizedData.description}\n\n<!-- VARITY_METADATA:${JSON.stringify(cleanMetadata)} -->`
        : sanitizedData.description;

      // STEP 3: Call smart contract to register app (using sanitized data)
      const result = await registerApp({
        name: sanitizedData.name,
        description: descriptionWithMetadata,
        appUrl: sanitizedData.appUrl,
        logoUrl: sanitizedData.logoUrl,
        category: sanitizedData.category,
        chainId: formData.chainId,
        builtWithVarity: formData.builtWithVarity,
        githubUrl: sanitizedData.githubUrl,
        screenshots: (sanitizedData.screenshots as string[]).filter(Boolean),
      });

      // Success! Clear the draft
      clearDraft();
      setSubmitStatus("success");

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Submit error:", error);
      const message = error instanceof Error ? error.message : "Failed to submit application. Please try again.";
      setErrorMessage(message);
      setSubmitStatus("error");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation breadcrumb */}
      <nav className="border-b border-slate-800/50" aria-label="Breadcrumb">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            onClick={(e) => {
              if (isDirty && !confirmLeave()) {
                e.preventDefault();
              }
            }}
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Browse
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with encouraging copy */}
        <header className="mb-8 text-center">
          <h1 className="text-display-sm text-foreground">Launch Your App on Varity</h1>
          <p className="mt-3 text-body-md text-foreground-secondary max-w-2xl mx-auto">
            You&apos;re <span className="text-brand-400 font-semibold">5 minutes away</span> from reaching enterprise customers worldwide.
            Fill in the basics and we&apos;ll handle the rest.
          </p>
        </header>

        {/* Success message - Full width */}
        {submitStatus === "success" && (
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-6 animate-fade-in max-w-3xl mx-auto">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-heading-md text-emerald-400">Application Submitted Successfully!</h3>
              <p className="mt-2 text-body-sm text-emerald-400/80">
                Congratulations! Your application is now in review. Our team typically approves quality apps within 24 hours.
              </p>
              {txHash && varityL3.blockExplorers?.[0] && (
                <a
                  href={`${varityL3.blockExplorers[0].url}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-body-sm text-emerald-400 hover:text-emerald-300 transition-colors underline"
                >
                  View transaction on explorer
                </a>
              )}
              <p className="mt-3 text-body-sm text-emerald-400/60 flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Redirecting to your dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Error message - Full width */}
        {submitStatus === "error" && (
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-error/20 bg-red-950/30 p-6 animate-fade-in max-w-3xl mx-auto">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-error/10">
              <AlertCircle className="h-5 w-5 text-error" />
            </div>
            <div className="flex-1">
              <h3 className="text-heading-md text-error">Submission Failed</h3>
              <p className="mt-2 text-body-sm text-red-400/80">{errorMessage}</p>
              <button
                onClick={() => setSubmitStatus("idle")}
                className="mt-4 text-body-sm text-red-400 hover:text-red-300 transition-colors underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Auth gate */}
        {!authenticated ? (
          <div className="card flex flex-col items-center justify-center py-16 text-center max-w-xl mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 mb-6">
              <Rocket className="h-8 w-8 text-brand-400" />
            </div>
            <h2 className="text-heading-lg text-foreground">Ready to launch your app?</h2>
            <p className="mt-3 text-body-md text-foreground-secondary max-w-sm">
              Sign in to submit your application. It takes about 5 minutes and your progress is saved automatically.
            </p>
            <button
              onClick={login}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-8 h-12 text-sm font-semibold text-slate-950 transition-all hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]"
            >
              Sign In to Continue
            </button>
            <p className="mt-4 text-xs text-foreground-muted">
              Join 100+ developers building on Varity
            </p>
          </div>
        ) : (
          /* Two-column layout: Form + Sidebar */
          <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
            {/* Main form column */}
            <div>
              {/* Progress indicator */}
              <SubmitProgress
                steps={SUBMIT_STEPS}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />

              {/* Draft restored notification */}
              {hasDraft && !isDirty && currentStep === 1 && (
                <div className="mb-6 flex items-start gap-4 rounded-xl border border-blue-500/20 bg-blue-950/30 p-5 animate-fade-in">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                    <Clock className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-400">Welcome back!</h3>
                    <p className="mt-1 text-xs text-blue-400/80">
                      We restored your previous progress. Pick up where you left off.
                    </p>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to clear your draft? This cannot be undone.")) {
                          resetForm();
                        }
                      }}
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors underline"
                    >
                      Start fresh instead
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: Basic Information (Required fields only) */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* GitHub Integration - Quick import */}
                    <GitHubIntegration formData={formData} setFormData={setFormData} />

                    {/* Basic Information Fields */}
                    <BasicInfoFields
                      formData={formData}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      getFieldError={getFieldError}
                      getInputClassName={getInputClassName}
                    />
                  </div>
                )}

                {/* STEP 2: Optional Details (Media, Company, Social, Legal) */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 mb-6">
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold text-brand-400">Optional but recommended:</span>{" "}
                        Adding more details increases your app&apos;s visibility and credibility.
                      </p>
                    </div>

                    {/* Screenshots */}
                    <ScreenshotsField
                      formData={formData}
                      setFormData={setFormData}
                      onError={handleComponentError}
                    />

                    {/* Company Information */}
                    <CompanyInfoFields formData={formData} handleChange={handleChange} />

                    {/* Social Links */}
                    <SocialLinksFields formData={formData} handleChange={handleChange} />

                    {/* Legal Documents */}
                    <LegalDocsFields formData={formData} handleChange={handleChange} />

                    {/* Built with Varity SDK */}
                    <fieldset className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                      <legend className="sr-only">Varity SDK Integration</legend>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="builtWithVarity"
                          name="builtWithVarity"
                          checked={formData.builtWithVarity}
                          onChange={handleChange}
                          className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-600 focus:ring-offset-slate-900"
                          aria-describedby="builtWithVarity-description"
                        />
                        <div className="flex-1">
                          <label htmlFor="builtWithVarity" className="text-sm font-medium text-slate-200 cursor-pointer">
                            Built with Varity SDK
                          </label>
                          <p id="builtWithVarity-description" className="mt-1 text-xs text-slate-500">
                            Apps built with Varity SDK get a verified badge and priority placement
                          </p>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                )}

                {/* STEP 3: Review & Submit */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Review Summary */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
                      <h3 className="text-lg font-semibold text-slate-200 mb-4">Review Your Submission</h3>

                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-slate-800/50 pb-3">
                          <span className="text-sm text-slate-500">App Name</span>
                          <span className="text-sm text-slate-200 font-medium text-right max-w-[60%]">{formData.name || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between items-start border-b border-slate-800/50 pb-3">
                          <span className="text-sm text-slate-500">Category</span>
                          <span className="text-sm text-slate-200">{formData.category || "Not selected"}</span>
                        </div>
                        <div className="flex justify-between items-start border-b border-slate-800/50 pb-3">
                          <span className="text-sm text-slate-500">App URL</span>
                          <a href={formData.appUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-400 hover:text-brand-300 truncate max-w-[60%]">
                            {formData.appUrl || "Not provided"}
                          </a>
                        </div>
                        <div className="border-b border-slate-800/50 pb-3">
                          <span className="text-sm text-slate-500 block mb-2">Description</span>
                          <p className="text-sm text-slate-300 line-clamp-3">{formData.description || "Not provided"}</p>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-slate-500">Screenshots</span>
                          <span className="text-sm text-slate-200">{formData.screenshots.length} added</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="mt-4 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        Edit details
                      </button>
                    </div>

                    {/* Form Validation Summary (if errors exist) */}
                    {!validationResult.isValid && Object.keys(validationResult.errors).length > 0 && (
                      <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-4" role="alert" aria-live="polite">
                        <p className="text-sm font-medium text-amber-400">Please fix the following before submitting:</p>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-amber-400/80">
                          {Object.entries(validationResult.errors).slice(0, 5).map(([field, error]) => (
                            <li key={field}>{error}</li>
                          ))}
                          {Object.keys(validationResult.errors).length > 5 && (
                            <li>...and {Object.keys(validationResult.errors).length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* What happens next */}
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-5">
                      <h4 className="text-sm font-semibold text-emerald-400 mb-3">What happens next?</h4>
                      <ol className="space-y-2 text-sm text-emerald-400/80">
                        <li className="flex items-start gap-2">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">1</span>
                          <span>Your app is submitted to the Varity L3 blockchain</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">2</span>
                          <span>Our team reviews within 24 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">3</span>
                          <span>Once approved, your app is live and discoverable</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-between border-t border-slate-800/50 pt-6">
                  {/* Left side: Draft status / Back button */}
                  <div className="flex items-center gap-3">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isDirty && (
                          <span className="text-xs text-slate-500 flex items-center gap-1.5" role="status" aria-live="polite">
                            <Save className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
                            <span>Auto-saved{lastSaved ? ` at ${lastSaved.toLocaleTimeString()}` : ""}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right side: Action buttons */}
                  <div className="flex gap-3">
                    {currentStep < SUBMIT_STEPS.length ? (
                      <>
                        {currentStep === 1 && (
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-md border border-slate-800 px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                          >
                            Cancel
                          </button>
                        )}
                        {currentStep === 2 && (
                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="rounded-md border border-slate-800 px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                          >
                            Skip optional fields
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleNextStep}
                          disabled={currentStep === 1 && !isStep1Valid}
                          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Continue
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="rounded-md border border-slate-800 px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                          aria-label="Cancel and discard changes"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading || submitStatus === "success" || !validationResult.isValid}
                          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={isLoading ? "Submitting application" : "Submit application for review"}
                        >
                          {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                          {isLoading ? "Submitting..." : submitStatus === "success" ? "Submitted!" : "Submit for Review"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Sidebar column */}
            <div className="hidden lg:block">
              <div className="sticky top-8">
                <BenefitsSidebar />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
