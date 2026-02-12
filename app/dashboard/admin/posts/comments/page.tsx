'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import api from '@/lib/api';
import { MessageSquare, Trash2, Heart, Reply, Eye, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

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

interface Reply {
  _id: string;
  userId?: string;
  name: string;
  email?: string;
  comment: string;
  createdAt: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  comments: Comment[];
}

export default function CommentsManagement() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<string>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/blog');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await api.delete(`/blog/${postId}/comments/${commentId}`);
      fetchPosts();
    } catch (error: any) {
      alert('Failed to delete comment: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteReply = async (postId: string, commentId: string, replyId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    
    try {
      await api.delete(`/blog/${postId}/comments/${commentId}/replies/${replyId}`);
      fetchPosts();
    } catch (error: any) {
      alert('Failed to delete reply: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleReply = async (postSlug: string, commentId: string) => {
    if (!replyText.trim()) {
      alert('Reply text is required');
      return;
    }

    try {
      await api.post(`/blog/${postSlug}/comments/${commentId}/reply`, {
        comment: replyText
      });
      setReplyText('');
      setReplyingTo(null);
      fetchPosts();
    } catch (error: any) {
      alert('Failed to add reply: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const allComments = posts.flatMap(post => 
    post.comments.map(comment => ({
      ...comment,
      postId: post._id,
      postTitle: post.title,
      postSlug: post.slug
    }))
  );

  const filteredComments = selectedPost === 'all' 
    ? allComments 
    : allComments.filter(c => c.postId === selectedPost);

  const totalComments = allComments.length;
  const totalReplies = allComments.reduce((sum, c) => sum + c.replies.length, 0);

  return (
    <RouteGuard allowedRoles={['admin', 'staff']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/admin/posts')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Comments Management</h2>
                <p className="text-gray-600 mt-1">Manage all blog comments and replies</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Comments</p>
                  <p className="text-2xl font-bold text-gray-900">{totalComments}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Reply className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Replies</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReplies}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allComments.reduce((sum, c) => sum + c.likes.length, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Post</label>
            <select
              value={selectedPost}
              onChange={(e) => setSelectedPost(e.target.value)}
              className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
            >
              <option value="all">All Posts ({totalComments} comments)</option>
              {posts.map(post => (
                <option key={post._id} value={post._id}>
                  {post.title} ({post.comments.length} comments)
                </option>
              ))}
            </select>
          </div>

          {/* Comments List */}
          <div className="bg-white rounded-lg border border-gray-200">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading comments...</p>
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No comments found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredComments.map((comment) => (
                  <div key={comment._id} className="p-6">
                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#59a4b5] rounded-full flex items-center justify-center text-white font-medium">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{comment.name}</p>
                            {comment.email && (
                              <span className="text-sm text-gray-500">({comment.email})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{format(new Date(comment.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                            <span>•</span>
                            <a 
                              href={`/blog/${comment.postSlug}`}
                              target="_blank"
                              className="text-[#59a4b5] hover:underline flex items-center gap-1"
                            >
                              <Eye size={14} />
                              {comment.postTitle}
                            </a>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.postId, comment._id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Comment Content */}
                    <div className="ml-13 mb-3">
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>

                    {/* Comment Stats & Actions */}
                    <div className="ml-13 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart size={16} className={comment.likes.length > 0 ? 'fill-red-500 text-red-500' : ''} />
                        <span>{comment.likes.length} {comment.likes.length === 1 ? 'like' : 'likes'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Reply size={16} />
                        <span>{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (replyingTo === comment._id) {
                            setReplyingTo(null);
                            setReplyText('');
                          } else {
                            setReplyingTo(comment._id);
                            setReplyText('');
                          }
                        }}
                        className="text-[#59a4b5] hover:text-[#4a8a99] font-medium flex items-center gap-1"
                      >
                        <Reply size={16} />
                        {replyingTo === comment._id ? 'Cancel Reply' : 'Reply'}
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment._id && (
                      <div className="ml-13 mt-4 bg-gray-50 rounded-lg p-4">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleReply(comment.postSlug, comment._id)}
                            className="px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors"
                          >
                            Post Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="ml-13 mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply._id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {reply.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900 text-sm">{reply.name}</p>
                                    {reply.email && (
                                      <span className="text-xs text-gray-500">({reply.email})</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(reply.createdAt), 'MMM dd, yyyy HH:mm')}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteReply(comment.postId, comment._id, reply._id)}
                                className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                                title="Delete reply"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <p className="text-gray-700 text-sm ml-11">{reply.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
