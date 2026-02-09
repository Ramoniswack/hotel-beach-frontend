'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import SideDrawerMenu from './SideDrawerMenu';
import { contentAPI } from '@/lib/api';

interface HeaderProps {
  isScrolled: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

interface NavItem {
  label: string;
  url: string;
  order?: number;
}

const Header: React.FC<HeaderProps> = ({ isScrolled: isScrolledProp, onMenuToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoText, setLogoText] = useState('HOTEL BEACH');
  const [logoImage, setLogoImage] = useState('');
  const [useImageLogo, setUseImageLogo] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([
    { label: 'Home', url: '/', order: 1 },
    { label: 'Our Rooms', url: '/rooms', order: 2 },
    { label: 'About Us', url: '/about', order: 3 },
    { label: 'Blog', url: '/blog', order: 4 },
    { label: 'Explore', url: '/explore', order: 5 },
    { label: 'Contact', url: '/contact', order: 6 }
  ]);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchHeaderSettings = async () => {
      try {
        const response = await contentAPI.getByPage('site-settings');
        const headerSection = response.data.data.sections.find((s: any) => s.sectionId === 'header');
        if (headerSection) {
          // Check if using image logo
          if (headerSection.subtitle === 'Use image logo' && headerSection.images?.[0]) {
            setUseImageLogo(true);
            setLogoImage(headerSection.images[0]);
          } else {
            setUseImageLogo(false);
            if (headerSection.title) {
              setLogoText(headerSection.title);
            }
          }
          
          if (headerSection.items && headerSection.items.length > 0) {
            setNavItems(headerSection.items.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)));
          }
        }
      } catch (error) {
        console.error('Error fetching header settings:', error);
      }
    };
    fetchHeaderSettings();
  }, []);

  const scrolled = isScrolledProp || isScrolled;

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    if (onMenuToggle) {
      onMenuToggle(newState);
    }
  };

  // Split logo text into two parts (e.g., "HOTEL BEACH" -> "HOTEL" and "BEACH")
  const logoParts = logoText.split(' ');
  const logoMain = logoParts[0] || 'HOTEL';
  const logoSub = logoParts.slice(1).join(' ') || 'BEACH';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6 ${
        scrolled ? 'bg-white border-b border-gray-100 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            {useImageLogo && logoImage ? (
              <img 
                src={logoImage} 
                alt="Logo" 
                className="h-12 w-auto object-contain"
              />
            ) : (
              <>
                <span className={`text-2xl font-bold tracking-tight transition-colors ${
                  scrolled ? 'text-slate-900' : 'text-white'
                }`}>
                  {logoMain}
                </span>
                <span className={`text-[10px] font-bold tracking-[0.4em] ml-1 transition-colors ${
                  scrolled ? 'text-slate-900' : 'text-white'
                }`}>
                  {logoSub}
                </span>
              </>
            )}
          </Link>

          {/* Navigation Links */}
          <div className={`hidden lg:flex space-x-10 text-[13px] font-medium transition-colors ${
            scrolled ? 'text-slate-800' : 'text-white/90'
          }`}>
            {navItems.map((item, idx) => (
              <Link key={idx} href={item.url} className="hover:text-black transition-colors">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-8">
            {user ? (
              <div className={`hidden lg:flex items-center space-x-4 text-[13px] font-medium transition-colors ${
                scrolled ? 'text-slate-800' : 'text-white/90'
              }`}>
                <Link 
                  href={
                    user.role === 'guest' ? '/dashboard/guest' : 
                    user.role === 'staff' ? '/dashboard/staff' : 
                    '/dashboard/admin'
                  }
                  className="hover:text-black transition-colors"
                >
                  Dashboard
                </Link>
                <span>Welcome, {user.name}</span>
                <button 
                  onClick={logout}
                  className="hover:text-black transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className={`hidden lg:flex items-center space-x-2 text-[13px] font-medium transition-colors ${
                scrolled ? 'text-slate-800' : 'text-white/90'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Login</span>
              </Link>
            )}

            {/* Burger Menu Button */}
            <button 
              onClick={toggleMenu}
              className={`${scrolled ? 'text-slate-900' : 'text-white'} transition-colors hover:opacity-70`}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Side Drawer Menu */}
      <SideDrawerMenu isOpen={isMenuOpen} onClose={() => {
        setIsMenuOpen(false);
        if (onMenuToggle) {
          onMenuToggle(false);
        }
      }} />
    </>
  );
};

export default Header;
