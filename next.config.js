/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
  // Required for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/new-blog' : '',
  // Add assetPrefix for static files
  assetPrefix: process.env.NODE_ENV === 'production' ? '/new-blog/' : '',
  // Ensure trailing slash for routes
  trailingSlash: true,
  // Make basePath available at runtime
  publicRuntimeConfig: {
    basePath: process.env.NODE_ENV === 'production' ? '/new-blog' : '',
  },
}

module.exports = nextConfig 