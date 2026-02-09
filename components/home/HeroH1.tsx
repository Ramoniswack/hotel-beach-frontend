import React, { useState } from 'react';
import Image from 'next/image';

interface Section {
  sectionId: string;
  title?: string;
  subtitle?: string;
  images?: string[];
  items?: any[];
}

interface HeroH1Props {
  section?: Section;
}

const HeroH1: React.FC<HeroH1Props> = ({ section }) => {
  const [current, setCurrent] = useState(0);

  // Default slides
  const defaultSlides = [
    {
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1920',
      title: 'Santorini Retreat',
      subtitle: 'Unlock the door to a wonder of the world'
    },
    {
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1920',
      title: 'Luxury Awaits',
      subtitle: 'Experience the pinnacle of Mediterranean hospitality'
    }
  ];

  // Use section data if available, otherwise use defaults
  const slides = section?.items && section.items.length > 0
    ? section.items
    : section?.images && section.images.length > 0
    ? [
        {
          image: section.images[0],
          title: section.title || 'Santorini Retreat',
          subtitle: section.subtitle || 'Unlock the door to a wonder of the world'
        },
        {
          image: section.images[1] || section.images[0],
          title: 'Luxury Awaits',
          subtitle: 'Experience the pinnacle of Mediterranean hospitality'
        }
      ]
    : defaultSlides;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image 
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover opacity-70"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-[60px] md:text-[80px] lg:text-[100px] font-bold tracking-tight mb-4 leading-none">
          {slides[current].title}
        </h1>
        <p className="text-[14px] md:text-[16px] uppercase tracking-[0.3em] font-medium opacity-90">
          {slides[current].subtitle}
        </p>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-4 z-20"
        aria-label="Previous slide"
      >
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-4 z-20"
        aria-label="Next slide"
      >
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bottom Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 ${
              i === current ? 'w-12 h-[2px] bg-white' : 'w-6 h-[1px] bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroH1;
