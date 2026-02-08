'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RoomDetailPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const data = {
    id: 'signature-room',
    title: 'Signature Room',
    subtitle: 'Great for families',
    price: '$299',
    heroImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1920',
    description: [
      "Great choice for a relaxing vacation for families with children or a group of friends.",
      "Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag. Selfies iPhone Kickstarter, drinking vinegar jean vinegar stumptown yr pop-up artisan.",
      "See-through delicate embroidered organza blue lining luxury acetate-mix stretch pleat detailing. Leather detail shoulder contrast colour contour stunning silhouette working peplum. Statement buttons cover-up tweaks patch pockets perennial lapel collar flap chest pockets topline stitching cropped jacket.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel molestie nisl. Duis ac mi leo. Mauris at convallis erat. Aliquam interdum semper luctus."
    ],
    specs: {
      bed: 'King Bed',
      capacity: '3 Adults 2 Children',
      size: '70m²',
      view: 'Sea view'
    },
    gallery: [
      'https://images.unsplash.com/photo-1590073236110-33c0afd3db2f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&q=80&w=1200'
    ],
    otherRooms: [
      { id: 'superior-room', title: 'Superior Room', price: '$199', tag: 'Great for business trip', image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800' },
      { id: 'deluxe-room', title: 'Deluxe Room', price: '$249', tag: 'Great for business trip', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800' },
      { id: 'luxury-suite', title: 'Luxury Suite Room', price: '$399', tag: 'Great for families', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800' }
    ]
  };

  return (
    <div className="bg-white">
      <Header isScrolled={isScrolled} />
      
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
          <div className="lg:w-1/3 lg:border-l lg:pl-12 flex flex-col">
            <div className="mb-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">From</span>
              <span className="text-[56px] font-bold text-[#1a1a1a] leading-none tracking-tighter">{data.price}</span>
            </div>
            <button className="w-full py-4 bg-[#59a4b5] hover:bg-[#4a8a99] text-white rounded-md text-[13px] font-bold uppercase tracking-widest transition-all mb-12 shadow-lg shadow-[#59a4b5]/20">
              Book Now
            </button>
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

      <Footer />
    </div>
  );
};

export default RoomDetailPage;
