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

// Enhanced Organization schema with E-E-A-T signals
const organizationSchema = {
  "@type": "Organization",
  "@id": "https://varity.so/#organization",
  name: "Varity",
  legalName: "Varity Labs, Inc.",
  url: "https://varity.so",
  logo: {
    "@type": "ImageObject",
    url: "https://developer.store.varity.so/logo/varity-logo-color.svg",
    width: 512,
    height: 512,
  },
  image: "https://developer.store.varity.so/og-image.svg",
  description:
    "Varity is a Web3 operating system that enables developers to deploy applications with 70-85% cost savings compared to traditional cloud providers.",
  slogan: "Keep 70% of Your Revenue. Launch in 24 Hours.",
  foundingDate: "2024",
  email: "support@varity.so",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@varity.so",
      availableLanguage: ["English"],
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "hello@varity.so",
      availableLanguage: ["English"],
    },
  ],
  sameAs: [
    "https://x.com/VarityHQ",
    "https://discord.gg/Uhjx6yhJ",
    "https://www.linkedin.com/company/varity-labs",
    "https://github.com/varity-labs",
    "https://www.reddit.com/r/varityHQ",
    "https://www.youtube.com/@VarityHQ",
  ],
  knowsAbout: [
    "Web3 Development",
    "Blockchain Technology",
    "Decentralized Applications",
    "Smart Contracts",
    "Developer Tools",
    "App Marketplace",
    "Arbitrum",
    "IPFS",
    "Decentralized Compute",
  ],
  areaServed: {
    "@type": "GeoShape",
    name: "Worldwide",
  },
};

// Enhanced Website schema with search action for sitelinks search box
const websiteSchema = {
  "@type": "WebSite",
  "@id": "https://developer.store.varity.so/#website",
  name: "Varity Developer Portal",
  alternateName: "Varity App Store Developer Portal",
  url: "https://developer.store.varity.so",
  description:
    "Submit and manage your enterprise applications on the Varity App Store. Get 70% revenue share and access to enterprise customers.",
  publisher: {
    "@id": "https://varity.so/#organization",
  },
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://store.varity.so/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// WebApplication schema for the Developer Portal itself
const webApplicationSchema = {
  "@type": "WebApplication",
  "@id": "https://developer.store.varity.so/#application",
  name: "Varity Developer Portal",
  description:
    "Submit and manage your Web3 applications on the Varity App Store. Get 70% revenue share, 24-hour review, and 70-85% infrastructure cost savings.",
  url: "https://developer.store.varity.so",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  browserRequirements: "Requires JavaScript, modern browser (Chrome, Firefox, Safari, Edge)",
  softwareVersion: "1.0.0",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "App submission with GitHub integration",
    "70% developer revenue share",
    "24-hour review process",
    "Developer dashboard with analytics",
    "Wallet and email authentication",
    "Screenshot and logo management",
  ],
  screenshot: {
    "@type": "ImageObject",
    url: "https://developer.store.varity.so/og-image.svg",
  },
  provider: {
    "@id": "https://varity.so/#organization",
  },
  isAccessibleForFree: true,
};

// HowTo schema for app submission process (critical for rich snippets)
export const howToSubmitAppSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Submit an App to the Varity App Store",
  description:
    "Step-by-step guide to submit your Web3 or enterprise application to the Varity App Store and start earning 70% revenue share.",
  totalTime: "PT10M",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: "0",
  },
  supply: [
    {
      "@type": "HowToSupply",
      name: "Application URL",
    },
    {
      "@type": "HowToSupply",
      name: "App Logo (256x256px minimum)",
    },
    {
      "@type": "HowToSupply",
      name: "Screenshots (optional, up to 5)",
    },
  ],
  tool: [
    {
      "@type": "HowToTool",
      name: "Web Browser",
    },
    {
      "@type": "HowToTool",
      name: "Wallet or Email Account",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Sign In",
      text: "Connect using email, social login (Google, Discord), or wallet connection (MetaMask, WalletConnect).",
      url: "https://developer.store.varity.so/submit/",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter Basic Information",
      text: "Fill in your app name (3-50 characters), description (20-500 characters), application URL, and select a category.",
      url: "https://developer.store.varity.so/submit/",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Add Media",
      text: "Upload your app logo (256x256px minimum, PNG with transparent background) and add up to 5 screenshots.",
      url: "https://developer.store.varity.so/submit/",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Add Developer Information",
      text: "Enter your company name, website, social links, privacy policy URL, and terms of service URL.",
      url: "https://developer.store.varity.so/submit/",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Submit for Review",
      text: "Review your submission and click Submit. Most apps are reviewed within 24 hours.",
      url: "https://developer.store.varity.so/submit/",
    },
  ],
};

// Developer portal specific schema
const developerPortalSchema = {
  "@type": "WebPage",
  "@id": "https://developer.store.varity.so/#webpage",
  name: "Varity Developer Portal - Submit & Manage Your Apps",
  url: "https://developer.store.varity.so/",
  description:
    "Submit your enterprise applications to the Varity App Store. Get 70% revenue share, 24-hour review, and access to enterprise customers.",
  isPartOf: {
    "@id": "https://developer.store.varity.so/#website",
  },
  about: {
    "@id": "https://varity.so/#organization",
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", ".text-body-lg"],
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://developer.store.varity.so/",
      },
    ],
  },
};

// Combined homepage structured data (includes all schemas for rich results)
export const homePageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    websiteSchema,
    developerPortalSchema,
    webApplicationSchema,
  ],
};

// Submit page schema (includes HowTo for rich snippets)
export const submitPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    websiteSchema,
    {
      "@type": "WebPage",
      "@id": "https://developer.store.varity.so/submit/#webpage",
      name: "Submit Your Application - Varity Developer Portal",
      url: "https://developer.store.varity.so/submit/",
      description:
        "Submit your enterprise application to the Varity App Store. Simple submission process with GitHub integration. Get 70% revenue share.",
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
            item: "https://developer.store.varity.so/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Submit Application",
            item: "https://developer.store.varity.so/submit/",
          },
        ],
      },
      mainEntity: {
        "@type": "HowTo",
        name: "How to Submit an App to the Varity App Store",
        description:
          "Step-by-step guide to submit your Web3 or enterprise application to the Varity App Store.",
        totalTime: "PT10M",
        estimatedCost: {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: "0",
        },
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Sign In",
            text: "Connect using email, social login, or wallet connection.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter App Details",
            text: "Fill in your app name, description, URL, and category.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Add Media",
            text: "Upload logo and screenshots to showcase your app.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Submit for Review",
            text: "Submit and wait for approval within 24 hours.",
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
      "@id": "https://developer.store.varity.so/dashboard/#webpage",
      name: "Developer Dashboard - Varity Developer Portal",
      url: "https://developer.store.varity.so/dashboard/",
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
            item: "https://developer.store.varity.so/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Dashboard",
            item: "https://developer.store.varity.so/dashboard/",
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
        "@id": `https://developer.store.varity.so/app/${appId}/#webpage`,
        name: `${app.name} - Varity Developer Portal`,
        url: `https://developer.store.varity.so/app/${appId}/`,
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
              item: "https://developer.store.varity.so/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Dashboard",
              item: "https://developer.store.varity.so/dashboard/",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: app.name,
              item: `https://developer.store.varity.so/app/${appId}/`,
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

// Developer Portal landing page FAQ data (comprehensive for SEO)
export const developerFAQData: FAQItem[] = [
  {
    question: "How do I submit an app to the Varity App Store?",
    answer:
      "Sign in with your wallet or email, fill out the submission form with your app details, and submit for review. Most apps are reviewed within 24 hours.",
  },
  {
    question: "What is the revenue share for developers?",
    answer:
      "Developers receive 70% of all revenue generated by their applications. Varity retains 30% to cover infrastructure and platform costs. This is significantly better than traditional app stores where platforms often take 30% and you still pay hosting costs.",
  },
  {
    question: "How long does the review process take?",
    answer:
      "Most applications are reviewed within 24 hours. Complex applications may take up to 48 hours. You'll receive an email notification once your app is approved or if changes are needed.",
  },
  {
    question: "What are the infrastructure cost savings?",
    answer:
      "Developers can save 70-85% on infrastructure costs compared to traditional cloud providers like AWS, Google Cloud, or Azure. Varity uses decentralized compute (Akash Network) and storage (IPFS/Filecoin) for significant cost reductions.",
  },
  {
    question: "Can I update my app after it's approved?",
    answer:
      "Yes, you can update your app's description, screenshots, and URLs through the Developer Dashboard. Major changes may require re-review.",
  },
  {
    question: "What types of apps can I submit to Varity?",
    answer:
      "Varity accepts Web3 dApps, enterprise applications, SaaS products, developer tools, and other web-based software. Apps must comply with our terms of service and not contain malicious code. Both blockchain-native and traditional web apps are welcome.",
  },
  {
    question: "Do I need blockchain development experience?",
    answer:
      "No. While Varity is built on Web3 infrastructure, you can submit any web application. Blockchain features like wallet integration and smart contract interaction are optional. Our platform handles the decentralized hosting automatically.",
  },
  {
    question: "How do payments and payouts work?",
    answer:
      "Payments are processed on the Varity L3 blockchain using Bridged USDC. Revenue is automatically split via smart contracts with instant settlement—70% to developers, 30% to the platform. All transactions are transparent and auditable on the blockchain.",
  },
];
