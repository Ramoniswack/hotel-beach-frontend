'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import SideDrawerMenu from './SideDrawerMenu';

interface HeaderProps {
  isScrolled: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isScrolled: isScrolledProp, onMenuToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrolled = isScrolledProp || isScrolled;

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);
    if (onMenuToggle) {
      onMenuToggle(newState);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6 ${
        scrolled ? 'bg-white border-b border-gray-100 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className={`text-2xl font-bold tracking-tight transition-colors ${
              scrolled ? 'text-slate-900' : 'text-white'
            }`}>
              HOTEL
            </span>
            <span className={`text-[10px] font-bold tracking-[0.4em] ml-1 transition-colors ${
              scrolled ? 'text-slate-900' : 'text-white'
            }`}>
              BEACH
            </span>
          </Link>

          {/* Navigation Links */}
          <div className={`hidden lg:flex space-x-10 text-[13px] font-medium transition-colors ${
            scrolled ? 'text-slate-800' : 'text-white/90'
          }`}>
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <Link href="/rooms" className="hover:text-black transition-colors">Our Rooms</Link>
            <Link href="/about" className="hover:text-black transition-colors">About Us</Link>
            <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
            <Link href="/explore" className="hover:text-black transition-colors">Explore</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
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
