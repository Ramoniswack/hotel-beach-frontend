'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MainContentWrapper from '@/components/MainContentWrapper';
import HeroH1 from '@/components/home/HeroH1';
import IntroSectionH2 from '@/components/home/IntroSectionH2';
import DeluxeRoomH3 from '@/components/home/DeluxeRoomH3';
import ChefExperienceH4 from '@/components/home/ChefExperienceH4';
import RetreatSpaH5 from '@/components/home/RetreatSpaH5';
import SignatureDesignsH6 from '@/components/home/SignatureDesignsH6';
import ExploreSantoriniH7 from '@/components/home/ExploreSantoriniH7';
import Footer from '@/components/Footer';
import { contentAPI } from '@/lib/api';

interface Section {
  sectionId: string;
  sectionName: string;
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  images?: string[];
  buttonText?: string;
  buttonLink?: string;
  items?: any[];
  isVisible: boolean;
  order: number;
}

export default function Home() {
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
        const response = await contentAPI.getByPage('home');
        setSections(response.data.data.sections || []);
      } catch (error) {
        console.error('Error fetching home content:', error);
        // Continue with default content if API fails
      }
    };
    fetchContent();
  }, []);

  const getSection = (sectionId: string): Section | undefined => {
    const section = sections.find(s => s.sectionId === sectionId);
    // Return section only if it exists and is visible, or undefined if sections haven't loaded yet (show all by default)
    if (sections.length === 0) return undefined; // Not loaded yet, show default
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
          {(sections.length === 0 || getSection('hero')) && <HeroH1 section={getSection('hero')} />}
          {(sections.length === 0 || getSection('intro')) && <IntroSectionH2 section={getSection('intro')} />}
          {(sections.length === 0 || getSection('deluxe-room')) && <DeluxeRoomH3 />}
          {(sections.length === 0 || getSection('chef-experience')) && <ChefExperienceH4 section={getSection('chef-experience')} />}
          {(sections.length === 0 || getSection('retreat-spa')) && <RetreatSpaH5 section={getSection('retreat-spa')} />}
          {(sections.length === 0 || getSection('signature-designs')) && <SignatureDesignsH6 />}
          {(sections.length === 0 || getSection('explore-santorini')) && <ExploreSantoriniH7 section={getSection('explore-santorini')} />}
        </main>
        
        <Footer />
      </MainContentWrapper>
    </div>
  );
}
