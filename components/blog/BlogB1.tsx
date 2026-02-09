'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  heroImage: string;
  categories: string[];
  publishedAt: string;
  status: string;
}

const BlogB1: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/blog?status=published');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8 text-center">
          <p className="text-[#666]">Loading posts...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-24 md:py-32">
      {/* Header section remains unchanged as requested */}
      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 text-center mb-20">
        <h2 className="text-[36px] md:text-[48px] font-bold mb-6 tracking-tight text-[#1a1a1a]">
          Retreat Hotel at Santorini
        </h2>
        <p className="text-[#666] text-[15px] font-normal">
          Unwind the clock of modern life. Unlock the door to a wonder of the world.
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Adjusted gap and space-y to match the tighter, elegant masonry spacing */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-20">
          {posts.map((post, index) => {
            // Logic to replicate the specific layout in the image:
            // The middle column (index 1, 4, 7...) uses a very tall portrait aspect.
            // The first and third columns alternate between standard landscape and slightly taller portrait.
            let aspectClass = 'aspect-[3/2]'; // Default Landscape
            
            if (index % 3 === 1) {
              aspectClass = 'aspect-[2/4.5]'; // Very Tall Middle Column
            } else if (index === 3) {
              aspectClass = 'aspect-[2/3.5]'; // Specific tall item for the first column
            } else if (index === 5) {
              aspectClass = 'aspect-[2/3]'; // Specific tall item for the third column
            }

            return (
              <Link 
                key={post._id} 
                href={`/blog/${post.slug}`}
                className="break-inside-avoid flex flex-col group cursor-pointer"
              >
                <div className="overflow-hidden w-full mb-8 relative">
                  <div className={`relative w-full ${aspectClass} blog-image-hover`}>
                    <Image 
                      src={post.heroImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Your existing animation content */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="absolute left-0 top-1/2 h-[1px] w-0 bg-white -translate-y-1/2 group-hover:w-[40px] group-hover:left-[calc(50%-20px)] transition-all duration-500 ease-out delay-100"></div>
                      <div className="absolute top-0 left-1/2 w-[1px] h-0 bg-white -translate-x-1/2 group-hover:h-[40px] group-hover:top-[calc(50%-20px)] transition-all duration-500 ease-out"></div>
                    </div>
                  </div>
                </div>

                {/* Text Content - Switched items-center to standard alignment for that editorial look */}
                <div className="text-center px-2">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[#ccc] mb-4 uppercase">
                    {post.categories.join('   ')}
                  </p>
                  <h3 className="text-[21px] font-bold leading-[1.3] text-[#1a1a1a] mb-4 tracking-tight group-hover:text-[#59a4b5] transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-[11px] font-medium text-[#999] tracking-wide">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogB1;