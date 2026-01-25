"use client";

import { useState, useCallback, useEffect } from "react";
import { Github, CheckCircle, Loader2, Search, ChevronDown, Star, GitFork, ExternalLink } from "lucide-react";
import { usePrivy, useLinkAccount, useOAuthTokens } from "@privy-io/react-auth";
import { GitHubRepo, formatRelativeTime, getLanguageColor } from "@/lib/github";
import type { AppFormData } from "@/lib/validation";

/** Props for the GitHubIntegration component */
export interface GitHubIntegrationProps {
  /** Current form data (used to auto-populate fields from selected repo) */
  formData: AppFormData;
  /** Callback to update form data when a repo is selected */
  setFormData: React.Dispatch<React.SetStateAction<AppFormData>>;
}

/**
 * GitHub repository picker section for the app submission form.
 *
 * Handles:
 * - GitHub OAuth linking via Privy
 * - Repository search and selection
 * - Auto-populating form fields from selected repo metadata
 */
export default function GitHubIntegration({ formData, setFormData }: GitHubIntegrationProps) {
  const { user } = usePrivy();

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

  const handleRepoSelect = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setFormData((prev) => ({
      ...prev,
      name: prev.name || repo.name,
      description: prev.description || (repo.description || ""),
      appUrl: prev.appUrl || (repo.homepage || ""),
      githubUrl: repo.html_url,
    }));
    setShowRepoDropdown(false);
    setRepoSearchQuery("");
  };

  return (
    <fieldset className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
      <legend className="sr-only">GitHub Integration</legend>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
            <Github className="h-5 w-5 text-slate-300" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-200">Import from GitHub</h3>
            <p className="text-xs text-slate-500">Connect your GitHub to import repository details</p>
          </div>
        </div>
        {isGithubLinked ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300">@{githubUsername}</span>
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <CheckCircle className="h-3 w-3" aria-hidden="true" /> Connected
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLinkGithub}
            disabled={isLinkingGithub}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-700 disabled:opacity-50"
          >
            {isLinkingGithub ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Github className="h-4 w-4" aria-hidden="true" />}
            {isLinkingGithub ? "Connecting..." : "Connect GitHub"}
          </button>
        )}
      </div>

      {isGithubLinked && githubToken && (
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search your repositories..."
                value={repoSearchQuery}
                onChange={(e) => {
                  setRepoSearchQuery(e.target.value);
                  setShowRepoDropdown(true);
                }}
                onFocus={() => setShowRepoDropdown(true)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
                aria-label="Search your GitHub repositories"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowRepoDropdown(!showRepoDropdown)}
              className="rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-slate-400 hover:text-slate-200"
              aria-label={showRepoDropdown ? "Close repository list" : "Open repository list"}
            >
              <ChevronDown className={"h-4 w-4 transition-transform " + (showRepoDropdown ? "rotate-180" : "")} aria-hidden="true" />
            </button>
          </div>

          {showRepoDropdown && (
            <div className="absolute z-10 mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 shadow-xl max-h-64 overflow-auto" role="listbox" aria-label="GitHub repositories">
              {isLoadingRepos ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" aria-hidden="true" />
                  <span className="sr-only">Loading repositories</span>
                </div>
              ) : searchRepos(repoSearchQuery).length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">No repositories found</div>
              ) : (
                searchRepos(repoSearchQuery).slice(0, 10).map((repo) => (
                  <button
                    key={repo.id}
                    type="button"
                    role="option"
                    aria-selected={selectedRepo?.id === repo.id}
                    onClick={() => handleRepoSelect(repo)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-700/50 border-b border-slate-700/50 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200 truncate">{repo.name}</span>
                        {repo.private && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">Private</span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }}></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" aria-hidden="true" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" aria-hidden="true" />
                          {repo.forks_count}
                        </span>
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
            <a
              href={selectedRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300"
              aria-label={`Open ${selectedRepo.full_name} on GitHub`}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </fieldset>
  );
}
