const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const DIST_DIR = path.join(process.cwd(), 'public/dist');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.webp', '.png'];
// Files with this in their name will remain as PNG
const KEEP_PNG_MARKER = '.keep';

async function ensureDirectoryExists(directory) {
  try {
    await fs.access(directory);
  } catch {
    await fs.mkdir(directory, { recursive: true });
  }
}

async function optimizeImages(directory) {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        await optimizeImages(fullPath);
        continue;
      }

      const ext = path.extname(file.name).toLowerCase();
      const nameWithoutExt = path.basename(file.name, ext);
      
      // Skip non-image files
      if (!IMAGE_EXTENSIONS.includes(ext)) {
        continue;
      }

      // Skip files that are already WebP
      if (ext === '.webp') {
        continue;
      }

      console.log(`Processing: ${fullPath}`);

      // If it's a PNG and has the keep marker, just copy it to dist
      if (ext === '.png' && nameWithoutExt.includes(KEEP_PNG_MARKER)) {
        const relativePath = path.relative(PUBLIC_DIR, directory);
        const distDir = path.join(DIST_DIR, relativePath);
        await ensureDirectoryExists(distDir);
        const distPath = path.join(distDir, file.name);
        await fs.copyFile(fullPath, distPath);
        console.log(`Copied PNG to dist: ${distPath}`);
        continue;
      }

      try {
        const image = sharp(fullPath);
        const metadata = await image.metadata();

        // Create dist path maintaining directory structure
        const relativePath = path.relative(PUBLIC_DIR, directory);
        const distDir = path.join(DIST_DIR, relativePath);
        await ensureDirectoryExists(distDir);

        // Convert to WebP
        const webpName = `${nameWithoutExt}.webp`;
        const webpPath = path.join(distDir, webpName);
        
        await image
          .webp({ 
            quality: 80,
            // Better settings for converting from PNG
            lossless: ext === '.png', // Use lossless for PNGs
            nearLossless: ext === '.png' // Use near-lossless compression for PNGs
          })
          .toFile(webpPath);

        console.log(`Created optimized version: ${webpPath}`);
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error);
        console.log('Skipping file due to conversion error');
      }
    }
  } catch (error) {
    console.error('Error in image optimization:', error);
    process.exit(1);
  }
}

// Clean dist directory before starting
async function cleanDistDirectory() {
  try {
    await fs.rm(DIST_DIR, { recursive: true, force: true });
    console.log('Cleaned dist directory');
  } catch (error) {
    console.error('Error cleaning dist directory:', error);
  }
}

// Start the optimization process
cleanDistDirectory()
  .then(() => optimizeImages(PUBLIC_DIR))
  .then(() => {
    console.log('\nImage optimization complete!');
    console.log(`Optimized images available in: ${DIST_DIR}`);
  }); 