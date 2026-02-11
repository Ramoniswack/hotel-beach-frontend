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
    <div className="pt-[1cm] pb-24 bg-white">
      <div className="relative h-[700px] w-full overflow-hidden">
        {/* Image positioned to leave 1cm from left and touch right */}
        <div className="absolute left-[1cm] top-0 bottom-0 right-0">
          <Image 
            src={section?.images?.[0] || "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2000"} 
            alt={section?.title || "Signature Designs"}
            fill
            className="object-cover rounded-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="text-white px-12 md:px-20 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {section?.title || 'Signature Serenity Designs'}
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-8">
                {section?.description || 'Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation.'}
              </p>
              <Link href={section?.buttonLink || '/rooms'}>
                <button className="px-10 py-3 rounded-full border border-white text-[13px] font-bold tracking-[0.1em] transition-all duration-300 hover:bg-white hover:text-black">
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
