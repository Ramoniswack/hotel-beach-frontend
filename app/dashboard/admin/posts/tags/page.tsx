'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import api from '@/lib/api';
import { Tag, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TagData {
  name: string;
  count: number;
  posts: string[];
}

export default function TagsManagement() {
  const router = useRouter();
  const [tags, setTags] = useState<TagData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/blog');
      const posts = response.data;
      
      // Aggregate tags
      const tagMap = new Map<string, TagData>();
      posts.forEach((post: any) => {
        post.tags.forEach((tag: string) => {
          if (tagMap.has(tag)) {
            const existing = tagMap.get(tag)!;
            existing.count++;
            existing.posts.push(post.title);
          } else {
            tagMap.set(tag, {
              name: tag,
              count: 1,
              posts: [post.title]
            });
          }
        });
      });
      
      setTags(Array.from(tagMap.values()).sort((a, b) => b.count - a.count));
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Tag name is required');
      return;
    }

    try {
      if (editingTag) {
        // Update tag across all posts
        const response = await api.get('/blog');
        const posts = response.data;
        
        for (const post of posts) {
          if (post.tags.includes(editingTag)) {
            const updatedTags = post.tags.map((t: string) => 
              t === editingTag ? formData.name.trim() : t
            );
            await api.put(`/blog/${post._id}`, { ...post, tags: updatedTags });
          }
        }
        
        alert('Tag updated successfully!');
      } else {
        alert('To add a tag, edit a post and add it there.');
      }
      
      fetchTags();
      resetForm();
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleEdit = (tag: TagData) => {
    setEditingTag(tag.name);
    setFormData({ name: tag.name });
    setShowForm(true);
  };

  const handleDelete = async (tagName: string) => {
    if (!confirm(`Are you sure you want to delete the tag "${tagName}"? This will remove it from all posts.`)) return;
    
    try {
      const response = await api.get('/blog');
      const posts = response.data;
      
      for (const post of posts) {
        if (post.tags.includes(tagName)) {
          const updatedTags = post.tags.filter((t: string) => t !== tagName);
          await api.put(`/blog/${post._id}`, { ...post, tags: updatedTags });
        }
      }
      
      fetchTags();
      alert('Tag deleted successfully!');
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Failed to delete tag');
    }
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingTag(null);
    setShowForm(false);
  };

  return (
    <RouteGuard allowedRoles={['admin']}>
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
                <h2 className="text-3xl font-bold text-gray-900">Tags Management</h2>
                <p className="text-gray-600 mt-1">Manage blog post tags</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors"
            >
              <Plus size={20} />
              {showForm ? 'Cancel' : 'Edit Tag'}
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Tag className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Tags</p>
                <p className="text-2xl font-bold text-gray-900">{tags.length}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingTag ? 'Edit Tag' : 'Add Tag'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tag Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                    placeholder="Enter tag name"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingTag ? 'Update Tag' : 'Add Tag'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tags List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading tags...</p>
              </div>
            ) : tags.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No tags found</p>
                <p className="text-sm text-gray-500 mt-2">Tags will appear here when you add them to posts</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tag Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Used In Posts
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tags.map((tag) => (
                      <tr key={tag.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Tag size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{tag.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {tag.count} {tag.count === 1 ? 'post' : 'posts'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-md truncate">
                            {tag.posts.join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(tag)}
                              className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit tag"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(tag.name)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete tag"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
