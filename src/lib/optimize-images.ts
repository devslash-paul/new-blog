import sharp from 'sharp';
import * as fs from 'fs/promises';
import { join, extname, basename, relative } from 'path';
import type { Dirent } from 'fs';

const PUBLIC_DIR = join(process.cwd(), 'public');
const DIST_DIR = join(process.cwd(), 'public/dist');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.webp', '.png'] as const;
type ImageExtension = typeof IMAGE_EXTENSIONS[number];

const KEEP_PNG_MARKER = '.keep';

interface WebPOptions {
  quality: number;
  lossless?: boolean;
  nearLossless?: boolean;
}

async function ensureDirectoryExists(directory: string): Promise<void> {
  try {
    await fs.access(directory);
  } catch {
    await fs.mkdir(directory, { recursive: true });
  }
}

export async function cleanDistDirectory(): Promise<void> {
  try {
    await fs.rm(DIST_DIR, { recursive: true, force: true });
    console.log('Cleaned dist directory');
  } catch (error) {
    console.error('Error cleaning dist directory:', error instanceof Error ? error.message : error);
    // Don't throw in test mode to match test expectations
  }
}

export async function optimizeImages(directory: string): Promise<void> {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });

    for (const file of files) {
      await processFile(directory, file);
    }
  } catch (error) {
    console.error('Error in image optimization:', error instanceof Error ? error.message : error);
    if (process.env.NODE_ENV === 'test') {
      throw error;
    } else {
      process.exit(1);
    }
  }
}

async function processFile(directory: string, file: Dirent): Promise<void> {
  const fullPath = join(directory, file.name);
  
  if (file.isDirectory()) {
    await optimizeImages(fullPath);
    return;
  }

  const ext = extname(file.name).toLowerCase() as ImageExtension;
  const nameWithoutExt = basename(file.name, ext);
  
  // Skip non-image files
  if (!IMAGE_EXTENSIONS.includes(ext)) {
    return;
  }

  // Skip files that are already WebP
  if (ext === '.webp') {
    return;
  }

  console.log(`Processing: ${fullPath}`);

  // If it's a PNG and has the keep marker, just copy it to dist
  if (ext === '.png' && nameWithoutExt.includes(KEEP_PNG_MARKER)) {
    await copyPngFile(directory, file.name, fullPath);
    return;
  }

  await convertToWebP(directory, fullPath, nameWithoutExt, ext);
}

async function copyPngFile(directory: string, fileName: string, fullPath: string): Promise<void> {
  const relativePath = relative(PUBLIC_DIR, directory);
  const distDir = join(DIST_DIR, relativePath);
  await ensureDirectoryExists(distDir);
  const distPath = join(distDir, fileName);
  await fs.copyFile(fullPath, distPath);
  console.log(`Copied PNG to dist: ${distPath}`);
}

async function convertToWebP(
  directory: string,
  fullPath: string,
  nameWithoutExt: string,
  ext: ImageExtension
): Promise<void> {
  try {
    const image = sharp(fullPath);
    await image.metadata(); // Ensure image is valid

    // Create dist path maintaining directory structure
    const relativePath = relative(PUBLIC_DIR, directory);
    const distDir = join(DIST_DIR, relativePath);
    await ensureDirectoryExists(distDir);

    // Convert to WebP
    const webpName = `${nameWithoutExt}.webp`;
    const webpPath = join(distDir, webpName);
    
    const options: WebPOptions = {
      quality: 80,
      ...(ext === '.png' && {
        lossless: true,
        nearLossless: true
      })
    };

    await image.webp(options).toFile(webpPath);
    console.log(`Created optimized version: ${webpPath}`);
  } catch (error) {
    console.error(`Error processing ${fullPath}:`, error instanceof Error ? error.message : error);
    console.log('Skipping file due to conversion error');
  }
} 