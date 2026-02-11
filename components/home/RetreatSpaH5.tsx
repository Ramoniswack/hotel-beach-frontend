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

interface RetreatSpaH5Props {
  section?: Section;
}

const RetreatSpaH5: React.FC<RetreatSpaH5Props> = ({ section }) => {
  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden flex items-center">
      {/* Background Image with Overlay - Positioned to touch left, leave small space on right */}
      <div className="absolute left-0 top-0 bottom-0 right-[1cm] z-0">
        <Image 
          src={section?.images?.[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000'} 
          alt="Luxury Villa Interior" 
          fill
          className="object-cover"
        />
        {/* Subtle dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-[1300px] mx-auto px-6 sm:px-8 w-full">
        <div className="max-w-2xl text-white">
          <h2 className="text-[42px] md:text-[52px] lg:text-[60px] font-bold leading-[1.1] mb-10 tracking-tight drop-shadow-sm">
            {section?.title || 'Visit Our fantastic villas'}
          </h2>
          <p className="text-[15px] md:text-[16px] leading-[1.8] font-normal mb-12 max-w-[500px] text-white/90 drop-shadow-sm">
            {section?.description || 'Featuring a pleasant blend of natural materials and elegance, the decor and furnishings create an inviting ambience fostering relaxation and a sense of well-being.'}
          </p>
          <div>
            <Link href={section?.buttonLink || '/rooms'}>
              <button className="px-10 py-3 rounded-full border border-white text-[13px] font-bold tracking-[0.1em] transition-all duration-300 hover:bg-white hover:text-black">
                {section?.buttonText || 'Discover our rooms'}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetreatSpaH5;
