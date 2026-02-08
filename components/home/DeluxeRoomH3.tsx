import React, { useState } from 'react';
import Image from 'next/image';

const rooms = [
  {
    title: 'Deluxe Room',
    price: '$249',
    details: {
      bed: 'king bed',
      capacity: '3 adults 1 children',
      'room size': '55m²',
      view: 'sea view',
      recommend: 'great for business trip'
    },
    image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200'
  }
];

const DeluxeRoomH3: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentRoom = rooms[currentIndex];

  const nextRoom = () => setCurrentIndex((prev) => (prev + 1) % rooms.length);
  const prevRoom = () => setCurrentIndex((prev) => (prev - 1 + rooms.length) % rooms.length);

  return (
    <section className="flex flex-col lg:flex-row min-h-[700px] w-full bg-[#1a1a1a] overflow-hidden">
      {/* Left Column: Info Sidebar */}
      <div className="w-full lg:w-[450px] p-12 lg:p-20 flex flex-col justify-center text-white">
        <h2 className="text-4xl font-serif font-medium mb-16 tracking-tight">
          {currentRoom.title}
        </h2>

        <div className="mb-16">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-2">
            From
          </p>
          <div className="text-5xl font-bold tracking-tight">
            {currentRoom.price}
          </div>
        </div>

        <div className="space-y-4 mb-20 text-sm">
          {Object.entries(currentRoom.details).map(([label, value]) => (
            <div key={label} className="grid grid-cols-[110px_1fr] items-start">
              <span className="font-bold tracking-wider text-slate-100">{label}:</span>
              <span className="text-slate-300 font-light italic">{value}</span>
            </div>
          ))}
        </div>

        <div>
          <button className="px-10 py-3 rounded-full border border-white/30 text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-300">
            view detail
          </button>
        </div>
      </div>

      {/* Right Column: Image Slider */}
      <div className="flex-grow relative overflow-hidden group">
        <div className="relative w-full h-full">
          <Image 
            src={currentRoom.image}
            alt={currentRoom.title}
            fill
            className="object-cover transition-all duration-1000 ease-in-out"
          />
          {/* Overlay for aesthetic */}
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevRoom}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:bg-white hover:text-black z-20"
          aria-label="Previous room"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={nextRoom}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:bg-white hover:text-black z-20"
          aria-label="Next room"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Subtle decorative element for that "arch" look from the photo */}
        <div className="absolute inset-0 pointer-events-none border-[40px] border-transparent group-hover:border-black/5 transition-all duration-700"></div>
      </div>
    </section>
  );
};

export default DeluxeRoomH3;
