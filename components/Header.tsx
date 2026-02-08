'use client';

import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Our Rooms', href: '/rooms' },
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Explore', href: '/explore' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white py-3 shadow-md border-b border-gray-100' : 'bg-white/95 backdrop-blur-sm py-4'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex flex-col items-center cursor-pointer">
            <span className="text-[#1a1a1a] font-serif text-2xl tracking-[0.2em] leading-tight font-bold">HOTEL</span>
            <span className="text-[#1a1a1a] text-[9px] tracking-[0.4em] uppercase opacity-70 font-bold">Beach</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-10">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[11px] uppercase tracking-[0.15em] font-bold transition-all border-b-2 py-1 ${
                pathname === item.href 
                  ? 'text-[#1a1a1a] border-hotel-gold' 
                  : 'text-[#1a1a1a]/60 border-transparent hover:text-hotel-gold'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Login */}
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-[#1a1a1a] text-[11px] uppercase tracking-[0.15em] font-bold hover:text-hotel-gold transition-colors">
            <User size={18} strokeWidth={1.5} />
            <span>Login</span>
          </button>
          <button 
            className="lg:hidden text-[#1a1a1a] ml-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white absolute top-full left-0 w-full p-8 flex flex-col space-y-5 shadow-2xl">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[11px] uppercase tracking-widest font-bold ${
                pathname === item.href ? 'text-hotel-gold' : 'text-[#1a1a1a]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Header;
