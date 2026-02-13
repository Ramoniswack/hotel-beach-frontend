'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { rooms } from '@/data/roomsData';

const DeluxeRoomH3: React.FC = () => {
  const deluxeRoom = rooms['deluxe-room'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Combine hero image with gallery images for slider
  const allImages = [
    deluxeRoom.heroImage,
    ...deluxeRoom.gallery
  ];

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % allImages.length;
    setCurrentImageIndex(newIndex);
    setScrollOffset(0);
  };

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    setCurrentImageIndex(newIndex);
    setScrollOffset(0);
  };

  // Drag handlers
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
      nextImage();
    } else if (scrollOffset < -100) {
      prevImage();
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
    <section className="flex flex-col lg:flex-row w-full bg-[#1a1a1a] overflow-hidden">
      {/* Left Column: Info Sidebar */}
      <div className="w-full lg:w-[450px] p-6 sm:p-8 md:p-12 lg:p-20 flex flex-col justify-center text-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium mb-8 sm:mb-12 md:mb-16 tracking-tight">
          {deluxeRoom.title}
        </h2>

        <div className="mb-8 sm:mb-12 md:mb-16">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-2">
            From
          </p>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {deluxeRoom.price}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-12 sm:mb-16 md:mb-20 text-xs sm:text-sm">
          <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">bed:</span>
            <span className="text-slate-300 font-light italic">{deluxeRoom.specs.bed}</span>
          </div>
          <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">capacity:</span>
            <span className="text-slate-300 font-light italic">{deluxeRoom.specs.capacity}</span>
          </div>
          <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">room size:</span>
            <span className="text-slate-300 font-light italic">{deluxeRoom.specs.size}</span>
          </div>
          <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">view:</span>
            <span className="text-slate-300 font-light italic">{deluxeRoom.specs.view}</span>
          </div>
          <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[110px_1fr] items-start">
            <span className="font-bold tracking-wider text-slate-100">recommend:</span>
            <span className="text-slate-300 font-light italic">{deluxeRoom.subtitle}</span>
          </div>
        </div>

        <div>
          <a 
            href={`/accommodation/${deluxeRoom.id}`}
            className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full border border-white text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-300 inline-block tap-target"
          >
            view detail
          </a>
        </div>
      </div>

      {/* Right Column: Image Slider with Preview */}
      <div 
        ref={sliderRef}
        className="w-full lg:flex-grow relative overflow-hidden h-[400px] sm:h-[500px] lg:h-auto lg:min-h-[600px]"
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
            transform: `translateX(calc(-${currentImageIndex} * 100% - ${scrollOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {allImages.map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 h-full w-full"
            >
              <Image 
                src={image}
                alt={`${deluxeRoom.title} - Image ${index + 1}`}
                fill
                className="object-cover pointer-events-none select-none"
                draggable={false}
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white transition-all hover:scale-110 z-20 bg-black/30 backdrop-blur-sm rounded-full tap-target"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button 
              onClick={nextImage}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white transition-all hover:scale-110 z-20 bg-black/30 backdrop-blur-sm rounded-full tap-target"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setScrollOffset(0);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DeluxeRoomH3;
