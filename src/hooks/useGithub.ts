"use client";

import { useGithubContext, GitHubRepo } from "@/contexts/GithubContext";

// Re-export types from context
export type { GitHubRepo } from "@/contexts/GithubContext";

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
}

// Main hook - uses the GithubContext
export function useGithub() {
  return useGithubContext();
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
