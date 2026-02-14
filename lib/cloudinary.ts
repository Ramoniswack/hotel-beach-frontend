/**
 * Cloudinary Image Optimization Utility
 * 
 * Automatically adds optimization parameters to Cloudinary URLs to improve:
 * - Largest Contentful Paint (LCP)
 * - Page load speed
 * - SEO performance
 * - Bandwidth usage
 */

interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'limit' | 'pad';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  dpr?: 'auto' | number;
  fetchFormat?: 'auto';
}

/**
 * Optimizes a Cloudinary URL with automatic format and quality parameters
 * 
 * @param url - Original Cloudinary URL
 * @param options - Optimization options
 * @returns Optimized Cloudinary URL
 * 
 * @example
 * ```ts
 * // Basic optimization (f_auto, q_auto)
 * optimizeCloudinaryUrl('https://res.cloudinary.com/demo/image/upload/sample.jpg')
 * // => 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/sample.jpg'
 * 
 * // With responsive sizing
 * optimizeCloudinaryUrl(url, { width: 800, height: 600, crop: 'fill' })
 * // => 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800,h_600,c_fill/sample.jpg'
 * 
 * // With device pixel ratio
 * optimizeCloudinaryUrl(url, { width: 400, dpr: 'auto' })
 * // => 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400,dpr_auto/sample.jpg'
 * ```
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: CloudinaryOptions = {}
): string {
  // Return original URL if not a Cloudinary URL
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Check if URL already has transformations
  const hasTransformations = url.includes('/upload/') && 
    url.split('/upload/')[1].includes('/');

  // Build transformation string
  const transformations: string[] = [];

  // Always add format and quality optimization
  transformations.push(`f_${options.format || 'auto'}`);
  transformations.push(`q_${options.quality || 'auto'}`);

  // Add responsive sizing
  if (options.width) {
    transformations.push(`w_${options.width}`);
  }
  if (options.height) {
    transformations.push(`h_${options.height}`);
  }

  // Add crop mode
  if (options.crop) {
    transformations.push(`c_${options.crop}`);
  }

  // Add gravity (for smart cropping)
  if (options.gravity) {
    transformations.push(`g_${options.gravity}`);
  }

  // Add device pixel ratio
  if (options.dpr) {
    transformations.push(`dpr_${options.dpr}`);
  }

  const transformString = transformations.join(',');

  // If URL already has transformations, append to them
  if (hasTransformations) {
    return url.replace('/upload/', `/upload/${transformString}/`);
  }

  // Otherwise, add transformations after /upload/
  return url.replace('/upload/', `/upload/${transformString}/`);
}

/**
 * Generates a responsive srcset for Cloudinary images
 * 
 * @param url - Original Cloudinary URL
 * @param widths - Array of widths for responsive images
 * @returns srcset string for img tag
 * 
 * @example
 * ```tsx
 * <img
 *   src={optimizeCloudinaryUrl(url, { width: 800 })}
 *   srcSet={generateCloudinarySrcSet(url, [400, 800, 1200, 1600])}
 *   sizes="(max-width: 768px) 100vw, 800px"
 * />
 * ```
 */
export function generateCloudinarySrcSet(
  url: string,
  widths: number[] = [400, 800, 1200, 1600, 2000]
): string {
  return widths
    .map(width => {
      const optimizedUrl = optimizeCloudinaryUrl(url, { 
        width, 
        dpr: 'auto',
        crop: 'scale'
      });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}

/**
 * Presets for common use cases
 */
export const CloudinaryPresets = {
  // Hero images - high quality, responsive
  hero: (url: string, width?: number) => 
    optimizeCloudinaryUrl(url, {
      width: width || 1920,
      quality: 'auto:best',
      crop: 'fill',
      gravity: 'auto',
      dpr: 'auto',
    }),

  // Thumbnail images - smaller, optimized
  thumbnail: (url: string, size: number = 300) =>
    optimizeCloudinaryUrl(url, {
      width: size,
      height: size,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto:good',
    }),

  // Room gallery images - balanced quality
  gallery: (url: string, width?: number) =>
    optimizeCloudinaryUrl(url, {
      width: width || 800,
      quality: 'auto:good',
      crop: 'fill',
      gravity: 'center',
      dpr: 'auto',
    }),

  // Blog/content images - optimized for reading
  content: (url: string, width?: number) =>
    optimizeCloudinaryUrl(url, {
      width: width || 1200,
      quality: 'auto',
      crop: 'limit',
      dpr: 'auto',
    }),

  // Avatar/profile images - small, circular
  avatar: (url: string, size: number = 150) =>
    optimizeCloudinaryUrl(url, {
      width: size,
      height: size,
      crop: 'thumb',
      gravity: 'face',
      quality: 'auto:good',
    }),

  // Background images - large, optimized
  background: (url: string) =>
    optimizeCloudinaryUrl(url, {
      width: 2560,
      quality: 'auto:eco',
      crop: 'fill',
      gravity: 'auto',
    }),
};

/**
 * Helper to get Cloudinary URL from various sources
 */
export function getCloudinaryUrl(
  source: string | { url?: string; secure_url?: string } | undefined
): string {
  if (!source) return '';
  if (typeof source === 'string') return source;
  return source.secure_url || source.url || '';
}

/**
 * Validates if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com');
}

/**
 * Extracts the public ID from a Cloudinary URL
 */
export function getCloudinaryPublicId(url: string): string | null {
  if (!isCloudinaryUrl(url)) return null;
  
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}
