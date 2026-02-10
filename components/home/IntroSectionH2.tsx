import React from 'react';
import Image from 'next/image';

interface Section {
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  images?: string[];
}

interface IntroSectionH2Props {
  section?: Section;
}

const IntroSectionH2: React.FC<IntroSectionH2Props> = ({ section }) => {
  return (
    <section className="py-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-5 space-y-8 animate-fade-in">
            <header>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-6">
                {section?.subtitle || 'About Hoteller'}
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] text-slate-900 mb-8">
                {section?.title || 'Beach Hotel More than a stay'}
              </h2>
            </header>
            
            <div className="space-y-6 text-slate-600 leading-relaxed font-light">
              <p>
                {section?.description || 'Pitchfork selfies master cleanse Kickstarter seitan retro. Drinking vinegar stumptown yr pop-up artisan sunt. Deep v cliche lomo biodiesel Neutra selfies. Shorts fixie consequat flexitarian four loko tempor duis single-origin coffee. Banksy, elit small batch freegan sed.'}
              </p>
            </div>
            
            <div className="pt-8">
              <div className="mb-4">
                <Image 
                  src="https://hotellerv1.b-cdn.net/beach/wp-content/uploads/sites/4/2018/06/signature.png" 
                  alt="Signature" 
                  width={200}
                  height={80}
                  className="h-16 w-auto mb-4"
                />
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-900">
                  {section?.content || 'Richard Morgan - General Manager'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Overlapping Images */}
          <div className="lg:col-span-7 relative">
            <div className="relative grid grid-cols-12 grid-rows-12 h-[600px] w-full">
              {/* Image 1: Tall Vertical (Left-most background) */}
              <div className="col-start-1 col-end-7 row-start-1 row-end-9 z-10 shadow-2xl relative">
                <Image 
                  src={section?.images?.[0] || 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=800'} 
                  alt="Coastal View" 
                  fill
                  className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Image 2: Wide Horizontal (Top-right overlap) */}
              <div className="col-start-5 col-end-13 row-start-2 row-end-7 z-20 shadow-2xl translate-x-4 relative">
                <Image 
                  src={section?.images?.[1] || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=1200'} 
                  alt="Beach Setup" 
                  fill
                  className="object-cover"
                />
              </div>

              {/* Image 3: Square Horizontal (Bottom-right overlap) */}
              <div className="col-start-4 col-end-12 row-start-6 row-end-12 z-30 shadow-2xl translate-y-4 relative">
                <Image 
                  src={section?.images?.[2] || 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&q=80&w=1000'} 
                  alt="Luxury Suite" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSectionH2;
