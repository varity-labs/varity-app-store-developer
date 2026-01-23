// Smart contract configuration for Varity App Registry
import { getContract } from "thirdweb";
import { thirdwebClient, varityL3 } from "./thirdweb";

// Contract address - hardcoded for static export reliability
// Deployed on Varity L3 Testnet (Chain ID: 33529)
export const VARITY_APP_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_VARITY_REGISTRY_ADDRESS || "0x3faa42a8639fcb076160d553e8d6e05add7d97a5") as `0x${string}`;

// Get the VarityAppRegistry contract instance
export function getRegistryContract() {
  return getContract({
    client: thirdwebClient,
    chain: varityL3,
    address: VARITY_APP_REGISTRY_ADDRESS,
  });
}

// Contract ABI for the VarityAppRegistry (generated from Rust contract)
export const REGISTRY_ABI = [
  // Read functions
  {
    name: "get_app",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "logo_url", type: "string" },
      { name: "category", type: "string" },
      { name: "chain_id", type: "uint256" },
      { name: "developer", type: "address" },
      { name: "is_active", type: "bool" },
      { name: "is_approved", type: "bool" },
      { name: "created_at", type: "uint256" },
      { name: "built_with_varity", type: "bool" },
      { name: "github_url", type: "string" },
      { name: "screenshot_count", type: "uint256" },
    ],
  },
  {
    name: "get_all_apps",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_apps_by_category",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "category", type: "string" },
      { name: "max_results", type: "uint64" },
    ],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_apps_by_chain",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "chain_id", type: "uint256" },
      { name: "max_results", type: "uint64" },
    ],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_apps_by_developer",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "developer", type: "address" },
      { name: "max_results", type: "uint64" },
    ],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_featured_apps",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_pending_apps",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "max_results", type: "uint64" }],
    outputs: [{ name: "app_ids", type: "uint64[]" }],
  },
  {
    name: "get_app_screenshot",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "index", type: "uint64" },
    ],
    outputs: [{ name: "url", type: "string" }],
  },
  {
    name: "is_admin",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "address", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "get_total_apps",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Write functions
  {
    name: "register_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "logo_url", type: "string" },
      { name: "category", type: "string" },
      { name: "chain_id", type: "uint256" },
      { name: "built_with_varity", type: "bool" },
      { name: "github_url", type: "string" },
      { name: "screenshot_urls", type: "string[]" },
    ],
    outputs: [{ name: "app_id", type: "uint64" }],
  },
  {
    name: "update_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "description", type: "string" },
      { name: "app_url", type: "string" },
      { name: "screenshot_urls", type: "string[]" },
    ],
    outputs: [],
  },
  {
    name: "deactivate_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
  },
  {
    name: "approve_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
  },
  {
    name: "reject_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "app_id", type: "uint64" },
      { name: "reason", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "feature_app",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "app_id", type: "uint64" }],
    outputs: [],
  },
  // Events
  {
    name: "AppRegistered",
    type: "event",
    inputs: [
      { name: "app_id", type: "uint64", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "category", type: "string", indexed: false },
      { name: "chain_id", type: "uint64", indexed: false },
    ],
  },
  {
    name: "AppApproved",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
  {
    name: "AppRejected",
    type: "event",
    inputs: [
      { name: "app_id", type: "uint64", indexed: true },
      { name: "reason", type: "string", indexed: false },
    ],
  },
  {
    name: "AppUpdated",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
  {
    name: "AppDeactivated",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
  {
    name: "AppFeatured",
    type: "event",
    inputs: [{ name: "app_id", type: "uint64", indexed: true }],
  },
] as const;
