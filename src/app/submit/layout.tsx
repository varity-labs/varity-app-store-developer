import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Your Application",
  description:
    "Submit your application to the Varity App Store. Join the trusted marketplace for enterprise Web3 applications and reach thousands of potential users.",
  openGraph: {
    title: "Submit Your Application | Varity App Store",
    description:
      "Submit your application to the Varity App Store. Join the trusted marketplace for enterprise Web3 applications and reach thousands of potential users.",
  },
  twitter: {
    title: "Submit Your Application | Varity App Store",
    description:
      "Submit your application to the Varity App Store. Join the trusted marketplace for enterprise Web3 applications and reach thousands of potential users.",
  },
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
