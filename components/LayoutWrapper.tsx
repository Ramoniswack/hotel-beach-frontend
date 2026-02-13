'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';

interface MenuContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MenuContext = createContext<MenuContextType>({
  isMenuOpen: false,
  setIsMenuOpen: () => {},
});

export const useMenu = () => useContext(MenuContext);

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Don't show header on dashboard pages
  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {!isDashboard && <Header isScrolled={isScrolled} onMenuToggle={setIsMenuOpen} />}
      {children}
      
      {/* Global overlay for closing menu */}
      {!isDashboard && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[85]"
          onClick={() => setIsMenuOpen(false)}
          style={{ cursor: 'pointer' }}
        />
      )}
    </MenuContext.Provider>
  );
}
