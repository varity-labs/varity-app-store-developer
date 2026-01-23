"use client";

import { useState, useEffect, useCallback } from "react";

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

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
}

interface UseGithubReturn {
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
}

// Default values for when hooks can't be used
const defaultReturn: UseGithubReturn = {
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
};

export function useGithub(): UseGithubReturn {
  const [mounted, setMounted] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [privyState, setPrivyState] = useState<{
    user: any;
    authenticated: boolean;
    linkGithub: () => void;
  } | null>(null);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);

    // Try to restore token from session storage
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("varity_github_token");
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }
  }, []);

  // Dynamically import and use Privy hooks after mount
  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;

    const initPrivy = async () => {
      try {
        const { usePrivy, useLinkAccount, useOAuthTokens } = await import("@privy-io/react-auth");

        // Note: We can't actually call hooks here since this is inside useEffect
        // This dynamic approach won't work for hooks
        // Instead, we need the user to be within a PrivyProvider context
      } catch (error) {
        console.warn("Privy not available for GitHub integration");
      }
    };

    initPrivy();

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  // Fetch repositories from GitHub API
  const fetchRepositories = useCallback(async () => {
    if (!accessToken) return;
    setIsLoadingRepos(true);
    setReposError(null);
    try {
      const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      setReposError(error instanceof Error ? error.message : "Failed to fetch repositories");
    } finally {
      setIsLoadingRepos(false);
    }
  }, [accessToken]);

  // Auto-fetch repos when token becomes available
  useEffect(() => {
    if (accessToken && repositories.length === 0) {
      fetchRepositories();
    }
  }, [accessToken, repositories.length, fetchRepositories]);

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

  // Link GitHub - placeholder that will be overridden by Privy integration
  const linkGithub = useCallback(() => {
    console.log("GitHub linking requires Privy authentication");
  }, []);

  // If not mounted yet, return defaults
  if (!mounted) {
    return defaultReturn;
  }

  return {
    isGithubLinked: false, // Will be updated when we integrate with Privy properly
    githubUsername: null,
    githubAvatarUrl: null,
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
  };
}

export function formatRelativeTime(dateString: string): string {
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Solidity: "#AA6746",
  Java: "#b07219",
};

export function getLanguageColor(language: string | null): string {
  return language ? languageColors[language] || "#8b949e" : "#8b949e";
}
