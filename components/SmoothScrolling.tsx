'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with optimized settings for luxury feel
    const lenis = new Lenis({
      duration: 1.2, // Smooth duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, // Adjust scroll speed
      smoothTouch: false, // Disable on touch devices for better mobile performance
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Expose lenis instance globally for programmatic access
    (window as any).__lenis = lenis;

    // Add lenis class to html element
    document.documentElement.classList.add('lenis');

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            lenis.scrollTo(targetElement, {
              offset: 0,
              duration: 1.5,
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Cleanup
    return () => {
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
      document.removeEventListener('click', handleAnchorClick);
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}
