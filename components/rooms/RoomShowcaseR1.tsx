import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RoomData {
  name: string;
  price: string;
  image: string;
  specs: { label: string; value: string }[];
}

const ROOMS: RoomData[] = [
  {
    name: "Superior Room",
    price: "199",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200",
    specs: [
      { label: 'bed:', value: 'twin bed' },
      { label: 'capacity:', value: '2 adults 1 children' },
      { label: 'room size:', value: '30m²' },
      { label: 'view:', value: 'sea view' },
      { label: 'recommend:', value: 'great for business trip' },
    ]
  },
  {
    name: "Deluxe Room",
    price: "249",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
    specs: [
      { label: 'bed:', value: 'king bed' },
      { label: 'capacity:', value: '3 adults 1 children' },
      { label: 'room size:', value: '55m²' },
      { label: 'view:', value: 'sea view' },
      { label: 'recommend:', value: 'great for business trip' },
    ]
  },
  {
    name: "Signature Room",
    price: "299",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200",
    specs: [
      { label: 'bed:', value: 'king bed' },
      { label: 'capacity:', value: '3 adults 2 children' },
      { label: 'room size:', value: '70m²' },
      { label: 'view:', value: 'sea view' },
      { label: 'recommend:', value: 'great for families' },
    ]
  },
  {
    name: "Luxury Suite Room",
    price: "399",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1200",
    specs: [
      { label: 'bed:', value: 'king bed' },
      { label: 'capacity:', value: '4 adults 2 children' },
      { label: 'room size:', value: '120m²' },
      { label: 'view:', value: 'sea view' },
      { label: 'recommend:', value: 'great for families' },
    ]
  }
];

const RoomRow: React.FC<{ room: RoomData }> = ({ room }) => {
  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[600px] bg-white overflow-hidden border-b border-gray-100">
      {/* Left Info Panel (Dark Sidebar) */}
      <div className="w-full lg:w-[350px] p-10 lg:p-14 flex flex-col justify-center bg-[#1a1a1a] text-white">
        <h3 className="text-2xl font-bold mb-4 tracking-tight">{room.name}</h3>
        
        <div className="mb-10">
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">From</p>
          <div className="flex items-baseline font-bold text-4xl">
            <span className="text-xl mr-1 font-medium">$</span>
            <span>{room.price}</span>
          </div>
        </div>

        <div className="space-y-3.5 mb-12">
          {room.specs.map((spec) => (
            <div key={spec.label} className="grid grid-cols-[100px_1fr] text-[12px] items-start">
              <span className="text-white font-bold opacity-100 uppercase tracking-tighter">{spec.label}</span>
              <span className="text-white/70 font-medium">{spec.value}</span>
            </div>
          ))}
        </div>

        <button className="w-fit px-10 py-3 border border-white/40 rounded-full text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-[#1a1a1a] transition-all duration-300">
          view detail
        </button>
      </div>

      {/* Right Image Slider Placeholder */}
      <div className="flex-1 relative group overflow-hidden bg-gray-200">
        <Image 
          src={room.image} 
          alt={room.name}
          fill
          className="object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        
        {/* Nav Arrows Placeholder */}
        <div className="absolute inset-y-0 left-0 flex items-center px-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-10 h-10 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center px-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-10 h-10 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const RoomShowcaseR1: React.FC = () => {
  return (
    <div className="w-full">
      {ROOMS.map((room, idx) => (
        <RoomRow key={idx} room={room} />
      ))}
    </div>
  );
};

export default RoomShowcaseR1;
