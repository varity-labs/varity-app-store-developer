import { Metadata } from "next";

/**
 * Generates dynamic metadata for the app detail page.
 *
 * Note: This is a placeholder implementation. In production, you would fetch
 * app data from the blockchain here to generate accurate metadata.
 * Since we're using client-side fetching, we provide generic metadata
 * that will be enhanced by structured data in the page component.
 *
 * @param params - Route parameters containing the app ID
 * @returns Metadata object for Next.js
 */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const appId = params.id;

  // In production, you would fetch app data here:
  // const app = await getAppFromContract(appId);

  // For now, use generic metadata with app ID
  const title = `Application #${appId}`;
  const description = `View detailed information about application #${appId} on the Varity App Store, including features, screenshots, and developer information.`;
  const url = `https://developer.store.varity.so/app/${appId}`;

  return {
    title,
    description,
    keywords: [
      "enterprise application",
      "web3 app",
      "decentralized app",
      "Varity app store",
      "app details",
      `app ${appId}`,
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${title} | Varity Developer Portal`,
      description,
      type: "website",
      url,
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: `Application #${appId} - Varity App Store`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Varity Developer Portal`,
      description,
      images: ["/og-image.svg"],
    },
    alternates: {
      canonical: url,
    },
  };
}

// Generate static params for app IDs at build time
// This creates static HTML shells for app detail pages
// Actual data is fetched client-side from the blockchain
export async function generateStaticParams() {
  // Generate pages for first 100 potential app IDs
  // This covers initial apps and allows for growth without constant rebuilds
  return Array.from({ length: 100 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export default function AppDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
