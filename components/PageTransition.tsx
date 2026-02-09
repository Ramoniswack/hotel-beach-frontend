'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <>
      {/* Loading Overlay */}
      <div 
        className={`fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-white z-[100] flex items-center justify-center transition-all duration-300 ${
          isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-[#59a4b5] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-gray-700 font-semibold text-sm">Loading</p>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-[#59a4b5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-[#59a4b5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-[#59a4b5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div 
        className={`transition-all duration-300 ${
          isLoading ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        {displayChildren}
      </div>
    </>
  );
}
