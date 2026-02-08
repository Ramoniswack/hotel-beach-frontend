import React from 'react';
import Image from 'next/image';

const roomOptions = [
  {
    title: 'Superior Room',
    image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800',
    specs: { size: '30', adults: '2', children: '1' },
    price: '$199'
  },
  {
    title: 'Deluxe Room',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    specs: { size: '55', adults: '3', children: '1' },
    price: '$249'
  },
  {
    title: 'Signature Room',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
    specs: { size: '70', adults: '3', children: '2' },
    price: '$299'
  },
  {
    title: 'Luxury Suite Room',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800',
    specs: { size: '120', adults: '4', children: '2' },
    price: '$399'
  }
];

const ExplorePageE1: React.FC = () => {
  return (
    <section className="bg-white">
      {/* Header Section */}
      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 pt-24 pb-16">
        <h2 className="text-[36px] md:text-[48px] font-bold mb-8 tracking-tight text-[#1a1a1a]">
          Explore Santorini
        </h2>
        <p className="text-[#666] text-[15px] font-normal mb-10">
          Unwind the clock of modern life. Unlock the door to a wonder of the world.
        </p>
        <div className="max-w-4xl">
          <p className="text-[#666] text-[14px] leading-[1.8] mb-6 font-light">
            Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica. Salvia esse nihil, flexitarian Truffaut synth art party deep v chillwave. Seitan High Life reprehenderit consectetur cupidatat kogi. Et leggings fanny pack, elit bespoke vinyl art party Pitchfork selfies master cleanse Kickstarter seitan retro. Drinking vinegar stumptown yr pop-up artisan sunt. Deep v cliche lomo biodiesel Neutra selfies. Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep.
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[500px] md:h-[700px] overflow-hidden relative">
        <Image 
          src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1920"
          alt="Santorini Coastline"
          fill
          className="object-cover"
        />
      </div>

      {/* Article Content Section */}
      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-20 flex flex-col items-center">
        <div className="max-w-4xl text-center md:text-left mb-16">
          <p className="text-[#1a1a1a] text-[14px] leading-[1.8] font-light">
            <span className="font-bold">What to See and Do</span> Foam padding in the insoles leather finest quality staple flat slip-on design pointed toe off-duty shoe. Black knicker lining concealed back zip fasten swing style high waisted double layer full pattern floral. Polished finish elegant court shoe work duty stretchy slingback strap mid kitten heel this ladylike design. Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica. Salvia esse nihil, flexitarian Truffaut synth art party deep v chillwave. Seitan High Life reprehenderit consectetur cupidatat kogi. Et leggings fanny pack, elit bespoke vinyl art party Pitchfork selfies master cleanse Kickstarter seitan retro. Drinking vinegar stumptown yr pop-up artisan sunt. Deep v cliche lomo biodiesel Neutra selfies. <span className="font-bold underline decoration-1 underline-offset-4">Where to Stay</span>
          </p>
        </div>

        {/* Tall Image with Caption */}
        <div className="w-full mb-20 flex flex-col items-center">
          <div className="max-w-[800px] w-full aspect-[2/3] overflow-hidden mb-6 relative">
            <Image 
              src="https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&q=80&w=1200"
              alt="City walk"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-[11px] text-[#999] font-medium tracking-wide">
            City walk through the tunnel.
          </p>
        </div>

        {/* Horizontal Image with Caption */}
        <div className="w-full mb-20 flex flex-col items-center">
          <div className="max-w-[1000px] w-full aspect-[16/9] overflow-hidden mb-6 relative">
            <Image 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200"
              alt="Sea view"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-[11px] text-[#999] font-medium tracking-wide">
            Sea view of Santorini
          </p>
        </div>

        {/* Final Text Block */}
        <div className="max-w-4xl text-center mb-32">
          <p className="text-[#666] text-[14px] leading-[1.9] font-light">
            Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica. Salvia esse nihil, flexitarian Truffaut synth art party deep v chillwave. Seitan High Life reprehenderit consectetur cupidatat kogi. Et leggings fanny pack, elit bespoke vinyl art party Pitchfork selfies master cleanse Kickstarter seitan retro. Drinking vinegar stumptown yr pop-up artisan sunt. Deep v cliche lomo biodiesel Neutra selfies. Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-100 mb-32"></div>

        {/* "Our Rooms" Showcase */}
        <div className="w-full text-center">
          <h3 className="text-[32px] md:text-[42px] font-bold mb-4 tracking-tight text-[#1a1a1a]">
            Our Rooms
          </h3>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#bbb] mb-16">
            Could also be interest for you
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {roomOptions.map((room, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-full aspect-[4/3] overflow-hidden mb-8 relative">
                  <Image 
                    src={room.image}
                    alt={room.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <h4 className="text-[18px] font-bold text-[#1a1a1a] mb-6">
                  {room.title}
                </h4>

                <div className="flex justify-center space-x-8 mb-8">
                  <div className="flex flex-col items-center">
                    <span className="text-[18px] font-bold text-[#1a1a1a]">{room.specs.size}</span>
                    <span className="text-[9px] font-bold text-[#bbb] uppercase tracking-widest mt-1">
                      Size<br/>M2
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[18px] font-bold text-[#1a1a1a]">{room.specs.adults}</span>
                    <span className="text-[9px] font-bold text-[#bbb] uppercase tracking-widest mt-1">
                      Max<br/>Adults
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[18px] font-bold text-[#1a1a1a]">{room.specs.children}</span>
                    <span className="text-[9px] font-bold text-[#bbb] uppercase tracking-widest mt-1">
                      Max<br/>Children
                    </span>
                  </div>
                </div>

                <a 
                  href="#" 
                  className="text-[11px] font-bold text-[#1a1a1a] uppercase tracking-[0.15em] border-b border-black pb-1 hover:opacity-50 transition-opacity"
                >
                  Book now from {room.price}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplorePageE1;
