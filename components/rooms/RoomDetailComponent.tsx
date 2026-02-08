'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { rooms, RoomData } from '@/data/roomsData';

interface Props {
  roomId: string;
}

const RoomDetailComponent: React.FC<Props> = ({ roomId }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const data = rooms[roomId] || rooms['superior-room'];

  const handleClearDates = () => {
    setDateRange(undefined);
  };

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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0">
          <Image 
            src={data.heroImage}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-[60px] md:text-[80px] font-bold tracking-tight mb-4">{data.title}</h1>
          <p className="text-[12px] uppercase tracking-[0.4em] font-medium opacity-90 mb-12">{data.subtitle}</p>
          <div className="flex items-center justify-center space-x-8 text-[11px] font-bold uppercase tracking-[0.2em]">
            <a href="#detail" className="hover:text-white/70 border-b border-white pb-1">Detail</a>
            <a href="#amenities" className="hover:text-white/70 transition-colors">Amenities & Services</a>
            <a href="#gallery" className="hover:text-white/70 transition-colors">Gallery</a>
          </div>
        </div>
      </section>

      {/* Main Info Card - Overlapping */}
      <section id="detail" className="max-w-[1100px] mx-auto px-6 -mt-32 relative z-20 mb-24">
        <div className="bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-8 md:p-16 flex flex-col lg:flex-row gap-16">
          {/* Left: Description */}
          <div className="lg:w-2/3">
            <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-8 leading-tight">
              {data.description[0]}
            </h2>
            <div className="space-y-6 text-[#666] text-[15px] leading-[1.8] font-light">
              {data.description.slice(1).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Right: Booking Box */}
          <div className="lg:w-1/3 lg:border-l lg:pl-12 flex flex-col relative">
            <div className="mb-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">From</span>
              <span className="text-[56px] font-bold text-[#1a1a1a] leading-none tracking-tighter">{data.price}</span>
            </div>
            <button 
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="book-now-btn w-full py-4 bg-[#59a4b5] hover:bg-[#4a8a99] text-white rounded-md text-[13px] font-bold uppercase tracking-widest transition-all mb-12 shadow-lg shadow-[#59a4b5]/20"
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
                  <button className="w-full py-3.5 bg-[#59a4b5] hover:bg-[#4a8a99] text-white rounded-full text-[12px] font-bold uppercase tracking-widest transition-all mt-2 shadow-md shadow-[#59a4b5]/10">
                    Check Availability
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6 text-[13px] text-[#1a1a1a]">
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">{data.specs.bed}</span>
              </div>
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium">{data.specs.capacity}</span>
              </div>
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="font-medium">{data.specs.size}</span>
              </div>
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium">{data.specs.view}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities & Services Section */}
      <section id="amenities" className="bg-[#1a1a1a] py-24 text-white">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Amenities */}
          <div className="flex space-x-8">
            <div className="pt-2">
              <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-[20px] font-bold mb-8 tracking-tight">Amenities</h3>
              <ul className="space-y-4 text-[13px] text-gray-400 font-medium">
                {[
                  '40-inch Samsung® LED TV',
                  'Electronic safe with charging facility',
                  'iHome™ Bluetooth MP3 Player',
                  'Iron and ironing board',
                  'Mini bar',
                  'Non-smoking',
                  'USB charging station',
                  'Wired and wireless broadband Internet access',
                  'Work desk'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <span className="text-white text-[10px]">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services */}
          <div className="flex space-x-8">
            <div className="pt-2">
              <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[20px] font-bold mb-8 tracking-tight">Services</h3>
              <ul className="space-y-4 text-[13px] text-gray-400 font-medium">
                {[
                  'Free-to-use smartphone (Free )',
                  'Safe-deposit box (Free )',
                  'Luggage storage (Free )',
                  'Childcare ($60 / Once / Per Accommodation )',
                  'Massage ($15 / Once / Per Guest )'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <span className="text-white text-[10px]">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-4 overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-[700px]">
          {data.gallery.map((img, idx) => (
            <div key={idx} className="h-full overflow-hidden relative">
              <Image 
                src={img}
                alt={`Gallery ${idx + 1}`}
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Cross Sell Section */}
      <section className="bg-white py-32 border-t border-gray-100">
        <div className="max-w-[1300px] mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-[36px] font-bold text-[#1a1a1a] mb-4">Other Rooms</h2>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#bbb]">Could also be interest for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.otherRooms.map((room, idx) => (
              <Link key={idx} href={`/accommodation/${room.id}`} className="group">
                <div className="aspect-[4/3] overflow-hidden mb-8 relative">
                  <Image 
                    src={room.image}
                    alt={room.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-[20px] font-bold text-[#1a1a1a] mb-2">{room.title}</h3>
                  <p className="text-[11px] text-[#999] mb-8">{room.tag}</p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-8">
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">From</span>
                      <span className="text-[22px] font-bold text-[#1a1a1a]">{room.price}</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 group-hover:text-[#59a4b5] group-hover:border-[#59a4b5] transition-colors">
                      View Detail
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomDetailComponent;
