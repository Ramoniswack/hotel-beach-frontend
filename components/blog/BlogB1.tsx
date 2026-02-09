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
          {posts.map((post, index) => (
            <Link 
              key={post._id} 
              href={`/blog/${post.slug}`}
              className="break-inside-avoid flex flex-col items-center group cursor-pointer"
            >
              <div className="overflow-hidden w-full mb-8 relative">
                <div className={`relative w-full ${index % 3 === 1 ? 'aspect-[2/3.2]' : 'aspect-[3/2]'}`}>
                  <Image 
                    src={post.heroImage}
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
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogB1;
