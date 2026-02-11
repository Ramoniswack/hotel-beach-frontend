
import React from 'react';

const SpaSectionR3: React.FC = () => {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-[30px] font-bold text-[#1a1a1a] mb-6" style={{ fontFamily: '"Raleway", sans-serif' }}>The Retreat Spa</h2>
            <p className="text-[#1a1a1a]/60 text-[13px] leading-loose font-medium">
              A hallmark of the Retreat Hotel experience, the Retreat Spa transports your mind and body to new dimensions of peace and rejuvenation.
            </p>
          </div>
          <button className="bg-[#5fb2c1] hover:bg-[#4ea1af] text-white text-[11px] font-bold py-3.5 px-10 rounded-full transition-all duration-300 whitespace-nowrap">
            View Offers
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpaSectionR3;
