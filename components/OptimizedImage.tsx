'use client';

import Image, { ImageProps } from 'next/image';
import { optimizeCloudinaryUrl, generateCloudinarySrcSet, isCloudinaryUrl } from '@/lib/cloudinary';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  cloudinaryWidth?: number;
  cloudinaryHeight?: number;
  cloudinaryCrop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'limit' | 'pad';
  cloudinaryGravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  cloudinaryQuality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low';
  enableSrcSet?: boolean;
}

/**
 * OptimizedImage Component
 * 
 * Automatically optimizes Cloudinary images with f_auto,q_auto parameters
 * Falls back to regular Next.js Image for non-Cloudinary URLs
 * 
 * @example
 * ```tsx
 * // Basic usage (auto-optimizes Cloudinary URLs)
 * <OptimizedImage
 *   src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *   alt="Sample"
 *   width={800}
 *   height={600}
 * />
 * 
 * // With Cloudinary transformations
 * <OptimizedImage
 *   src={cloudinaryUrl}
 *   alt="Hero"
 *   width={1920}
 *   height={1080}
 *   cloudinaryCrop="fill"
 *   cloudinaryGravity="auto"
 *   cloudinaryQuality="auto:best"
 * />
 * 
 * // With responsive srcset
 * <OptimizedImage
 *   src={cloudinaryUrl}
 *   alt="Gallery"
 *   width={800}
 *   height={600}
 *   enableSrcSet
 * />
 * ```
 */
export default function OptimizedImage({
  src,
  cloudinaryWidth,
  cloudinaryHeight,
  cloudinaryCrop,
  cloudinaryGravity,
  cloudinaryQuality,
  enableSrcSet = false,
  ...props
}: OptimizedImageProps) {
  // If not a Cloudinary URL, use regular Next.js Image
  if (!isCloudinaryUrl(src)) {
    return <Image src={src} {...props} />;
  }

  // Optimize Cloudinary URL
  const optimizedSrc = optimizeCloudinaryUrl(src, {
    width: cloudinaryWidth,
    height: cloudinaryHeight,
    crop: cloudinaryCrop,
    gravity: cloudinaryGravity,
    quality: cloudinaryQuality,
    dpr: 'auto',
  });

  // Generate srcset for responsive images if enabled
  const srcSet = enableSrcSet ? generateCloudinarySrcSet(src) : undefined;

  return (
    <Image
      src={optimizedSrc}
      {...(srcSet && { srcSet })}
      {...props}
    />
  );
}
