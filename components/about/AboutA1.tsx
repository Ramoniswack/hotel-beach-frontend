import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';

interface Section {
  sectionId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  images?: string[];
  items?: any[];
  isVisible: boolean;
}

interface AboutA1Props {
  sections: Section[];
}

const AboutA1: React.FC<AboutA1Props> = ({ sections }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const getSection = (id: string) => sections.find(s => s.sectionId === id && s.isVisible);
  
  const header = getSection('header');
  const heroImage = getSection('hero-image');
  const introText = getSection('intro-text');
  const gallery = getSection('gallery');
  const contentSection = getSection('content-section');
  const bannerImage = getSection('banner-image');

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - galleryRef.current.offsetLeft);
    setScrollLeft(galleryRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    galleryRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-white">
      {/* 1. Header Section */}
      {(sections.length === 0 || header) && (
        <div className="pt-40 pb-16">
          <div className="container mx-auto" style={{ paddingLeft: '3.5cm' }}>
            <h1 className="font-sans text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-tight">
              {header?.title || 'Retreat Hotel at Santorini'}
            </h1>
            <p className="text-[#1a1a1a]/60 text-sm max-w-2xl font-medium leading-relaxed">
              {header?.subtitle || 'Unwind the clock of modern life. Unlock the door to a wonder of the world.'}
            </p>
          </div>
        </div>
      )}

      {/* 2. Main Hero Image */}
      {(sections.length === 0 || heroImage) && (
        <div className="w-full mb-24" style={{ paddingLeft: '1cm' }}>
          <div className="relative aspect-[21/10] overflow-hidden rounded-sm">
            <Image 
              src={heroImage?.images?.[0] || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000'} 
              alt="Santorini Blue Dome"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* 3. Intro Text & Signature */}
      {(sections.length === 0 || introText) && (
        <div className="mb-32" style={{ paddingLeft: '5cm', paddingRight: '5cm' }}>
          <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
            <div className="lg:w-2/3">
              <p className="text-[#1a1a1a]/70 text-[13px] leading-[2] font-medium max-w-2xl">
                {introText?.description || 'Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica. Salvia esse nihil, flexitarian Truffaut synth art party deep v chillwave. Seitan High Life reprehenderit consectetur cupidatat kogi. Et leggings fanny pack.'}
              </p>
            </div>
            <div className="lg:w-1/3 flex flex-col items-start lg:items-end">
              {introText?.images?.[0] && (
                <Image 
                  src={introText.images[0]} 
                  alt="Signature" 
                  width={120}
                  height={80}
                  className="h-20 w-auto mb-4 object-contain"
                />
              )}
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#1a1a1a]">
                {introText?.content || 'RICARD MORGAN - GENERAL MANAGER'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Horizontal Gallery Strip */}
      {(sections.length === 0 || gallery) && (
        <div 
          ref={galleryRef}
          className="relative group mb-32 cursor-grab active:cursor-grabbing select-none overflow-x-auto scrollbar-hide"
          style={{ paddingRight: '3.5cm' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex" style={{ gap: '0.3cm', height: '9cm' }}>
            {(gallery?.images || [
              'https://images.unsplash.com/photo-1433086177604-50dc80846517?auto=format&fit=crop&q=80&w=600',
              'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=600',
              'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
              'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=600',
              'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&q=80&w=600'
            ]).map((img, idx) => (
              <div key={idx} className="relative flex-shrink-0" style={{ width: '5.5cm', height: '9cm' }}>
                <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover pointer-events-none" />
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-12 h-12 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-12 h-12 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}

      {/* 5. "Everything Handy" Content */}
      {(sections.length === 0 || contentSection) && (
        <div className="mb-32" style={{ paddingLeft: '3.5cm', paddingRight: '8.5cm' }}>
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-10 tracking-tight">
              {contentSection?.title || 'Everything Handy'}
            </h2>
            <div className="space-y-8 text-[#1a1a1a]/70 text-[13px] leading-[1.8] font-medium">
              {(contentSection?.items || [
                { text: 'Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag. Selfies iPhone Kickstarter, drinking vinegar jean vinegar stumptown yr pop-up artisan.' },
                { text: 'See-through delicate embroidered organza blue lining luxury acetate-mix stretch pleat detailing. Leather detail shoulder contrast colour contour stunning silhouette working peplum. Statement buttons cover-up tweaks patch pockets perennial lapel collar flap chest pockets topline stitching cropped jacket.' },
                { text: 'Effortless comfortable full leather lining eye-catching unique detail to the toe low \'cut-away\' sides clean and sleek. Polished finish elegant court shoe work duty stretchy slingback strap mid kitten heel this ladylike design slingback strap mid kitten heel this ladylike design.' }
              ]).map((item: any, idx: number) => (
                <p key={idx}>{item.text}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Landscape Banner */}
      {(sections.length === 0 || bannerImage) && (
        <div className="w-full -mb-24">
          <div className="relative aspect-[21/9] overflow-hidden">
            <Image 
              src={bannerImage?.images?.[0] || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=2000'} 
              alt="Santorini Landscape"
              fill
              className="object-cover"
            />
            {/* White gradient overlay at top, dark gradient at bottom to blend with footer */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-[#1a1a1a] pointer-events-none"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutA1;
