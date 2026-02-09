'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useAuthStore } from '@/store/authStore';

interface SideDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawerMenu: React.FC<SideDrawerMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Animate main content with 3D rotation (left-hinge flip)
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        gsap.to(mainContent, {
          rotationY: -20,        // Rotate on Y-axis (door swing)
          xPercent: 30,          // Move right to make room
          scale: 0.85,           // Scale down for depth
          duration: 0.9,
          ease: 'power3.inOut',
        });
      }

      // Animate side menu panel
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.9,
        ease: 'power3.inOut',
      });

      // Animate menu links with stagger
      const links = linksRef.current?.querySelectorAll('.drawer-link');
      if (links) {
        gsap.fromTo(
          links,
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            delay: 0.5,
            ease: 'power2.out',
          }
        );
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Animate main content back
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        gsap.to(mainContent, {
          rotationY: 0,
          xPercent: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.inOut',
        });
      }

      // Hide side menu
      if (menuRef.current) {
        gsap.to(menuRef.current, {
          x: '-100%',
          duration: 0.8,
          ease: 'power3.inOut',
        });
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 h-full w-[320px] bg-[#1a1a1a] z-[90] shadow-2xl"
      style={{ transform: 'translateX(-100%)' }}
    >
      <div className="h-full flex flex-col p-10 overflow-y-auto">
        {/* Logo */}
        <div className="drawer-link mb-12">
          <Link href="/" onClick={handleLinkClick} className="flex flex-col leading-none">
            <span className="text-3xl font-bold tracking-tight text-white">
              HOTEL
            </span>
            <span className="text-[10px] font-bold tracking-[0.4em] text-white/80 ml-1">
              BEACH
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav ref={linksRef} className="flex-1 space-y-6">
          <div className="drawer-link">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="text-white text-2xl font-bold tracking-tight hover:text-[#59a4b5] transition-colors duration-300 block"
            >
              Home
            </Link>
          </div>
          <div className="drawer-link">
            <Link
              href="/rooms"
              onClick={handleLinkClick}
              className="text-white text-2xl font-bold tracking-tight hover:text-[#59a4b5] transition-colors duration-300 block"
            >
              Our Rooms
            </Link>
          </div>
          <div className="drawer-link">
            <Link
              href="/about"
              onClick={handleLinkClick}
              className="text-white text-2xl font-bold tracking-tight hover:text-[#59a4b5] transition-colors duration-300 block"
            >
              About Us
            </Link>
          </div>
          <div className="drawer-link">
            <Link
              href="/blog"
              onClick={handleLinkClick}
              className="text-white text-2xl font-bold tracking-tight hover:text-[#59a4b5] transition-colors duration-300 block"
            >
              Blog
            </Link>
          </div>
          <div className="drawer-link">
            <Link
              href="/explore"
              onClick={handleLinkClick}
              className="text-white text-2xl font-bold tracking-tight hover:text-[#59a4b5] transition-colors duration-300 block"
            >
              Explore
            </Link>
          </div>
          <div className="drawer-link">
            <Link
              href="/contact"
              onClick={handleLinkClick}
              className="text-white text-2xl font-bold tracking-tight hover:text-[#59a4b5] transition-colors duration-300 block"
            >
              Contact
            </Link>
          </div>

          {/* Divider */}
          <div className="drawer-link pt-6 border-t border-white/10">
            {user ? (
              <div className="space-y-3">
                <p className="text-white/60 text-sm">Welcome, {user.name}</p>
                <button
                  onClick={handleLogout}
                  className="text-white text-lg font-medium hover:text-[#59a4b5] transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="text-white text-lg font-medium hover:text-[#59a4b5] transition-colors duration-300 inline-block"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Footer - Social Links */}
        <div className="drawer-link mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col space-y-3">
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Facebook
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Instagram
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideDrawerMenu;
