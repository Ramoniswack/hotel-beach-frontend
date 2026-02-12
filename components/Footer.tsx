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
    <footer className="relative z-10 bg-[#1a1a1a] pt-24 pb-0 overflow-hidden font-roboto">
      {/* Wave Decorative Divider - Flipped horizontally (slant opposite) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-360 scale-x-[-1]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="relative z-10 px-28 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
          {/* Our Address */}
          {addressSection && (
            <div>
              <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-10">
                {addressSection.title}
              </h4>
              <div 
                className="text-white space-y-1 whitespace-pre-line"
                style={{ 
                  fontFamily: 'Raleway', 
                  fontSize: '15px', 
                  fontWeight: 400, 
                  letterSpacing: '0px', 
                  lineHeight: 1.7, 
                  textTransform: 'none' 
                }}
              >
                {addressSection.content?.split('\n').map((line, idx) => (
                  <p key={idx} className={idx === 0 ? 'font-extrabold text-[15px] tracking-tight' : 'font-medium opacity-90'}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Reservation */}
          {reservationSection && (
            <div>
              <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-10">
                {reservationSection.title}
              </h4>
              <div 
                className="text-white space-y-1 whitespace-pre-line"
                style={{ 
                  fontFamily: 'Raleway', 
                  fontSize: '15px', 
                  fontWeight: 400, 
                  letterSpacing: '0px', 
                  lineHeight: 1.7, 
                  textTransform: 'none' 
                }}
              >
                {reservationSection.content?.split('\n').map((line, idx) => {
                  if (line.includes('@')) {
                    return (
                      <p key={idx}>
                        <a href={`mailto:${line}`} className="text-hotel-white border-b border-hotel-white hover:border-hotel-gold transition-colors pb-0">
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
            <div>
              <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-10">
                {newsletterSection.title}
              </h4>
              <form className="space-y-6 max-w-[260px]">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full bg-transparent border-b border-white pb-0 text-white text-[13px] outline-none focus:border-hotel-gold transition-colors font-medium placeholder:text-white"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#5fb2c1] hover:bg-[#4ea1af] text-white text-xs font-bold py-3.5 px-8 rounded-full transition-all duration-300 transform active:scale-95 shadow-lg"
                >
                  Subscribe
                </button>
              </form>
            </div>
          )}

          {/* Awards */}
          {awardsSection && awardsSection.images && (
            <div>
              <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-10">
                {awardsSection.title}
              </h4>
              <div className="flex items-center space-x-6">
                {awardsSection.images.map((img, idx) => (
                  <Image 
                    key={idx}
                    src={img} 
                    alt={`Award ${idx + 1}`} 
                    width={56}
                    height={56}
                    className="h-14 w-auto object-contain brightness-125" 
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-10 border-t border-white/20 flex flex-col lg:flex-row justify-between items-center px-10"
          style={{ 
            fontFamily: 'Raleway', 
            fontSize: '13px', 
            fontWeight: 500, 
            letterSpacing: '0px', 
            lineHeight: 1.7, 
            textTransform: 'none' 
          }}
        >
          <p className="text-white">{copyrightSection?.content}</p>
          <div className="flex items-center space-x-6 mt-6 lg:mt-0 text-white">
            {linksSection?.links?.map((link, idx) => (
              <Link key={idx} href={link.url} className="hover:opacity-70 transition-opacity">
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
