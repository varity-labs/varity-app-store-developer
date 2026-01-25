import { Metadata } from "next";
import { ReactNode } from "react";

/**
 * Metadata for the Edit Application page
 * Comprehensive SEO with noindex (private page), but follow for internal linking
 */
export const metadata: Metadata = {
  title: "Edit Application | Varity Developer Portal",
  description:
    "Update your application details, description, screenshots, social links, legal documents, and URLs on the Varity Developer Portal. Manage your app listing with real-time preview and auto-save.",
  keywords: [
    "edit app",
    "update application",
    "app management",
    "developer tools",
    "Varity developer",
    "app store",
    "web3 apps",
    "decentralized apps",
    "dapp management",
  ],
  robots: {
    index: false, // Private page - no indexing
    follow: true, // Allow following internal links
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: "Edit Application | Varity Developer Portal",
    description: "Update your application details on the Varity Developer Portal.",
    type: "website",
    siteName: "Varity Developer Portal",
  },
  twitter: {
    card: "summary",
    title: "Edit Application | Varity Developer Portal",
    description: "Update your application details on the Varity Developer Portal.",
  },
};

export async function generateStaticParams() {
  // Generate pages for first 100 potential app IDs
  // This covers initial apps and allows for growth without constant rebuilds
  return Array.from({ length: 100 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export default function EditAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
