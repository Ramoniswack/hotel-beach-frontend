import React from 'react';
import Image from 'next/image';

const RetreatSpaH5: React.FC = () => {
  return (
    <div className="relative h-[600px] w-full">
      <div className="absolute inset-0">
        <Image 
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=2000" 
          alt="Retreat Spa"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Visit Our Exclusive Spa
        </h2>
        <p className="text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
          A hallmark of the Retreat Hotel experience, the Retreat Spa transports your mind and body 
          to new dimensions of peace and rejuvenation.
        </p>
        <button className="border-2 border-white text-white px-8 py-3 text-sm font-semibold hover:bg-white hover:text-black transition-colors">
          VIEW OFFERS
        </button>
      </div>
    </div>
  );
};

export default RetreatSpaH5;
