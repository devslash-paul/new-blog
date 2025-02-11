import type { NextConfig } from "next";

const config: NextConfig = {
  output: 'export',  // Enable static exports
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable server-side features not needed for static sites
  trailingSlash: true,
  experimental: {
    esmExternals: true,
  },
};

export default config;
