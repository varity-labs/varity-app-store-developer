"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, AlertCircle, CheckCircle, Loader2, Github, Star, GitFork, ChevronDown, Search, ExternalLink } from "lucide-react";
import { usePrivy, useLinkAccount, useOAuthTokens } from "@privy-io/react-auth";
import { useAuth } from "@/hooks/useAuth";
import { useContract } from "@/hooks/useContract";
import { GitHubRepo, formatRelativeTime, getLanguageColor } from "@/lib/github";
import { APP_CATEGORIES, VALIDATION } from "@/lib/constants";
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
  // Company Information
  companyName: string;
  websiteUrl: string;
  // Social Links
  twitterHandle: string;
  linkedinUrl: string;
  // Legal Documents
  privacyPolicyUrl: string;
  supportEmail: string;
  termsOfServiceUrl: string;
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

// Validation helpers
const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Empty is valid (fields are optional)
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Empty is valid (field is optional)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatTwitterHandle = (handle: string): string => {
  // Remove @ if user included it
  return handle.startsWith("@") ? handle.slice(1) : handle;
};

export default function SubmitPage() {
  const router = useRouter();
  const { authenticated, login } = useAuth();
  const { user } = usePrivy();
  const { registerApp, isLoading, error: contractError, txHash, resetState, account } = useContract();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [screenshotInput, setScreenshotInput] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [repoSearchQuery, setRepoSearchQuery] = useState("");
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);
  const [isLinkingGithub, setIsLinkingGithub] = useState(false);

  // GitHub state
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  // Check if GitHub is linked via Privy
  const githubAccount = user?.linkedAccounts?.find((account: any) => account.type === "github_oauth");
  const isGithubLinked = !!githubAccount;
  const githubUsername = (githubAccount as any)?.username || null;

  // Use Privy's useOAuthTokens to get GitHub access token
  const { reauthorize } = useOAuthTokens({
    onOAuthTokenGrant: ({ oAuthTokens }) => {
      if (oAuthTokens.provider === "github") {
        setGithubToken(oAuthTokens.accessToken);
        setIsLinkingGithub(false);
      }
    },
  });

  // Use Privy's useLinkAccount for GitHub OAuth
  const { linkGithub } = useLinkAccount({
    onSuccess: () => {
      // Token will be received via useOAuthTokens callback
    },
    onError: (error) => {
      console.error("GitHub linking error:", error);
      setIsLinkingGithub(false);
    },
  });

  // Fetch repositories when we have a token
  const fetchRepositories = useCallback(async () => {
    if (!githubToken) return;
    setIsLoadingRepos(true);
    try {
      const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
        headers: { Authorization: `Bearer ${githubToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch repositories");
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      console.error("Error fetching repos:", error);
    } finally {
      setIsLoadingRepos(false);
    }
  }, [githubToken]);

  // Auto-fetch repos when token is available
  useEffect(() => {
    if (githubToken && repositories.length === 0) {
      fetchRepositories();
    }
  }, [githubToken, repositories.length, fetchRepositories]);

  // Search repos locally
  const searchRepos = useCallback((query: string): GitHubRepo[] => {
    if (!query.trim()) return repositories;
    const q = query.toLowerCase();
    return repositories.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.full_name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }, [repositories]);

  const handleLinkGithub = () => {
    setIsLinkingGithub(true);
    linkGithub();
  };

  const selectRepo = (repo: GitHubRepo | null) => setSelectedRepo(repo);

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

  const handleRepoSelect = (repo: GitHubRepo) => { selectRepo(repo); setFormData((prev) => ({ ...prev, name: prev.name || repo.name, description: prev.description || (repo.description || ""), appUrl: prev.appUrl || (repo.homepage || ""), githubUrl: repo.html_url })); setShowRepoDropdown(false); setRepoSearchQuery(""); };

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

    // Validate optional URL fields
    const urlFields = [
      { name: "Website URL", value: formData.websiteUrl },
      { name: "LinkedIn URL", value: formData.linkedinUrl },
      { name: "Privacy Policy URL", value: formData.privacyPolicyUrl },
      { name: "Terms of Service URL", value: formData.termsOfServiceUrl },
    ];

    for (const field of urlFields) {
      if (field.value && !isValidUrl(field.value)) {
        setErrorMessage(`Please enter a valid URL for ${field.name}.`);
        setSubmitStatus("error");
        return;
      }
    }

    // Validate email
    if (formData.supportEmail && !isValidEmail(formData.supportEmail)) {
      setErrorMessage("Please enter a valid email address for Support Email.");
      setSubmitStatus("error");
      return;
    }

    // Reset previous state
    resetState();
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // STEP 1: Send email notification via Web3Forms BEFORE blockchain call
      try {
        const web3formsResponse = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: "322fcdfe-779a-4cab-a76a-11285466709c",
            subject: `New App Submission: ${formData.name}`,
            from_name: "Varity App Store",
            to: "team@varity.so",
            // Form data
            app_name: formData.name,
            description: formData.description,
            app_url: formData.appUrl,
            logo_url: formData.logoUrl || "Not provided",
            category: formData.category,
            chain_id: formData.chainId,
            github_url: formData.githubUrl || "Not provided",
            built_with_varity: formData.builtWithVarity ? "Yes" : "No",
            screenshots: formData.screenshots.length > 0 ? formData.screenshots.join(", ") : "None",
            developer_address: account,
            // Company Information
            company_name: formData.companyName || "Not provided",
            website_url: formData.websiteUrl || "Not provided",
            // Social Links
            twitter_handle: formData.twitterHandle ? `@${formatTwitterHandle(formData.twitterHandle)}` : "Not provided",
            linkedin_url: formData.linkedinUrl || "Not provided",
            // Legal Documents
            privacy_policy_url: formData.privacyPolicyUrl || "Not provided",
            support_email: formData.supportEmail || "Not provided",
            terms_of_service_url: formData.termsOfServiceUrl || "Not provided",
          }),
        });

        const web3formsData = await web3formsResponse.json();
        if (!web3formsData.success) {
          console.warn("Web3Forms notification failed:", web3formsData.message);
          // Continue anyway - email failure shouldn't block submission
        }
      } catch (emailError) {
        console.warn("Email notification failed:", emailError);
        // Continue anyway - email failure shouldn't block submission
      }

      // STEP 2: Prepare metadata JSON for additional fields
      const metadata = {
        companyName: formData.companyName || undefined,
        websiteUrl: formData.websiteUrl || undefined,
        twitterHandle: formData.twitterHandle ? formatTwitterHandle(formData.twitterHandle) : undefined,
        linkedinUrl: formData.linkedinUrl || undefined,
        privacyPolicyUrl: formData.privacyPolicyUrl || undefined,
        supportEmail: formData.supportEmail || undefined,
        termsOfServiceUrl: formData.termsOfServiceUrl || undefined,
      };

      // Filter out undefined values
      const cleanMetadata = Object.fromEntries(
        Object.entries(metadata).filter(([, v]) => v !== undefined)
      );

      // Append metadata to description if there are any extra fields
      const descriptionWithMetadata = Object.keys(cleanMetadata).length > 0
        ? `${formData.description}\n\n<!-- VARITY_METADATA:${JSON.stringify(cleanMetadata)} -->`
        : formData.description;

      // STEP 3: Call smart contract to register app
      const result = await registerApp({
        name: formData.name,
        description: descriptionWithMetadata,
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
      {/* Navigation breadcrumb */}
      <nav className="border-b border-slate-800/50" aria-label="Breadcrumb">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Browse
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-display-sm text-foreground">Submit Your Application</h1>
          <p className="mt-3 text-body-md text-foreground-secondary max-w-2xl">
            Join the growing ecosystem of verified applications. Your app will be reviewed within 48 hours and discoverable by enterprise customers worldwide.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-xs text-brand-400">
            <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Average approval time: 24 hours</span>
          </div>
        </header>

        {/* Success message */}
        {submitStatus === "success" && (
          <div className="mb-8 flex items-start gap-4 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-6 animate-fade-in">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-heading-md text-emerald-400">Application Submitted Successfully!</h3>
              <p className="mt-2 text-body-sm text-emerald-400/80">
                Your application has been submitted successfully! Our team will review it within 24-48 hours. Check your dashboard for status updates.
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
            <h2 className="text-heading-lg text-foreground">Ready to submit your app?</h2>
            <p className="mt-3 text-body-md text-foreground-secondary max-w-sm">
              Sign in with your wallet or email to submit your application. It takes less than 2 minutes.
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
          <form onSubmit={handleSubmit} className="space-y-6">
{/* GitHub Integration Section */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                    <Github className="h-5 w-5 text-slate-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">Import from GitHub</h3>
                    <p className="text-xs text-slate-500">Connect your GitHub to import repository details</p>
                  </div>
                </div>
                {isGithubLinked ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">@{githubUsername}</span>
                    <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle className="h-3 w-3" /> Connected</span>
                  </div>
                ) : (
                  <button type="button" onClick={handleLinkGithub} disabled={isLinkingGithub} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-700 disabled:opacity-50">
                    {isLinkingGithub ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
                    {isLinkingGithub ? "Connecting..." : "Connect GitHub"}
                  </button>
                )}
              </div>
              
              {isGithubLinked && githubToken && (
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input type="text" placeholder="Search your repositories..." value={repoSearchQuery} onChange={(e) => { setRepoSearchQuery(e.target.value); setShowRepoDropdown(true); }} onFocus={() => setShowRepoDropdown(true)} className="w-full rounded-lg border border-slate-700 bg-slate-800 pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none" />
                    </div>
                    <button type="button" onClick={() => setShowRepoDropdown(!showRepoDropdown)} className="rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-slate-400 hover:text-slate-200">
                      <ChevronDown className={"h-4 w-4 transition-transform " + (showRepoDropdown ? "rotate-180" : "")} />
                    </button>
                  </div>
                  
                  {showRepoDropdown && (
                    <div className="absolute z-10 mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 shadow-xl max-h-64 overflow-auto">
                      {isLoadingRepos ? (
                        <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div>
                      ) : searchRepos(repoSearchQuery).length === 0 ? (
                        <div className="py-8 text-center text-sm text-slate-500">No repositories found</div>
                      ) : (
                        searchRepos(repoSearchQuery).slice(0, 10).map((repo) => (
                          <button key={repo.id} type="button" onClick={() => handleRepoSelect(repo)} className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-700/50 border-b border-slate-700/50 last:border-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-200 truncate">{repo.name}</span>
                                {repo.private && <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">Private</span>}
                              </div>
                              {repo.description && <p className="text-xs text-slate-500 truncate mt-0.5">{repo.description}</p>}
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                                {repo.language && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{backgroundColor: getLanguageColor(repo.language)}}></span>{repo.language}</span>}
                                <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stargazers_count}</span>
                                <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks_count}</span>
                                <span>{formatRelativeTime(repo.updated_at)}</span>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {isGithubLinked && !githubToken && (
                <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-950/20 p-4">
                  <p className="text-sm text-amber-400">GitHub is connected, but we need the access token to fetch your repositories.</p>
                  <button
                    type="button"
                    onClick={() => reauthorize({ provider: "github" })}
                    className="mt-2 text-xs text-amber-400 hover:text-amber-300 underline"
                  >
                    Click here to grant repository access
                  </button>
                </div>
              )}
              
              {selectedRepo && (
                <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-400">Selected: {selectedRepo.full_name}</p>
                      <p className="text-xs text-emerald-400/70 mt-0.5">Form fields auto-populated from repository</p>
                    </div>
                    <a href={selectedRepo.html_url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300"><ExternalLink className="h-4 w-4" /></a>
                  </div>
                </div>
              )}
            </div>

            
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-200">
                Application Name <span className="text-red-400">*</span>
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
                maxLength={VALIDATION.NAME_MAX_LENGTH}
                placeholder="e.g., Enterprise Analytics Dashboard"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                required
              />
              <p className="mt-1 text-xs text-slate-500">
                {formData.name.length}/{VALIDATION.NAME_MAX_LENGTH} characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-200">
                Description <span className="text-red-400">*</span>
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Explain what your application does and who it&apos;s for. This appears on your app card.
              </p>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
                rows={5}
                placeholder="e.g., A real-time analytics dashboard for enterprise teams to track metrics, visualize data, and make data-driven decisions. Built for high-scale operations with 70-85% lower infrastructure costs."
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
                placeholder="https://myapp.com/logo.png"
                className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
              />
              <p className="mt-1 text-xs text-slate-500">
                Square image recommended (256×256px minimum). PNG with transparent background works best.
              </p>
            </div>

            {/* Category and Network */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-200">
                  Category <span className="text-red-400">*</span>
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Help users find your app in the right category
                </p>
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
                <p className="mt-1 text-xs text-slate-500">
                  Your app will be hosted on the Varity Network
                </p>
                <div className="mt-2 w-full rounded-md border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Varity Network
                </div>
                <input type="hidden" name="chainId" value={33529} />
              </div>
            </div>

            {/* Screenshots */}
            <div>
              <label className="block text-sm font-medium text-slate-200">
                Screenshots <span className="text-slate-500">(Optional, {formData.screenshots.length}/{VALIDATION.MAX_SCREENSHOTS})</span>
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Screenshots increase conversions by 3x. Show users what makes your app great.
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="url"
                  value={screenshotInput}
                  onChange={(e) => setScreenshotInput(e.target.value)}
                  placeholder="https://myapp.com/screenshot-1.png"
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

            {/* Company Information Section */}
            <div className="border-t border-slate-800/50 pt-6">
              <h3 className="text-sm font-medium text-slate-200 mb-1">Company Information</h3>
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
            </div>

            {/* Social Links Section */}
            <div className="border-t border-slate-800/50 pt-6">
              <h3 className="text-sm font-medium text-slate-200 mb-1">Social Links</h3>
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
            </div>

            {/* Legal Documents Section */}
            <div className="border-t border-slate-800/50 pt-6">
              <h3 className="text-sm font-medium text-slate-200 mb-1">Legal Documents</h3>
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
            </div>

            {/* Built with Varity */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="builtWithVarity"
                  name="builtWithVarity"
                  checked={formData.builtWithVarity}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-600 focus:ring-offset-slate-900"
                />
                <div className="flex-1">
                  <label htmlFor="builtWithVarity" className="text-sm font-medium text-slate-200 cursor-pointer">
                    Built with Varity SDK
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    Apps built with Varity SDK get a verified badge and priority placement in the marketplace
                  </p>
                </div>
              </div>
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
