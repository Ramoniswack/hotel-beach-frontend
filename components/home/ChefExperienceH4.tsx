import React from 'react';
import Image from 'next/image';

interface Section {
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
}

interface ChefExperienceH4Props {
  section?: Section;
}

const ChefExperienceH4: React.FC<ChefExperienceH4Props> = ({ section }) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white overflow-hidden mt-8 sm:mt-12 md:mt-16">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-24 items-center">
          {/* Images Section: Two vertical blocks */}
          <div className="lg:col-span-7 flex flex-row gap-4 sm:gap-6">
            <div className="w-1/2 overflow-hidden shadow-sm relative aspect-[1/1.5]">
              <Image 
                src={section?.images?.[0] || 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=800'} 
                alt="Dining with view" 
                fill
                className="object-cover"
              />
            </div>
            <div className="w-1/2 overflow-hidden shadow-sm relative aspect-[1/1.5]">
              <Image 
                src={section?.images?.[1] || 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800'} 
                alt="Chef specialty dish" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Text Section */}
          <div className="lg:col-span-5 pr-0 sm:pr-4">
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] sm:tracking-[0.35em] uppercase text-slate-800 mb-6 sm:mb-8 md:mb-10">
              {section?.subtitle || '5 STARS MICHALIN'}
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[48px] lg:text-[50px] xl:text-[64px] font-[500] leading-[1.1] text-[#1a1a1a] mb-8 sm:mb-10 md:mb-12 tracking-tight">
              {section?.title || 'Experience Deliciously from Our Chefs'}
            </h2>
            <p className="text-[#666666] text-sm sm:text-[15px] leading-[1.7] sm:leading-[1.9] font-normal max-w-[460px]">
              {section?.description || 'Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefExperienceH4;
