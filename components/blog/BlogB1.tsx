import React from 'react';
import Image from 'next/image';

interface BlogPost {
  id: number;
  image: string;
  categories: string[];
  title: string;
  date: string;
  isTall?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1512918728675-ed7a9c797da7?auto=format&fit=crop&q=80&w=800',
    categories: ['LUXURY', 'TRAVEL', 'VACATION'],
    title: 'Disclosing the Secrets of Success in Luxury Hospitality',
    date: 'June 14, 2018'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1505881502353-a1986add3732?auto=format&fit=crop&q=80&w=800',
    categories: ['INTERIOR DESIGN', 'LUXURY', 'VACATION'],
    title: 'Online Hotel Marketing - A Hotelier\'s Guide to Inbound Marketing',
    date: 'June 7, 2018',
    isTall: true
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800',
    categories: ['INTERIOR DESIGN', 'TRAVEL', 'VACATION'],
    title: 'Disclosing the Secrets of Success in Luxury Hospitality',
    date: 'June 7, 2018'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&q=80&w=800',
    categories: ['INTERIOR DESIGN', 'LUXURY', 'TRAVEL'],
    title: 'The Inexpensive Hotel Amenities That Luxury Guests Now Want Most',
    date: 'June 7, 2018',
    isTall: true
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    categories: ['LUXURY', 'TRAVEL', 'VACATION'],
    title: 'How an Independent Hotel Won Back Its Direct Bookings',
    date: 'June 7, 2018'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800',
    categories: ['LUXURY', 'TRAVEL', 'VACATION'],
    title: '10 Ways to Market Your Hotel for the Summer Season',
    date: 'June 7, 2018'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800',
    categories: ['INTERIOR DESIGN', 'TRAVEL', 'VACATION'],
    title: 'Are Hotel Star Categories the Same in All Countries?',
    date: 'June 7, 2018'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800',
    categories: ['LUXURY', 'TRAVEL', 'VACATION'],
    title: 'luxury hotel room Disclosing the Secrets of Success in Luxury Hospitality',
    date: 'June 7, 2018'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1469796466635-455ede028ace?auto=format&fit=crop&q=80&w=800',
    categories: ['INTERIOR DESIGN', 'LUXURY', 'VACATION'],
    title: 'The Top Hotel Trends to Watch in 2018, According to the Industry',
    date: 'June 7, 2018',
    isTall: true
  }
];

const BlogB1: React.FC = () => {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 text-center mb-20">
        <h2 className="text-[36px] md:text-[48px] font-bold mb-6 tracking-tight text-[#1a1a1a]">
          Retreat Hotel at Santorini
        </h2>
        <p className="text-[#666] text-[15px] font-normal">
          Unwind the clock of modern life. Unlock the door to a wonder of the world.
        </p>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-8">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-12">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="break-inside-avoid flex flex-col items-center group cursor-pointer"
            >
              <div className="overflow-hidden w-full mb-8 relative">
                <div className={`relative w-full ${post.isTall ? 'aspect-[2/3.2]' : 'aspect-[3/2]'}`}>
                  <Image 
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="text-center px-4">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#bbb] mb-4">
                  {post.categories.join(' . ')}
                </p>
                <h3 className="text-[20px] font-bold leading-[1.4] text-[#1a1a1a] mb-4 tracking-tight group-hover:text-[#59a4b5] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-[11px] font-bold text-[#888] tracking-widest uppercase">
                  {post.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogB1;
