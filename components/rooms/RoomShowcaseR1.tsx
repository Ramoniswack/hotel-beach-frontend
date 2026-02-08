import React, { useState } from 'react';
import Image from 'next/image';

interface RoomDetail {
  bed: string;
  capacity: string;
  roomSize: string;
  view: string;
  recommend: string;
}

interface Room {
  id: string;
  title: string;
  price: string;
  details: RoomDetail;
  images: string[];
}

const roomsData: Room[] = [
  {
    id: 'superior',
    title: 'Superior Room',
    price: '$199',
    details: {
      bed: 'twin bed',
      capacity: '2 adults 1 children',
      roomSize: '30m²',
      view: 'sea view',
      recommend: 'great for business trip'
    },
    images: [
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 'deluxe',
    title: 'Deluxe Room',
    price: '$249',
    details: {
      bed: 'king bed',
      capacity: '3 adults 1 children',
      roomSize: '55m²',
      view: 'sea view',
      recommend: 'great for business trip'
    },
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591088398332-8a77d399eb65?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 'signature',
    title: 'Signature Room',
    price: '$299',
    details: {
      bed: 'king bed',
      capacity: '3 adults 2 children',
      roomSize: '70m²',
      view: 'sea view',
      recommend: 'great for families'
    },
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: 'luxury',
    title: 'Luxury Suite Room',
    price: '$399',
    details: {
      bed: 'king bed',
      capacity: '4 adults 2 children',
      roomSize: '120m²',
      view: 'sea view',
      recommend: 'great for families'
    },
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200'
    ]
  }
];

const RoomRow: React.FC<{ room: Room }> = ({ room }) => {
  const [activeImg, setActiveImg] = useState(0);

  const nextImg = () => setActiveImg((prev) => (prev + 1) % room.images.length);
  const prevImg = () => setActiveImg((prev) => (prev - 1 + room.images.length) % room.images.length);

  return (
    <div className="flex flex-col lg:flex-row w-full border-b border-black last:border-b-0 overflow-hidden">
      {/* Sidebar Info - Exactly matching the dark charcoal theme */}
      <div className="w-full lg:w-[460px] bg-[#1a1a1a] p-12 lg:p-20 text-white flex flex-col justify-center min-h-[650px] lg:min-h-[720px]">
        <h3 className="text-[32px] font-bold mb-10 tracking-tight leading-tight">
          {room.title}
        </h3>

        <div className="mb-12">
          <p className="text-[13px] text-gray-400 mb-6 font-medium">From</p>
          <p className="text-[52px] font-bold tracking-tighter leading-none">{room.price}</p>
        </div>

        <div className="space-y-6 mb-16 text-[14px]">
          <div className="grid grid-cols-[120px_1fr] items-baseline">
            <span className="font-bold text-white tracking-wide">bed:</span>
            <span className="text-gray-300 font-light lowercase pl-2">{room.details.bed}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline">
            <span className="font-bold text-white tracking-wide">capacity:</span>
            <span className="text-gray-300 font-light lowercase pl-2">{room.details.capacity}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline">
            <span className="font-bold text-white tracking-wide">room size:</span>
            <span className="text-gray-300 font-light pl-2">{room.details.roomSize}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline">
            <span className="font-bold text-white tracking-wide">view:</span>
            <span className="text-gray-300 font-light lowercase pl-2">{room.details.view}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline">
            <span className="font-bold text-white tracking-wide">recommend:</span>
            <span className="text-gray-300 font-light lowercase pl-2">{room.details.recommend}</span>
          </div>
        </div>

        <div className="mt-4">
          <button className="px-12 py-3.5 rounded-full border border-white/80 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-all duration-300">
            view detail
          </button>
        </div>
      </div>

      {/* Image Slider Area - The 90/10 split layout */}
      <div className="flex-grow flex relative h-[500px] lg:h-auto overflow-hidden bg-[#1a1a1a]">
        {/* Main Image Container */}
        <div className="relative w-[88%] lg:w-[90%] h-full overflow-hidden bg-black/20 group">
          <Image 
            src={room.images[activeImg]}
            alt={room.title}
            fill
            className="object-cover transition-opacity duration-700 ease-in-out"
          />

          {/* Circular Navigation Controls */}
          <button 
            onClick={prevImg}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white/90 hover:bg-white hover:text-black transition-all duration-300 z-20 shadow-xl"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={nextImg}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white/90 hover:bg-white hover:text-black transition-all duration-300 z-20 shadow-xl"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Peek Section - The strip on the right showing the next image */}
        <div 
          className="w-[12%] lg:w-[10%] h-full relative cursor-pointer group border-l border-white/5 bg-zinc-900" 
          onClick={nextImg}
        >
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
          <Image 
            src={room.images[(activeImg + 1) % room.images.length]}
            alt="Next room preview"
            fill
            className="object-cover opacity-60 scale-110 group-hover:scale-100 transition-transform duration-700 ease-out grayscale-[20%]"
          />
        </div>
      </div>
    </div>
  );
};

const RoomShowcaseR1: React.FC = () => {
  return (
    <section className="bg-white">
      {/* Intro Header Section */}
      <div className="max-w-[1300px] mx-auto px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <h2 className="text-[36px] md:text-[48px] font-bold mb-8 tracking-tight text-[#1a1a1a] leading-[1.1]">
          In harmony with nature
        </h2>
        <p className="text-[#666] text-[15px] leading-[1.9] max-w-2xl font-normal">
          Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum.
        </p>
      </div>

      {/* Room Rows Vertical Stack */}
      <div className="w-full flex flex-col border-t border-black">
        {roomsData.map((room) => (
          <RoomRow key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
};

export default RoomShowcaseR1;
