'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MainContentWrapperProps {
  children: React.ReactNode;
  isMenuOpen: boolean;
  onOverlayClick: () => void;
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({ 
  children, 
  isMenuOpen,
  onOverlayClick 
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMenuOpen) {
      // Show overlay with fade
      gsap.to(overlayRef.current, {
        opacity: 0.5,
        duration: 0.6,
        ease: 'power2.out',
        pointerEvents: 'auto',
      });
    } else {
      // Hide overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        pointerEvents: 'none',
      });
    }
  }, [isMenuOpen]);

  return (
    <div 
      id="main-content" 
      className="relative min-h-screen bg-white"
      style={{
        transformOrigin: 'left center',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black z-[85] pointer-events-none"
        style={{ opacity: 0 }}
        onClick={onOverlayClick}
      />
      
      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MainContentWrapper;
