'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ExplorePageE1 from '@/components/explore/ExplorePageE1';
import Footer from '@/components/Footer';

export default function ExplorePage_Route() {
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
        <ExplorePageE1 />
      </main>
      
      <Footer />
    </div>
  );
}
