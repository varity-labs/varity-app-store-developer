import Script from "next/script";

interface StructuredDataProps {
  data: Record<string, unknown>;
  id?: string;
}

export function StructuredData({ data, id = "structured-data" }: StructuredDataProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization schema with social profiles
const organizationSchema = {
  "@type": "Organization",
  "@id": "https://varity.so/#organization",
  name: "Varity",
  url: "https://varity.so",
  logo: {
    "@type": "ImageObject",
    url: "https://developer.store.varity.so/logo/varity-logo-color.svg",
    width: 512,
    height: 512,
  },
  description:
    "Varity is a Web3 operating system that enables developers to deploy applications with 70-85% cost savings compared to traditional cloud providers.",
  email: "hello@varity.so",
  sameAs: [
    "https://x.com/VarityHQ",
    "https://discord.gg/Uhjx6yhJ",
    "https://www.linkedin.com/company/varity-labs",
    "https://github.com/varity-labs",
    "https://www.reddit.com/r/varityHQ",
    "https://www.youtube.com/@VarityHQ",
  ],
};

// Website schema with search action
const websiteSchema = {
  "@type": "WebSite",
  "@id": "https://developer.store.varity.so/#website",
  name: "Varity Developer Portal",
  url: "https://developer.store.varity.so",
  description:
    "Submit and manage your enterprise applications on the Varity App Store. Get 70% revenue share and access to enterprise customers.",
  publisher: {
    "@id": "https://varity.so/#organization",
  },
  inLanguage: "en-US",
};

// Developer portal specific schema
const developerPortalSchema = {
  "@type": "WebPage",
  "@id": "https://developer.store.varity.so/#webpage",
  name: "Varity Developer Portal - Submit & Manage Your Apps",
  url: "https://developer.store.varity.so",
  description:
    "Submit your enterprise applications to the Varity App Store. Get 70% revenue share, 24-hour review, and access to enterprise customers.",
  isPartOf: {
    "@id": "https://developer.store.varity.so/#website",
  },
  about: {
    "@id": "https://varity.so/#organization",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://developer.store.varity.so",
      },
    ],
  },
};

// Combined homepage structured data
export const homePageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, websiteSchema, developerPortalSchema],
};

// Submit page schema
export const submitPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    websiteSchema,
    {
      "@type": "WebPage",
      "@id": "https://developer.store.varity.so/submit#webpage",
      name: "Submit Your Application - Varity Developer Portal",
      url: "https://developer.store.varity.so/submit",
      description:
        "Submit your enterprise application to the Varity App Store. Simple submission process with GitHub integration.",
      isPartOf: {
        "@id": "https://developer.store.varity.so/#website",
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://developer.store.varity.so",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Submit Application",
            item: "https://developer.store.varity.so/submit",
          },
        ],
      },
    },
  ],
};

// Dashboard page schema
export const dashboardPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    websiteSchema,
    {
      "@type": "WebPage",
      "@id": "https://developer.store.varity.so/dashboard#webpage",
      name: "Developer Dashboard - Varity Developer Portal",
      url: "https://developer.store.varity.so/dashboard",
      description:
        "Manage your submitted applications, track status, and view analytics on the Varity Developer Dashboard.",
      isPartOf: {
        "@id": "https://developer.store.varity.so/#website",
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://developer.store.varity.so",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Dashboard",
            item: "https://developer.store.varity.so/dashboard",
          },
        ],
      },
    },
  ],
};

// App detail page schema types
export interface AppSchemaData {
  id: string;
  name: string;
  description: string;
  appUrl: string;
  logoUrl: string;
  category: string;
  developer: string;
  companyName?: string;
  screenshots?: string[];
  datePublished?: string;
  featureList?: string[];
  website?: string;
  twitter?: string;
  linkedin?: string;
}

// Structured data for app listings (can be used on app detail pages)
export function createAppStructuredData(app: AppSchemaData) {
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
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Organization",
      name: app.companyName || app.developer,
      url: app.website,
    },
    ...(app.screenshots &&
      app.screenshots.length > 0 && {
        screenshot: app.screenshots.map((url) => ({
          "@type": "ImageObject",
          url,
        })),
      }),
    ...(app.datePublished && { datePublished: app.datePublished }),
    ...(app.featureList &&
      app.featureList.length > 0 && { featureList: app.featureList }),
    provider: {
      "@id": "https://varity.so/#organization",
    },
  };
}

// Create full app detail page schema with breadcrumbs
export function createAppDetailPageSchema(app: AppSchemaData, appId: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      websiteSchema,
      {
        "@type": "WebPage",
        "@id": `https://developer.store.varity.so/app/${appId}#webpage`,
        name: `${app.name} - Varity Developer Portal`,
        url: `https://developer.store.varity.so/app/${appId}`,
        description: app.description,
        isPartOf: {
          "@id": "https://developer.store.varity.so/#website",
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://developer.store.varity.so",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Dashboard",
              item: "https://developer.store.varity.so/dashboard",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: app.name,
              item: `https://developer.store.varity.so/app/${appId}`,
            },
          ],
        },
        mainEntity: createAppStructuredData(app),
      },
    ],
  };
}

// FAQ Schema for help/support pages
export interface FAQItem {
  question: string;
  answer: string;
}

export function createFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Developer Portal landing page FAQ data
export const developerFAQData: FAQItem[] = [
  {
    question: "How do I submit an app to the Varity App Store?",
    answer:
      "Sign in with your wallet or email, fill out the submission form with your app details, and submit for review. Most apps are reviewed within 24 hours.",
  },
  {
    question: "What is the revenue share for developers?",
    answer:
      "Developers receive 70% of all revenue generated by their applications. Varity retains 30% to cover infrastructure and platform costs.",
  },
  {
    question: "How long does the review process take?",
    answer:
      "Most applications are reviewed within 24 hours. Complex applications may take up to 48 hours. You'll receive an email notification once your app is approved or if changes are needed.",
  },
  {
    question: "What are the infrastructure cost savings?",
    answer:
      "Developers can save 70-85% on infrastructure costs compared to traditional cloud providers like AWS. Varity uses decentralized compute and storage for significant cost reductions.",
  },
  {
    question: "Can I update my app after it's approved?",
    answer:
      "Yes, you can update your app's description, screenshots, and URLs through the Developer Dashboard. Major changes may require re-review.",
  },
];
