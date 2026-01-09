import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow dev access from your local network IP (adjust if this changes)
  allowedDevOrigins: ["http://172.26.176.1:3000"],
  // Ensure edge runtime is used where specified
  experimental: {
    // This helps ensure edge runtime works properly
  },
};

export default nextConfig;
