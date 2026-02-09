'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { contentAPI } from '@/lib/api';
import { Home, Edit, X, Save, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';

interface Section {
  sectionId: string;
  sectionName: string;
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  images?: string[];
  buttonText?: string;
  buttonLink?: string;
  items?: any[];
  isVisible: boolean;
  order: number;
}

interface HomeContent {
  _id?: string;
  pageName: string;
  sections: Section[];
  metadata: {
    pageTitle: string;
    pageDescription: string;
    keywords?: string[];
  };
}

export default function HomeManagement() {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Section | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      setIsLoading(true);
      const response = await contentAPI.getByPage('home');
      setHomeContent(response.data.data);
    } catch (err: any) {
      console.error('Error fetching home content:', err);
      alert('Failed to load home content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section.sectionId);
    setFormData({ ...section });
  };

  const handleSaveSection = async () => {
    if (!homeContent || !formData) return;

    setIsSaving(true);
    try {
      const updatedSections = homeContent.sections.map(s =>
        s.sectionId === formData.sectionId ? formData : s
      );

      const updatedContent = {
        ...homeContent,
        sections: updatedSections
      };

      await contentAPI.update('home', updatedContent);
      setHomeContent(updatedContent);
      setEditingSection(null);
      setFormData(null);
      alert('Section updated successfully!');
    } catch (err: any) {
      console.error('Update error:', err);
      alert('Failed to update section: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (sectionId: string) => {
    if (!homeContent) return;

    const updatedSections = homeContent.sections.map(s =>
      s.sectionId === sectionId ? { ...s, isVisible: !s.isVisible } : s
    );

    try {
      const updatedContent = { 
        pageName: homeContent.pageName,
        sections: updatedSections,
        metadata: homeContent.metadata
      };
      await contentAPI.update('home', updatedContent);
      setHomeContent({ ...homeContent, sections: updatedSections });
    } catch (err: any) {
      console.error('Toggle visibility error:', err);
      alert('Failed to toggle visibility: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setFormData(null);
  };

  const updateFormField = (field: string, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const updateImageAtIndex = (index: number, value: string) => {
    if (!formData) return;
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImage = () => {
    if (!formData) return;
    setFormData({ ...formData, images: [...(formData.images || []), ''] });
  };

  const removeImage = (index: number) => {
    if (!formData) return;
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, images: newImages });
  };

  // Functions for managing items (slides with title/subtitle/image)
  const addSlide = () => {
    if (!formData) return;
    const newSlide = { title: '', subtitle: '', image: '' };
    setFormData({ ...formData, items: [...(formData.items || []), newSlide] });
  };

  const updateSlide = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const removeSlide = (index: number) => {
    if (!formData) return;
    const newItems = formData.items?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, items: newItems });
  };

  if (isLoading) {
    return (
      <RouteGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading home content...</p>
          </div>
        </DashboardLayout>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-8 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <Home size={32} />
              <h2 className="text-3xl font-bold">Home Page Management</h2>
            </div>
            <p className="text-white/90">Manage all sections of the home page</p>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {homeContent?.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div
                  key={section.sectionId}
                  className={`bg-white rounded-lg border-2 overflow-hidden transition-all ${
                    section.isVisible ? 'border-gray-200' : 'border-gray-300 opacity-60'
                  }`}
                >
                  {editingSection === section.sectionId && formData ? (
                    // Edit Mode
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                          Edit {section.sectionName}
                        </h3>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => updateFormField('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        {/* Subtitle */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={formData.subtitle || ''}
                            onChange={(e) => updateFormField('subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => updateFormField('description', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>

                        {/* Content */}
                        {section.sectionId === 'intro' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Signature Text (e.g., Manager Name)
                            </label>
                            <input
                              type="text"
                              value={formData.content || ''}
                              onChange={(e) => updateFormField('content', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}

                        {/* Hero Slides (for hero section only) */}
                        {section.sectionId === 'hero' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hero Slides (Carousel)
                            </label>
                            {formData.items?.map((slide: any, idx: number) => (
                              <div key={idx} className="border border-gray-300 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-gray-900">Slide {idx + 1}</h4>
                                  <button
                                    onClick={() => removeSlide(idx)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Slide Title
                                    </label>
                                    <input
                                      type="text"
                                      value={slide.title || ''}
                                      onChange={(e) => updateSlide(idx, 'title', e.target.value)}
                                      placeholder="e.g., Santorini Retreat"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Slide Subtitle
                                    </label>
                                    <input
                                      type="text"
                                      value={slide.subtitle || ''}
                                      onChange={(e) => updateSlide(idx, 'subtitle', e.target.value)}
                                      placeholder="e.g., Unlock the door to a wonder of the world"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Slide Image URL
                                    </label>
                                    <input
                                      type="text"
                                      value={slide.image || ''}
                                      onChange={(e) => updateSlide(idx, 'image', e.target.value)}
                                      placeholder="https://..."
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={addSlide}
                              className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                            >
                              + Add Slide
                            </button>
                          </div>
                        )}

                        {/* Images (for non-hero sections) */}
                        {section.sectionId !== 'hero' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Images
                            </label>
                            {formData.images?.map((img, idx) => (
                              <div key={idx} className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={img}
                                  onChange={(e) => updateImageAtIndex(idx, e.target.value)}
                                  placeholder="Image URL"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <button
                                  onClick={() => removeImage(idx)}
                                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={addImage}
                              className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              + Add Image
                            </button>
                          </div>
                        )}

                        {/* Button */}
                        {(section.sectionId === 'retreat-spa' || section.sectionId === 'explore-santorini') && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Button Text
                              </label>
                              <input
                                type="text"
                                value={formData.buttonText || ''}
                                onChange={(e) => updateFormField('buttonText', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Button Link
                              </label>
                              <input
                                type="text"
                                value={formData.buttonLink || ''}
                                onChange={(e) => updateFormField('buttonLink', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4 border-t">
                          <button
                            onClick={handleSaveSection}
                            disabled={isSaving}
                            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            {isSaving ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <Save size={20} />
                                <span>Save Changes</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-medium text-gray-500">
                              #{section.order}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900">
                              {section.sectionName}
                            </h3>
                            {!section.isVisible && (
                              <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {section.title || 'No title set'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleVisibility(section.sectionId)}
                            className={`p-2 rounded-lg transition-colors ${
                              section.isVisible
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title={section.isVisible ? 'Hide section' : 'Show section'}
                          >
                            {section.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                          </button>
                          <button
                            onClick={() => handleEditSection(section)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                          >
                            <Edit size={20} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
