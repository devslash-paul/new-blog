import { ImageLoaderProps } from 'next/image';

const KEEP_PNG_MARKER = '.keep';

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  // For absolute URLs (external images), return as is
  if (src.startsWith('http') || src.startsWith('//')) {
    return src;
  }

  // For local images
  // Extract the path parts
  const srcPath = src.startsWith('/') ? src.slice(1) : src;
  const ext = srcPath.split('.').pop()?.toLowerCase() || '';
  const isKeepPng = srcPath.includes(KEEP_PNG_MARKER);

  // If it's a keep.png file, use it from the dist directory as is
  if (isKeepPng && ext === 'png') {
    return `/dist/${srcPath}`;
  }

  // For all other images, use the WebP version from dist
  const pathWithoutExt = srcPath.replace(/\.[^/.]+$/, '');
  const webpPath = `/dist/${pathWithoutExt}.webp`;

  // Add any width/quality parameters
  const params = [`w=${width}`];
  if (quality) {
    params.push(`q=${quality}`);
  }

  return `${webpPath}${params.length ? `?${params.join('&')}` : ''}`;
} 