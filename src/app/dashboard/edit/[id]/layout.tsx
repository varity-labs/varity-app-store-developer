import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Edit Application",
  description:
    "Update your application details, description, screenshots, and URLs on the Varity Developer Portal.",
  keywords: [
    "edit app",
    "update application",
    "app management",
    "developer tools",
    "Varity developer",
  ],
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: "Edit Application | Varity Developer Portal",
    description: "Update your application details on the Varity Developer Portal.",
    type: "website",
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
