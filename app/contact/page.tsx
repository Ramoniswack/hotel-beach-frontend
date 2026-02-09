'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MainContentWrapper from '@/components/MainContentWrapper';
import ContactPageC1 from '@/components/contact/ContactPageC1';
import Footer from '@/components/Footer';
import { contentAPI } from '@/lib/api';

interface Section {
  sectionId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  items?: any[];
  buttonText?: string;
  buttonLink?: string;
  isVisible: boolean;
}

export default function ContactPage_Route() {
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
        const response = await contentAPI.getByPage('contact');
        setSections(response.data.data.sections || []);
      } catch (error) {
        console.error('Error fetching contact page content:', error);
      }
    };
    fetchContent();
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
          <ContactPageC1 sections={sections} />
        </main>
        
        <Footer />
      </MainContentWrapper>
    </div>
  );
}
