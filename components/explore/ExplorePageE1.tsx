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
        <section className="bg-white py-32 border-t border-gray-100">
          <div className="max-w-[1300px] mx-auto px-8">
            <div className="text-center mb-20">
              <h2 className="text-[36px] font-bold text-[#1a1a1a] mb-4">
                {ourRooms?.title || 'Our Rooms'}
              </h2>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#bbb]">
                {ourRooms?.subtitle || 'Could also be interest for you'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  link: '/accommodation/luxury-suite'
                }
              ]).map((room: any, idx: number) => (
                <Link key={idx} href={room.link} className="group">
                  <div className="aspect-[4/3] overflow-hidden mb-6 relative">
                    <Image 
                      src={room.image}
                      alt={room.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-6">{room.title}</h3>
                    <div className="flex justify-center gap-4 mb-6 text-[11px]">
                      <div className="flex flex-col items-center">
                        <span className="text-[20px] font-bold text-[#1a1a1a]">{room.size}</span>
                        <span className="text-[9px] uppercase tracking-wider text-gray-400">Size m²</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[20px] font-bold text-[#1a1a1a]">{room.maxAdults}</span>
                        <span className="text-[9px] uppercase tracking-wider text-gray-400">Max Adults</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[20px] font-bold text-[#1a1a1a]">{room.maxChildren}</span>
                        <span className="text-[9px] uppercase tracking-wider text-gray-400">Max Children</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-6">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 block mb-2">Book Now From</span>
                      <span className="text-[20px] font-bold text-[#1a1a1a]">{room.price}</span>
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
