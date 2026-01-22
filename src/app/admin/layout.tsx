import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Review",
  description: "Varity App Store admin panel for reviewing and managing application submissions.",
  robots: {
    index: false, // Don't index admin pages
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
