import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Required for 4everland/IPFS deployment
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig;
