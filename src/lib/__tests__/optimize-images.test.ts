import fs from 'fs/promises';
import { Dirent, PathLike, RmOptions } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { jest } from '@jest/globals';

// Mock the external dependencies
jest.mock('fs/promises');
jest.mock('sharp');

// Mock process.cwd() before importing the module
jest.spyOn(process, 'cwd').mockReturnValue('/test-root');

// Import after mocking
const { optimizeImages, cleanDistDirectory } = require('../optimize-images');

// Mock types
type MockedFunction<T extends (...args: any) => any> = jest.MockedFunction<T>;

// Store original NODE_ENV
const originalEnv = process.env.NODE_ENV;

describe('Image Optimization', () => {
  beforeEach(() => {
    // Set NODE_ENV to test
    process.env = { ...process.env, NODE_ENV: 'test' };
    
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock path functions
    jest.spyOn(path, 'join').mockImplementation((...args: string[]) => {
      const cleanedArgs = args.filter(arg => arg !== undefined).map(arg => {
        if (typeof arg !== 'string') return '';
        return arg.replace(/^\/+|\/+$/g, '');
      });
      return cleanedArgs.filter(Boolean).join('/');
    });
    
    jest.spyOn(path, 'extname').mockImplementation((p: string) => {
      const parts = p.split('.');
      return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
    });
    
    jest.spyOn(path, 'basename').mockImplementation((p: string, ext?: string) => {
      const base = p.split('/').pop() || '';
      return ext ? base.replace(ext, '') : base;
    });
    
    jest.spyOn(path, 'relative').mockImplementation((from: string, to: string) => {
      return to.replace(from + '/', '');
    });
    
    // Mock fs.readdir to return test files (no directories by default to prevent recursion)
    const mockDirents = [
      { name: 'test.png', isDirectory: () => false, isFile: () => true } as Dirent,
      { name: 'test.jpg', isDirectory: () => false, isFile: () => true } as Dirent,
      { name: 'test.webp', isDirectory: () => false, isFile: () => true } as Dirent,
    ];
    (fs.readdir as MockedFunction<typeof fs.readdir>).mockResolvedValue(mockDirents);

    // Mock fs.access to simulate directory exists
    (fs.access as MockedFunction<typeof fs.access>).mockResolvedValue();

    // Mock fs.mkdir to simulate directory creation
    (fs.mkdir as MockedFunction<typeof fs.mkdir>).mockResolvedValue(undefined);

    // Mock fs.rm to capture path argument
    const rmMock = jest.fn<(path: PathLike, options?: RmOptions) => Promise<void>>()
      .mockImplementation((path: PathLike, options?: RmOptions) => Promise.resolve());
    (fs.rm as unknown) = rmMock;

    // Mock sharp instance methods
    const mockToFile = jest.fn<() => Promise<sharp.OutputInfo>>()
      .mockResolvedValue({ size: 1000, width: 800, height: 600 } as sharp.OutputInfo);
    
    const mockMetadata = jest.fn<() => Promise<sharp.Metadata>>()
      .mockResolvedValue({ width: 800, height: 600 } as sharp.Metadata);
    
    const mockWebp = jest.fn().mockReturnThis();

    const mockSharpInstance = {
      webp: mockWebp,
      toFile: mockToFile,
      metadata: mockMetadata,
    };
    (sharp as unknown as jest.Mock).mockReturnValue(mockSharpInstance);
  });

  afterEach(() => {
    // Restore original NODE_ENV
    process.env = { ...process.env, NODE_ENV: originalEnv };
    jest.restoreAllMocks();
  });

  describe('cleanDistDirectory', () => {
    it('should remove the dist directory', async () => {
      await cleanDistDirectory();
      expect(fs.rm).toHaveBeenCalledWith(
        '/test-root/public/dist',
        expect.objectContaining({ recursive: true, force: true })
      );
    });

    it('should handle errors gracefully', async () => {
      (fs.rm as MockedFunction<typeof fs.rm>).mockRejectedValue(new Error('Test error'));
      await expect(cleanDistDirectory()).resolves.not.toThrow();
    });
  });

  describe('optimizeImages', () => {
    it('should process PNG files to WebP', async () => {
      // Mock readdir to return only PNG files
      const mockPngFiles = [
        { name: 'test.png', isDirectory: () => false, isFile: () => true } as Dirent,
      ];
      (fs.readdir as MockedFunction<typeof fs.readdir>).mockResolvedValue(mockPngFiles);

      await optimizeImages('test-dir');
      
      // Should create WebP version
      expect(sharp).toHaveBeenCalledWith('test-dir/test.png');
      expect(fs.copyFile).not.toHaveBeenCalled();
    });

    it('should preserve .keep.png files', async () => {
      // Mock readdir to return only .keep.png files
      const mockKeepFiles = [
        { name: 'test.keep.png', isDirectory: () => false, isFile: () => true } as Dirent,
      ];
      (fs.readdir as MockedFunction<typeof fs.readdir>).mockResolvedValue(mockKeepFiles);

      await optimizeImages('test-dir');
      
      // Should copy the file instead of converting
      expect(fs.copyFile).toHaveBeenCalledWith(
        'test-dir/test.keep.png',
        expect.stringContaining('test.keep.png')
      );
      // Should not try to convert to WebP
      expect(sharp).not.toHaveBeenCalledWith(expect.stringContaining('test.keep.png'));
    });

    it('should skip existing WebP files', async () => {
      // Mock readdir to return only WebP files
      const mockWebpFiles = [
        { name: 'test.webp', isDirectory: () => false, isFile: () => true } as Dirent,
      ];
      (fs.readdir as MockedFunction<typeof fs.readdir>).mockResolvedValue(mockWebpFiles);

      await optimizeImages('test-dir');
      
      // Should not process WebP files
      expect(sharp).not.toHaveBeenCalledWith(expect.stringContaining('test.webp'));
    });

    it('should process subdirectories recursively', async () => {
      // First call returns a directory and a file
      const mockSubdirContents = [
        { name: 'subdir', isDirectory: () => true, isFile: () => false } as Dirent,
        { name: 'test.png', isDirectory: () => false, isFile: () => true } as Dirent,
      ];
      // Second call (for the subdirectory) returns only a file
      const mockSubdirFiles = [
        { name: 'subimage.png', isDirectory: () => false, isFile: () => true } as Dirent,
      ];
      
      // Mock readdir to handle both the main directory and subdirectory
      const readdirMock = jest.fn<() => Promise<Dirent[]>>()
        .mockResolvedValueOnce(mockSubdirContents)  // First call returns directory
        .mockResolvedValueOnce(mockSubdirFiles);    // Second call returns only files
      (fs.readdir as unknown) = readdirMock;

      await optimizeImages('test-dir');
      
      // Should process main directory and subdirectory
      expect(readdirMock).toHaveBeenCalledWith('test-dir', expect.any(Object));
      expect(readdirMock).toHaveBeenCalledWith('test-dir/subdir', expect.any(Object));
    });

    it('should handle conversion errors gracefully', async () => {
      const mockToFile = jest.fn<() => Promise<sharp.OutputInfo>>()
        .mockRejectedValue(new Error('Conversion failed'));
      
      const mockMetadata = jest.fn<() => Promise<sharp.Metadata>>()
        .mockResolvedValue({ width: 800, height: 600 } as sharp.Metadata);
      
      const mockWebp = jest.fn().mockReturnThis();

      const mockSharpInstance = {
        webp: mockWebp,
        toFile: mockToFile,
        metadata: mockMetadata,
      };
      (sharp as unknown as jest.Mock).mockReturnValue(mockSharpInstance);

      await expect(optimizeImages('test-dir')).resolves.not.toThrow();
    });

    it('should use correct WebP options for PNG files', async () => {
      const mockToFile = jest.fn<() => Promise<sharp.OutputInfo>>()
        .mockResolvedValue({ size: 1000, width: 800, height: 600 } as sharp.OutputInfo);
      
      const mockMetadata = jest.fn<() => Promise<sharp.Metadata>>()
        .mockResolvedValue({ width: 800, height: 600 } as sharp.Metadata);
      
      const mockWebp = jest.fn().mockReturnThis();

      const mockSharpInstance = {
        webp: mockWebp,
        toFile: mockToFile,
        metadata: mockMetadata,
      };
      (sharp as unknown as jest.Mock).mockReturnValue(mockSharpInstance);

      // Mock readdir to return only PNG files
      const mockPngFiles = [
        { name: 'test.png', isDirectory: () => false, isFile: () => true } as Dirent,
      ];
      (fs.readdir as MockedFunction<typeof fs.readdir>).mockResolvedValue(mockPngFiles);

      await optimizeImages('test-dir');
      
      // Check PNG-specific options
      expect(mockWebp).toHaveBeenCalledWith(expect.objectContaining({
        lossless: true,
        nearLossless: true,
      }));
    });
  });
}); 