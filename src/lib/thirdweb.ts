// thirdweb client configuration for Varity App Store
import { createThirdwebClient, defineChain } from "thirdweb";

// Create thirdweb client (function-based v5 API)
export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id",
});

// Define Varity L3 chain
export const varityL3 = defineChain({
  id: 33529,
  name: "Varity L3 Testnet",
  nativeCurrency: {
    name: "Bridged USDC",
    symbol: "USDC",
    decimals: 6, // CRITICAL: USDC uses 6 decimals, NOT 18
  },
  rpc: "https://rpc-varity-testnet-rroe52pwjp.t.conduit.xyz",
  blockExplorers: [
    {
      name: "Varity Explorer",
      url: "https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz",
    },
  ],
  testnet: true,
});

// Supported chains for app deployment
export const supportedChains = [
  varityL3,
  defineChain({ id: 421614, name: "Arbitrum Sepolia", rpc: "https://sepolia-rollup.arbitrum.io/rpc", testnet: true }),
  defineChain({ id: 42161, name: "Arbitrum One", rpc: "https://arb1.arbitrum.io/rpc" }),
  defineChain({ id: 8453, name: "Base", rpc: "https://mainnet.base.org" }),
  defineChain({ id: 137, name: "Polygon", rpc: "https://polygon-rpc.com" }),
  defineChain({ id: 10, name: "Optimism", rpc: "https://mainnet.optimism.io" }),
];

export function getChainById(chainId: number) {
  return supportedChains.find((c) => c.id === chainId) || varityL3;
}
