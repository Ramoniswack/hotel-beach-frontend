'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PageLoaderAdvancedProps {
  duration?: number;
  variant?: 'fade' | 'slide' | 'scale' | 'curtain';
}

const PageLoaderAdvanced: React.FC<PageLoaderAdvancedProps> = ({ 
  duration = 1500,
  variant = 'fade'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [pathname, duration]);

  const variants = {
    fade: {
      initial: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.5 }
    },
    slide: {
      initial: { x: 0 },
      exit: { x: '-100%' },
      transition: { duration: 0.6, ease: 'easeInOut' }
    },
    scale: {
      initial: { scale: 1 },
      exit: { scale: 0 },
      transition: { duration: 0.5, ease: 'easeInOut' }
    },
    curtain: {
      initial: { clipPath: 'inset(0% 0% 0% 0%)' },
      exit: { clipPath: 'inset(0% 0% 100% 0%)' },
      transition: { duration: 0.8, ease: 'easeInOut' }
    }
  };

  const selectedVariant = variants[variant];

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={selectedVariant.initial}
          exit={selectedVariant.exit}
          transition={selectedVariant.transition}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#59a4b5] via-[#4a9aaa] to-[#3b8a9a]"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center relative"
          >
            {/* Animated background circle */}
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0.1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <div className="w-40 h-40 mx-auto rounded-full bg-white" />
            </motion.div>

            {/* Logo with stagger animation */}
            <motion.div className="flex flex-col items-center">
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-2 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {['H', 'O', 'T', 'E', 'L'].map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: i * 0.1,
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                    className="inline-block"
                    style={{ letterSpacing: '0.2em' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.h1>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
                className="h-[2px] bg-white/50 my-3"
              />
              
              <motion.p 
                className="text-sm sm:text-base tracking-[0.4em] text-white/90 font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                BEACH
              </motion.p>
            </motion.div>

            {/* Animated progress bar */}
            <motion.div
              className="mt-8 w-48 h-1 bg-white/20 rounded-full overflow-hidden mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ 
                  duration: duration / 1000,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Pulsing dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 flex justify-center space-x-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoaderAdvanced;
