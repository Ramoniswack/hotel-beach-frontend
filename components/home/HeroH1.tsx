import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroH1: React.FC = () => {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0">
        <Image 
          src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Hotel Santorini"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Navigation Arrows */}
      <button className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all z-20">
        <ChevronLeft size={24} />
      </button>
      <button className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all z-20">
        <ChevronRight size={24} />
      </button>
      
      {/* Hero Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight">
          Luxury Comfort
        </h1>
        <p className="text-sm md:text-base tracking-wide">
          Design, curated art and welcoming teams
        </p>
      </div>
    </div>
  );
};

export default HeroH1;
