import Image from 'next/image';
import { Settings, Heart, ShoppingBag, BookOpen, ShoppingCart } from 'lucide-react';

interface Post {
  title: string;
  category: string;
  date: string;
  image: string;
  isTall?: boolean;
  hasOverlay?: boolean;
}

const POSTS: Post[] = [
  {
    category: "LUXURY . TRAVEL . VACATION",
    title: "Disclosing the Secrets of Success in Luxury Hospitality",
    date: "June 14, 2018",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
  },
  {
    category: "INTERIOR DESIGN . LUXURY . VACATION",
    title: "Online Hotel Marketing — A Hotelier’s Guide to Inbound Marketing",
    date: "June 7, 2018",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800",
    isTall: true,
    hasOverlay: true
  },
  {
    category: "INTERIOR DESIGN . TRAVEL . VACATION",
    title: "Disclosing the Secrets of Success in Luxury Hospitality",
    date: "June 7, 2018",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800",
  },
  {
    category: "INTERIOR DESIGN . LUXURY . TRAVEL",
    title: "The Inexpensive Hotel Amenities That Luxury Guests Now Want Most",
    date: "June 7, 2018",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
    hasOverlay: true
  },
  {
    category: "LUXURY . TRAVEL . VACATION",
    title: "How an Independent Hotel Won Back Its Direct Bookings",
    date: "June 7, 2018",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
  },
  {
    category: "INTERIOR DESIGN . TRAVEL . VACATION",
    title: "Are Hotel Star Categories the Same in All Countries?",
    date: "June 7, 2018",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800",
  },
  {
    category: "LUXURY . TRAVEL . VACATION",
    title: "10 Ways to Market Your Hotel for the Summer Season",
    date: "June 7, 2018",
    image: "https://images.unsplash.com/photo-1433086177604-50dc80846517?auto=format&fit=crop&q=80&w=800",
  },
  {
    category: "INTERIOR DESIGN . LUXURY . VACATION",
    title: "The Top Hotel Trends to Watch in 2018, According to the Industry",
    date: "June 7, 2018",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=800",
    isTall: true
  },
  {
    category: "LUXURY . TRAVEL . VACATION",
    title: "luxury hotel room Disclosing the Secrets of Success in Luxury Hospitality",
    date: "June 7, 2018",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
  }
];

const BlogCard: React.FC<{ post: Post }> = ({ post }) => (
  <div className="mb-16 break-inside-avoid">
    <div className={`relative overflow-hidden rounded-sm mb-6 ${post.isTall ? 'aspect-[4/7]' : 'aspect-[4/3]'}`}>
      <Image 
        src={post.image} 
        alt={post.title} 
        fill
        className="object-cover transition-transform duration-700 hover:scale-105" 
      />
      {post.hasOverlay && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
           <div className="w-12 h-12 flex items-center justify-center">
              <div className="w-8 h-0.5 bg-white/60"></div>
              <div className="w-0.5 h-8 bg-white/60 absolute"></div>
           </div>
        </div>
      )}
    </div>
    <div className="text-center px-4">
      <p className="text-[#1a1a1a]/30 text-[9px] uppercase tracking-[0.2em] font-bold mb-3">
        {post.category}
      </p>
      <h3 className="text-[#1a1a1a] text-[18px] font-bold leading-tight mb-4 hover:text-hotel-gold cursor-pointer transition-colors px-4">
        {post.title}
      </h3>
      <p className="text-[#1a1a1a]/40 text-[11px] font-medium italic">
        {post.date}
      </p>
    </div>
  </div>
);

const BlogB1: React.FC = () => {
  return (
    <div className="bg-white pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Header Title */}
        <div className="text-center mb-24">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-tight">
            Retreat Hotel at Santorini
          </h1>
          <p className="text-[#1a1a1a]/60 text-sm max-w-2xl mx-auto font-medium leading-relaxed">
            Unwind the clock of modern life. Unlock the door to a wonder of the world.
          </p>
        </div>

        {/* Masonry Grid Simulation */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {POSTS.map((post, idx) => (
            <BlogCard key={idx} post={post} />
          ))}
        </div>
      </div>

      {/* Side Utility Bar */}
      <div className="fixed top-1/4 right-0 bg-white shadow-2xl border border-gray-100 flex flex-col items-center py-4 px-2 space-y-6 z-[40] rounded-l-md hidden lg:flex">
        <button className="text-gray-400 hover:text-hotel-gold transition-colors"><Settings size={18} strokeWidth={1.5} /></button>
        <button className="text-gray-400 hover:text-hotel-gold transition-colors"><Heart size={18} strokeWidth={1.5} /></button>
        <button className="text-gray-400 hover:text-hotel-gold transition-colors"><ShoppingBag size={18} strokeWidth={1.5} /></button>
        <button className="text-gray-400 hover:text-hotel-gold transition-colors"><BookOpen size={18} strokeWidth={1.5} /></button>
        <button className="text-gray-400 hover:text-hotel-gold transition-colors"><ShoppingCart size={18} strokeWidth={1.5} /></button>
      </div>
    </div>
  );
};

export default BlogB1;
