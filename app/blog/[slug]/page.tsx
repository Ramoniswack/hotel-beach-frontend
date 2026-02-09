'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import api from '@/lib/api';

export default function BlogPostPage() {
  const params = useParams();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/blog/${params.slug}`);
        setPost(response.data);
        
        // Fetch related posts
        const relatedResponse = await api.get('/blog?status=published');
        const filtered = relatedResponse.data
          .filter((p: any) => p._id !== response.data._id)
          .slice(0, 2);
        setRelatedPosts(filtered);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <>
        <Header isScrolled={isScrolled} />
        <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
          <p className="text-gray-600">Loading post...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header isScrolled={isScrolled} />
        <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
          <p className="text-gray-600">Post not found</p>
        </div>
        <Footer />
      </>
    );
  }

  const contentParagraphs = post.content.split('\n\n').filter((p: string) => p.trim());

  return (
    <>
      <Header isScrolled={isScrolled} />
      <div className="min-h-screen bg-[#f8f8f8]">
      {/* Hero Section */}
      <div className="relative h-screen w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white px-4">
          <div className="text-center max-w-4xl">
            <div className="flex gap-3 justify-center mb-6">
              {post.categories.map((cat: string, idx: number) => (
                <span key={idx} className="text-xs tracking-[0.2em] font-light">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-sm tracking-widest font-light">
              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Previous Article Label - Desktop Only */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-10">
        <Link 
          href="/blog"
          className="flex items-center gap-0.1 text-gray-600 hover:text-[#63aeba] transition-colors group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs tracking-[0.1em] writing-mode-vertical transform rotate-90">
            PREVIOUS ARTICLE
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              {contentParagraphs.map((paragraph: string, idx: number) => (
                <p key={idx} className="text-gray-700 leading-relaxed mb-6 text-lg font-light">
                  {paragraph}
                </p>
              ))}

              {/* Tags */}
              <div className="flex gap-2 mt-12 pt-8 border-t border-gray-200">
                {post.tags.map((tag: string, idx: number) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-gray-100 text-gray-600 text-xs tracking-wider hover:bg-[#63aeba] hover:text-white transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-16">
              <h2 className="text-3xl font-serif mb-8 text-center">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedPosts.map((related) => (
                  <Link 
                    key={related._id}
                    href={`/blog/${related.slug}`}
                    className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundImage: `url(${related.heroImage})` }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex gap-2 mb-3">
                        {related.categories.map((cat: string, idx: number) => (
                          <span key={idx} className="text-[10px] tracking-[0.2em] text-gray-500">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-serif mb-2 group-hover:text-[#63aeba] transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-xs text-gray-500 tracking-wider">
                        {new Date(related.publishedAt).toLocaleDateString('en-US', { 
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

            {/* Comment Form */}
            <div className="mt-16 bg-white rounded-lg shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-serif mb-8">Leave a Comment</h2>
              <form className="space-y-8">
                <div>
                  <input 
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-transparent border-b border-gray-300 pb-3 focus:border-[#63aeba] outline-none transition-colors text-gray-700"
                  />
                </div>
                <div>
                  <input 
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-transparent border-b border-gray-300 pb-3 focus:border-[#63aeba] outline-none transition-colors text-gray-700"
                  />
                </div>
                <div>
                  <textarea 
                    rows={5}
                    placeholder="Your Comment"
                    className="w-full bg-transparent border-b border-gray-300 pb-3 focus:border-[#63aeba] outline-none transition-colors text-gray-700 resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-[#63aeba] text-white tracking-wider text-sm hover:bg-[#52919d] transition-colors"
                >
                  POST COMMENT
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Booking Widget */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-serif mb-4 text-center">Book Your Stay</h3>
                <div className="space-y-4">
                  <input 
                    type="date"
                    className="w-full border border-gray-300 px-4 py-3 focus:border-[#63aeba] outline-none transition-colors"
                  />
                  <input 
                    type="date"
                    className="w-full border border-gray-300 px-4 py-3 focus:border-[#63aeba] outline-none transition-colors"
                  />
                  <select className="w-full border border-gray-300 px-4 py-3 focus:border-[#63aeba] outline-none transition-colors">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                  <button className="w-full bg-[#63aeba] text-white py-3 tracking-wider text-sm hover:bg-[#52919d] transition-colors">
                    CHECK AVAILABILITY
                  </button>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-serif mb-4 text-center">Newsletter</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Subscribe to get special offers and updates
                </p>
                <div className="space-y-4">
                  <input 
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-transparent border-b border-gray-300 pb-3 focus:border-[#63aeba] outline-none transition-colors text-gray-700"
                  />
                  <button className="w-full bg-gray-900 text-white py-3 tracking-wider text-sm hover:bg-gray-800 transition-colors">
                    SUBSCRIBE
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-serif mb-4">Categories</h3>
                <ul className="space-y-3">
                  {["Luxury", "Travel", "Vacation", "Interior Design", "Hotel"].map((cat, idx) => (
                    <li key={idx}>
                      <Link 
                        href={`/blog?category=${cat.toLowerCase()}`}
                        className="text-gray-600 hover:text-[#63aeba] transition-colors text-sm flex items-center justify-between group"
                      >
                        <span>{cat}</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#63aeba] text-white p-4 rounded-full shadow-lg hover:bg-[#52919d] transition-all hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      </div>
      <Footer />
    </>
  );
}
