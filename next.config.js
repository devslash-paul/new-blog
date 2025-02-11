/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    // Enable remote patterns if you need to load external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure trailing slash for routes
  trailingSlash: true,
}

export default nextConfig; 