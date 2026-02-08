import React from 'react';
import Image from 'next/image';

const ExploreSantoriniH7: React.FC = () => {
  return (
    <div className="py-24 bg-[#f8f8f8]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 leading-tight">
              Explore Santorini Greece
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. 
              Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave 
              deep v laborum.
            </p>
            <button className="bg-[#5fb2c1] hover:bg-[#4ea1af] text-white px-8 py-3 text-sm font-semibold transition-colors">
              LEARN MORE
            </button>
          </div>
          
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4]">
              <Image 
                src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=600" 
                alt="Santorini View 1"
                fill
                className="object-cover rounded-sm"
              />
            </div>
            <div className="relative aspect-[3/4]">
              <Image 
                src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=600" 
                alt="Santorini View 2"
                fill
                className="object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreSantoriniH7;
