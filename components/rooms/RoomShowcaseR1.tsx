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
  const [scrollOffset, setScrollOffset] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const images = room.gallery && room.gallery.length > 0 ? room.gallery : [room.heroImage];

  const nextImg = () => {
    const newIndex = (activeImg + 1) % images.length;
    setActiveImg(newIndex);
    setScrollOffset(0);
  };

  const prevImg = () => {
    const newIndex = (activeImg - 1 + images.length) % images.length;
    setActiveImg(newIndex);
    setScrollOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = startX - x;
    setScrollOffset(walk);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Snap to next/prev image if dragged more than 100px
    if (scrollOffset > 100) {
      nextImg();
    } else if (scrollOffset < -100) {
      prevImg();
    } else {
      // Snap back to current position
      setScrollOffset(0);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
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

      {/* Image Slider with 3cm Peek Preview */}
      <div 
        ref={containerRef}
        className="flex-grow relative overflow-hidden h-[500px] lg:h-auto"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Container - Follows mouse drag smoothly */}
        <div 
          className="flex h-full"
          style={{ 
            transform: `translateX(calc(-${activeImg} * (100% - 3cm) - ${scrollOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 h-full"
              style={{ 
                width: 'calc(100% - 3cm)'
              }}
            >
              <Image 
                src={image}
                alt={`${room.title} - Image ${index + 1}`}
                fill
                className="object-cover pointer-events-none select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImg}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white transition-all hover:scale-110 z-20 bg-black/20 backdrop-blur-sm rounded-sm"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button 
              onClick={nextImg}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white transition-all hover:scale-110 z-20 bg-black/20 backdrop-blur-sm rounded-sm"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
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
  <div className="max-w-[1300px] mx-auto px-8 pt-4 pb-16 lg:pt-6 lg:pb-24">
        <h2 className="text-[36px] md:text-[30px] font-bold mb-8 tracking-tight text-[#1a1a1a] leading-[1.1]" style={{ fontFamily: '"Raleway", sans-serif' }}>
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
