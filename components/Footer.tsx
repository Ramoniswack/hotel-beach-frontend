'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { contentAPI } from '@/lib/api';

interface FooterSection {
  section: string;
  title?: string;
  content?: string;
  images?: string[];
  links?: { label: string; url: string }[];
}

const Footer: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterSection[]>([
    {
      section: 'address',
      title: 'OUR ADDRESS',
      content: 'Hoteller Beach Hotel\n45 Santorini Station\nThira 150-0042'
    },
    {
      section: 'reservation',
      title: 'RESERVATION',
      content: 'Tel.: +41 (0)54 2344 00\nFax: +41 (0)54 2344 99\nrevs@hotellerbeach.com'
    },
    {
      section: 'newsletter',
      title: 'NEWSLETTER',
      content: 'Subscribe to our newsletter'
    },
    {
      section: 'awards',
      title: 'AWARDS',
      images: [
        'https://hoteller-beach.themegoods.com/wp-content/uploads/2017/08/logo-tripadvisor.png',
        'https://hoteller-beach.themegoods.com/wp-content/uploads/2017/08/logo-asean.png'
      ]
    },
    {
      section: 'copyright',
      content: '© Copyright Hoteller Theme Demo - Theme by ThemeGoods'
    },
    {
      section: 'footer-links',
      links: [
        { label: 'Home', url: '/' },
        { label: 'Our Rooms', url: '/rooms' },
        { label: 'About Us', url: '/about' },
        { label: 'Contact', url: '/contact' },
        { label: 'Terms and Conditions', url: '#' }
      ]
    }
  ]);

  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const response = await contentAPI.getByPage('site-settings');
        const footerSection = response.data.data.sections.find((s: any) => s.sectionId === 'footer');
        if (footerSection && footerSection.items) {
          setFooterData(footerSection.items);
        }
      } catch (error) {
        console.error('Error fetching footer settings:', error);
      }
    };
    fetchFooterSettings();
  }, []);

  const getSection = (sectionName: string) => footerData.find(s => s.section === sectionName);
  
  const addressSection = getSection('address');
  const reservationSection = getSection('reservation');
  const newsletterSection = getSection('newsletter');
  const awardsSection = getSection('awards');
  const copyrightSection = getSection('copyright');
  const linksSection = getSection('footer-links');

  return (
    <footer className="relative z-10 bg-[#1a1a1a] pt-16 sm:pt-20 md:pt-24 pb-0 overflow-hidden font-roboto w-full">
      {/* Wave Decorative Divider - Flipped horizontally (slant opposite) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-360 scale-x-[-1]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[40px] sm:h-[50px] md:h-[60px] fill-white"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-28 py-8 sm:py-10 md:py-12 overflow-x-hidden">
        <div className="w-full max-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          {/* Our Address */}
          {addressSection && (
            <div className="w-full">
              <h4 className="text-white text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                {addressSection.title}
              </h4>
              <div 
                className="text-white space-y-1 text-[13px] sm:text-sm md:text-[15px] leading-relaxed"
                style={{ 
                  fontFamily: 'Raleway', 
                  fontWeight: 400, 
                  letterSpacing: '0px', 
                  textTransform: 'none' 
                }}
              >
                {addressSection.content?.split('\n').map((line, idx) => (
                  <p key={idx} className={idx === 0 ? 'font-extrabold tracking-tight' : 'font-medium opacity-90'}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Reservation */}
          {reservationSection && (
            <div className="w-full">
              <h4 className="text-white text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                {reservationSection.title}
              </h4>
              <div 
                className="text-white space-y-1 text-[13px] sm:text-sm md:text-[15px] leading-relaxed break-words"
                style={{ 
                  fontFamily: 'Raleway', 
                  fontWeight: 400, 
                  letterSpacing: '0px', 
                  textTransform: 'none' 
                }}
              >
                {reservationSection.content?.split('\n').map((line, idx) => {
                  if (line.includes('@')) {
                    return (
                      <p key={idx} className="break-all">
                        <a href={`mailto:${line}`} className="text-white border-b border-white hover:border-[#5fb2c1] transition-colors">
                          {line}
                        </a>
                      </p>
                    );
                  }
                  return <p key={idx}>{line}</p>;
                })}
              </div>
            </div>
          )}

          {/* Newsletter */}
          {newsletterSection && (
            <div className="w-full">
              <h4 className="text-white text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                {newsletterSection.title}
              </h4>
              <form className="space-y-4 sm:space-y-5 md:space-y-6 w-full max-w-[260px]">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full bg-transparent border-b border-white pb-1 text-white text-[11px] sm:text-xs md:text-[13px] outline-none focus:border-[#5fb2c1] transition-colors font-medium placeholder:text-white/80"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#5fb2c1] hover:bg-[#4ea1af] text-white text-[10px] sm:text-[11px] md:text-xs font-bold py-2.5 sm:py-3 md:py-3.5 px-5 sm:px-6 md:px-8 rounded-full transition-all duration-300 transform active:scale-95 shadow-lg"
                >
                  Subscribe
                </button>
              </form>
            </div>
          )}

          {/* Awards */}
          {awardsSection && awardsSection.images && (
            <div className="w-full">
              <h4 className="text-white text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                {awardsSection.title}
              </h4>
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                {awardsSection.images.map((img, idx) => (
                  <Image 
                    key={idx}
                    src={img} 
                    alt={`Award ${idx + 1}`} 
                    width={56}
                    height={56}
                    className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain brightness-125" 
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div 
          className="w-full max-w-full pt-6 sm:pt-8 md:pt-10 pb-6 sm:pb-8 border-t border-white/20 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6 text-[11px] sm:text-xs md:text-[13px]"
          style={{ 
            fontFamily: 'Raleway', 
            fontWeight: 500, 
            letterSpacing: '0px', 
            lineHeight: 1.6, 
            textTransform: 'none' 
          }}
        >
          <p className="text-white text-center lg:text-left px-2">{copyrightSection?.content}</p>
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-4 md:gap-5 lg:gap-6 text-white px-2">
            {linksSection?.links?.map((link, idx) => (
              <Link key={idx} href={link.url} className="hover:opacity-70 transition-opacity whitespace-nowrap text-[11px] sm:text-xs md:text-[13px]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
