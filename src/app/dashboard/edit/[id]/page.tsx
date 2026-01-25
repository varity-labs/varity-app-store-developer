"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Save,
  Clock,
  RotateCcw,
  ChevronRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  FileText,
  Share2,
  Mail,
  Scale,
  Globe,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useContract } from "@/hooks/useContract";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { VALIDATION, APP_CATEGORIES } from "@/lib/constants";
import type { AppData } from "@/lib/constants";
import { varityL3 } from "@/lib/thirdweb";
import { validateAppUpdate, type AppUpdateFormData, type ValidationResult } from "@/lib/validation";
import {
  sanitizeInput,
  sanitizeUrl,
  sanitizeFormData,
  checkRateLimit,
  incrementRateLimit,
  RATE_LIMITS,
  isContentSafe,
} from "@/lib/security";
import { StructuredData } from "@/components/StructuredData";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormData extends AppUpdateFormData {}

const initialFormData: FormData = {
  description: "",
  appUrl: "",
  logoUrl: "",
  category: "",
  screenshots: [],
  websiteUrl: "",
  twitterHandle: "",
  linkedinUrl: "",
  privacyPolicyUrl: "",
  termsOfServiceUrl: "",
  supportEmail: "",
};

// ---------------------------------------------------------------------------
// Skeleton components
// ---------------------------------------------------------------------------

function FieldSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className="space-y-2 animate-fade-in">
      <div className={`h-4 ${wide ? "w-32" : "w-24"} skeleton-shimmer rounded`} />
      <div className="h-10 w-full skeleton-shimmer rounded-md" />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen" aria-busy="true" aria-label="Loading edit form">
      {/* Breadcrumb skeleton */}
      <div className="border-b border-slate-800/50">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-4 w-48 skeleton-shimmer rounded" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-10 space-y-3">
          <div className="h-8 w-72 skeleton-shimmer rounded" />
          <div className="h-5 w-96 skeleton-shimmer rounded" />
        </div>

        {/* Read-only info skeleton */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-8">
          <div className="h-4 w-40 skeleton-shimmer rounded mb-4" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 skeleton-shimmer rounded" />
                <div className="h-4 w-32 skeleton-shimmer rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Form fields skeleton */}
        <div className="space-y-8">
          <FieldSkeleton wide />
          <FieldSkeleton />
          <FieldSkeleton wide />
          <FieldSkeleton />
          <FieldSkeleton />
        </div>

        {/* Button skeleton */}
        <div className="mt-8 flex justify-end gap-3 border-t border-slate-800/50 pt-6">
          <div className="h-10 w-24 skeleton-shimmer rounded-md" />
          <div className="h-10 w-32 skeleton-shimmer rounded-md" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Change diff helper
// ---------------------------------------------------------------------------

interface ChangedField {
  label: string;
  original: string;
  current: string;
}

/**
 * Compares original and current form data to identify changed fields
 * @param original - Original form data from the server
 * @param current - Current form data from user input
 * @returns Array of changed fields with labels and values
 */
function getChangedFields(
  original: FormData,
  current: FormData
): ChangedField[] {
  const changes: ChangedField[] = [];
  const fieldLabels: Record<string, string> = {
    description: "Description",
    appUrl: "Application URL",
    logoUrl: "Logo URL",
    category: "Category",
    websiteUrl: "Website URL",
    twitterHandle: "Twitter Handle",
    linkedinUrl: "LinkedIn URL",
    privacyPolicyUrl: "Privacy Policy URL",
    termsOfServiceUrl: "Terms of Service URL",
    supportEmail: "Support Email",
  };

  for (const key of Object.keys(fieldLabels)) {
    const origVal = String(original[key] || "");
    const curVal = String(current[key] || "");
    if (origVal !== curVal) {
      changes.push({
        label: fieldLabels[key],
        original: origVal || "(empty)",
        current: curVal || "(empty)",
      });
    }
  }

  // Screenshots comparison
  const origScreens = (original.screenshots || []).join(", ");
  const curScreens = (current.screenshots || []).join(", ");
  if (origScreens !== curScreens) {
    changes.push({
      label: "Screenshots",
      original: origScreens || "(none)",
      current: curScreens || "(none)",
    });
  }

  return changes;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function EditAppPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params?.id as string;
  const formRef = useRef<HTMLFormElement>(null);

  const { authenticated, login } = useAuth();
  const { getApp, updateApp, isLoading, error: contractError, txHash, resetState, account } = useContract();

  const [app, setApp] = useState<AppData | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Original data reference for revert and diff
  const [originalData, setOriginalData] = useState<FormData>(initialFormData);

  // Form persistence hook - saves draft to localStorage (unique per app)
  const storageKey = `varity-app-edit-draft-${appId}`;
  const {
    data: formData,
    setData: setFormData,
    isDirty,
    hasDraft,
    lastSaved,
    clearDraft,
    setOriginal,
    discardChanges,
  } = useFormPersistence<FormData>(storageKey, initialFormData, {
    restoreOnMount: false, // Don't restore until we have app data
  });

  // Unsaved changes warning
  const { safeNavigate, confirmLeave } = useUnsavedChangesWarning(
    isDirty,
    "You have unsaved changes to your application. Are you sure you want to leave?"
  );

  const [screenshotInput, setScreenshotInput] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Field-level validation errors and touched state
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Real-time validation using the validation module
  const validationResult = useMemo((): ValidationResult => {
    return validateAppUpdate(formData);
  }, [formData]);

  // Whether save should be enabled (must be dirty AND valid)
  const canSave = isDirty && validationResult.isValid && !isLoading && submitStatus !== "success";

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

  // Changed fields for the diff view
  const changedFields = useMemo(
    () => getChangedFields(originalData, formData),
    [originalData, formData]
  );

  // Fetch app data on mount
  useEffect(() => {
    async function fetchApp() {
      if (!appId) return;

      setIsLoadingApp(true);
      try {
        const appData = await getApp(BigInt(appId));
        if (appData) {
          setApp(appData);
          const appFormData: FormData = {
            description: appData.description,
            appUrl: appData.appUrl,
            logoUrl: appData.logoUrl || "",
            category: appData.category || "",
            screenshots: appData.screenshots || [],
            // TODO: These fields will be added to contract/AppData interface in future
            websiteUrl: "",
            twitterHandle: "",
            linkedinUrl: "",
            privacyPolicyUrl: "",
            termsOfServiceUrl: "",
            supportEmail: "",
          };
          // Set original data - this will be used for dirty state comparison
          setOriginal(appFormData);
          setOriginalData(appFormData);
        }
      } catch (error) {
        console.error("Failed to fetch app:", error);
        setErrorMessage("Failed to load app data");
        setSubmitStatus("error");
      } finally {
        setIsLoadingApp(false);
      }
    }

    fetchApp();
  }, [appId, getApp, setOriginal]);

  // Keyboard shortcut: Ctrl/Cmd+S to save
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (canSave && formRef.current) {
          formRef.current.requestSubmit();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canSave]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addScreenshot = () => {
    if (screenshotInput && formData.screenshots.length < VALIDATION.MAX_SCREENSHOTS) {
      // Security: Validate URL before adding
      const sanitizedUrl = sanitizeUrl(screenshotInput);
      if (!sanitizedUrl) {
        setErrorMessage("Please enter a valid screenshot URL.");
        setSubmitStatus("error");
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

  const handleRevert = () => {
    if (window.confirm("Revert all changes to the last saved version? This cannot be undone.")) {
      discardChanges();
      setTouchedFields(new Set());
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authenticated) {
      login();
      return;
    }

    if (!account) {
      setErrorMessage("Please connect your wallet to update the application.");
      setSubmitStatus("error");
      return;
    }

    if (!app) {
      setErrorMessage("App data not loaded");
      setSubmitStatus("error");
      return;
    }

    // Verify ownership
    if (app.developer.toLowerCase() !== account.address.toLowerCase()) {
      setErrorMessage("You can only edit apps you own.");
      setSubmitStatus("error");
      return;
    }

    // Mark all fields as touched to show errors
    setTouchedFields(new Set(["description", "appUrl", "logoUrl", "category"]));

    // Use the validation module for comprehensive validation
    const validation = validateAppUpdate(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setErrorMessage(firstError || "Please fix the errors in the form.");
      setSubmitStatus("error");
      return;
    }

    // Security: Check rate limiting
    const rateLimitCheck = checkRateLimit("update", RATE_LIMITS.update);
    if (rateLimitCheck.isLimited) {
      const waitSeconds = Math.ceil(rateLimitCheck.remainingMs / 1000);
      setErrorMessage(`Too many updates. Please wait ${waitSeconds} seconds before trying again.`);
      setSubmitStatus("error");
      return;
    }

    // Security: Check for potentially dangerous content
    if (!isContentSafe(formData.description)) {
      setErrorMessage("Invalid characters detected in your description. Please remove any scripts or special formatting.");
      setSubmitStatus("error");
      return;
    }

    resetState();
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // Security: Increment rate limit counter
      incrementRateLimit("update", RATE_LIMITS.update);

      // Security: Sanitize all form data before contract call
      const sanitizedData = sanitizeFormData({
        description: formData.description,
        appUrl: formData.appUrl,
        logoUrl: formData.logoUrl,
        category: formData.category,
        screenshots: formData.screenshots,
      });

      await updateApp(
        BigInt(appId),
        sanitizedData.description as string,
        sanitizedData.appUrl as string,
        (sanitizedData.screenshots as string[]).filter(Boolean)
      );

      // Success! Clear the draft
      clearDraft();
      setSubmitStatus("success");

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Update error:", error);
      const message = error instanceof Error ? error.message : "Failed to update application. Please try again.";
      setErrorMessage(message);
      setSubmitStatus("error");
    }
  };

  // -------------------------------------------------------------------------
  // Loading skeleton
  // -------------------------------------------------------------------------
  if (isLoadingApp) {
    return <LoadingSkeleton />;
  }

  // -------------------------------------------------------------------------
  // App not found
  // -------------------------------------------------------------------------
  if (!app) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-slate-800/50">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </nav>
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-12 w-12 text-error mb-4" />
            <h2 className="text-heading-lg text-foreground">App Not Found</h2>
            <p className="mt-2 text-foreground-secondary">
              The app you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 h-10 text-sm font-semibold text-slate-950 transition-all hover:bg-brand-400"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Structured data for SEO
  // -------------------------------------------------------------------------
  const structuredData = app ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Edit ${app.name}`,
    description: `Update application details for ${app.name} on Varity Developer Portal`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Dashboard",
          item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://developer.varity.so"}/dashboard`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Edit",
          item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://developer.varity.so"}/dashboard/edit/${appId}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: app.name,
        },
      ],
    },
  } : null;

  // -------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen">
      {/* Structured Data for SEO */}
      {structuredData && <StructuredData data={structuredData} />}

      {/* Breadcrumb navigation */}
      <div className="border-b border-slate-800/50">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  onClick={(e) => {
                    if (isDirty && !confirmLeave()) {
                      e.preventDefault();
                    }
                  }}
                  className="text-slate-400 transition-colors hover:text-slate-200"
                >
                  Dashboard
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              </li>
              <li>
                <span className="text-slate-400">Edit</span>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              </li>
              <li>
                <span className="text-foreground font-medium truncate max-w-[200px] inline-block align-bottom">
                  {app.name}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-display-sm text-foreground">Update Your Application</h1>
          <p className="mt-3 text-body-md text-foreground-secondary max-w-2xl">
            Make changes to <span className="font-semibold text-foreground">{app.name}</span> and resubmit for review.
          </p>
          {!app.isApproved && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs text-amber-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>This app is pending review. Updates will reset the review process.</span>
            </div>
          )}
          <p className="mt-3 text-xs text-slate-500">
            Press <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">Ctrl+S</kbd> to save changes quickly.
          </p>
        </div>

        {/* Announcements region for screen readers */}
        <div aria-live="assertive" aria-atomic="true" className="sr-only">
          {submitStatus === "success" && "Application updated successfully. Redirecting to dashboard."}
          {submitStatus === "error" && errorMessage}
        </div>

        {/* Success message */}
        {submitStatus === "success" && (
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-6 animate-scale-in" role="alert">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-heading-md text-emerald-400">Application Updated Successfully!</h3>
              <p className="mt-2 text-body-sm text-emerald-400/80">
                Your changes have been saved. The app will be reviewed again within 24-48 hours.
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

        {/* Error message */}
        {submitStatus === "error" && (
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-error/20 bg-red-950/30 p-6 animate-fade-in" role="alert">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-error/10">
              <AlertCircle className="h-5 w-5 text-error" />
            </div>
            <div className="flex-1">
              <h3 className="text-heading-md text-error">Update Failed</h3>
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
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 mb-6">
              <AlertCircle className="h-8 w-8 text-brand-400" />
            </div>
            <h2 className="text-heading-lg text-foreground">Sign In Required</h2>
            <p className="mt-3 text-body-md text-foreground-secondary max-w-sm">
              Please sign in with your wallet to edit your application.
            </p>
            <button
              onClick={login}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-8 h-12 text-sm font-semibold text-slate-950 transition-all hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]"
            >
              Sign In to Continue
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* ============================================================ */}
            {/* Main Form Column                                              */}
            {/* ============================================================ */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex-1 space-y-8"
              noValidate
            >
              {/* ---------------------------------------------------------- */}
              {/* Section: Read-only Application Info                         */}
              {/* ---------------------------------------------------------- */}
              <fieldset className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <legend className="px-2 text-sm font-medium text-slate-400">Application Details (Read-only)</legend>
                <div className="grid gap-4 sm:grid-cols-2 mt-2">
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Name</span>
                    <p className="text-sm text-slate-200">{app.name}</p>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">GitHub URL</span>
                    <p className="text-sm text-slate-200 truncate">{app.githubUrl || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Chain ID</span>
                    <p className="text-sm text-slate-200">{app.chainId.toString()}</p>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-1">Status</span>
                    <p className="text-sm">
                      {app.isApproved ? (
                        <span className="text-emerald-400">Approved</span>
                      ) : (
                        <span className="text-amber-400">Pending Review</span>
                      )}
                    </p>
                  </div>
                </div>
              </fieldset>

              {/* ---------------------------------------------------------- */}
              {/* Section: Core Details                                       */}
              {/* ---------------------------------------------------------- */}
              <fieldset className="space-y-6">
                <legend className="text-heading-md text-foreground flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-brand-400" />
                  Core Details
                </legend>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-200">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <p className="mt-1 text-xs text-slate-500" id="description-hint">
                    Update your app description to better explain what it does.
                  </p>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={() => handleBlur("description")}
                    maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
                    rows={5}
                    aria-label="Application description"
                    aria-describedby="description-hint description-error description-count"
                    aria-invalid={!!getFieldError("description")}
                    className={getInputClassName("description", "mt-2 w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
                    required
                  />
                  <div className="mt-1 flex items-center justify-between">
                    {getFieldError("description") ? (
                      <p className="text-xs text-red-400" id="description-error" role="alert">{getFieldError("description")}</p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Tip: Focus on benefits, not just features
                      </p>
                    )}
                    <p className="text-xs text-slate-500" id="description-count">
                      {formData.description.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-200">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <p className="mt-1 text-xs text-slate-500" id="category-hint">
                    Choose the category that best describes your app.
                  </p>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onBlur={() => handleBlur("category")}
                    aria-label="Application category"
                    aria-describedby="category-hint category-error"
                    aria-invalid={!!getFieldError("category")}
                    className={getInputClassName("category", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {APP_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {getFieldError("category") && (
                    <p className="mt-1 text-xs text-red-400" id="category-error" role="alert">{getFieldError("category")}</p>
                  )}
                </div>
              </fieldset>

              {/* ---------------------------------------------------------- */}
              {/* Section: URLs & Links                                       */}
              {/* ---------------------------------------------------------- */}
              <fieldset className="space-y-6">
                <legend className="text-heading-md text-foreground flex items-center gap-2 mb-2">
                  <LinkIcon className="h-5 w-5 text-brand-400" />
                  URLs &amp; Links
                </legend>

                {/* App URL */}
                <div>
                  <label htmlFor="appUrl" className="block text-sm font-medium text-slate-200">
                    Application URL <span className="text-red-400">*</span>
                  </label>
                  <p className="mt-1 text-xs text-slate-500" id="appUrl-hint">
                    The live URL where users can access your application.
                  </p>
                  <input
                    type="url"
                    id="appUrl"
                    name="appUrl"
                    value={formData.appUrl}
                    onChange={handleChange}
                    onBlur={() => handleBlur("appUrl")}
                    placeholder="https://myapp.varity.so"
                    aria-label="Application URL"
                    aria-describedby="appUrl-hint appUrl-error"
                    aria-invalid={!!getFieldError("appUrl")}
                    className={getInputClassName("appUrl", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
                    required
                  />
                  {getFieldError("appUrl") && (
                    <p className="mt-1 text-xs text-red-400" id="appUrl-error" role="alert">{getFieldError("appUrl")}</p>
                  )}
                </div>

                {/* Logo URL */}
                <div>
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-200">
                    Logo URL
                  </label>
                  <p className="mt-1 text-xs text-slate-500" id="logoUrl-hint">
                    Direct link to your app logo (PNG, JPG, or SVG recommended).
                  </p>
                  <input
                    type="url"
                    id="logoUrl"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    onBlur={() => handleBlur("logoUrl")}
                    placeholder="https://myapp.varity.so/logo.png"
                    aria-label="Logo URL"
                    aria-describedby="logoUrl-hint logoUrl-error"
                    aria-invalid={!!getFieldError("logoUrl")}
                    className={getInputClassName("logoUrl", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
                  />
                  {getFieldError("logoUrl") && (
                    <p className="mt-1 text-xs text-red-400" id="logoUrl-error" role="alert">{getFieldError("logoUrl")}</p>
                  )}
                </div>
              </fieldset>

              {/* ---------------------------------------------------------- */}
              {/* Section: Media                                              */}
              {/* ---------------------------------------------------------- */}
              <fieldset className="space-y-4">
                <legend className="text-heading-md text-foreground flex items-center gap-2 mb-2">
                  <ImageIcon className="h-5 w-5 text-brand-400" />
                  Screenshots
                  <span className="text-sm font-normal text-slate-500">
                    ({formData.screenshots.length}/{VALIDATION.MAX_SCREENSHOTS})
                  </span>
                </legend>
                <p className="text-xs text-slate-500">
                  Update screenshots to showcase new features or improvements.
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={screenshotInput}
                    onChange={(e) => setScreenshotInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addScreenshot();
                      }
                    }}
                    placeholder="https://myapp.com/screenshot.png"
                    aria-label="Screenshot URL to add"
                    className="flex-1 rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                    disabled={formData.screenshots.length >= VALIDATION.MAX_SCREENSHOTS}
                  />
                  <button
                    type="button"
                    onClick={addScreenshot}
                    disabled={!screenshotInput || formData.screenshots.length >= VALIDATION.MAX_SCREENSHOTS}
                    aria-label="Add screenshot"
                    className="rounded-md border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {formData.screenshots.length > 0 && (
                  <ul className="space-y-2" aria-label="Screenshot URLs">
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
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {formData.logoUrl && (
                  <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                    <p className="text-xs font-medium text-slate-400 mb-2">Logo Preview</p>
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-lg border border-slate-700 bg-slate-900 overflow-hidden flex items-center justify-center">
                        <img
                          src={formData.logoUrl}
                          alt="App logo preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-slate-500">Invalid</span>';
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Logo will be displayed at 64x64px on app cards
                      </p>
                    </div>
                  </div>
                )}
              </fieldset>

              {/* ---------------------------------------------------------- */}
              {/* Section: Social Links (Optional)                            */}
              {/* ---------------------------------------------------------- */}
              <fieldset className="space-y-6">
                <legend className="text-heading-md text-foreground flex items-center gap-2 mb-2">
                  <Share2 className="h-5 w-5 text-brand-400" />
                  Social Links
                  <span className="text-xs font-normal text-slate-500 ml-2">Optional</span>
                </legend>
                <p className="text-xs text-slate-500">
                  Add social media links to help users connect with your brand.
                </p>

                {/* Website URL */}
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    Website URL
                  </label>
                  <p className="mt-1 text-xs text-slate-500" id="websiteUrl-hint">
                    Your company or project website.
                  </p>
                  <input
                    type="url"
                    id="websiteUrl"
                    name="websiteUrl"
                    value={formData.websiteUrl || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("websiteUrl")}
                    placeholder="https://example.com"
                    aria-label="Website URL"
                    aria-describedby="websiteUrl-hint websiteUrl-error"
                    aria-invalid={!!getFieldError("websiteUrl")}
                    className={getInputClassName("websiteUrl", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
                  />
                  {getFieldError("websiteUrl") && (
                    <p className="mt-1 text-xs text-red-400" id="websiteUrl-error" role="alert">{getFieldError("websiteUrl")}</p>
                  )}
                </div>

                {/* Twitter Handle */}
                <div>
                  <label htmlFor="twitterHandle" className="block text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-slate-400" />
                    Twitter Handle
                  </label>
                  <p className="mt-1 text-xs text-slate-500" id="twitterHandle-hint">
                    Your Twitter/X username (without @).
                  </p>
                  <input
                    type="text"
                    id="twitterHandle"
                    name="twitterHandle"
                    value={formData.twitterHandle || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("twitterHandle")}
                    placeholder="username"
                    maxLength={15}
                    aria-label="Twitter handle"
                    aria-describedby="twitterHandle-hint twitterHandle-error"
                    aria-invalid={!!getFieldError("twitterHandle")}
                    className={getInputClassName("twitterHandle", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
                  />
                  {getFieldError("twitterHandle") && (
                    <p className="mt-1 text-xs text-red-400" id="twitterHandle-error" role="alert">{getFieldError("twitterHandle")}</p>
                  )}
                </div>

                {/* LinkedIn URL */}
                <div>
                  <label htmlFor="linkedinUrl" className="block text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-slate-400" />
                    LinkedIn URL
                  </label>
                  <p className="mt-1 text-xs text-slate-500" id="linkedinUrl-hint">
                    Your company LinkedIn profile.
                  </p>
                  <input
                    type="url"
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={formData.linkedinUrl || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("linkedinUrl")}
                    placeholder="https://linkedin.com/company/example"
                    aria-label="LinkedIn URL"
                    aria-describedby="linkedinUrl-hint linkedinUrl-error"
                    aria-invalid={!!getFieldError("linkedinUrl")}
                    className={getInputClassName("linkedinUrl", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
                  />
                  {getFieldError("linkedinUrl") && (
                    <p className="mt-1 text-xs text-red-400" id="linkedinUrl-error" role="alert">{getFieldError("linkedinUrl")}</p>
                  )}
                </div>
              </fieldset>

              {/* ---------------------------------------------------------- */}
              {/* Section: Legal & Support (Optional)                         */}
              {/* ---------------------------------------------------------- */}
              <fieldset className="space-y-6">
                <legend className="text-heading-md text-foreground flex items-center gap-2 mb-2">
                  <Scale className="h-5 w-5 text-brand-400" />
                  Legal &amp; Support
                  <span className="text-xs font-normal text-slate-500 ml-2">Optional</span>
                </legend>
                <p className="text-xs text-slate-500">
                  Provide legal documents and support contact for transparency and user trust.
                </p>

                {/* Support Email */}
                <div>
                  <label htmlFor="supportEmail" className="block text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    Support Email
                  </label>
                  <p className="mt-1 text-xs text-slate-500" id="supportEmail-hint">
                    Email address for user support and inquiries.
                  </p>
                  <input
                    type="email"
                    id="supportEmail"
                    name="supportEmail"
                    value={formData.supportEmail || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("supportEmail")}
                    placeholder="support@example.com"
                    aria-label="Support email"
                    aria-describedby="supportEmail-hint supportEmail-error"
                    aria-invalid={!!getFieldError("supportEmail")}
                    className={getInputClassName("supportEmail", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
                  />
                  {getFieldError("supportEmail") && (
                    <p className="mt-1 text-xs text-red-400" id="supportEmail-error" role="alert">{getFieldError("supportEmail")}</p>
                  )}
                </div>

                {/* Privacy Policy URL */}
                <div>
                  <label htmlFor="privacyPolicyUrl" className="block text-sm font-medium text-slate-200 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    Privacy Policy URL
                  </label>
                  <p className="mt-1 text-xs text-slate-500" id="privacyPolicyUrl-hint">
                    Link to your privacy policy document.
                  </p>
                  <input
                    type="url"
                    id="privacyPolicyUrl"
                    name="privacyPolicyUrl"
                    value={formData.privacyPolicyUrl || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("privacyPolicyUrl")}
                    placeholder="https://example.com/privacy"
                    aria-label="Privacy Policy URL"
                    aria-describedby="privacyPolicyUrl-hint privacyPolicyUrl-error"
                    aria-invalid={!!getFieldError("privacyPolicyUrl")}
                    className={getInputClassName("privacyPolicyUrl", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
                  />
                  {getFieldError("privacyPolicyUrl") && (
                    <p className="mt-1 text-xs text-red-400" id="privacyPolicyUrl-error" role="alert">{getFieldError("privacyPolicyUrl")}</p>
                  )}
                </div>

                {/* Terms of Service URL */}
                <div>
                  <label htmlFor="termsOfServiceUrl" className="block text-sm font-medium text-slate-200 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    Terms of Service URL
                  </label>
                  <p className="mt-1 text-xs text-slate-500" id="termsOfServiceUrl-hint">
                    Link to your terms of service document.
                  </p>
                  <input
                    type="url"
                    id="termsOfServiceUrl"
                    name="termsOfServiceUrl"
                    value={formData.termsOfServiceUrl || ""}
                    onChange={handleChange}
                    onBlur={() => handleBlur("termsOfServiceUrl")}
                    placeholder="https://example.com/terms"
                    aria-label="Terms of Service URL"
                    aria-describedby="termsOfServiceUrl-hint termsOfServiceUrl-error"
                    aria-invalid={!!getFieldError("termsOfServiceUrl")}
                    className={getInputClassName("termsOfServiceUrl", "mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600")}
                  />
                  {getFieldError("termsOfServiceUrl") && (
                    <p className="mt-1 text-xs text-red-400" id="termsOfServiceUrl-error" role="alert">{getFieldError("termsOfServiceUrl")}</p>
                  )}
                </div>
              </fieldset>

              {/* ---------------------------------------------------------- */}
              {/* Sticky footer: Actions                                      */}
              {/* ---------------------------------------------------------- */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800/50 pt-6">
                {/* Left side: status indicators */}
                <div className="flex items-center gap-3 flex-wrap">
                  {isDirty && (
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      Unsaved changes
                    </span>
                  )}
                  {hasDraft && lastSaved && !isDirty && (
                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      Saved at {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                  {/* Toggle preview on small screens */}
                  <button
                    type="button"
                    onClick={() => setShowPreview((p) => !p)}
                    className="lg:hidden inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showPreview ? "Hide change preview" : "Show change preview"}
                  >
                    {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showPreview ? "Hide preview" : "Preview changes"}
                  </button>
                </div>

                {/* Right side: action buttons */}
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  {/* Revert button */}
                  {isDirty && (
                    <button
                      type="button"
                      onClick={handleRevert}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-amber-500/30 hover:text-amber-400"
                      aria-label="Revert all changes"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Revert
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirmLeave()) {
                        clearDraft();
                        router.push("/dashboard");
                      }
                    }}
                    className="rounded-md border border-slate-800 px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSave}
                    className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Save changes"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isLoading ? "Saving..." : submitStatus === "success" ? "Saved" : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* ============================================================ */}
            {/* Side panel: Change Preview (always visible on lg+)            */}
            {/* ============================================================ */}
            <aside
              className={`lg:w-80 flex-shrink-0 ${showPreview ? "block" : "hidden lg:block"}`}
              aria-label="Changes preview"
            >
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Change diff card */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                  <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-4">
                    <Eye className="h-4 w-4 text-brand-400" />
                    Changes Preview
                  </h3>

                  {changedFields.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">
                      No changes yet. Edit the fields on the left to see a preview of your changes.
                    </p>
                  ) : (
                    <ul className="space-y-4">
                      {changedFields.map((change) => (
                        <li key={change.label} className="text-xs">
                          <span className="font-medium text-slate-300 block mb-1">{change.label}</span>
                          <div className="space-y-1">
                            <div className="rounded bg-red-950/30 border border-red-500/10 px-2.5 py-1.5 text-red-400/80 line-through break-words">
                              {change.original.length > 120 ? change.original.slice(0, 120) + "..." : change.original || "(empty)"}
                            </div>
                            <div className="rounded bg-emerald-950/30 border border-emerald-500/10 px-2.5 py-1.5 text-emerald-400/80 break-words">
                              {change.current.length > 120 ? change.current.slice(0, 120) + "..." : change.current || "(empty)"}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Validation summary card */}
                {!validationResult.isValid && touchedFields.size > 0 && (
                  <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-5 animate-fade-in">
                    <h3 className="text-sm font-medium text-red-400 flex items-center gap-2 mb-3">
                      <AlertCircle className="h-4 w-4" />
                      Validation Issues
                    </h3>
                    <ul className="space-y-1.5" role="list">
                      {Object.entries(validationResult.errors).map(([field, msg]) => (
                        <li key={field} className="text-xs text-red-400/80 flex items-start gap-1.5">
                          <span className="text-red-500 mt-0.5">-</span>
                          {msg}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick info card */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                  <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-brand-400" />
                    App Info
                  </h3>
                  <dl className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">App ID</dt>
                      <dd className="text-slate-300 font-mono">#{appId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Status</dt>
                      <dd>{app.isApproved ? <span className="text-emerald-400">Approved</span> : <span className="text-amber-400">Pending</span>}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Built with Varity</dt>
                      <dd className="text-slate-300">{app.builtWithVarity ? "Yes" : "No"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Created</dt>
                      <dd className="text-slate-300">
                        {app.createdAt ? new Date(Number(app.createdAt) * 1000).toLocaleDateString() : "N/A"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
