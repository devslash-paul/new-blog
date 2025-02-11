import imageLoader from '../image-loader';

// Mock environment variables
const originalEnv = process.env.NODE_ENV;

describe('imageLoader', () => {
  beforeEach(() => {
    // Reset NODE_ENV before each test
    process.env = { ...process.env, NODE_ENV: originalEnv };
  });

  describe('external URLs', () => {
    it('should return absolute URLs unchanged', () => {
      const result = imageLoader({
        src: 'https://example.com/image.png',
        width: 800,
        quality: 75,
      });
      expect(result).toBe('https://example.com/image.png');
    });

    it('should return protocol-relative URLs unchanged', () => {
      const result = imageLoader({
        src: '//example.com/image.png',
        width: 800,
        quality: 75,
      });
      expect(result).toBe('//example.com/image.png');
    });
  });

  describe('local images', () => {
    it('should handle regular images', () => {
      const result = imageLoader({
        src: '/images/test.png',
        width: 800,
        quality: 75,
      });
      expect(result).toBe('/dist/images/test.webp?w=800&q=75');
    });

    it('should handle .keep.png images', () => {
      const result = imageLoader({
        src: '/images/test.keep.png',
        width: 800,
        quality: 75,
      });
      expect(result).toBe('/dist/images/test.keep.png');
    });

    it('should handle images without leading slash', () => {
      const result = imageLoader({
        src: 'images/test.jpg',
        width: 800,
        quality: 75,
      });
      expect(result).toBe('/dist/images/test.webp?w=800&q=75');
    });
  });

  describe('quality parameter handling', () => {
    it('should omit quality parameter when not provided', () => {
      const result = imageLoader({
        src: '/images/test.png',
        width: 800,
      });
      expect(result).not.toContain('q=');
      expect(result).toContain('w=800');
    });

    it('should include quality parameter when provided', () => {
      const result = imageLoader({
        src: '/images/test.png',
        width: 800,
        quality: 90,
      });
      expect(result).toContain('q=90');
    });
  });
}); 