"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { usePrivy, useLinkAccount, useOAuthTokens } from "@privy-io/react-auth";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  pushed_at: string;
  private: boolean;
  owner: { login: string; avatar_url: string };
  topics?: string[];
}

export interface GitHubOrg {
  login: string;
  avatar_url: string;
}

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetAt: Date | null;
}

interface GithubContextValue {
  isGithubLinked: boolean;
  githubUsername: string | null;
  githubAvatarUrl: string | null;
  hasAccessToken: boolean;
  accessToken: string | null;
  repositories: GitHubRepo[];
  isLoadingRepos: boolean;
  reposError: string | null;
  selectedRepo: GitHubRepo | null;
  selectRepo: (repo: GitHubRepo | null) => void;
  linkGithub: () => void;
  refreshRepos: () => Promise<void>;
  searchRepos: (query: string) => GitHubRepo[];
  isLinking: boolean;
  rateLimit: RateLimitInfo | null;
  userOrgs: GitHubOrg[];
  fetchOrgRepos: (orgName: string) => Promise<GitHubRepo[]>;
}

const defaultContextValue: GithubContextValue = {
  isGithubLinked: false,
  githubUsername: null,
  githubAvatarUrl: null,
  hasAccessToken: false,
  accessToken: null,
  repositories: [],
  isLoadingRepos: false,
  reposError: null,
  selectedRepo: null,
  selectRepo: () => {},
  linkGithub: () => {},
  refreshRepos: async () => {},
  searchRepos: () => [],
  isLinking: false,
  rateLimit: null,
  userOrgs: [],
  fetchOrgRepos: async () => [],
};

const GithubContext = createContext<GithubContextValue>(defaultContextValue);

// Rate limit warning threshold
const RATE_LIMIT_WARNING_THRESHOLD = 10;

/**
 * Extract rate limit info from GitHub API response headers
 */
function extractRateLimitInfo(response: Response): RateLimitInfo {
  const remaining = parseInt(response.headers.get("x-ratelimit-remaining") || "0", 10);
  const limit = parseInt(response.headers.get("x-ratelimit-limit") || "0", 10);
  const resetTimestamp = response.headers.get("x-ratelimit-reset");
  const resetAt = resetTimestamp ? new Date(parseInt(resetTimestamp, 10) * 1000) : null;

  return { remaining, limit, resetAt };
}

/**
 * Get user-friendly error message based on HTTP status code
 */
function getErrorMessage(status: number, defaultMessage: string): string {
  switch (status) {
    case 401:
      return "GitHub authentication failed. Please re-link your GitHub account.";
    case 403:
      return "GitHub API rate limit exceeded. Please wait a few minutes before trying again.";
    case 404:
      return "The requested GitHub resource was not found.";
    case 422:
      return "Invalid request to GitHub API. Please check your inputs.";
    case 500:
    case 502:
    case 503:
      return "GitHub is experiencing issues. Please try again later.";
    default:
      return defaultMessage;
  }
}

export function GithubProvider({ children }: { children: ReactNode }) {
  const { user, authenticated } = usePrivy();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [userOrgs, setUserOrgs] = useState<GitHubOrg[]>([]);

  // Handle OAuth token grant from Privy
  useOAuthTokens({
    onOAuthTokenGrant: ({ oAuthTokens }) => {
      if (oAuthTokens?.provider === "github" && oAuthTokens?.accessToken) {
        setAccessToken(oAuthTokens.accessToken);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("varity_github_token", oAuthTokens.accessToken);
        }
      }
    },
  });

  // Handle GitHub linking
  const { linkGithub: privyLinkGithub } = useLinkAccount({
    onSuccess: () => setIsLinking(false),
    onError: () => setIsLinking(false),
  });

  // Find GitHub account in linked accounts
  const githubAccount = user?.linkedAccounts?.find(
    (account) => account.type === "github_oauth"
  ) as { username?: string; subject?: string } | undefined;

  const isGithubLinked = !!githubAccount;
  const githubUsername = githubAccount?.username || null;
  const githubAvatarUrl = githubUsername ? `https://github.com/${githubUsername}.png` : null;

  // Restore token from session storage
  useEffect(() => {
    if (typeof window !== "undefined" && isGithubLinked && !accessToken) {
      const storedToken = sessionStorage.getItem("varity_github_token");
      if (storedToken) setAccessToken(storedToken);
    }
  }, [isGithubLinked, accessToken]);

  // Fetch user's organizations from GitHub API
  const fetchUserOrgs = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await fetch("https://api.github.com/user/orgs", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Update rate limit info
      const rateLimitInfo = extractRateLimitInfo(response);
      setRateLimit(rateLimitInfo);

      // Log warning if rate limit is low
      if (rateLimitInfo.remaining < RATE_LIMIT_WARNING_THRESHOLD && rateLimitInfo.remaining > 0) {
        console.warn(
          `GitHub API rate limit is low: ${rateLimitInfo.remaining}/${rateLimitInfo.limit} remaining. ` +
            `Resets at ${rateLimitInfo.resetAt?.toLocaleTimeString() || "unknown"}`
        );
      }

      if (!response.ok) {
        // Don't throw for orgs fetch - it's not critical
        console.warn("Failed to fetch user organizations:", getErrorMessage(response.status, "Unknown error"));
        return;
      }

      const data: GitHubOrg[] = await response.json();
      setUserOrgs(data);
    } catch (error) {
      console.warn("Error fetching user organizations:", error);
    }
  }, [accessToken]);

  // Fetch repositories from GitHub API
  const fetchRepositories = useCallback(async () => {
    if (!accessToken) return;
    setIsLoadingRepos(true);
    setReposError(null);
    try {
      const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Update rate limit info
      const rateLimitInfo = extractRateLimitInfo(response);
      setRateLimit(rateLimitInfo);

      // Log warning if rate limit is low
      if (rateLimitInfo.remaining < RATE_LIMIT_WARNING_THRESHOLD && rateLimitInfo.remaining > 0) {
        console.warn(
          `GitHub API rate limit is low: ${rateLimitInfo.remaining}/${rateLimitInfo.limit} remaining. ` +
            `Resets at ${rateLimitInfo.resetAt?.toLocaleTimeString() || "unknown"}`
        );
      }

      if (!response.ok) {
        throw new Error(getErrorMessage(response.status, "Failed to fetch repositories"));
      }
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      setReposError(error instanceof Error ? error.message : "Failed to fetch repositories");
    } finally {
      setIsLoadingRepos(false);
    }
  }, [accessToken]);

  // Fetch organization repositories from GitHub API
  const fetchOrgRepos = useCallback(
    async (orgName: string): Promise<GitHubRepo[]> => {
      if (!accessToken) {
        throw new Error("No access token available. Please link your GitHub account.");
      }

      const response = await fetch(
        `https://api.github.com/orgs/${encodeURIComponent(orgName)}/repos?sort=updated&per_page=100`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Update rate limit info
      const rateLimitInfo = extractRateLimitInfo(response);
      setRateLimit(rateLimitInfo);

      // Log warning if rate limit is low
      if (rateLimitInfo.remaining < RATE_LIMIT_WARNING_THRESHOLD && rateLimitInfo.remaining > 0) {
        console.warn(
          `GitHub API rate limit is low: ${rateLimitInfo.remaining}/${rateLimitInfo.limit} remaining. ` +
            `Resets at ${rateLimitInfo.resetAt?.toLocaleTimeString() || "unknown"}`
        );
      }

      if (!response.ok) {
        throw new Error(getErrorMessage(response.status, `Failed to fetch repositories for organization ${orgName}`));
      }

      const data: GitHubRepo[] = await response.json();
      return data;
    },
    [accessToken]
  );

  // Auto-fetch repos and orgs when token becomes available
  useEffect(() => {
    if (accessToken && repositories.length === 0) {
      fetchRepositories();
      fetchUserOrgs();
    }
  }, [accessToken, repositories.length, fetchRepositories, fetchUserOrgs]);

  // Link GitHub account
  const linkGithub = useCallback(() => {
    if (!authenticated) return;
    setIsLinking(true);
    privyLinkGithub();
  }, [authenticated, privyLinkGithub]);

  // Search repositories
  const searchRepos = useCallback(
    (query: string): GitHubRepo[] => {
      if (!query.trim()) return repositories;
      const q = query.toLowerCase();
      return repositories.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.full_name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
      );
    },
    [repositories]
  );

  // Select a repository
  const selectRepo = useCallback((repo: GitHubRepo | null) => setSelectedRepo(repo), []);

  const value: GithubContextValue = {
    isGithubLinked,
    githubUsername,
    githubAvatarUrl,
    hasAccessToken: !!accessToken,
    accessToken,
    repositories,
    isLoadingRepos,
    reposError,
    selectedRepo,
    selectRepo,
    linkGithub,
    refreshRepos: fetchRepositories,
    searchRepos,
    isLinking,
    rateLimit,
    userOrgs,
    fetchOrgRepos,
  };

  return <GithubContext.Provider value={value}>{children}</GithubContext.Provider>;
}

export function useGithubContext(): GithubContextValue {
  return useContext(GithubContext);
}
