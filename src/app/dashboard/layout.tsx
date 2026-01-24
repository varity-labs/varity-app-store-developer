import type { Metadata } from "next";
import { StructuredData, dashboardPageSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Developer Dashboard",
  description:
    "Manage your submitted applications, track approval status, view revenue analytics, and monitor your 70% earnings share on the Varity Developer Dashboard.",
  keywords: [
    "developer dashboard",
    "app management",
    "application status",
    "revenue tracking",
    "Varity developer",
    "app analytics",
    "submission status",
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
    title: "Developer Dashboard | Varity Developer Portal",
    description:
      "Manage your applications and track performance on the Varity Developer Dashboard.",
    url: "https://developer.store.varity.so/dashboard",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Developer Dashboard | Varity Developer Portal",
    description:
      "Manage your applications and track performance on the Varity Developer Dashboard.",
  },
  alternates: {
    canonical: "https://developer.store.varity.so/dashboard",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={dashboardPageSchema} id="dashboard-page-schema" />
      {children}
    </>
  );
}
