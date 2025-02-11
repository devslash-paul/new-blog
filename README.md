# Static Website with Dynamic Components

This is a modern static website built with Next.js that supports dynamic client-side components while being fully static-site-generation (SSG) compatible.

## Features

- 📱 Responsive design with Tailwind CSS
- 🌙 Dark mode support
- ⚡ Client-side dynamic components
- 🎯 TypeScript for type safety
- 📦 Static site export capability

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create a static export of your site:

```bash
npm run build
```

This will create an `out` directory with your static site. You can deploy this directory to any static hosting service like:

- GitHub Pages
- Netlify
- Vercel
- Amazon S3
- Cloudflare Pages

## Development

- Edit pages in the `src/app` directory
- Add components in the `src/components` directory
- Modify styles in the Tailwind configuration or component classes

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

# Paul Thompson's Blog

A personal blog built with Next.js.

## Hosting on GitHub Pages (Private Repository)

### 1. Configure Next.js for Static Export

Add the following to your `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Required for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/new-blog' : '',
}

module.exports = nextConfig
```

### 2. Set Up GitHub Actions

Create `.github/workflows/deploy.yml` with:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Configure GitHub Repository

1. Go to your repository's Settings
2. Navigate to "Pages" in the sidebar
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
4. Under "Branch":
   - Select "gh-pages" (will be created by the action)

### 4. Add Build Script

In your `package.json`, ensure you have:

```json
{
  "scripts": {
    "build": "next build"
  }
}
```

### 5. Deploy

1. Push your changes to the main branch
2. GitHub Actions will automatically build and deploy your site
3. Your blog will be available at: `https://[username].github.io/new-blog`

### Notes

- The site will rebuild and deploy automatically on every push to main
- You can manually trigger a deployment from the Actions tab
- Private repositories require GitHub Pro or a GitHub Team/Enterprise account
- Make sure GitHub Pages is enabled in your repository settings

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
