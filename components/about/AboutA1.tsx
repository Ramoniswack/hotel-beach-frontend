import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const AboutA1: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
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
      <div className="pt-40 pb-16 text-center">
        <div className="container mx-auto px-6">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-tight">
            Retreat Hotel at Santorini
          </h1>
          <p className="text-[#1a1a1a]/60 text-sm max-w-2xl mx-auto font-medium leading-relaxed">
            Unwind the clock of modern life. Unlock the door to a wonder of the world.
          </p>
        </div>
      </div>

      {/* 2. Main Hero Image */}
      <div className="w-full px-6 mb-24">
        <div className="container mx-auto">
          <div className="relative aspect-[21/10] overflow-hidden rounded-sm">
            <Image 
              src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000" 
              alt="Santorini Blue Dome"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* 3. Intro Text & Signature */}
      <div className="container mx-auto px-6 mb-32">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
          <div className="lg:w-2/3">
            <p className="text-[#1a1a1a]/70 text-[13px] leading-[2] font-medium max-w-2xl">
              Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. 
              Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica. Salvia esse nihil, flexitarian Truffaut 
              synth art party deep v chillwave. Seitan High Life reprehenderit consectetur cupidatat kogi. Et leggings 
              fanny pack.
            </p>
          </div>
          <div className="lg:w-1/3 flex flex-col items-start lg:items-end">
             <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Signature_of_Richard_Nixon.svg" 
              alt="Signature" 
              width={120}
              height={80}
              className="h-20 w-auto mb-4 opacity-80 grayscale invert brightness-0"
            />
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#1a1a1a]">
              RICARD MORGAN - GENERAL MANAGER
            </p>
          </div>
        </div>
      </div>

      {/* 4. Horizontal Gallery Strip */}
      <div 
        className="relative group mb-32 px-1 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0.5 h-[480px]">
          <div className="relative w-full h-full"><Image src="https://images.unsplash.com/photo-1433086177604-50dc80846517?auto=format&fit=crop&q=80&w=600" alt="Gallery 1" fill className="object-cover pointer-events-none" /></div>
          <div className="relative w-full h-full"><Image src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=600" alt="Gallery 2" fill className="object-cover pointer-events-none" /></div>
          <div className="relative w-full h-full"><Image src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600" alt="Gallery 3" fill className="object-cover pointer-events-none" /></div>
          <div className="relative w-full h-full"><Image src="https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=600" alt="Gallery 4" fill className="object-cover pointer-events-none" /></div>
          <div className="relative w-full h-full"><Image src="https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&q=80&w=600" alt="Gallery 5" fill className="object-cover pointer-events-none" /></div>
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

      {/* 5. "Everything Handy" Content */}
      <div className="container mx-auto px-6 mb-32">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-10 tracking-tight">Everything Handy</h2>
          <div className="space-y-8 text-[#1a1a1a]/70 text-[13px] leading-[1.8] font-medium">
            <p>
              Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. <span className="font-bold italic">Aliquip veniam delectus, Marfa eiusmod Pinterest</span> in do umami readymade swag. Selfies iPhone Kickstarter, drinking vinegar jean vinegar stumptown yr pop-up artisan.
            </p>
            <p>
              See-through delicate embroidered organza blue lining luxury acetate-mix stretch pleat detailing. Leather detail shoulder contrast colour contour stunning silhouette working peplum. Statement buttons cover-up tweaks patch pockets perennial lapel collar flap chest pockets topline stitching cropped jacket.
            </p>
            <p>
              Effortless comfortable full leather lining eye-catching unique detail to the toe low 'cut-away' sides clean and sleek. Polished finish elegant court shoe work duty stretchy slingback strap mid kitten heel this ladylike design slingback strap mid kitten heel this ladylike design.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Landscape Banner */}
      <div className="w-full px-6 pb-24">
        <div className="container mx-auto">
          <div className="relative aspect-[21/9] overflow-hidden rounded-sm shadow-sm">
            <Image 
              src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=2000" 
              alt="Santorini Landscape"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutA1;
