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
    <section className="py-24 bg-white overflow-hidden mt-16">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Images Section: Two vertical blocks */}
          <div className="lg:col-span-7 flex flex-row gap-6">
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
          <div className="lg:col-span-5 pr-4">
            <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-slate-800 mb-10">
              {section?.subtitle || '5 STARS MICHALIN'}
            </p>
            <h2 className="text-[48px] md:text-[56px] lg:text-[64px] font-[800] leading-[1.05] text-[#1a1a1a] mb-12 tracking-tight">
              {section?.title || 'Experience Deliciously from Our Chefs'}
            </h2>
            <p className="text-[#666666] text-[15px] leading-[1.9] font-normal max-w-[460px]">
              {section?.description || 'Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefExperienceH4;
