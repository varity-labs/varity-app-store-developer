import type { Metadata, Viewport } from "next";
import { fontClasses } from "@/lib/fonts";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StructuredData, homePageStructuredData } from "@/components/StructuredData";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030712",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://developer.store.varity.so"),
  title: {
    default: "Varity Developer Portal - Submit & Manage Your Apps",
    template: "%s | Varity Developer Portal",
  },
  description:
    "Submit your enterprise applications to the Varity App Store. Get 70% revenue share, 24-hour review, and access to enterprise customers. Join 100+ developers.",
  keywords: [
    "developer portal",
    "app submission",
    "enterprise software",
    "Varity",
    "web3 development",
    "app marketplace",
    "developer dashboard",
    "app publishing",
    "Web3 marketplace",
    "decentralized apps",
    "infrastructure cost savings",
    "revenue share",
    "app store submission",
    "enterprise app marketplace",
  ],
  authors: [{ name: "Varity" }],
  creator: "Varity",
  publisher: "Varity",
  category: "technology",
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
  verification: {
    google: "google-site-verification-code-here",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://developer.store.varity.so",
    siteName: "Varity Developer Portal",
    title: "Varity Developer Portal - Submit & Manage Your Apps",
    description:
      "Submit your enterprise applications to the Varity App Store. Get 70% revenue share, 24-hour review, and access to enterprise customers.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Varity Developer Portal - Submit Your Enterprise Applications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VarityHQ",
    creator: "@VarityHQ",
    title: "Varity Developer Portal - Submit & Manage Your Apps",
    description:
      "Submit your enterprise applications to the Varity App Store. Get 70% revenue share, 24-hour review, and access to enterprise customers.",
    images: ["/og-image.svg"],
  },
  alternates: {
    canonical: "https://developer.store.varity.so",
  },
  other: {
    "ai-content-declaration": "factual-informational",
    "ai-generated": "false",
    "llms-txt": "https://developer.store.varity.so/llms.txt",
    "ai-txt": "https://developer.store.varity.so/ai.txt",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo/varity-logo-color.svg", sizes: "any", type: "image/svg+xml" }
    ],
    shortcut: "/favicon.svg",
    apple: "/logo/varity-logo-color.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz" />
        <StructuredData data={homePageStructuredData} id="homepage-schema" />
      </head>
      <body className={`${fontClasses} antialiased min-h-screen bg-background text-foreground`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
