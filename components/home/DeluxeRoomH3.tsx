'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { roomsAPI } from '@/lib/api';

interface Room {
  id: string;
  title: string;
  price: number;
  heroImage: string;
  galleryImages?: string[];
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
  const [deluxeRoom, setDeluxeRoom] = useState<Room | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeluxeRoom = async () => {
      try {
        setIsLoading(true);
        const response = await roomsAPI.getAll();
        const roomsData = response.data.data;
        
        // Find the Deluxe Room specifically
        const deluxe = roomsData.find((room: Room) => 
          room.title.toLowerCase().includes('deluxe') && room.isAvailable
        );
        
        if (deluxe) {
          setDeluxeRoom(deluxe);
        } else {
          // Fallback to first available room
          setDeluxeRoom(roomsData.find((room: Room) => room.isAvailable) || null);
        }
      } catch (err: any) {
        console.error('Error fetching deluxe room:', err);
        // Fallback to static data if API fails
        setDeluxeRoom({
          id: 'deluxe-room',
          title: 'Deluxe Room',
          price: 249,
          heroImage: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200',
          galleryImages: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
          ],
          specs: {
            bed: 'King Bed',
            capacity: '3 Adults 1 Children',
            size: '55m²',
            view: 'Sea view',
          },
          subtitle: 'Great for business trip',
          isAvailable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeluxeRoom();
  }, []);

  if (isLoading) {
    return (
      <section className="flex items-center justify-center min-h-[700px] w-full bg-[#1a1a1a]">
        <div className="text-white text-xl">Loading room...</div>
      </section>
    );
  }

  if (!deluxeRoom) {
    return (
      <section className="flex items-center justify-center min-h-[700px] w-full bg-[#1a1a1a]">
        <div className="text-white text-xl">Room not available</div>
      </section>
    );
  }

  // Combine hero image with gallery images for slider
  const allImages = [
    deluxeRoom.heroImage,
    ...(deluxeRoom.galleryImages || [])
  ].filter(Boolean);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <section className="flex flex-col lg:flex-row min-h-[700px] w-full bg-[#1a1a1a] overflow-hidden">
      {/* Left Column: Info Sidebar */}
      <div className="w-full lg:w-[450px] p-12 lg:p-20 flex flex-col justify-center text-white">
        <h2 className="text-4xl font-serif font-medium mb-16 tracking-tight">
          {deluxeRoom.title}
        </h2>

        <div className="mb-16">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-2">
            From
          </p>
          <div className="text-5xl font-bold tracking-tight">
            ${deluxeRoom.price}
          </div>
        </div>

        <div className="space-y-4 mb-20 text-sm">
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">bed:</span>
            <span className="text-slate-300 font-light italic">{deluxeRoom.specs.bed}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">capacity:</span>
            <span className="text-slate-300 font-light italic">{deluxeRoom.specs.capacity}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">room size:</span>
            <span className="text-slate-300 font-light italic">{deluxeRoom.specs.size}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">view:</span>
            <span className="text-slate-300 font-light italic">{deluxeRoom.specs.view}</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">recommend:</span>
            <span className="text-slate-300 font-light italic">{deluxeRoom.subtitle}</span>
          </div>
        </div>

        <div>
          <a 
            href={`/accommodation/${deluxeRoom.id}`}
            className="px-10 py-3 rounded-full border border-white/30 text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-300 inline-block"
          >
            view detail
          </a>
        </div>
      </div>

      {/* Right Column: Image Slider */}
      <div className="flex-grow relative overflow-hidden group select-none">
        {/* Continuous Scroll Container */}
        <div 
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {allImages.map((image, index) => (
            <div
              key={index}
              className="relative min-w-full h-full flex-shrink-0"
            >
              <Image 
                src={image}
                alt={`${deluxeRoom.title} - Image ${index + 1}`}
                fill
                className="object-cover pointer-events-none"
              />
              {/* Overlay for aesthetic */}
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Only show if multiple images */}
        {allImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:bg-white hover:text-black z-20"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button 
              onClick={nextImage}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:bg-white hover:text-black z-20"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Subtle decorative element for that "arch" look from the photo */}
        <div className="absolute inset-0 pointer-events-none border-[40px] border-transparent group-hover:border-black/5 transition-all duration-700"></div>
      </div>
    </section>
  );
};

export default DeluxeRoomH3;
