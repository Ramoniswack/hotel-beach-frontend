'use client';

import React from 'react';

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
  return (
    <div 
      id="main-content" 
      className="relative min-h-screen bg-white"
      style={{
        transformOrigin: 'left center',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
};

export default MainContentWrapper;
