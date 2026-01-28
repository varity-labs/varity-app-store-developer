import type { Metadata } from "next";
import { StructuredData, submitPageSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Submit Your Application",
  description:
    "Submit your enterprise application to the Varity App Store. Join 100+ developers, get 70% revenue share, and reach enterprise customers with 24-hour review times.",
  keywords: [
    "submit app",
    "developer submission",
    "enterprise application",
    "app marketplace",
    "Varity developer",
    "web3 app submission",
    "decentralized app store",
    "revenue share",
    "app publishing",
    "GitHub integration",
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
    title: "Submit Your Application | Varity Developer Portal",
    description:
      "Submit your enterprise application to the Varity App Store. Get 70% revenue share, 24-hour review, and access to enterprise customers.",
    url: "https://developer.store.varity.so/submit/",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Submit Your Application to Varity Developer Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit Your Application | Varity Developer Portal",
    description:
      "Submit your enterprise application to the Varity App Store. Get 70% revenue share and 24-hour review times.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "https://developer.store.varity.so/submit/",
  },
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StructuredData data={submitPageSchema} id="submit-page-schema" />
      {children}
    </>
  );
}
