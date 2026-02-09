'use client';

import { useState } from 'react';
import { Facebook, Youtube, Instagram, MapPin, Bird } from 'lucide-react';
import Image from 'next/image';

interface Section {
  sectionId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  items?: any[];
  buttonText?: string;
  buttonLink?: string;
  isVisible: boolean;
}

interface ContactPageC1Props {
  sections: Section[];
}

const ContactPageC1: React.FC<ContactPageC1Props> = ({ sections }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false
  });

  const getSection = (id: string) => sections.find(s => s.sectionId === id && s.isVisible);
  
  const header = getSection('header');
  const map = getSection('map');
  const infoColumns = getSection('info-columns');
  const contactForm = getSection('contact-form');
  const contactInfo = getSection('contact-info');
  const socialMedia = getSection('social-media');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you shortly.');
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook size={18} fill="currentColor" />;
      case 'twitter': return <Bird size={18} fill="currentColor" />;
      case 'youtube': return <Youtube size={18} fill="currentColor" />;
      case 'instagram': return <Instagram size={18} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white">
      {/* 1. Header Section */}
      {(sections.length === 0 || header) && (
        <div className="pt-40 pb-16">
          <div className="container mx-auto px-6 lg:px-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
              <h1 className="font-sans text-4xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight leading-tight">
                {header?.title || 'Located in center of Santorini, Greece'}
              </h1>
              <a 
                href={header?.buttonLink || 'https://maps.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#66b1be] hover:bg-[#579ea9] text-white text-[11px] font-bold py-3.5 px-8 rounded-full transition-all duration-300 flex items-center gap-2 w-fit shadow-sm"
              >
                <MapPin size={16} strokeWidth={2} />
                {header?.buttonText || 'Get Direction'}
              </a>
            </div>
            <p className="text-[#1a1a1a]/60 text-sm font-medium leading-relaxed max-w-2xl">
              {header?.subtitle || 'Unwind the clock of modern life. Unlock the door to a wonder of the world.'}
            </p>
          </div>
        </div>
      )}

      {/* 2. Map Section */}
      {(sections.length === 0 || map) && (
        <div className="w-full h-[500px] bg-gray-100 relative mb-20 overflow-hidden">
          <Image 
            src={map?.images?.[0] || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000'} 
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
      )}

      {/* 3. Info Columns */}
      {(sections.length === 0 || infoColumns) && (
        <div className="container mx-auto px-6 lg:px-24 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {(infoColumns?.items || [
              { title: 'Our Address', content: '45 Santorini Station. Thira 150-0042 Greece\nrevs@hotellerbeach.com' },
              { title: 'By Car', content: 'Approximately 5 minutes from Santorini station. or 10 minutes from Thira station.' },
              { title: 'By Train', content: '7 minutes walk from St. Santorini Station. or 15 minutes walk from Thira Station.' }
            ]).map((item: any, idx: number) => (
              <div key={idx}>
                <h4 className="text-[#1a1a1a] text-[11px] uppercase tracking-[0.3em] font-black mb-6">{item.title}</h4>
                <div className="text-[#1a1a1a]/50 text-[13px] leading-loose font-medium whitespace-pre-line">
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Contact Form & Side Card */}
      <div className="container mx-auto px-6 lg:px-24 pb-32">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Form */}
          {(sections.length === 0 || contactForm) && (
            <div className="flex-1">
              <h2 className="text-[26px] font-bold text-[#1a1a1a] mb-12 tracking-tight">
                {contactForm?.title || 'Do you have any wishes or questions?'}
              </h2>
              
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
                    {contactForm?.description || 'I consent to Hoteller Hotel collecting my details through this form.'}
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
          )}

          {/* Right Side Card & Socials */}
          <div className="lg:w-[320px] pt-16">
            {(sections.length === 0 || contactInfo) && (
              <div className="bg-[#fcfcfc] border border-gray-100 p-10 text-center mb-16 rounded-sm shadow-sm">
                <h3 className="text-[13px] font-black text-[#1a1a1a] mb-6 tracking-tight">
                  {contactInfo?.title || 'Hoteller Beach Hotel'}
                </h3>
                <div className="text-[#1a1a1a]/40 text-[12px] leading-[2.2] font-medium">
                  {(contactInfo?.items || [
                    { type: 'address', content: '45 Santorini Station\nThira 150-0042' },
                    { type: 'contact', content: 'Tel.: +41 (0)54 2344 00\nFax: +41 (0)54 2344 99\nrevs@hotellerbeach.com' }
                  ]).map((item: any, idx: number) => (
                    <div key={idx}>
                      <div className="whitespace-pre-line">{item.content}</div>
                      {idx === 0 && <div className="my-5 border-t border-gray-100 mx-auto w-12"></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(sections.length === 0 || socialMedia) && (
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-[#1a1a1a] mb-8">
                  {socialMedia?.title || 'Stay in touch with us'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {(socialMedia?.items || [
                    { platform: 'facebook', url: '#', color: '#3b5998' },
                    { platform: 'twitter', url: '#', color: '#52c179' },
                    { platform: 'youtube', url: '#', color: '#e32d2d' },
                    { platform: 'instagram', url: '#', color: '#35465d' }
                  ]).map((item: any, idx: number) => (
                    <a 
                      key={idx}
                      href={item.url} 
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                      style={{ backgroundColor: item.color }}
                    >
                      {getSocialIcon(item.platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPageC1;
