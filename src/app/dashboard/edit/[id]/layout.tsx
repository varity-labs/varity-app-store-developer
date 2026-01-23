import { ReactNode } from "react";

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
