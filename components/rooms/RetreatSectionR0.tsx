import React from 'react';
import Image from 'next/image';

/**
 * RetreatSection Component
 * 
 * Layout update:
 * - Text remains contained in a readable, centered grid.
 * - Image breaks out of the grid to touch the left screen edge.
 * - Image retains a small gap on the right side.
 */

interface RetreatSectionR0Props {
  section?: {
    title?: string;
    subtitle?: string;
    heroImage?: string;
  };
}

export const RetreatSectionR0: React.FC<RetreatSectionR0Props> = ({ section }) => {
  // Default values
  const title = section?.title || "Retreat Hotel at Santorini";
  const subtitle = section?.subtitle || "Unwind the clock of modern life. Unlock the door to a wonder of the world.";
  const imageUrl = section?.heroImage || "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2670&auto=format&fit=crop";

  return (
    <section className="w-full pt-20 md:pt-32 pb-4 overflow-hidden">
      {/* Text Content - Kept in a standard container for readability alignment */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 mb-6 md:mb-8">
        <h1 className="text-gray-900 tracking-tight mb-3 md:mb-4 text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: '"Raleway", sans-serif', fontWeight: 700 }}>
          {title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 font-normal max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Hero Image - Touches left edge of viewport, gap on right */}
      <div className="w-full pl-0 pr-4 sm:pr-6 md:pr-12 lg:pr-24">
        <div 
          className="relative w-full overflow-hidden bg-gray-100"
          style={{ aspectRatio: '16/9' }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};
