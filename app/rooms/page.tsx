'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MainContentWrapper from '@/components/MainContentWrapper';
import RoomShowcaseR1 from '@/components/rooms/RoomShowcaseR1';
import SpaSectionR3 from '@/components/rooms/SpaSectionR3';
import PromotionGridR4 from '@/components/rooms/PromotionGridR4';
import Footer from '@/components/Footer';

export default function RoomsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="relative bg-white selection:bg-hotel-gold selection:text-white"
      style={{
        perspective: '2000px',
        perspectiveOrigin: 'left center',
        overflow: 'hidden',
      }}
    >
      <Header isScrolled={isScrolled} onMenuToggle={setIsMenuOpen} />
      <MainContentWrapper isMenuOpen={isMenuOpen} onOverlayClick={() => setIsMenuOpen(false)}>
        <main>
          <RoomShowcaseR1 />
          <SpaSectionR3 />
          <PromotionGridR4 />
        </main>
        
        <Footer />
      </MainContentWrapper>
    </div>
  );
}
