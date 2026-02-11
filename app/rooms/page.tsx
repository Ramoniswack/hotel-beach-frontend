'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MainContentWrapper from '@/components/MainContentWrapper';
import { RetreatSectionR0 } from '@/components/rooms/RetreatSectionR0';
import RoomShowcaseR1 from '@/components/rooms/RoomShowcaseR1';
import SpaSectionR3 from '@/components/rooms/SpaSectionR3';
import PromotionGridR4 from '@/components/rooms/PromotionGridR4';
import Footer from '@/components/Footer';
import { contentAPI } from '@/lib/api';

interface Section {
  sectionId: string;
  sectionName: string;
  title?: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  items?: any[];
  isVisible: boolean;
  order: number;
}

export default function RoomsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await contentAPI.getByPage('rooms');
        setSections(response.data.data.sections || []);
      } catch (error) {
        console.error('Error fetching rooms page content:', error);
      }
    };
    fetchContent();
  }, []);

  const getSection = (sectionId: string): Section | undefined => {
    const section = sections.find(s => s.sectionId === sectionId);
    if (sections.length === 0) return undefined;
    return section && section.isVisible ? section : undefined;
  };

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
          {(sections.length === 0 || getSection('retreat-hero')) && (
            <RetreatSectionR0 section={getSection('retreat-hero')} />
          )}
          {(sections.length === 0 || getSection('rooms-showcase')) && (
            <RoomShowcaseR1 section={getSection('header')} />
          )}
          {(sections.length === 0 || getSection('spa-section')) && <SpaSectionR3 />}
          {(sections.length === 0 || getSection('promotions')) && (
            <PromotionGridR4 section={getSection('promotions')} />
          )}
        </main>
        
        <Footer />
      </MainContentWrapper>
    </div>
  );
}
