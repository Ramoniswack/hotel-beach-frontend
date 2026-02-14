'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Tag,
  Loader2,
  User,
  Hash,
  Folder
} from 'lucide-react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import * as Tabs from '@radix-ui/react-tabs';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  heroImage: string;
  categories: string[];
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  status: 'draft' | 'published';
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    heroImage: '',
    categories: '',
    tags: '',
    authorName: 'Admin',
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/blog/${postId}`);
      const postData = response.data;
      setPost(postData);
      setFormData({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        heroImage: postData.heroImage,
        categories: postData.categories.join(', '),
        tags: postData.tags.join(', '),
        authorName: postData.author.name,
        status: postData.status
      });
    } catch (err) {
      console.error('Error fetching post:', err);
      alert('Failed to load post details');
      router.push('/dashboard/admin/posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        heroImage: formData.heroImage,
        categories: formData.categories.split(',').map(c => c.trim()).filter(c => c),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        author: { name: formData.authorName },
        status: formData.status
      };

      await api.put(`/blog/${postId}`, postData);
      alert('Post updated successfully!');
      router.push('/dashboard/admin/posts');
    } catch (error: any) {
      console.error('Error updating post:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error updating post';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <RouteGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="max-w-5xl mx-auto">
            <div className="text-center py-12">
              <Loader2 className="animate-spin h-12 w-12 text-[#59a4b5] mx-auto" />
              <p className="mt-4 text-gray-600">Loading post details...</p>
            </div>
          </div>
        </DashboardLayout>
      </RouteGuard>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <RouteGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
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
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="text-[#59a4b5]" size={32} />
                  Edit Post
                </h2>
                <p className="text-gray-600 mt-1">Update post details and content</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-3 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

          {/* Form with Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <form onSubmit={handleSubmit}>
              <Tabs.Root defaultValue="basic" className="w-full">
                {/* Tab List */}
                <Tabs.List className="flex border-b border-gray-200 bg-gray-50 px-6 overflow-x-auto">
                  <Tabs.Trigger
                    value="basic"
                    className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-[#59a4b5] data-[state=active]:text-[#59a4b5] transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <FileText size={16} />
                    Basic Info
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="content"
                    className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-[#59a4b5] data-[state=active]:text-[#59a4b5] transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <BookOpen size={16} />
                    Content
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="media"
                    className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-[#59a4b5] data-[state=active]:text-[#59a4b5] transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <ImageIcon size={16} />
                    Media
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="meta"
                    className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-[#59a4b5] data-[state=active]:text-[#59a4b5] transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Tag size={16} />
                    Categories & Tags
                  </Tabs.Trigger>
                </Tabs.List>

                {/* Basic Info Tab */}
                <Tabs.Content value="basic" className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="Enter post title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Hash size={16} className="text-gray-400" />
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="post-url-slug"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">URL-friendly version of the title</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      rows={3}
                      placeholder="Brief summary of the post"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        Author Name *
                      </label>
                      <input
                        type="text"
                        value={formData.authorName}
                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                        placeholder="Admin"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      >
                        <option value="draft">📝 Draft</option>
                        <option value="published">✅ Published</option>
                      </select>
                    </div>
                  </div>
                </Tabs.Content>

                {/* Content Tab */}
                <Tabs.Content value="content" className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <BookOpen size={16} className="text-gray-400" />
                      Post Content *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent font-mono text-sm"
                      rows={20}
                      placeholder="Write your post content here..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.content.length} characters
                    </p>
                  </div>
                </Tabs.Content>

                {/* Media Tab */}
                <Tabs.Content value="media" className="p-8 space-y-6">
                  <ImageUpload
                    label="Hero Image"
                    value={formData.heroImage}
                    onChange={(url) => setFormData({ ...formData, heroImage: url })}
                  />
                </Tabs.Content>

                {/* Categories & Tags Tab */}
                <Tabs.Content value="meta" className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Folder size={16} className="text-gray-400" />
                      Categories
                    </label>
                    <input
                      type="text"
                      value={formData.categories}
                      onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="LUXURY, TRAVEL, VACATION"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated list of categories</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Tag size={16} className="text-gray-400" />
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="hotel, luxury, vacation"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated list of tags</p>
                  </div>
                </Tabs.Content>
              </Tabs.Root>

              {/* Action Buttons */}
              <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/admin/posts')}
                  disabled={isSaving}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
