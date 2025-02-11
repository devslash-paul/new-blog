#!/usr/bin/env node
import { cleanDistDirectory, optimizeImages } from '../src/lib/optimize-images.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_DIR = join(process.cwd(), 'public');

async function main() {
  try {
    await cleanDistDirectory();
    await optimizeImages(PUBLIC_DIR);
    console.log('\nImage optimization complete!');
    console.log(`Optimized images available in: ${join(PUBLIC_DIR, 'dist')}`);
  } catch (error) {
    console.error('Fatal error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main(); 