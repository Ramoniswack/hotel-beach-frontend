'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { roomsAPI } from '@/lib/api';

interface Room {
  _id: string;
  id: string;
  title: string;
  price: number;
  heroImage: string;
  gallery?: string[];
  specs: {
    bed: string;
    capacity: string;
    size: string;
    view: string;
  };
  isAvailable: boolean;
}

const RoomRow: React.FC<{ room: Room }> = ({ room }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const images = room.gallery && room.gallery.length > 0 ? room.gallery : [room.heroImage];

  const nextImg = () => setActiveImg((prev) => (prev + 1) % images.length);
  const prevImg = () => setActiveImg((prev) => (prev - 1 + images.length) % images.length);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const diff = e.pageX - startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevImg();
      } else {
        nextImg();
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full border-b border-black last:border-b-0 overflow-hidden">
      {/* Sidebar Info */}
      <div className="w-full lg:w-[460px] bg-[#1a1a1a] p-12 lg:p-20 text-white flex flex-col justify-center min-h-[650px] lg:min-h-[720px]">
        <h3 className="text-[32px] font-bold mb-10 tracking-tight leading-tight">
          {room.title}
        </h3>

        <div className="mb-12">
          <p className="text-[13px] text-gray-400 mb-6 font-medium">From</p>
          <p className="text-[52px] font-bold tracking-tighter leading-none">${room.price}</p>
        </div>

        <div className="space-y-6 mb-16 text-[14px]">
          <div className="grid grid-cols-[120px_1fr] items-baseline">
            <span className="font-bold text-white tracking-wide">bed:</span>
            <span className="text-gray-300 font-light lowercase pl-2">{room.specs.bed}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline">
            <span className="font-bold text-white tracking-wide">capacity:</span>
            <span className="text-gray-300 font-light lowercase pl-2">{room.specs.capacity}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline">
            <span className="font-bold text-white tracking-wide">room size:</span>
            <span className="text-gray-300 font-light pl-2">{room.specs.size}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-baseline">
            <span className="font-bold text-white tracking-wide">view:</span>
            <span className="text-gray-300 font-light lowercase pl-2">{room.specs.view}</span>
          </div>
        </div>

        <div className="mt-4">
          <a 
            href={`/accommodation/${room.id}`}
            className="px-12 py-3.5 rounded-full border border-white/80 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-all duration-300 inline-block"
          >
            view detail
          </a>
        </div>
      </div>

      {/* Image Slider Area */}
      <div className="flex-grow flex relative h-[500px] lg:h-auto overflow-hidden bg-[#1a1a1a]">
        {/* Main Image Container */}
        <div 
          className="relative w-[88%] lg:w-[90%] h-full overflow-hidden bg-black/20 group cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <Image 
            src={images[activeImg]}
            alt={room.title}
            fill
            className="object-cover transition-opacity duration-700 ease-in-out pointer-events-none"
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

        {/* Peek Section */}
        <div 
          className="w-[12%] lg:w-[10%] h-full relative cursor-pointer group border-l border-white/5 bg-zinc-900" 
          onClick={nextImg}
        >
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
          <Image 
            src={images[(activeImg + 1) % images.length]}
            alt="Next room preview"
            fill
            className="object-cover opacity-60 scale-110 group-hover:scale-100 transition-transform duration-700 ease-out grayscale-[20%]"
          />
        </div>
      </div>
    </div>
  );
};

const RoomShowcaseR1: React.FC<{ section?: any }> = ({ section }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await roomsAPI.getAll();
        const roomsData = response.data.data || [];
        // Only show available rooms
        const availableRooms = roomsData.filter((room: Room) => room.isAvailable);
        setRooms(availableRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full bg-white py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </section>
    );
  }

  if (rooms.length === 0) {
    return (
      <section className="w-full bg-white py-24">
        <div className="text-center">
          <p className="text-gray-600 text-xl">No rooms available at the moment</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">
      {/* Intro Header Section */}
      <div className="max-w-[1300px] mx-auto px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <h2 className="text-[36px] md:text-[48px] font-bold mb-8 tracking-tight text-[#1a1a1a] leading-[1.1]">
          {section?.title || 'In harmony with nature'}
        </h2>
        <p className="text-[#666] text-[15px] leading-[1.9] max-w-2xl font-normal">
          {section?.description || 'Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum.'}
        </p>
      </div>

      {/* Room Rows Vertical Stack */}
      <div className="w-full flex flex-col border-t border-black">
        {rooms.map((room) => (
          <RoomRow key={room._id} room={room} />
        ))}
      </div>
    </section>
  );
};

export default RoomShowcaseR1;
