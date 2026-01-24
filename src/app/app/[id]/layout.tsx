import { Metadata } from "next";

// Default metadata for app detail pages
// Dynamic metadata should be added when server-side data fetching is available
export const metadata: Metadata = {
  title: "Application Details",
  description:
    "View detailed information about this enterprise application on the Varity App Store, including features, screenshots, and developer information.",
  keywords: [
    "enterprise application",
    "web3 app",
    "decentralized app",
    "Varity app store",
    "app details",
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
    title: "Application Details | Varity Developer Portal",
    description:
      "View detailed information about this enterprise application on the Varity App Store.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Application Details | Varity Developer Portal",
    description:
      "View detailed information about this enterprise application on the Varity App Store.",
  },
};

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
