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
export const RetreatSectionR0: React.FC = () => {
  // Pastel blue building with palm trees
  const imageUrl = "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2670&auto=format&fit=crop";

  return (
    <section className="w-full pt-32 pb-12 overflow-hidden">
      {/* Text Content - Kept in a standard container for readability alignment */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight font-sans mb-4">
          Retreat Hotel at Santorini
        </h1>
        <p className="text-base md:text-lg text-gray-600 font-normal max-w-2xl leading-relaxed">
          Unwind the clock of modern life. Unlock the door to a wonder of the world.
        </p>
      </div>

      {/* Hero Image - Touches left edge of viewport, gap on right */}
      <div className="w-full pl-0 pr-6 md:pr-12 lg:pr-24">
        <div 
          className="relative w-full overflow-hidden bg-gray-100"
          style={{ aspectRatio: '16/9' }}
        >
          <Image
            src={imageUrl}
            alt="Pastel blue hotel building with palm trees"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};
