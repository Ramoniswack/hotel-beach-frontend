import Image from 'next/image';
import { Maximize, Users, Baby } from 'lucide-react';

interface SuggestedRoom {
  name: string;
  size: string;
  adults: string;
  children: string;
  price: string;
  image: string;
}

const SUGGESTED_ROOMS: SuggestedRoom[] = [
  {
    name: "Superior Room",
    size: "30",
    adults: "2",
    children: "1",
    price: "199",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Deluxe Room",
    size: "55",
    adults: "3",
    children: "1",
    price: "249",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Signature Room",
    size: "70",
    adults: "3",
    children: "2",
    price: "299",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600",
  },
  {
    name: "Luxury Suite Room",
    size: "120",
    adults: "4",
    children: "2",
    price: "399",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=600",
  }
];

const ExplorePageE1: React.FC = () => {
  return (
    <div className="bg-white">
      {/* 1. Header Section */}
      <div className="pt-40 pb-16 text-center">
        <div className="container mx-auto px-6">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-tight">
            Explore Santorini
          </h1>
          <p className="text-[#1a1a1a]/60 text-sm max-w-2xl mx-auto font-medium leading-relaxed">
            Unwind the clock of modern life. Unlock the door to a wonder of the world.
          </p>
          
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <p className="text-[#1a1a1a]/70 text-[13px] leading-[1.8] font-medium">
              Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. 
              Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica. Salvia esse nihil, flexitarian Truffaut 
              synth art party deep v chillwave. Seitan High Life reprehenderit consectetur cupidatat kogi. Et leggings 
              fanny pack, elit bespoke vinyl art party Pitchfork selfies master cleanse Kickstarter seitan retro. 
              Drinking vinegar stumptown yr pop-up artisan sunt. Deep v cliche lomo biodiesel Neutra selfies. 
              Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. 
              Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Full Width Aerial Ocean Image */}
      <div className="w-full mb-24 px-1">
        <div className="relative aspect-[21/9] overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=2000" 
            alt="Santorini Aerial Ocean"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* 3. Mid Section Text & Vertical Image */}
      <div className="container mx-auto px-6 mb-32">
        <div className="max-w-3xl mx-auto mb-20">
          <p className="text-[#1a1a1a]/80 text-[13px] leading-[1.8] font-medium">
            <span className="font-bold">What to See and Do</span> Foam padding in the insoles leather finest quality staple flat slip-on design pointed toe off-duty shoe. Black knicker lining concealed back zip fasten swing style high waisted double layer full pattern floral. Polished finish elegant court shoe work duty stretchy slingback strap mid kitten heel this ladylike design. Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica. Salvia esse nihil, flexitarian Truffaut synth art party deep v chillwave. Seitan High Life reprehenderit consectetur cupidatat kogi. Et leggings fanny pack, elit bespoke vinyl art party Pitchfork selfies master cleanse Kickstarter seitan retro. Drinking vinegar stumptown yr pop-up artisan sunt. Deep v cliche lomo biodiesel Neutra selfies. <span className="underline cursor-pointer font-bold">Where to Stay</span>
          </p>
        </div>

        {/* Large Portrait Image */}
        <div className="flex flex-col items-center mb-32">
          <div className="relative w-full max-w-4xl aspect-[3/4] overflow-hidden rounded-sm mb-6">
            <Image 
              src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1200" 
              alt="City walk through the tunnel" 
              fill
              className="object-cover"
            />
          </div>
          <p className="text-[#1a1a1a]/40 text-[10px] uppercase tracking-widest font-bold">City walk through the tunnel</p>
        </div>

        {/* Large Landscape Image */}
        <div className="flex flex-col items-center mb-32">
          <div className="relative w-full max-w-5xl aspect-[16/9] overflow-hidden rounded-sm mb-6">
            <Image 
              src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1200" 
              alt="Sea view of Santorini" 
              fill
              className="object-cover"
            />
          </div>
          <p className="text-[#1a1a1a]/40 text-[10px] uppercase tracking-widest font-bold">Sea view of Santorini</p>
        </div>

        {/* Closing Text Block */}
        <div className="max-w-3xl mx-auto mb-32 text-center">
          <p className="text-[#1a1a1a]/70 text-[13px] leading-[1.8] font-medium">
            Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica. Salvia esse nihil, flexitarian Truffaut synth art party deep v chillwave. Seitan High Life reprehenderit consectetur cupidatat kogi. Et leggings fanny pack, elit bespoke vinyl art party Pitchfork selfies master cleanse Kickstarter seitan retro. Drinking vinegar stumptown yr pop-up artisan sunt. Deep v cliche lomo biodiesel Neutra selfies. Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep.
          </p>
        </div>
      </div>

      {/* 4. "Our Rooms" Suggestion Section */}
      <div className="bg-white pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4 tracking-tight">Our Rooms</h2>
            <p className="text-[#1a1a1a]/40 text-[10px] uppercase tracking-[0.3em] font-black">COULD ALSO BE INTEREST FOR YOU</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {SUGGESTED_ROOMS.map((room, idx) => (
              <div key={idx} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-6 shadow-sm group-hover:shadow-lg transition-all duration-500">
                  <Image 
                    src={room.image} 
                    alt={room.name} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#1a1a1a] mb-6">{room.name}</h3>
                  <div className="flex items-center justify-center space-x-8 mb-8">
                    <div className="text-center flex flex-col items-center">
                      <div className="flex items-center gap-1.5 mb-1 text-hotel-gold">
                        <Maximize size={12} strokeWidth={2.5} />
                        <p className="text-xl font-bold text-[#1a1a1a]">{room.size}</p>
                      </div>
                      <p className="text-[9px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Size M2</p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <div className="flex items-center gap-1.5 mb-1 text-hotel-gold">
                        <Users size={12} strokeWidth={2.5} />
                        <p className="text-xl font-bold text-[#1a1a1a]">{room.adults}</p>
                      </div>
                      <p className="text-[9px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Max Adults</p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                      <div className="flex items-center gap-1.5 mb-1 text-hotel-gold">
                        <Baby size={12} strokeWidth={2.5} />
                        <p className="text-xl font-bold text-[#1a1a1a]">{room.children}</p>
                      </div>
                      <p className="text-[9px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">Max Children</p>
                    </div>
                  </div>
                  <a href="#" className="text-[#1a1a1a] text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#1a1a1a]/20 pb-1 hover:border-[#1a1a1a] transition-all">
                    Book Now From ${room.price}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePageE1;
