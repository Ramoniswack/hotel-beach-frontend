'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Heart, MessageCircle } from 'lucide-react';

interface Reply {
  _id: string;
  userId?: string;
  name: string;
  email?: string;
  comment: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  userId?: string;
  name: string;
  email?: string;
  comment: string;
  likes: string[];
  replies: Reply[];
  createdAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Availability form states
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  
  // Comment form states
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [replyForms, setReplyForms] = useState<{ [key: string]: { name: string; email: string; comment: string } }>({});
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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
        setComments(response.data.comments || []);
        
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

  const handleCheckAvailability = () => {
    if (!dateRange?.from || !dateRange?.to) {
      setAvailabilityError('Please select check-in and check-out dates');
      return;
    }

    const checkIn = format(dateRange.from, 'yyyy-MM-dd');
    const checkOut = format(dateRange.to, 'yyyy-MM-dd');
    router.push(`/search-results?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`);
  };

  useEffect(() => {
    setAvailabilityError(null);
  }, [dateRange]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showCalendar && !target.closest('.calendar-container') && !target.closest('.date-input')) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await api.post(`/blog/${params.slug}/comments`, commentForm);
      setComments(response.data.comments);
      setCommentForm({ name: '', email: '', comment: '' });
      setSubmitMessage('Comment posted successfully!');
    } catch (error) {
      setSubmitMessage('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) {
      setSubmitMessage('Please login to like comments');
      return;
    }

    try {
      await api.post(`/blog/${params.slug}/comments/${commentId}/like`);
      const response = await api.get(`/blog/${params.slug}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReplySubmit = async (commentId: string) => {
    setSubmitting(true);
    const replyData = replyForms[commentId] || { name: '', email: '', comment: '' };

    try {
      await api.post(`/blog/${params.slug}/comments/${commentId}/reply`, replyData);
      const response = await api.get(`/blog/${params.slug}`);
      setComments(response.data.comments || []);
      setReplyForms({ ...replyForms, [commentId]: { name: '', email: '', comment: '' } });
      setShowReplyForm(null);
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

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

            {/* Comments Section */}
            {comments.length > 0 && (
              <div className="mt-16 bg-white rounded-lg shadow-lg p-8 md:p-12">
                <h2 className="text-3xl font-serif mb-8">Comments ({comments.length})</h2>
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment._id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#63aeba] flex items-center justify-center text-white font-bold flex-shrink-0">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{comment.name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleLike(comment._id)}
                                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <Heart 
                                  size={18} 
                                  className={comment.likes.includes(user?.id || '') ? 'fill-red-500 text-red-500' : ''}
                                />
                                <span className="text-sm">{comment.likes.length}</span>
                              </button>
                              <button
                                onClick={() => setShowReplyForm(showReplyForm === comment._id ? null : comment._id)}
                                className="flex items-center gap-1 text-gray-500 hover:text-[#63aeba] transition-colors"
                              >
                                <MessageCircle size={18} />
                                <span className="text-sm">Reply</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed mt-2">{comment.comment}</p>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4 ml-8 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply._id} className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {reply.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-gray-900 text-sm">{reply.name}</p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                    <p className="text-gray-700 text-sm mt-1">{reply.comment}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Form */}
                          {showReplyForm === comment._id && (
                            <div className="mt-4 ml-8 bg-gray-50 p-4 rounded-lg">
                              <div className="space-y-3">
                                {!user && (
                                  <>
                                    <input
                                      type="text"
                                      placeholder="Your Name"
                                      value={replyForms[comment._id]?.name || ''}
                                      onChange={(e) => setReplyForms({
                                        ...replyForms,
                                        [comment._id]: { ...replyForms[comment._id], name: e.target.value }
                                      })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#63aeba] outline-none text-sm"
                                    />
                                    <input
                                      type="email"
                                      placeholder="Your Email"
                                      value={replyForms[comment._id]?.email || ''}
                                      onChange={(e) => setReplyForms({
                                        ...replyForms,
                                        [comment._id]: { ...replyForms[comment._id], email: e.target.value }
                                      })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#63aeba] outline-none text-sm"
                                    />
                                  </>
                                )}
                                <textarea
                                  rows={3}
                                  placeholder="Write your reply..."
                                  value={replyForms[comment._id]?.comment || ''}
                                  onChange={(e) => setReplyForms({
                                    ...replyForms,
                                    [comment._id]: { ...replyForms[comment._id], comment: e.target.value }
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-[#63aeba] outline-none text-sm resize-none"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleReplySubmit(comment._id)}
                                    disabled={submitting}
                                    className="px-4 py-2 bg-[#63aeba] text-white text-sm rounded hover:bg-[#52919d] transition-colors disabled:opacity-50"
                                  >
                                    Post Reply
                                  </button>
                                  <button
                                    onClick={() => setShowReplyForm(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comment Form */}
            <div className="mt-16 bg-white rounded-lg shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-serif mb-8">Leave a Comment</h2>
              {submitMessage && (
                <div className={`mb-6 p-4 rounded ${submitMessage.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitMessage}
                </div>
              )}
              <form onSubmit={handleCommentSubmit} className="space-y-8">
                {!user && (
                  <>
                    <div>
                      <input 
                        type="text"
                        placeholder="Your Name"
                        value={commentForm.name}
                        onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                        required
                        className="w-full bg-transparent border-b border-gray-300 pb-3 focus:border-[#63aeba] outline-none transition-colors text-gray-700"
                      />
                    </div>
                    <div>
                      <input 
                        type="email"
                        placeholder="Your Email"
                        value={commentForm.email}
                        onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                        required
                        className="w-full bg-transparent border-b border-gray-300 pb-3 focus:border-[#63aeba] outline-none transition-colors text-gray-700"
                      />
                    </div>
                  </>
                )}
                <div>
                  <textarea 
                    rows={5}
                    placeholder="Your Comment"
                    value={commentForm.comment}
                    onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                    required
                    className="w-full bg-transparent border-b border-gray-300 pb-3 focus:border-[#63aeba] outline-none transition-colors text-gray-700 resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#63aeba] text-white tracking-wider text-sm hover:bg-[#52919d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'POSTING...' : 'POST COMMENT'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Availability Check Widget */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-serif mb-4 text-center">Check Availability</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in & Check-out
                    </label>
                    <button
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="date-input w-full border border-gray-300 px-4 py-3 rounded text-left focus:border-[#63aeba] outline-none transition-colors"
                    >
                      {dateRange?.from ? (
                        dateRange.to ? (
                          `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
                        ) : (
                          format(dateRange.from, 'MMM dd, yyyy')
                        )
                      ) : (
                        <span className="text-gray-400">Select dates</span>
                      )}
                    </button>
                    {showCalendar && (
                      <div className="calendar-container absolute z-50 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 scale-55 origin-top-left">
                        <DateRangePicker
                          date={dateRange}
                          onDateChange={(newDate) => {
                            setDateRange(newDate);
                            if (newDate?.from && newDate?.to) {
                              setShowCalendar(false);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adults
                    </label>
                    <select 
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full border border-gray-300 px-4 py-3 rounded focus:border-[#63aeba] outline-none transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Children
                    </label>
                    <select 
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full border border-gray-300 px-4 py-3 rounded focus:border-[#63aeba] outline-none transition-colors"
                    >
                      {[0, 1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                      ))}
                    </select>
                  </div>

                  {availabilityError && (
                    <div className="text-red-600 text-sm">{availabilityError}</div>
                  )}

                  <button 
                    onClick={handleCheckAvailability}
                    className="w-full bg-[#63aeba] text-white py-3 tracking-wider text-sm hover:bg-[#52919d] transition-colors rounded"
                  >
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
                  <button className="w-full bg-gray-900 text-white py-3 tracking-wider text-sm hover:bg-gray-800 transition-colors rounded">
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
