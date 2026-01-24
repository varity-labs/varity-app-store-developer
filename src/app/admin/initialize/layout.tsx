import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Initialize Contract",
  description:
    "One-time contract initialization for the Varity App Store marketplace. Sets up the first administrator.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function InitializeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
