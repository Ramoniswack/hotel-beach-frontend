import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Section {
  sectionId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  items?: any[];
  isVisible: boolean;
}

interface ExplorePageE1Props {
  sections: Section[];
}

const ExplorePageE1: React.FC<ExplorePageE1Props> = ({ sections }) => {
  const getSection = (id: string) => sections.find(s => s.sectionId === id && s.isVisible);
  
  const header = getSection('header');
  const heroImage = getSection('hero-image');
  const content = getSection('content');
  const gallery = getSection('image-gallery');
  const closingText = getSection('closing-text');
  const ourRooms = getSection('our-rooms');

  return (
    <section className="bg-white">
      {/* Header Section */}
      {(sections.length === 0 || header) && (
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8 pt-24 pb-16">
          <h2 className="text-[36px] md:text-[48px] font-bold mb-8 tracking-tight text-[#1a1a1a]">
            {header?.title || 'Explore Santorini'}
          </h2>
          <p className="text-[#666] text-[15px] font-normal mb-10">
            {header?.subtitle || 'Unwind the clock of modern life. Unlock the door to a wonder of the world.'}
          </p>
          <div className="max-w-4xl">
            <p className="text-[#666] text-[14px] leading-[1.8] mb-6 font-light">
              {header?.description || 'Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica.'}
            </p>
          </div>
        </div>
      )}

      {/* Hero Image */}
      {(sections.length === 0 || heroImage) && (
        <div className="w-full h-[500px] md:h-[700px] overflow-hidden relative">
          <Image 
            src={heroImage?.images?.[0] || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1920'}
            alt="Santorini Coastline"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Article Content Section */}
      {(sections.length === 0 || content) && (
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-20 flex flex-col items-center">
          <div className="max-w-4xl text-center md:text-left mb-16">
            <p className="text-[#1a1a1a] text-[14px] leading-[1.8] font-light">
              {content?.description || 'What to See and Do - Foam padding in the insoles leather finest quality staple flat slip-on design pointed toe off-duty shoe.'}
            </p>
          </div>

          {/* Image Gallery */}
          {(sections.length === 0 || gallery) && (
            <>
              {(gallery?.items || [
                {
                  image: 'https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&q=80&w=1200',
                  caption: 'City walk through the tunnel.',
                  type: 'vertical'
                },
                {
                  image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
                  caption: 'Sea view of Santorini',
                  type: 'horizontal'
                }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="w-full mb-20 flex flex-col items-center">
                  <div className={`w-full overflow-hidden mb-6 relative ${
                    item.type === 'vertical' ? 'max-w-[800px] aspect-[2/3]' : 'max-w-[1000px] aspect-[16/9]'
                  }`}>
                    <Image 
                      src={item.image}
                      alt={item.caption || `Gallery image ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-[11px] text-[#999] font-medium tracking-wide">
                    {item.caption}
                  </p>
                </div>
              ))}
            </>
          )}

          {/* Final Text Block */}
          {(sections.length === 0 || closingText) && (
            <div className="max-w-4xl text-center mb-32">
              <p className="text-[#666] text-[14px] leading-[1.9] font-light">
                {closingText?.description || 'Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud.'}
              </p>
            </div>
          )}
        </div>
      )}
{/* Our Rooms Section */}
{(sections.length === 0 || ourRooms) && (
<section className="bg-white py-20 flex flex-col items-center"><div className="w-full max-w-[1000px] border-t border-black mb-20"></div>
    <div className="max-w-[1300px] mx-auto px-8">
      
      <div className="text-center mb-20">
        <h2 className="text-[36px] font-bold text-[#1a1a1a] mb-4">
          {ourRooms?.title || 'Our Rooms'}
        </h2>
        <p className="text-[10px]  tracking-[0.3em] uppercase text-black">
          {ourRooms?.subtitle || 'Could also be interest for you'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {(ourRooms?.items || [
          {
            id: 'superior-room',
            title: 'Superior Room',
            image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800',
            size: '30',
            maxAdults: '2',
            maxChildren: '1',
            price: '$199',
            link: '/accommodation/superior-room'
          },
          {
            id: 'deluxe-room',
            title: 'Deluxe Room',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
            size: '55',
            maxAdults: '3',
            maxChildren: '1',
            price: '$249',
            link: '/accommodation/deluxe-room'
          },
          {
            id: 'signature-room',
            title: 'Signature Room',
            image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
            size: '70',
            maxAdults: '3',
            maxChildren: '2',
            price: '$299',
            link: '/accommodation/signature-room'
          },
          {
            id: 'luxury-suite',
            title: 'Luxury Suite Room',
            image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800',
            size: '120',
            maxAdults: '4',
            maxChildren: '2',
            price: '$399',
            link: '/accommodation/luxury-suite-room'
          }
        ]).map((room: any, idx: number) => (
          <Link key={idx} href={room.link} className="group block">
            {/* Image section with cross animation */}
            <div className="aspect-[1.4/1] overflow-hidden mb-8 relative">
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
              <h3 className="text-[24px] font-bold text-[#1a1a1a] mb-10">{room.title}</h3>
              
              {/* Stats with Vertical Dividers */}
              <div className="flex justify-between items-start mb-10 max-w-[240px] mx-auto">
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[22px] font-bold text-[#1a1a1a] leading-none mb-1">{room.size}</span>
                  <span className="text-[9px] uppercase tracking-wider text-black  leading-tight">Size<br/>m²</span>
                </div>
                
                <div className="w-[1px] h-12 bg-black self-center"></div> {/* Divider */}
                
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[22px] font-bold text-[#1a1a1a] leading-none mb-1">{room.maxAdults}</span>
                  <span className="text-[9px] uppercase tracking-wider text-black  leading-tight">Max<br/>Adults</span>
                </div>
                
                <div className="w-[1px] h-12 bg-black self-center"></div> {/* Divider */}
                
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[22px] font-bold text-[#1a1a1a] leading-none mb-1">{room.maxChildren}</span>
                  <span className="text-[9px] uppercase tracking-wider text-black leading-tight">Max<br/>Children</span>
                </div>
              </div>

              {/* Book Now Section - Underlined Only */}
              <div className="mt-8 pt-2">
                <div className="inline-block border-b border-[#1a1a1a] pb-1 transition-opacity group-hover:opacity-60">
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1a1a1a]">
                    Book Now From <span className="ml-1">{room.price}</span>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
)}
    
    </section>
  );
};

export default ExplorePageE1;
