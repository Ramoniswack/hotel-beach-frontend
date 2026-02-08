import Image from 'next/image';

const PROMOTIONS = [
  {
    title: "2 Nights Getaway Promotion Package",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Free Breakfast for 3 days Package",
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "3 Nights Honeymoon Special Package",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800",
  }
];

const PromotionGridR4: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 w-full h-[400px]">
      {PROMOTIONS.map((promo, idx) => (
        <div key={idx} className="relative group overflow-hidden h-full">
          <Image 
            src={promo.image} 
            alt={promo.title}
            fill
            className="object-cover transition-transform duration-[3s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-500"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
            <h3 className="text-white text-xl font-bold mb-6 drop-shadow-lg leading-tight">
              {promo.title}
            </h3>
            <button className="text-white text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/50 hover:border-white transition-all pb-1">
              Read More
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromotionGridR4;
