import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  // Disable server-side features not needed for static sites
  trailingSlash: true,
};

export default nextConfig;
