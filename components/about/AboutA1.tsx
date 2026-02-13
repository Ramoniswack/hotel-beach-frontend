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

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - galleryRef.current.offsetLeft);
    setScrollLeft(galleryRef.current.scrollLeft);
    galleryRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    galleryRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (galleryRef.current) {
      galleryRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (galleryRef.current) {
        galleryRef.current.style.cursor = 'grab';
      }
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - galleryRef.current.offsetLeft);
    setScrollLeft(galleryRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !galleryRef.current) return;
    const x = e.touches[0].pageX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    galleryRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-white">
      {/* 1. Header Section */}
      {(sections.length === 0 || header) && (
        <div className="pt-24 sm:pt-32 md:pt-40 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-8 md:px-12 lg:px-[132px]">
          <div className="container mx-auto max-w-7xl">
            <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4 sm:mb-6 tracking-tight">
              {header?.title || 'Retreat Hotel at Santorini'}
            </h1>
            <p className="text-[#1a1a1a]/60 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
              {header?.subtitle || 'Unwind the clock of modern life. Unlock the door to a wonder of the world.'}
            </p>
          </div>
        </div>
      )}

      {/* 2. Main Hero Image */}
      {(sections.length === 0 || heroImage) && (
        <div className="w-full mb-12 sm:mb-16 md:mb-24 pl-4 sm:pl-6 md:pl-8 lg:pl-[38px]">
          <div className="relative aspect-[16/9] sm:aspect-[21/10] overflow-hidden rounded-sm">
            <Image 
              src={heroImage?.images?.[0] || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000'} 
              alt="Santorini Blue Dome"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* 3. Intro Text & Signature */}
      {(sections.length === 0 || introText) && (
        <div className="mb-16 sm:mb-24 md:mb-32 px-4 sm:px-8 md:px-12 lg:px-[189px]">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 sm:gap-12 lg:gap-16">
            <div className="lg:w-2/3">
              <p className="text-[#1a1a1a]/70 text-xs sm:text-[13px] leading-relaxed sm:leading-[2] font-medium max-w-2xl">
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
                  className="h-16 sm:h-20 w-auto mb-3 sm:mb-4 object-contain"
                />
              )}
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black text-[#1a1a1a]">
                {introText?.content || 'RICARD MORGAN - GENERAL MANAGER'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Horizontal Gallery Strip */}
      {(sections.length === 0 || gallery) && (
        <div className="w-full overflow-hidden mb-16 sm:mb-24 md:mb-32 relative">
          <div 
            ref={galleryRef}
            className="relative group cursor-grab active:cursor-grabbing select-none overflow-x-scroll scrollbar-hide scroll-smooth"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex gap-2 sm:gap-3 md:gap-[11px] h-[250px] sm:h-[300px] md:h-[340px] pl-4 sm:pl-6 md:pl-8">
              {(gallery?.images || [
                'https://images.unsplash.com/photo-1433086177604-50dc80846517?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&q=80&w=600',
                'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&q=80&w=600'
              ]).map((img, idx) => (
                <div key={idx} className="relative flex-shrink-0 w-[180px] sm:w-[220px] md:w-[208px] h-full overflow-hidden rounded-sm">
                  <Image 
                    src={img} 
                    alt={`Gallery ${idx + 1}`} 
                    fill 
                    className="object-cover pointer-events-none" 
                    draggable={false}
                  />
                  {/* Bottom gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                </div>
              ))}
              {/* Spacer for right padding */}
              <div className="w-4 sm:w-6 md:w-8 flex-shrink-0"></div>
            </div>
            
            {/* Navigation Arrows - Hidden on mobile */}
            <div className="hidden md:flex absolute inset-y-0 left-8 items-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => {
                  if (galleryRef.current) {
                    galleryRef.current.scrollBy({ left: -219, behavior: 'smooth' });
                  }
                }}
                className="w-12 h-12 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="hidden md:flex absolute inset-y-0 right-8 items-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button 
                onClick={() => {
                  if (galleryRef.current) {
                    galleryRef.current.scrollBy({ left: 219, behavior: 'smooth' });
                  }
                }}
                className="w-12 h-12 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. "Everything Handy" Content */}
      {(sections.length === 0 || contentSection) && (
        <div className="mb-16 sm:mb-24 md:mb-32 px-4 sm:px-8 md:px-12 lg:px-[132px] lg:pr-[321px]">
          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-6 sm:mb-8 md:mb-10 tracking-tight">
              {contentSection?.title || 'Everything Handy'}
            </h2>
            <div className="space-y-4 sm:space-y-6 md:space-y-8 text-[#1a1a1a]/70 text-xs sm:text-[13px] leading-relaxed sm:leading-[1.8] font-medium">
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
        <div className="w-full relative z-20">
          {/* Wave Decorative Divider */}
          <div className="w-full overflow-hidden leading-[0]">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="relative block w-[calc(100%+1.3px)] h-[40px] sm:h-[60px] fill-white"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
          <div className="relative aspect-[16/9] sm:aspect-[21/10] md:aspect-[21/9] overflow-hidden -mt-12 sm:-mt-16 md:-mt-24">
            <Image 
              src={bannerImage?.images?.[0] || 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=2000'} 
              alt="Santorini Landscape"
              fill
              className="object-cover"
            />
            {/* White gradient overlay at top */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
            {/* White gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutA1;
