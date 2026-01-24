import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Administrative dashboard for reviewing and managing application submissions on the Varity App Store marketplace.",
  keywords: [
    "admin dashboard",
    "app review",
    "marketplace management",
    "application approval",
  ],
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "Admin Dashboard | Varity Developer Portal",
    description: "Administrative dashboard for managing app submissions.",
    url: "https://developer.store.varity.so/admin",
    type: "website",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
