import React from 'react';
import Image from 'next/image';

const SignatureDesignsH6: React.FC = () => {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="relative h-[500px] w-full overflow-hidden rounded-sm">
          <Image 
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2000" 
            alt="Signature Designs"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="text-white px-12 md:px-20 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Signature Serenity Designs
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-8">
                Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. 
                Craft beer elit seitan exercitation.
              </p>
              <button className="border-2 border-white text-white px-8 py-3 text-sm font-semibold hover:bg-white hover:text-black transition-colors">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureDesignsH6;
