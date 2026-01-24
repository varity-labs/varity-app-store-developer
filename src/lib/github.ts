/**
 * GitHub types and utilities for the Varity App Store
 *
 * Extracted from the broken useGithub hook. These are pure utilities
 * with no React hooks - they can be safely used anywhere.
 *
 * For GitHub OAuth integration, use the GithubContext from @/contexts/GithubContext
 */

/**
 * GitHub repository data structure from the GitHub API
 */
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

/**
 * GitHub user data structure from the GitHub API
 */
export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
}

/**
 * Language colors for displaying repository languages
 * Based on GitHub's linguist colors
 */
export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Solidity: "#AA6746",
  Java: "#b07219",
  Ruby: "#701516",
  PHP: "#4F5D95",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

/**
 * Get the color for a programming language
 * @param language - The programming language name
 * @returns The hex color code for the language, or a default gray
 */
export function getLanguageColor(language: string | null): string {
  return language ? languageColors[language] || "#8b949e" : "#8b949e";
}

/**
 * Format a date string to a human-readable relative time
 * @param dateString - ISO date string
 * @returns Human-readable relative time (e.g., "2 days ago", "3 weeks ago")
 */
export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
