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
  const [direction, setDirection] = useState<'left' | 'right'>('left');

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

  const nextSlide = () => {
    setDirection('left');
    setCurrent((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setDirection('right');
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > current ? 'left' : 'right');
    setCurrent(index);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background Slides with Continuous Scroll */}
      <div 
        className="absolute inset-0 flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative min-w-full h-full flex-shrink-0"
          >
            <Image 
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover opacity-70"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Content for each slide */}
            <div className="absolute inset-0 z-10 flex items-center justify-center text-center text-white px-6">
              <div>
                <h1 className="text-[60px] md:text-[80px] lg:text-[100px] font-bold tracking-tight mb-4 leading-none">
                  {slide.title}
                </h1>
                <p className="text-[14px] md:text-[16px] uppercase tracking-[0.3em] font-medium opacity-90">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
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

      {/* Bottom Line Pagination */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="inline-block px-[5px] py-[15px] relative w-[46px] h-8 cursor-pointer z-10"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span 
              className={`block absolute top-[15px] left-[5px] w-9 h-[2px] bg-white transition-opacity duration-200 ${
                i === current ? 'opacity-100' : 'opacity-30 hover:opacity-100'
              }`}
            ></span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroH1;
