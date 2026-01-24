import { MetadataRoute } from "next";

// Required for static export
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://developer.store.varity.so";
  const currentDate = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Note: Admin pages are intentionally excluded from sitemap
    // Dynamic app pages could be added via getAllApps() if needed in the future
  ];
}
