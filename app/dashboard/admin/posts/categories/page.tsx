'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import api from '@/lib/api';
import { Folder, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CategoryData {
  name: string;
  count: number;
  posts: string[];
}

export default function CategoriesManagement() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/blog');
      const posts = response.data;
      
      // Aggregate categories
      const categoryMap = new Map<string, CategoryData>();
      posts.forEach((post: any) => {
        post.categories.forEach((category: string) => {
          if (categoryMap.has(category)) {
            const existing = categoryMap.get(category)!;
            existing.count++;
            existing.posts.push(post.title);
          } else {
            categoryMap.set(category, {
              name: category,
              count: 1,
              posts: [post.title]
            });
          }
        });
      });
      
      setCategories(Array.from(categoryMap.values()).sort((a, b) => b.count - a.count));
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        // Update category across all posts
        const response = await api.get('/blog');
        const posts = response.data;
        
        for (const post of posts) {
          if (post.categories.includes(editingCategory)) {
            const updatedCategories = post.categories.map((c: string) => 
              c === editingCategory ? formData.name.trim().toUpperCase() : c
            );
            await api.put(`/blog/${post._id}`, { ...post, categories: updatedCategories });
          }
        }
        
        alert('Category updated successfully!');
      } else {
        alert('To add a category, edit a post and add it there.');
      }
      
      fetchCategories();
      resetForm();
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleEdit = (category: CategoryData) => {
    setEditingCategory(category.name);
    setFormData({ name: category.name });
    setShowForm(true);
  };

  const handleDelete = async (categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"? This will remove it from all posts.`)) return;
    
    try {
      const response = await api.get('/blog');
      const posts = response.data;
      
      for (const post of posts) {
        if (post.categories.includes(categoryName)) {
          const updatedCategories = post.categories.filter((c: string) => c !== categoryName);
          await api.put(`/blog/${post._id}`, { ...post, categories: updatedCategories });
        }
      }
      
      fetchCategories();
      alert('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingCategory(null);
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
                <h2 className="text-3xl font-bold text-gray-900">Categories Management</h2>
                <p className="text-gray-600 mt-1">Manage blog post categories</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors"
            >
              <Plus size={20} />
              {showForm ? 'Cancel' : 'Edit Category'}
            </button>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Folder className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                    placeholder="Enter category name (e.g., LUXURY, TRAVEL)"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Categories are typically in UPPERCASE</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingCategory ? 'Update Category' : 'Add Category'}
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

          {/* Categories List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No categories found</p>
                <p className="text-sm text-gray-500 mt-2">Categories will appear here when you add them to posts</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category Name
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
                    {categories.map((category) => (
                      <tr key={category.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Folder size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                            {category.count} {category.count === 1 ? 'post' : 'posts'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-md truncate">
                            {category.posts.join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit category"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(category.name)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete category"
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
