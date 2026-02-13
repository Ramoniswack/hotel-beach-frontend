import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Section {
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  buttonText?: string;
  buttonLink?: string;
}

interface ExploreSantoriniH7Props {
  section?: Section;
}

const ExploreSantoriniH7: React.FC<ExploreSantoriniH7Props> = ({ section }) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white overflow-hidden" style={{ fontFamily: '"Raleway", sans-serif' }}>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-24 items-center">
          {/* Left Side: Text Content */}
          <div className="lg:col-span-5 pr-0 sm:pr-4 order-2 lg:order-1">
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] sm:tracking-[0.35em] uppercase text-slate-800 mb-6 sm:mb-8 md:mb-10">
              {section?.subtitle || 'DESTINATION'}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[56px] xl:text-[64px] font-[800] leading-[1.05] text-[#1a1a1a] mb-8 sm:mb-10 md:mb-12 tracking-tight">
              {section?.title || 'Explore Santorini Greece'}
            </h2>
            <p className="text-[#666666] text-sm sm:text-[15px] leading-[1.7] sm:leading-[1.9] font-normal max-w-[460px] mb-8 sm:mb-10 md:mb-12">
              {section?.description || 'Pitchfork selfies master cleanse Kickstarter seitan retro. Drinking vinegar stumptown yr pop-up artisan sunt. Deep v cliche lomo biodiesel Neutra selfies. Shorts fixie consequat flexitarian four loko tempor duis single-origin coffee. Banksy, elit small batch freegan sed.'}
            </p>
            <Link href={section?.buttonLink || '/explore'}>
              <button className="text-xs sm:text-[13px] font-bold tracking-[0.1em] border-b-2 border-slate-900 pb-1 transition-all hover:opacity-50 tap-target">
                {section?.buttonText || 'Discover More'}
              </button>
            </Link>
          </div>

          {/* Right Side: Two vertical images */}
          <div className="lg:col-span-7 flex flex-row gap-4 sm:gap-6 order-1 lg:order-2">
            <div className="w-1/2 overflow-hidden shadow-sm relative aspect-[1/1.5]">
              <Image 
                src={section?.images?.[0] || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800'} 
                alt="Santorini white buildings" 
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="w-1/2 overflow-hidden shadow-sm relative aspect-[1/1.5]">
              <Image 
                src={section?.images?.[1] || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800'} 
                alt="Santorini blue domes" 
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSantoriniH7;
