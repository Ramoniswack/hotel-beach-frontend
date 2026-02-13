'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { contentAPI } from '@/lib/api';

const UnifiedPageLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [logoText, setLogoText] = useState({ main: 'HOTEL', sub: 'BEACH' });
  const pathname = usePathname();

  useEffect(() => {
    // Fetch logo text from site settings
    const fetchLogoText = async () => {
      try {
        const response = await contentAPI.getByPage('site-settings');
        const loaderSection = response.data.data.sections.find((s: any) => s.sectionId === 'page-loader');
        if (loaderSection) {
          setLogoText({
            main: loaderSection.title || 'HOTEL',
            sub: loaderSection.subtitle || 'BEACH'
          });
        }
      } catch (error) {
        console.error('Error fetching loader settings:', error);
      }
    };
    fetchLogoText();
  }, []);

  useEffect(() => {
    // Don't show loader on dashboard pages
    if (pathname.startsWith('/dashboard')) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#5fb2c1]"
        >
          <div className="text-center flex flex-col items-center">
            {/* Main Text with Water Fill Effect */}
            <div className="relative inline-block">
              {/* Background text (outline) */}
              <h1 
                className="text-[4rem] sm:text-[5rem] md:text-[6rem] font-light tracking-[0.15em] text-transparent"
                style={{
                  WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.4)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 300,
                }}
              >
                {logoText.main}
              </h1>
              
              {/* Filled text (water fill) */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                animate={{ clipPath: 'inset(0% 0 0 0)' }}
                transition={{ 
                  duration: 1.2,
                  ease: "easeInOut",
                  delay: 0.2
                }}
              >
                <h1 
                  className="text-[4rem] sm:text-[5rem] md:text-[6rem] font-light tracking-[0.15em] text-white"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 300,
                  }}
                >
                  {logoText.main}
                </h1>
              </motion.div>
            </div>

            {/* Sub Text with Water Fill Effect */}
            <div className="relative inline-block -mt-2">
              {/* Background text (outline) */}
              <p 
                className="text-[0.75rem] sm:text-[0.875rem] tracking-[0.35em] text-transparent font-light"
                style={{
                  WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.4)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 300,
                }}
              >
                {logoText.sub}
              </p>
              
              {/* Filled text (water fill) */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                animate={{ clipPath: 'inset(0% 0 0 0)' }}
                transition={{ 
                  duration: 1.2,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <p 
                  className="text-[0.75rem] sm:text-[0.875rem] tracking-[0.35em] text-white/95 font-light"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 300,
                  }}
                >
                  {logoText.sub}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnifiedPageLoader;
