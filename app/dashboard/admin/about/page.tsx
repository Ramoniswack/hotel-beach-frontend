'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ImageUpload from '@/components/ImageUpload';
import MultiImageUpload from '@/components/MultiImageUpload';
import { contentAPI } from '@/lib/api';
import { FileText, Edit, X, Save, Eye, EyeOff } from 'lucide-react';

interface Section {
  sectionId: string;
  sectionName: string;
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  images?: string[];
  items?: any[];
  isVisible: boolean;
  order: number;
}

interface AboutContent {
  _id?: string;
  pageName: string;
  sections: Section[];
  metadata: {
    pageTitle: string;
    pageDescription: string;
    keywords?: string[];
  };
}

export default function AboutPageManagement() {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Section | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setIsLoading(true);
      const response = await contentAPI.getByPage('about');
      setAboutContent(response.data.data);
    } catch (err: any) {
      console.error('Error fetching about content:', err);
      alert('Failed to load about content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section.sectionId);
    setFormData({ ...section });
  };

  const handleSaveSection = async () => {
    if (!aboutContent || !formData) return;

    setIsSaving(true);
    try {
      const updatedSections = aboutContent.sections.map(s =>
        s.sectionId === formData.sectionId ? formData : s
      );

      const updatedContent = {
        pageName: aboutContent.pageName,
        sections: updatedSections,
        metadata: aboutContent.metadata
      };

      await contentAPI.update('about', updatedContent);
      setAboutContent({ ...aboutContent, sections: updatedSections });
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
    if (!aboutContent) return;

    const updatedSections = aboutContent.sections.map(s =>
      s.sectionId === sectionId ? { ...s, isVisible: !s.isVisible } : s
    );

    try {
      const updatedContent = { 
        pageName: aboutContent.pageName,
        sections: updatedSections,
        metadata: aboutContent.metadata
      };
      await contentAPI.update('about', updatedContent);
      setAboutContent({ ...aboutContent, sections: updatedSections });
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

  const addParagraph = () => {
    if (!formData) return;
    setFormData({ ...formData, items: [...(formData.items || []), { text: '' }] });
  };

  const updateParagraph = (index: number, value: string) => {
    if (!formData) return;
    const newItems = [...(formData.items || [])];
    newItems[index] = { text: value };
    setFormData({ ...formData, items: newItems });
  };

  const removeParagraph = (index: number) => {
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
            <p className="text-gray-600">Loading about content...</p>
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
              <FileText size={32} />
              <h2 className="text-3xl font-bold">About Page Management</h2>
            </div>
            <p className="text-white/90">Manage all sections of the about page</p>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {aboutContent?.sections
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
                        {(section.sectionId === 'header' || section.sectionId === 'content-section') && (
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

                        {/* Subtitle */}
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
                        {section.sectionId === 'intro-text' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Introduction Text
                            </label>
                            <textarea
                              value={formData.description || ''}
                              onChange={(e) => updateFormField('description', e.target.value)}
                              rows={6}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}

                        {/* Manager Name */}
                        {section.sectionId === 'intro-text' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Manager Name & Title
                            </label>
                            <input
                              type="text"
                              value={formData.content || ''}
                              onChange={(e) => updateFormField('content', e.target.value)}
                              placeholder="RICARD MORGAN - GENERAL MANAGER"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}

                        {/* Images */}
                        {(section.sectionId === 'hero-image' || section.sectionId === 'gallery' || section.sectionId === 'banner-image') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {section.sectionId === 'gallery' ? 'Gallery Images (5 images)' : 'Image URL'}
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
                                {section.sectionId === 'gallery' && (
                                  <button
                                    onClick={() => removeImage(idx)}
                                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                  >
                                    <X size={20} />
                                  </button>
                                )}
                              </div>
                            ))}
                            {section.sectionId === 'gallery' && (
                              <button
                                onClick={addImage}
                                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                              >
                                + Add Image
                              </button>
                            )}
                          </div>
                        )}

                        {/* Content Paragraphs */}
                        {section.sectionId === 'content-section' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Content Paragraphs
                            </label>
                            {formData.items?.map((item: any, idx: number) => (
                              <div key={idx} className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <label className="text-xs font-medium text-gray-600">
                                    Paragraph {idx + 1}
                                  </label>
                                  <button
                                    onClick={() => removeParagraph(idx)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                                <textarea
                                  value={item.text || ''}
                                  onChange={(e) => updateParagraph(idx, e.target.value)}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                            ))}
                            <button
                              onClick={addParagraph}
                              className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                            >
                              + Add Paragraph
                            </button>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={handleSaveSection}
                            disabled={isSaving}
                            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                            {section.title || section.description?.substring(0, 100) || 'No content set'}
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
