import Script from "next/script";

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Structured data for the Varity App Store homepage
export const homePageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Varity App Store",
  url: "https://store.varity.so",
  description:
    "Discover and deploy enterprise-grade applications with 70-85% lower infrastructure costs. The trusted marketplace for business software.",
  publisher: {
    "@type": "Organization",
    name: "Varity",
    url: "https://varity.so",
    logo: {
      "@type": "ImageObject",
      url: "https://store.varity.so/logo/varity-logo-color.svg",
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://store.varity.so/?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// Structured data for app listings (can be used on app detail pages)
export function createAppStructuredData(app: {
  name: string;
  description: string;
  appUrl: string;
  logoUrl: string;
  category: string;
  developer: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    url: app.appUrl,
    image: app.logoUrl,
    applicationCategory: app.category,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: app.developer,
    },
  };
}
