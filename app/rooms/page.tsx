'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import RoomShowcaseR1 from '@/components/rooms/RoomShowcaseR1';
import PromotionGridR4 from '@/components/rooms/PromotionGridR4';
import SpaSectionR3 from '@/components/rooms/SpaSectionR3';
import CallToActionR2 from '@/components/rooms/CallToActionR2';
import Footer from '@/components/Footer';

export default function RoomsPage() {
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
        {/* Header Section */}
        <div className="pt-40 pb-16 text-center">
          <div className="container mx-auto px-6">
            <h1 className="font-sans text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-tight">
              Our Luxury Rooms & Suites
            </h1>
            <p className="text-[#1a1a1a]/60 text-sm max-w-2xl mx-auto font-medium leading-relaxed">
              Discover your perfect sanctuary. Each room is thoughtfully designed to provide the ultimate comfort and breathtaking views of Santorini.
            </p>
          </div>
        </div>

        <RoomShowcaseR1 />
        <SpaSectionR3 />
        <PromotionGridR4 />
        
        <CallToActionR2 
          title="Ready to Experience Luxury?"
          subtitle="Book your stay and discover the perfect blend of comfort and elegance"
          image="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=2000"
          buttonText="Book Now"
        />
      </main>
      
      <Footer />
    </div>
  );
}
