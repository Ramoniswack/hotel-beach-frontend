'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroH1 from '@/components/home/HeroH1';
import IntroSectionH2 from '@/components/home/IntroSectionH2';
import DeluxeRoomH3 from '@/components/home/DeluxeRoomH3';
import ChefExperienceH4 from '@/components/home/ChefExperienceH4';
import RetreatSpaH5 from '@/components/home/RetreatSpaH5';
import SignatureDesignsH6 from '@/components/home/SignatureDesignsH6';
import ExploreSantoriniH7 from '@/components/home/ExploreSantoriniH7';
import Footer from '@/components/Footer';

export default function Home() {
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
        <HeroH1 />
        <IntroSectionH2 />
        <DeluxeRoomH3 />
        <ChefExperienceH4 />
        <RetreatSpaH5 />
        <SignatureDesignsH6 />
        <ExploreSantoriniH7 />
      </main>
      
      <Footer />
    </div>
  );
}
