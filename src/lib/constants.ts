// Varity App Store Constants

// Varity L3 Network Configuration
export const VARITY_L3 = {
  id: 33529,
  name: "Varity L3 Testnet",
  nativeCurrency: {
    name: "Bridged USDC",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Varity Explorer",
      url: "https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz",
    },
  },
} as const;

// App Categories - Enterprise-focused, user-friendly terminology
export const APP_CATEGORIES = [
  "Business Tools",
  "Analytics",
  "Finance",
  "Developer Tools",
  "Productivity",
  "Infrastructure",
  "Communication",
  "Data Management",
  "Security",
  "Other",
] as const;

export type AppCategory = (typeof APP_CATEGORIES)[number];

// Supported Chains for apps (apps can be deployed on any of these)
export const SUPPORTED_CHAINS = [
  { id: 33529, name: "Varity L3" },
  { id: 421614, name: "Arbitrum Sepolia" },
  { id: 42161, name: "Arbitrum One" },
  { id: 1, name: "Ethereum Mainnet" },
  { id: 137, name: "Polygon" },
  { id: 10, name: "Optimism" },
  { id: 8453, name: "Base" },
] as const;

// App Status
export const APP_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type AppStatus = (typeof APP_STATUS)[keyof typeof APP_STATUS];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// App Interface matching contract storage
export interface AppData {
  id: bigint;
  name: string;
  description: string;
  appUrl: string;
  logoUrl: string;
  category: string;
  chainId: bigint;
  developer: `0x${string}`;
  isActive: boolean;
  isApproved: boolean;
  createdAt: bigint;
  builtWithVarity: boolean;
  githubUrl: string;
  screenshotCount: bigint;
  screenshots?: string[];
}

// Form validation
export const VALIDATION = {
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  MAX_SCREENSHOTS: 5,
} as const;
