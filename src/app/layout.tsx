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
  metadataBase: new URL("https://store.varity.so"),
  title: {
    default: "Varity App Store - Discover Enterprise Applications",
    template: "%s | Varity App Store",
  },
  description:
    "Discover and deploy enterprise-grade applications with 70-85% lower infrastructure costs. The trusted marketplace for business software.",
  keywords: [
    "app store",
    "enterprise software",
    "business applications",
    "Varity",
    "web3",
    "decentralized apps",
    "blockchain applications",
    "enterprise app marketplace",
    "Web3 marketplace",
    "decentralized application store",
    "infrastructure cost savings",
    "cloud alternative",
    "Arbitrum apps",
    "IPFS hosting",
  ],
  authors: [{ name: "Varity" }],
  creator: "Varity",
  publisher: "Varity",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://store.varity.so",
    siteName: "Varity App Store",
    title: "Varity App Store - Discover Enterprise Applications",
    description:
      "Discover and deploy enterprise-grade applications with 70-85% lower infrastructure costs. The trusted marketplace for business software.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Varity App Store - Enterprise Application Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varity App Store - Discover Enterprise Applications",
    description:
      "Discover and deploy enterprise-grade applications with 70-85% lower infrastructure costs. The trusted marketplace for business software.",
    images: ["/og-image.png"],
    creator: "@VarityHQ",
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
        <StructuredData data={homePageStructuredData} />
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
