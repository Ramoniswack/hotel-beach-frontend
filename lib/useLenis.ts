'use client';

import { useEffect, useState } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Get the lenis instance from window if it exists
    const lenisInstance = (window as any).__lenis;
    if (lenisInstance) {
      setLenis(lenisInstance);
    }
  }, []);

  return lenis;
}

// Helper function to scroll to an element
export function scrollToElement(target: string | HTMLElement, options?: {
  offset?: number;
  duration?: number;
}) {
  const lenis = (window as any).__lenis as Lenis;
  if (!lenis) return;

  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  lenis.scrollTo(element, {
    offset: options?.offset || 0,
    duration: options?.duration || 1.5,
  });
}

// Helper function to scroll to top
export function scrollToTop(duration = 1.5) {
  const lenis = (window as any).__lenis as Lenis;
  if (!lenis) return;

  lenis.scrollTo(0, { duration });
}
