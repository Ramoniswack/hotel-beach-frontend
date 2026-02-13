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

interface SignatureDesignsH6Props {
  section?: Section;
}

const SignatureDesignsH6: React.FC<SignatureDesignsH6Props> = ({ section }) => {
  return (
    <div className="pt-[0.5cm] sm:pt-[1cm] pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-white">
      <div className="relative h-[500px] sm:h-[600px] md:h-[700px] w-full overflow-hidden">
        {/* Image positioned to leave 1cm from left and touch right */}
        <div className="absolute left-[0.5cm] sm:left-[1cm] top-0 bottom-0 right-0">
          <Image 
            src={section?.images?.[0] || "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2000"} 
            alt={section?.title || "Signature Designs"}
            fill
            className="object-cover rounded-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="text-white px-6 sm:px-8 md:px-12 lg:px-20 max-w-xl sm:max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6">
                {section?.title || 'Signature Serenity Designs'}
              </h2>
              <p className="text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-7 md:mb-8">
                {section?.description || 'Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation.'}
              </p>
              <Link href={section?.buttonLink || '/rooms'}>
                <button className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full border border-white text-xs sm:text-[13px] font-bold tracking-[0.1em] transition-all duration-300 hover:bg-white hover:text-black tap-target">
                  {section?.buttonText || 'LEARN MORE'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureDesignsH6;
