"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useContract } from "@/hooks/useContract";
import { APP_CATEGORIES, SUPPORTED_CHAINS, VALIDATION } from "@/lib/constants";
import { varityL3 } from "@/lib/thirdweb";

interface FormData {
  name: string;
  description: string;
  appUrl: string;
  logoUrl: string;
  category: string;
  chainId: number;
  builtWithVarity: boolean;
  githubUrl: string;
  screenshots: string[];
}

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
};

export default function SubmitPage() {
  const router = useRouter();
  const { authenticated, login } = useAuth();
  const { registerApp, isLoading, error: contractError, txHash, resetState, account } = useContract();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [screenshotInput, setScreenshotInput] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
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

    // Check wallet connection
    if (!account) {
      setErrorMessage("Please connect your wallet to submit an application.");
      setSubmitStatus("error");
      return;
    }

    // Validate form
    if (!formData.name || !formData.description || !formData.appUrl || !formData.category) {
      setErrorMessage("Please fill in all required fields.");
      setSubmitStatus("error");
      return;
    }

    // Reset previous state
    resetState();
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // Call smart contract to register app
      const result = await registerApp({
        name: formData.name,
        description: formData.description,
        appUrl: formData.appUrl,
        logoUrl: formData.logoUrl,
        category: formData.category,
        chainId: formData.chainId,
        builtWithVarity: formData.builtWithVarity,
        githubUrl: formData.githubUrl,
        screenshots: formData.screenshots,
      });

      // Success!
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
      {/* Back link */}
      <div className="border-b border-slate-800/50">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-display-sm text-foreground">Submit Your Application</h1>
          <p className="mt-3 text-body-md text-foreground-secondary max-w-2xl">
            Submit your application for our curation team to review. Once approved, your app will be listed in the marketplace and discoverable by enterprise customers worldwide.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-xs text-brand-400">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Typical approval time: 24-48 hours</span>
          </div>
        </div>

        {/* Success message */}
        {submitStatus === "success" && (
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-6 animate-fade-in">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-heading-md text-emerald-400">Application Submitted Successfully</h3>
              <p className="mt-2 text-body-sm text-emerald-400/80">
                Your application has been submitted to our curation team. You&apos;ll be notified once it&apos;s approved and live in the marketplace.
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
                Redirecting to dashboard...
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
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 mb-6">
              <AlertCircle className="h-8 w-8 text-brand-400" />
            </div>
            <h2 className="text-heading-lg text-foreground">Sign In to Continue</h2>
            <p className="mt-3 text-body-md text-foreground-secondary max-w-sm">
              Sign in with your wallet to submit your application and join our curated marketplace of enterprise-grade apps.
            </p>
            <button
              onClick={login}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-8 h-12 text-sm font-semibold text-slate-950 transition-all hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]"
            >
              Sign In with Wallet
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                Application Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={VALIDATION.NAME_MAX_LENGTH}
                placeholder="My Application"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-200">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
                rows={5}
                placeholder="Describe what your application does and its key features..."
                className="mt-2 w-full resize-none rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                required
              />
              <p className="mt-1 text-xs text-slate-500">
                {formData.description.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH} characters
              </p>
            </div>

            {/* App URL */}
            <div>
              <label htmlFor="appUrl" className="block text-sm font-medium text-slate-200">
                Application URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                id="appUrl"
                name="appUrl"
                value={formData.appUrl}
                onChange={handleChange}
                placeholder="https://myapp.com"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                required
              />
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-slate-200">
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
              />
              <p className="mt-1 text-xs text-slate-500">
                Recommended: Square image, minimum 256×256 pixels (PNG or SVG preferred)
              </p>
            </div>

            {/* Category and Network */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-200">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                  required
                >
                  <option value="">Select category</option>
                  {APP_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="chainId" className="block text-sm font-medium text-slate-200">
                  Hosted Network
                </label>
                <select
                  id="chainId"
                  name="chainId"
                  value={formData.chainId}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                >
                  {SUPPORTED_CHAINS.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* GitHub URL */}
            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-200">
                GitHub Repository
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
              />
            </div>

            {/* Screenshots */}
            <div>
              <label className="block text-sm font-medium text-slate-200">
                Screenshots ({formData.screenshots.length}/{VALIDATION.MAX_SCREENSHOTS})
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  type="url"
                  value={screenshotInput}
                  onChange={(e) => setScreenshotInput(e.target.value)}
                  placeholder="https://example.com/screenshot.png"
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

            {/* Built with Varity */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="builtWithVarity"
                name="builtWithVarity"
                checked={formData.builtWithVarity}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-slate-100 focus:ring-slate-600 focus:ring-offset-slate-900"
              />
              <label htmlFor="builtWithVarity" className="text-sm text-slate-300">
                This application was built using the Varity SDK
              </label>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 border-t border-slate-800/50 pt-6">
              <Link
                href="/"
                className="rounded-md border border-slate-800 px-5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || submitStatus === "success"}
                className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Submitting..." : submitStatus === "success" ? "Submitted" : "Submit for Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
