"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, AlertCircle, CheckCircle, Loader2, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useContract } from "@/hooks/useContract";
import { VALIDATION } from "@/lib/constants";
import type { AppData } from "@/lib/constants";
import { varityL3 } from "@/lib/thirdweb";

interface FormData {
  description: string;
  appUrl: string;
  screenshots: string[];
}

export default function EditAppPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params?.id as string;

  const { authenticated, login } = useAuth();
  const { getApp, updateApp, isLoading, error: contractError, txHash, resetState, account } = useContract();

  const [app, setApp] = useState<AppData | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    description: "",
    appUrl: "",
    screenshots: [],
  });
  const [screenshotInput, setScreenshotInput] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch app data on mount
  useEffect(() => {
    async function fetchApp() {
      if (!appId) return;

      setIsLoadingApp(true);
      try {
        const appData = await getApp(BigInt(appId));
        if (appData) {
          setApp(appData);
          setFormData({
            description: appData.description,
            appUrl: appData.appUrl,
            screenshots: appData.screenshots || [],
          });
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
  }, [appId, getApp]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addScreenshot = () => {
    if (screenshotInput && formData.screenshots.length < VALIDATION.MAX_SCREENSHOTS) {
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, screenshotInput],
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

    // Validate form
    if (!formData.description || !formData.appUrl) {
      setErrorMessage("Please fill in all required fields.");
      setSubmitStatus("error");
      return;
    }

    resetState();
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      await updateApp(
        BigInt(appId),
        formData.description,
        formData.appUrl,
        formData.screenshots
      );

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

  // Loading state
  if (isLoadingApp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400 mx-auto mb-4" />
          <p className="text-foreground-secondary">Loading app details...</p>
        </div>
      </div>
    );
  }

  // App not found
  if (!app) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-slate-800/50">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
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

  return (
    <div className="min-h-screen">
      {/* Back link */}
      <div className="border-b border-slate-800/50">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
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
        </div>

        {/* Success message */}
        {submitStatus === "success" && (
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-6 animate-fade-in">
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
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-error/20 bg-red-950/30 p-6 animate-fade-in">
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* App Info (Read-only) */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-4">Application Details (Read-only)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Name</label>
                  <p className="text-sm text-slate-200">{app.name}</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Category</label>
                  <p className="text-sm text-slate-200">{app.category}</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">GitHub URL</label>
                  <p className="text-sm text-slate-200">{app.githubUrl || "Not provided"}</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Status</label>
                  <p className="text-sm">
                    {app.isApproved ? (
                      <span className="text-emerald-400">Approved</span>
                    ) : (
                      <span className="text-amber-400">Pending Review</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-200">
                Description <span className="text-red-400">*</span>
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Update your app description to better explain what it does.
              </p>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
                rows={5}
                className="mt-2 w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                required
              />
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Tip: Focus on benefits, not just features
                </p>
                <p className="text-xs text-slate-500">
                  {formData.description.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH}
                </p>
              </div>
            </div>

            {/* App URL */}
            <div>
              <label htmlFor="appUrl" className="block text-sm font-medium text-slate-200">
                Application URL <span className="text-red-400">*</span>
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
                placeholder="https://myapp.varity.so"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                required
              />
            </div>

            {/* Screenshots */}
            <div>
              <label className="block text-sm font-medium text-slate-200">
                Screenshots <span className="text-slate-500">({formData.screenshots.length}/{VALIDATION.MAX_SCREENSHOTS})</span>
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Update screenshots to showcase new features or improvements.
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="url"
                  value={screenshotInput}
                  onChange={(e) => setScreenshotInput(e.target.value)}
                  placeholder="https://myapp.com/screenshot.png"
                  className="flex-1 rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                  disabled={formData.screenshots.length >= VALIDATION.MAX_SCREENSHOTS}
                />
                <button
                  type="button"
                  onClick={addScreenshot}
                  disabled={!screenshotInput || formData.screenshots.length >= VALIDATION.MAX_SCREENSHOTS}
                  className="rounded-md border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {formData.screenshots.length > 0 && (
                <ul className="mt-3 space-y-2">
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
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 border-t border-slate-800/50 pt-6">
              <Link
                href="/dashboard"
                className="rounded-md border border-slate-800 px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || submitStatus === "success"}
                className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
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
          </form>
        )}
      </div>
    </div>
  );
}
