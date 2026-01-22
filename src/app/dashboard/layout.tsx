import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Dashboard",
  description:
    "Manage your applications on the Varity App Store. Track submission status, view analytics, and update your app listings.",
  openGraph: {
    title: "Developer Dashboard | Varity App Store",
    description:
      "Manage your applications on the Varity App Store. Track submission status, view analytics, and update your app listings.",
  },
  twitter: {
    title: "Developer Dashboard | Varity App Store",
    description:
      "Manage your applications on the Varity App Store. Track submission status, view analytics, and update your app listings.",
  },
  robots: {
    index: false, // Don't index personal dashboards
    follow: true,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
