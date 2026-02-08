'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BlogB1 from '@/components/blog/BlogB1';
import Footer from '@/components/Footer';

export default function BlogPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-white selection:bg-hotel-gold selection:text-white overflow-x-hidden">
      <Header isScrolled={isScrolled} />
      <main>
        <BlogB1 />
      </main>
      
      <Footer />
    </div>
  );
}
