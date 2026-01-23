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
};

const GithubContext = createContext<GithubContextValue>(defaultContextValue);

export function GithubProvider({ children }: { children: ReactNode }) {
  const { user, authenticated } = usePrivy();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isLinking, setIsLinking] = useState(false);

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
  };

  return <GithubContext.Provider value={value}>{children}</GithubContext.Provider>;
}

export function useGithubContext(): GithubContextValue {
  return useContext(GithubContext);
}
