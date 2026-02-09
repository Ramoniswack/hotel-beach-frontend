'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MainContentWrapper from '@/components/MainContentWrapper';
import AboutA1 from '@/components/about/AboutA1';
import Footer from '@/components/Footer';
import { contentAPI } from '@/lib/api';

interface Section {
  sectionId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  images?: string[];
  items?: any[];
  isVisible: boolean;
}

export default function AboutPage() {
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
        const response = await contentAPI.getByPage('about');
        setSections(response.data.data.sections || []);
      } catch (error) {
        console.error('Error fetching about page content:', error);
      }
    };
    fetchContent();
  }, []);

  const getSection = (sectionId: string) => {
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
          <AboutA1 sections={sections} />
        </main>
        
        <Footer />
      </MainContentWrapper>
    </div>
  );
}
