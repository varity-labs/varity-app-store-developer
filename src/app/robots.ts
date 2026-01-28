import { MetadataRoute } from "next";

// Required for static export
export const dynamic = "force-static";

/**
 * Robots.txt configuration for SEO and AI crawler access
 *
 * This configuration:
 * - Allows all standard search engine crawlers
 * - Explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
 * - Blocks admin and API routes from indexing
 * - References the sitemap for crawlers
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://developer.store.varity.so";

  return {
    rules: [
      // Default rule for all crawlers
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // OpenAI's GPTBot - Training data collection
      {
        userAgent: "GPTBot",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // OpenAI's ChatGPT-User - On-demand web browsing
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // OpenAI's SearchBot - ChatGPT Search indexing
      {
        userAgent: "OAI-SearchBot",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // Anthropic's ClaudeBot - Training data collection
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // Anthropic's Claude-SearchBot - Search result improvement
      {
        userAgent: "Claude-SearchBot",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // Anthropic's Claude-User - User-requested page fetching
      {
        userAgent: "Claude-User",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // Perplexity AI Search
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // Google's Extended crawler for Gemini training
      {
        userAgent: "Google-Extended",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // Cohere AI crawler
      {
        userAgent: "cohere-ai",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // Meta AI crawler
      {
        userAgent: "meta-externalagent",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
      // Microsoft Copilot
      {
        userAgent: "Applebot-Extended",
        allow: ["/", "/submit/", "/dashboard/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/admin/", "/api/", "/_next/", "/private/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
