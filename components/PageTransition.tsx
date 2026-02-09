'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    // Only show loading if pathname actually changed
    if (pathname !== prevPathname) {
      setIsLoading(true);
      setPrevPathname(pathname);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [pathname, prevPathname]);

  return (
    <>
      {/* Loading Overlay */}
      <div 
        className={`fixed inset-0 bg-[#59a4b5] z-[9999] flex items-center justify-center transition-all duration-500 ${
          isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center">
          {/* Hotel Text - Large and Centered */}
          <div className="text-6xl md:text-8xl font-bold tracking-wider text-white/60 animate-pulse">
            HOTEL
          </div>
          {/* Beach Text - Small below */}
          <div className="text-xs md:text-sm font-bold tracking-[0.3em] text-white/60 mt-1">
            BEACH
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div 
        className={`transition-all duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
}
