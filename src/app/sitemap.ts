import { MetadataRoute } from "next";

// Required for static export
export const dynamic = "force-static";

/**
 * XML Sitemap for SEO and search engine indexing
 *
 * Best practices implemented:
 * - All URLs use trailing slashes for consistency
 * - lastModified uses ISO 8601 format
 * - Priority reflects page importance hierarchy
 * - Admin and API routes are excluded
 * - AI-friendly files (llms.txt) are included
 *
 * Note: Google ignores changeFrequency and priority, but other search engines may use them
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://developer.store.varity.so";
  const currentDate = new Date().toISOString();

  // Core pages with SEO-optimized metadata
  const corePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/submit/`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard/`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // AI-friendly content files
  const aiPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/llms-full.txt`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  // Future: Add dynamic app pages when app listing is implemented
  // Example:
  // const appPages: MetadataRoute.Sitemap = apps.map((app) => ({
  //   url: `${baseUrl}/app/${app.id}/`,
  //   lastModified: app.updatedAt || currentDate,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.7,
  // }));

  return [...corePages, ...aiPages];
}
