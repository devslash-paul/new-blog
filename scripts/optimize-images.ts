#!/usr/bin/env node
import { cleanDistDirectory, optimizeImages } from '../src/lib/optimize-images';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function main() {
  try {
    await cleanDistDirectory();
    await optimizeImages(PUBLIC_DIR);
    console.log('\nImage optimization complete!');
    console.log(`Optimized images available in: ${path.join(PUBLIC_DIR, 'dist')}`);
  } catch (error) {
    console.error('Fatal error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main(); 