import React from 'react';
import Image from 'next/image';

const ExploreSantoriniH7: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Left Side: Text Content */}
          <div className="lg:col-span-5 pr-4 order-2 lg:order-1">
            <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-slate-800 mb-10">
              DESTINATION
            </p>
            <h2 className="text-[48px] md:text-[56px] lg:text-[64px] font-[800] leading-[1.05] text-[#1a1a1a] mb-12 tracking-tight">
              Explore Santorini <br />Greece
            </h2>
            <p className="text-[#666666] text-[15px] leading-[1.9] font-normal max-w-[460px] mb-12">
              Pitchfork selfies master cleanse Kickstarter seitan retro. Drinking vinegar stumptown yr pop-up artisan sunt. Deep v cliche lomo biodiesel Neutra selfies. Shorts fixie consequat flexitarian four loko tempor duis single-origin coffee. Banksy, elit small batch freegan sed.
            </p>
            <button className="text-[13px] font-bold tracking-[0.1em] border-b-2 border-slate-900 pb-1 transition-all hover:opacity-50">
              Discover More
            </button>
          </div>

          {/* Right Side: Two vertical images */}
          <div className="lg:col-span-7 flex flex-row gap-6 order-1 lg:order-2">
            <div className="w-1/2 overflow-hidden shadow-sm relative aspect-[1/1.5]">
              <Image 
                src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800" 
                alt="Santorini white buildings" 
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="w-1/2 overflow-hidden shadow-sm relative aspect-[1/1.5]">
              <Image 
                src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800" 
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
