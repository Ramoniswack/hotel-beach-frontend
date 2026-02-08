'use client';

import { useState } from 'react';
import { Facebook, Youtube, Instagram, MapPin, Bird } from 'lucide-react';
import Image from 'next/image';

const ContactPageC1: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you shortly.');
  };

  return (
    <div className="bg-white">
      {/* 1. Header Section */}
      <div className="pt-40 pb-16">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
            <h1 className="font-sans text-4xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight leading-tight">
              Located in center of <br /> Santorini, Greece
            </h1>
            <button className="bg-[#66b1be] hover:bg-[#579ea9] text-white text-[11px] font-bold py-3.5 px-8 rounded-full transition-all duration-300 flex items-center gap-2 w-fit shadow-sm">
              <MapPin size={16} strokeWidth={2} />
              Get Direction
            </button>
          </div>
          <p className="text-[#1a1a1a]/60 text-sm font-medium leading-relaxed max-w-2xl">
            Unwind the clock of modern life. Unlock the door to a wonder of the world.
          </p>
        </div>
      </div>

      {/* 2. Map Section */}
      <div className="w-full h-[500px] bg-gray-100 relative mb-20 overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
          alt="Santorini Map" 
          fill
          className="object-cover grayscale opacity-40"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <div className="relative">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                 <div className="w-2.5 h-2.5 bg-hotel-gold rounded-full"></div>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Info Columns */}
      <div className="container mx-auto px-6 lg:px-24 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <h4 className="text-[#1a1a1a] text-[11px] uppercase tracking-[0.3em] font-black mb-6">Our Address</h4>
            <div className="text-[#1a1a1a]/50 text-[13px] leading-loose font-medium">
              <p>45 Santorini Station. Thira 150-0042 Greece</p>
              <p><a href="mailto:revs@hotellerbeach.com" className="text-[#1a1a1a]/80 hover:text-hotel-gold transition-colors underline decoration-[#1a1a1a]/10">revs@hotellerbeach.com</a></p>
            </div>
          </div>
          <div>
            <h4 className="text-[#1a1a1a] text-[11px] uppercase tracking-[0.3em] font-black mb-6">By Car</h4>
            <div className="text-[#1a1a1a]/50 text-[13px] leading-loose font-medium">
              <p>Approximately 5 minutes from Santorini station. or 10 minutes from Thira station.</p>
            </div>
          </div>
          <div>
            <h4 className="text-[#1a1a1a] text-[11px] uppercase tracking-[0.3em] font-black mb-6">By Train</h4>
            <div className="text-[#1a1a1a]/50 text-[13px] leading-loose font-medium">
              <p>7 minutes walk from St. Santorini Station. or 15 minutes walk from Thira Station.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Contact Form & Side Card */}
      <div className="container mx-auto px-6 lg:px-24 pb-32">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Form */}
          <div className="flex-1">
            <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-12 tracking-tight">Do you have any wishes or questions?</h2>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-12">
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/30 block mb-1 group-focus-within:text-hotel-gold transition-colors">Name (*)</label>
                  <input 
                    type="text" 
                    required
                    className="w-full border-b border-gray-200 py-3 text-[14px] font-medium outline-none focus:border-[#1a1a1a] transition-all bg-transparent"
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/30 block mb-1 group-focus-within:text-hotel-gold transition-colors">Email (*)</label>
                  <input 
                    type="email" 
                    required
                    className="w-full border-b border-gray-200 py-3 text-[14px] font-medium outline-none focus:border-[#1a1a1a] transition-all bg-transparent"
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/30 block mb-1 group-focus-within:text-hotel-gold transition-colors">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full border-b border-gray-200 py-3 text-[14px] font-medium outline-none focus:border-[#1a1a1a] transition-all bg-transparent"
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/30 block mb-1 group-focus-within:text-hotel-gold transition-colors">Your Message</label>
                  <textarea 
                    rows={5}
                    className="w-full border-b border-gray-200 py-3 text-[14px] font-medium outline-none focus:border-[#1a1a1a] transition-all resize-none bg-transparent"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4">
                <div className="pt-1">
                  <input 
                    type="checkbox" 
                    id="consent"
                    required
                    className="w-3.5 h-3.5 rounded border-gray-300 text-hotel-gold focus:ring-0 cursor-pointer"
                  />
                </div>
                <label htmlFor="consent" className="text-[11px] font-medium text-[#1a1a1a]/40 cursor-pointer leading-tight">
                  I consent to Hoteller Hotel collecting my details through this form.
                </label>
              </div>

              <button 
                type="submit"
                className="bg-[#66b1be] hover:bg-[#579ea9] text-white text-[11px] font-bold py-3.5 px-10 rounded-full transition-all duration-300 shadow-sm"
              >
                Send
              </button>
            </form>
          </div>

          {/* Right Side Card & Socials */}
          <div className="lg:w-[320px] pt-16">
            <div className="bg-[#fcfcfc] border border-gray-100 p-10 text-center mb-16 rounded-sm shadow-sm">
              <h3 className="text-[13px] font-black text-[#1a1a1a] mb-6 tracking-tight">Hoteller Beach Hotel</h3>
              <div className="text-[#1a1a1a]/40 text-[12px] leading-[2.2] font-medium">
                <p>45 Santorini Station</p>
                <p>Thira 150-0042</p>
                <div className="my-5 border-t border-gray-100 mx-auto w-12"></div>
                <p>Tel.: +41 (0)54 2344 00</p>
                <p>Fax: +41 (0)54 2344 99</p>
                <p><a href="mailto:revs@hotellerbeach.com" className="text-[#1a1a1a]/60 hover:text-hotel-gold transition-colors underline decoration-[#1a1a1a]/10">revs@hotellerbeach.com</a></p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.25em] font-black text-[#1a1a1a] mb-8">Stay in touch with us</p>
              <div className="flex items-center justify-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-[#3b5998] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                  <Facebook size={18} fill="currentColor" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#52c179] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                  <Bird size={18} fill="currentColor" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#e32d2d] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                  <Youtube size={18} fill="currentColor" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#35465d] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPageC1;
