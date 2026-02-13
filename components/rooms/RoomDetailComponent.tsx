'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { roomsAPI } from '@/lib/api';
import { rooms as fallbackRooms } from '@/data/roomsData';

interface Props {
  roomId: string;
}

interface RoomData {
  _id: string;
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  price: number;
  description: string[];
  specs: {
    bed: string;
    capacity: string;
    size: string;
    view: string;
  };
  gallery: string[];
  amenities?: string[];
  services?: string[];
  isAvailable: boolean;
}

const RoomDetailComponent: React.FC<Props> = ({ roomId }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  
  // Gallery slider states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const galleryRef = React.useRef<HTMLDivElement>(null);
  
  // Room data states
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  
  // Availability check states
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Fetch room data from API
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setIsLoadingRoom(true);
        const response = await roomsAPI.getById(roomId);
        setRoomData(response.data.data);
      } catch (error) {
        console.error('Error fetching room:', error);
        // Fallback to static data if API fails
        const fallbackData = fallbackRooms[roomId] || fallbackRooms['superior-room'];
        setRoomData({
          _id: roomId,
          id: roomId,
          title: fallbackData.title,
          subtitle: fallbackData.subtitle,
          heroImage: fallbackData.heroImage,
          price: parseInt(fallbackData.price.replace('$', '')),
          description: fallbackData.description,
          specs: fallbackData.specs,
          gallery: fallbackData.gallery,
          isAvailable: true,
        });
      } finally {
        setIsLoadingRoom(false);
      }
    };

    fetchRoomData();
  }, [roomId]);
  
  // Gallery slider handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - galleryRef.current.offsetLeft);
    setScrollLeft(galleryRef.current.scrollLeft);
    galleryRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    galleryRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (galleryRef.current) {
      galleryRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (galleryRef.current) {
        galleryRef.current.style.cursor = 'grab';
      }
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - galleryRef.current.offsetLeft);
    setScrollLeft(galleryRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !galleryRef.current) return;
    const x = e.touches[0].pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    galleryRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Check availability - redirect to search results
  const handleCheckAvailability = () => {
    if (!dateRange?.from || !dateRange?.to) {
      setAvailabilityError('Please select check-in and check-out dates');
      return;
    }

    // Redirect to search results page with query params
    const checkIn = format(dateRange.from, 'yyyy-MM-dd');
    const checkOut = format(dateRange.to, 'yyyy-MM-dd');
    window.location.href = `/search-results?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`;
  };

  // Reset availability error when dates change
  useEffect(() => {
    setAvailabilityError(null);
  }, [dateRange]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showBookingForm && !target.closest('.booking-popup') && !target.closest('.book-now-btn')) {
        setShowBookingForm(false);
      }
      if (showCalendar && !target.closest('.calendar-container') && !target.closest('.date-input')) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBookingForm, showCalendar]);

  // Show loading state
  if (isLoadingRoom) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  // Show error if no room data
  if (!roomData) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl">Room not found</p>
          <Link href="/rooms" className="text-[#59a4b5] hover:underline mt-4 inline-block">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0">
          <Image 
            src={roomData.heroImage}
            alt={roomData.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] xl:text-[80px] font-bold tracking-tight mb-3 sm:mb-4">{roomData.title}</h1>
          <p className="text-[10px] sm:text-[11px] md:text-[12px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-medium opacity-90 mb-8 sm:mb-10 md:mb-12">{roomData.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
            <a href="#detail" className="hover:text-white/70 border-b border-white pb-1">Detail</a>
            <a href="#amenities" className="hover:text-white/70 transition-colors">Amenities & Services</a>
            <a href="#gallery" className="hover:text-white/70 transition-colors">Gallery</a>
          </div>
        </div>
      </section>

      {/* Main Info Card - Overlapping */}
      <section id="detail" className="max-w-[1100px] mx-auto px-4 sm:px-6 -mt-16 sm:-mt-24 md:-mt-32 relative z-20 mb-16 sm:mb-20 md:mb-24">
        <div className="bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] sm:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-10 sm:gap-12 md:gap-16">
          {/* Left: Description */}
          <div className="lg:w-2/3">
            <h2 className="text-xl sm:text-2xl md:text-[24px] font-bold text-[#1a1a1a] mb-6 sm:mb-8 leading-tight">
              {roomData.description[0]}
            </h2>
            <div className="space-y-4 sm:space-y-6 text-[#666] text-sm sm:text-[15px] leading-[1.7] sm:leading-[1.8] font-light">
              {roomData.description.slice(1).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Right: Booking Box */}
          <div className="lg:w-1/3 lg:border-l lg:pl-8 xl:pl-12 flex flex-col relative">
            <div className="mb-8 sm:mb-10">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">From</span>
              <span className="text-4xl sm:text-5xl md:text-[56px] font-bold text-[#1a1a1a] leading-none tracking-tighter">${roomData.price}</span>
            </div>
            <button 
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="book-now-btn w-full py-3 sm:py-3.5 md:py-4 bg-[#59a4b5] hover:bg-[#4a8a99] text-white rounded-md text-xs sm:text-[13px] font-bold uppercase tracking-widest transition-all mb-8 sm:mb-10 md:mb-12 shadow-lg shadow-[#59a4b5]/20"
            >
              Book Now
            </button>

            {/* Booking Form Popup */}
            {showBookingForm && (
              <div className="booking-popup absolute top-full left-0 right-0 mt-2 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] rounded-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-6">
                  <div className="relative">
                    <label className="text-[11px] font-bold text-[#1a1a1a] block mb-2">Check-in Date <span className="text-red-400">*</span></label>
                    <input 
                      type="text" 
                      value={dateRange?.from ? format(dateRange.from, 'MMM dd, yyyy') : ''} 
                      placeholder="Check-in Date"
                      onClick={() => setShowCalendar(!showCalendar)}
                      readOnly
                      className="date-input w-full border-b border-gray-300 py-2 text-[14px] cursor-pointer hover:border-[#59a4b5] transition-colors text-gray-600"
                    />
                    
                    {/* Calendar Dropdown - appears below check-in field */}
                    {showCalendar && (
                      <div className="calendar-container absolute top-full left-0 mt-2 z-[60] shadow-2xl">
                        <DateRangePicker
                          date={dateRange}
                          onDateChange={setDateRange}
                          onClose={() => setShowCalendar(false)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-[11px] font-bold text-[#1a1a1a] block mb-2">Check-out Date <span className="text-red-400">*</span></label>
                    <input 
                      type="text" 
                      value={dateRange?.to ? format(dateRange.to, 'MMM dd, yyyy') : ''} 
                      placeholder="Check-out Date"
                      readOnly
                      className="w-full border-b border-gray-300 py-2 text-[14px] bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#1a1a1a] block mb-2">Adults</label>
                      <select 
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-sm p-2 text-[13px] bg-white appearance-none cursor-pointer"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#1a1a1a] block mb-2">Children</label>
                      <select 
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-sm p-2 text-[13px] bg-white appearance-none cursor-pointer"
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </div>
                  </div>

                  {availabilityError && (
                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <p className="text-yellow-800 text-xs">{availabilityError}</p>
                    </div>
                  )}

                  <button 
                    onClick={handleCheckAvailability}
                    disabled={!dateRange?.from || !dateRange?.to}
                    className="w-full py-3.5 bg-[#59a4b5] hover:bg-[#4a8a99] text-white rounded-full text-[12px] font-bold uppercase tracking-widest transition-all mt-2 shadow-md shadow-[#59a4b5]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>Check Availability</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-xs sm:text-[13px] text-[#1a1a1a]">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">{roomData.specs.bed}</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium">{roomData.specs.capacity}</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="font-medium">{roomData.specs.size}</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium">{roomData.specs.view}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities & Services Section */}
      <section id="amenities" className="bg-[#1a1a1a] py-16 sm:py-20 md:py-24 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-32">
          {/* Amenities */}
          <div className="flex space-x-6 sm:space-x-8">
            <div className="pt-2">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl md:text-[20px] font-bold mb-6 sm:mb-8 tracking-tight">Amenities</h3>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-[13px] text-gray-400 font-medium">
                {roomData.amenities && roomData.amenities.length > 0 ? (
                  roomData.amenities.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <span className="text-white text-[10px]">›</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No amenities listed</li>
                )}
              </ul>
            </div>
          </div>

          {/* Services */}
          <div className="flex space-x-6 sm:space-x-8">
            <div className="pt-2">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl md:text-[20px] font-bold mb-6 sm:mb-8 tracking-tight">Services</h3>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-[13px] text-gray-400 font-medium">
                {roomData.services && roomData.services.length > 0 ? (
                  roomData.services.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <span className="text-white text-[10px]">›</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No services listed</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="max-w-full px-4 sm:px-6 md:px-8">
          <div 
            ref={galleryRef}
            className="flex gap-4 sm:gap-6 overflow-x-scroll scrollbar-hide cursor-grab active:cursor-grabbing select-none scroll-smooth"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {roomData.gallery.map((img, idx) => (
              <div 
                key={idx} 
                className="relative flex-shrink-0 w-[280px] sm:w-[350px] md:w-[450px] lg:w-[550px] h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-sm"
              >
                <Image 
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  fill
                  className="object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross Sell Section */}
      <section className="bg-white py-20 sm:py-24 md:py-28 lg:py-32 border-t border-gray-100">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-[#1a1a1a] mb-3 sm:mb-4">Other Rooms</h2>
            <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#1a1a1a]">Could also be interest for you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {/* Use fallback data for other rooms section */}
            {fallbackRooms[roomId]?.otherRooms?.map((room: any, idx: number) => (
              <Link key={idx} href={`/accommodation/${room.id}`} className="group">
                <div className="aspect-[4/3] overflow-hidden mb-6 sm:mb-8 relative">
                  <Image 
                    src={room.image}
                    alt={room.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  {/* Cross animation */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="absolute left-0 top-1/2 h-[1px] w-0 bg-white -translate-y-1/2 group-hover:w-[40px] group-hover:left-[calc(50%-20px)] transition-all duration-500 ease-out delay-100"></div>
                    <div className="absolute top-0 left-1/2 w-[1px] h-0 bg-white -translate-x-1/2 group-hover:h-[40px] group-hover:top-[calc(50%-20px)] transition-all duration-500 ease-out"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl md:text-[20px] font-bold text-[#1a1a1a] mb-2">{room.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-[#999] mb-6 sm:mb-8">{room.tag}</p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-6 sm:pt-8">
                    <div className="flex flex-col items-start">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-400">From</span>
                      <span className="text-xl sm:text-[22px] font-bold text-[#1a1a1a]">{room.price}</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 group-hover:text-[#59a4b5] group-hover:border-[#59a4b5] transition-colors">
                      View Detail
                    </span>
                  </div>
                </div>
              </Link>
            )) || (
              <p className="col-span-full text-center text-gray-500">No other rooms available</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomDetailComponent;
