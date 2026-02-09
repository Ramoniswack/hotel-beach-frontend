'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ImageUpload from '@/components/ImageUpload';
import MultiImageUpload from '@/components/MultiImageUpload';
import { contentAPI } from '@/lib/api';
import { Compass, Edit, X, Save, Eye, EyeOff } from 'lucide-react';

interface Section {
  sectionId: string;
  sectionName: string;
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  items?: any[];
  isVisible: boolean;
  order: number;
}

interface ExploreContent {
  _id?: string;
  pageName: string;
  sections: Section[];
  metadata: {
    pageTitle: string;
    pageDescription: string;
    keywords?: string[];
  };
}

export default function ExploreManagement() {
  const [exploreContent, setExploreContent] = useState<ExploreContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Section | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchExploreContent();
  }, []);

  const fetchExploreContent = async () => {
    try {
      setIsLoading(true);
      const response = await contentAPI.getByPage('explore');
      setExploreContent(response.data.data);
    } catch (err: any) {
      console.error('Error fetching explore content:', err);
      alert('Failed to load explore content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section.sectionId);
    setFormData({ ...section });
  };

  const handleSaveSection = async () => {
    if (!exploreContent || !formData) return;

    setIsSaving(true);
    try {
      const updatedSections = exploreContent.sections.map(s =>
        s.sectionId === formData.sectionId ? formData : s
      );

      const updatedContent = {
        ...exploreContent,
        sections: updatedSections
      };

      await contentAPI.update('explore', updatedContent);
      setExploreContent(updatedContent);
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
    if (!exploreContent) return;

    const updatedSections = exploreContent.sections.map(s =>
      s.sectionId === sectionId ? { ...s, isVisible: !s.isVisible } : s
    );

    try {
      const updatedContent = { 
        pageName: exploreContent.pageName,
        sections: updatedSections,
        metadata: exploreContent.metadata
      };
      await contentAPI.update('explore', updatedContent);
      setExploreContent({ ...exploreContent, sections: updatedSections });
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

  // Functions for managing gallery items
  const addGalleryItem = () => {
    if (!formData) return;
    const newItem = { image: '', caption: '', type: 'horizontal' };
    setFormData({ ...formData, items: [...(formData.items || []), newItem] });
  };

  const updateGalleryItem = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const removeGalleryItem = (index: number) => {
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
            <p className="text-gray-600">Loading explore content...</p>
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
              <Compass size={32} />
              <h2 className="text-3xl font-bold">Explore Page Management</h2>
            </div>
            <p className="text-white/90">Manage all sections of the explore page</p>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {exploreContent?.sections
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
                        {/* Title (for header section) */}
                        {section.sectionId === 'header' && (
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
                        )}

                        {/* Subtitle (for header section) */}
                        {section.sectionId === 'header' && (
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
                        )}

                        {/* Description */}
                        {(section.sectionId === 'header' || section.sectionId === 'content' || section.sectionId === 'closing-text') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {section.sectionId === 'header' ? 'Description' : 'Content Text'}
                            </label>
                            <textarea
                              value={formData.description || ''}
                              onChange={(e) => updateFormField('description', e.target.value)}
                              rows={6}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}

                        {/* Hero Image */}
                        {section.sectionId === 'hero-image' && (
                          <div>
                            <MultiImageUpload
                              label="Hero Images"
                              value={formData.images || []}
                              onChange={(urls) => setFormData({ ...formData, images: urls })}
                              maxImages={5}
                            />
                          </div>
                        )}

                        {/* Gallery Items */}
                        {section.sectionId === 'image-gallery' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Gallery Images
                            </label>
                            {formData.items?.map((item: any, idx: number) => (
                              <div key={idx} className="border border-gray-300 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-gray-900">Image {idx + 1}</h4>
                                  <button
                                    onClick={() => removeGalleryItem(idx)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <ImageUpload
                                      label="Image"
                                      value={item.image || ''}
                                      onChange={(url) => updateGalleryItem(idx, 'image', url)}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Caption
                                    </label>
                                    <input
                                      type="text"
                                      value={item.caption || ''}
                                      onChange={(e) => updateGalleryItem(idx, 'caption', e.target.value)}
                                      placeholder="e.g., City walk through the tunnel"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Image Type
                                    </label>
                                    <select
                                      value={item.type || 'horizontal'}
                                      onChange={(e) => updateGalleryItem(idx, 'type', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                      <option value="horizontal">Horizontal (16:9)</option>
                                      <option value="vertical">Vertical (2:3)</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={addGalleryItem}
                              className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                            >
                              + Add Gallery Image
                            </button>
                          </div>
                        )}

                        {/* Our Rooms Section */}
                        {section.sectionId === 'our-rooms' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Section Title
                              </label>
                              <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => updateFormField('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Our Rooms"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Section Subtitle
                              </label>
                              <input
                                type="text"
                                value={formData.subtitle || ''}
                                onChange={(e) => updateFormField('subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Could also be interest for you"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Room Cards
                              </label>
                              {formData.items?.map((item: any, idx: number) => (
                                <div key={idx} className="border border-gray-300 rounded-lg p-4 mb-4">
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-900">{item.title || `Room ${idx + 1}`}</h4>
                                    <button
                                      onClick={() => removeGalleryItem(idx)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X size={20} />
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Room Title
                                      </label>
                                      <input
                                        type="text"
                                        value={item.title || ''}
                                        onChange={(e) => updateGalleryItem(idx, 'title', e.target.value)}
                                        placeholder="Superior Room"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <ImageUpload
                                        label="Room Image"
                                        value={item.image || ''}
                                        onChange={(url) => updateGalleryItem(idx, 'image', url)}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Size (m²)
                                      </label>
                                      <input
                                        type="text"
                                        value={item.size || ''}
                                        onChange={(e) => updateGalleryItem(idx, 'size', e.target.value)}
                                        placeholder="30"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Max Adults
                                      </label>
                                      <input
                                        type="text"
                                        value={item.maxAdults || ''}
                                        onChange={(e) => updateGalleryItem(idx, 'maxAdults', e.target.value)}
                                        placeholder="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Max Children
                                      </label>
                                      <input
                                        type="text"
                                        value={item.maxChildren || ''}
                                        onChange={(e) => updateGalleryItem(idx, 'maxChildren', e.target.value)}
                                        placeholder="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Price
                                      </label>
                                      <input
                                        type="text"
                                        value={item.price || ''}
                                        onChange={(e) => updateGalleryItem(idx, 'price', e.target.value)}
                                        placeholder="$199"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Link URL
                                      </label>
                                      <input
                                        type="text"
                                        value={item.link || ''}
                                        onChange={(e) => updateGalleryItem(idx, 'link', e.target.value)}
                                        placeholder="/accommodation/superior-room"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={addGalleryItem}
                                className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                              >
                                + Add Room Card
                              </button>
                            </div>
                          </>
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
                            {section.title || section.description?.substring(0, 80) || 'No content set'}
                            {section.description && section.description.length > 80 ? '...' : ''}
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
