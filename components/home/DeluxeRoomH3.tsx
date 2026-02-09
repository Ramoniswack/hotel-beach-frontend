'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { roomsAPI } from '@/lib/api';

interface Room {
  id: string;
  title: string;
  price: number;
  heroImage: string;
  specs: {
    bed: string;
    capacity: string;
    size: string;
    view: string;
  };
  subtitle: string;
  isAvailable: boolean;
}

const DeluxeRoomH3: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await roomsAPI.getAll();
        const roomsData = response.data.data;
        
        // Filter to show only available rooms
        const availableRooms = roomsData.filter((room: Room) => room.isAvailable);
        setRooms(availableRooms);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms');
        // Fallback to static data if API fails
        setRooms([{
          id: 'deluxe-room',
          title: 'Deluxe Room',
          price: 249,
          heroImage: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200',
          specs: {
            bed: 'King Bed',
            capacity: '3 Adults 1 Children',
            size: '55m²',
            view: 'Sea view',
          },
          subtitle: 'Great for business trip',
          isAvailable: true,
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const currentRoom = rooms[currentIndex];

  const nextRoom = () => setCurrentIndex((prev) => (prev + 1) % rooms.length);
  const prevRoom = () => setCurrentIndex((prev) => (prev - 1 + rooms.length) % rooms.length);

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
        prevRoom();
      } else {
        nextRoom();
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

  if (isLoading) {
    return (
      <section className="flex items-center justify-center min-h-[700px] w-full bg-[#1a1a1a]">
        <div className="text-white text-xl">Loading rooms...</div>
      </section>
    );
  }

  if (!currentRoom) {
    return (
      <section className="flex items-center justify-center min-h-[700px] w-full bg-[#1a1a1a]">
        <div className="text-white text-xl">No rooms available</div>
      </section>
    );
  }

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
            ${currentRoom.price}
          </div>
        </div>

        <div className="space-y-4 mb-20 text-sm">
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">bed:</span>
            <span className="text-slate-300 font-light italic">{currentRoom.specs.bed}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">capacity:</span>
            <span className="text-slate-300 font-light italic">{currentRoom.specs.capacity}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">room size:</span>
            <span className="text-slate-300 font-light italic">{currentRoom.specs.size}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">view:</span>
            <span className="text-slate-300 font-light italic">{currentRoom.specs.view}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">recommend:</span>
            <span className="text-slate-300 font-light italic">{currentRoom.subtitle}</span>
          </div>
        </div>

        <div>
          <a 
            href={`/accommodation/${currentRoom.id}`}
            className="px-10 py-3 rounded-full border border-white/30 text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-300 inline-block"
          >
            view detail
          </a>
        </div>
      </div>

      {/* Right Column: Image Slider */}
      <div 
        ref={dragRef}
        className="flex-grow relative overflow-hidden group cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full h-full">
          <Image 
            src={currentRoom.heroImage}
            alt={currentRoom.title}
            fill
            className="object-cover transition-all duration-1000 ease-in-out pointer-events-none"
          />
          {/* Overlay for aesthetic */}
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Navigation Arrows - Only show if multiple rooms */}
        {rooms.length > 1 && (
          <>
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
          </>
        )}

        {/* Subtle decorative element for that "arch" look from the photo */}
        <div className="absolute inset-0 pointer-events-none border-[40px] border-transparent group-hover:border-black/5 transition-all duration-700"></div>
      </div>
    </section>
  );
};

export default DeluxeRoomH3;
