'use client';

import React, { useState } from 'react';
import { Facebook, Youtube, Instagram, MapPin, Twitter, Linkedin } from 'lucide-react';

// --- Types ---
interface SectionItem {
  title?: string;
  content?: string;
  type?: string;
  platform?: string;
  url?: string;
  color?: string;
}

interface Section {
  sectionId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  items?: SectionItem[];
  buttonText?: string;
  buttonLink?: string;
  isVisible: boolean;
}

interface ContactPageC1Props {
  sections?: Section[];
}

// --- Component ---
const ContactPageC1: React.FC<ContactPageC1Props> = ({ sections = [] }) => {
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
      case 'twitter': return <Twitter size={18} fill="currentColor" />;
      case 'youtube': return <Youtube size={18} fill="currentColor" />;
      case 'instagram': return <Instagram size={18} />;
      case 'linkedin': return <Linkedin size={18} fill="currentColor" />;
      default: return null;
    }
  };

  const defaultSections = sections.length === 0;

  return (
    <div className="bg-white text-[#1a1a1a] selection:bg-[#66b1be] selection:text-white">
      {/* 1. Header Section */}
      {(defaultSections || header) && (
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-6 lg:px-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-6">
              <div className="flex-1">
                <h1 className="text-4xl md:text-[42px] font-bold text-[#1a1a1a] tracking-tight leading-[1.15] max-w-xl">
                  {header?.title || "Located in center of Santorini, Greece"}
                </h1>
              </div>
              <div className="flex items-center pb-2">
                <a 
                  href={header?.buttonLink || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#66b1be] hover:bg-[#579ea9] text-white text-[12px] uppercase tracking-wider font-bold py-2.5 px-6 rounded-full transition-all duration-300 flex items-center gap-2 w-fit shadow-md hover:-translate-y-0.5"
                >
                  <MapPin size={14} fill="currentColor" />
                  {header?.buttonText || 'Get Direction'}
                </a>
              </div>
            </div>
            <p className="text-black text-[15px] font-normal leading-relaxed max-w-2xl mt-8">
              {header?.subtitle || 'Unwind the clock of modern life. Unlock the door to a wonder of the world.'}
            </p>
          </div>
        </div>
      )}

      {/* 2. Map Section */}
      {(defaultSections || map) && (
        <div className="w-full h-[520px] bg-[#f5f5f5] relative mt-12 mb-20 overflow-hidden border-y border-gray">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(map?.description || 'Santorini, Greece')}&output=embed&z=13`}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(100%) contrast(0.8) brightness(1.1)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          ></iframe>
        </div>
      )}

      {/* 3. Info Columns */}
      {(defaultSections || infoColumns) && (
        <div className="container mx-auto px-6 lg:px-32 mb-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
            {(infoColumns?.items || [
              { title: 'Our Address', content: '45 Santorini Station. Thira 150-0042 Greece\nrevs@hotellerbeach.com' },
              { title: 'By Car', content: 'Approximately 5 minutes from Santorini station, or 10 minutes from Thira station.' },
              { title: 'By Train', content: '7 minutes walk from St. Santorini Station, or 15 minutes walk from Thira Station.' }
            ]).map((item: SectionItem, idx: number) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-black text-[13px] font-bold tracking-normal uppercase tracking-[0.2em]">
                  {item.title}
                </h4>
                <div className="text-black text-[15px] leading-[1.8] font-normal whitespace-pre-line" style={{ fontFamily: 'Raleway', letterSpacing: '0px' }}>
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Contact Form & Side Card */}
      <div className="container mx-auto px-6 lg:px-32 pb-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Form */}
          {(defaultSections || contactForm) && (
            <div className="flex-1">
              <h2 className="text-[32px] font-bold text-[#1a1a1a] mb-16 tracking-tight">
                {contactForm?.title || 'Do you have any wishes or questions?'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-12">
                  <div className="relative">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-black block mb-2">
                      Name (*)
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder=""
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border-b border-black pb-3 text-[15px] font-medium outline-none focus:border-[#1a1a1a] transition-colors bg-transparent placeholder:text-transparent"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-black block mb-2">
                      Email (*)
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder=""
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border-b border-black pb-3 text-[15px] font-medium outline-none focus:border-[#1a1a1a] transition-colors bg-transparent placeholder:text-transparent"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-black block mb-2">
                      Phone
                    </label>
                    <input 
                      type="tel" 
                      placeholder=""
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border-b border-black pb-3 text-[15px] font-medium outline-none focus:border-[#1a1a1a] transition-colors bg-transparent placeholder:text-transparent"
                    />
                  </div>

                  <div className="relative pt-4">
                    <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-black block mb-2">
                      Your Message
                    </label>
                    <textarea 
                      rows={1}
                      placeholder=""
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full border-b border-black pb-3 text-[15px] font-medium outline-none focus:border-[#1a1a1a] transition-colors resize-none bg-transparent overflow-hidden placeholder:text-transparent min-h-[40px]"
                    ></textarea>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input 
                    type="checkbox" 
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    className="w-4 h-4 rounded border-black text-[#66b1be] focus:ring-[#66b1be] cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-[13px] font-normal text-black cursor-pointer leading-tight">
                    {contactForm?.description || 'I consent to Hoteller Hotel collecting my details through this form.'}
                  </label>
                </div>

                <button 
                  type="submit"
                  className="bg-[#66b1be] hover:bg-[#579ea9] text-white text-[12px] uppercase tracking-wider font-bold py-3 px-12 rounded-full transition-all duration-300 shadow-md hover:-translate-y-0.5 mt-4"
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* Right Side Card & Socials */}
          <div className="lg:w-[360px] pt-12">
            {(defaultSections || contactInfo) && (
              <div className="bg-[#F9F9F9] border-[4px] border-double border-black mx-5 p-[30px] text-center mb-16 rounded-sm shadow-sm relative">
                <h3 className="text-[15px] font-extrabold text-black mb-10 tracking-[0.1em] uppercase">
                  {contactInfo?.title || 'Hoteller Beach Hotel'}
                </h3>
                <div className="text-black text-[14px] leading-[2.4] font-medium">
                  {(contactInfo?.items || [
                    { type: 'address', content: '45 Santorini Station\nThira 150-0042' },
                    { type: 'contact', content: 'Tel.: +41 (0)54 2344 00\nFax: +41 (0)54 2344 99\nrevs@hotellerbeach.com' }
                  ]).map((item: SectionItem, idx: number) => (
                    <div key={idx}>
                      <div className="whitespace-pre-line">{item.content}</div>
                      {idx === 0 && <div className="my-8 border-t border-black mx-auto w-12"></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(defaultSections || socialMedia) && (
              <div className="text-center">
                <p className="text-[13px] font-bold text-[#1a1a1a] mb-8 tracking-tight">
                  {socialMedia?.title || 'Stay in touch with us'}
                </p>
                <div className="flex items-center justify-center gap-4">
                  {(socialMedia?.items || [
                    { platform: 'facebook', url: '#', color: '#3b5998' },
                    { platform: 'twitter', url: '#', color: '#1DA1F2' },
                    { platform: 'youtube', url: '#', color: '#cd201f' },
                    { platform: 'instagram', url: '#', color: '#E4405F' }
                  ]).map((item: SectionItem, idx: number) => (
                    <a 
                      key={idx}
                      href={item.url} 
                      className="w-11 h-11 rounded-full text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                      style={{ backgroundColor: item.color }}
                      title={item.platform}
                    >
                      {getSocialIcon(item.platform || '')}
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
