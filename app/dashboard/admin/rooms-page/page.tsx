'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { contentAPI } from '@/lib/api';
import { FileText, Edit, X, Save } from 'lucide-react';

interface Promotion {
  title: string;
  image: string;
  link?: string;
}

interface Section {
  sectionId: string;
  sectionName: string;
  title?: string;
  description?: string;
  items?: Promotion[];
  isVisible: boolean;
  order: number;
}

interface RoomsPageContent {
  _id?: string;
  pageName: string;
  sections: Section[];
  metadata: {
    pageTitle: string;
    pageDescription: string;
    keywords?: string[];
  };
}

export default function RoomsPageManagement() {
  const [pageContent, setPageContent] = useState<RoomsPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Section | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      setIsLoading(true);
      const response = await contentAPI.getByPage('rooms');
      setPageContent(response.data.data);
    } catch (err: any) {
      console.error('Error fetching rooms page content:', err);
      alert('Failed to load rooms page content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section.sectionId);
    setFormData({ ...section });
  };

  const handleSaveSection = async () => {
    if (!pageContent || !formData) return;

    setIsSaving(true);
    try {
      const updatedSections = pageContent.sections.map(s =>
        s.sectionId === formData.sectionId ? formData : s
      );

      const updatedContent = {
        pageName: pageContent.pageName,
        sections: updatedSections,
        metadata: pageContent.metadata
      };

      await contentAPI.update('rooms', updatedContent);
      setPageContent({ ...pageContent, sections: updatedSections });
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

  const handleCancelEdit = () => {
    setEditingSection(null);
    setFormData(null);
  };

  const updateFormField = (field: string, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const addPromotion = () => {
    if (!formData) return;
    const newPromo = { title: '', image: '', link: '' };
    setFormData({ ...formData, items: [...(formData.items || []), newPromo] });
  };

  const updatePromotion = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const removePromotion = (index: number) => {
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
            <p className="text-gray-600">Loading...</p>
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
              <h2 className="text-3xl font-bold">Rooms Page Management</h2>
            </div>
            <p className="text-white/90">Manage content for the rooms page</p>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {pageContent?.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div
                  key={section.sectionId}
                  className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden"
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
                        {section.sectionId !== 'promotions' && (
                          <>
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
                          </>
                        )}

                        {/* Promotions */}
                        {section.sectionId === 'promotions' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Promotion Packages
                            </label>
                            {formData.items?.map((promo: Promotion, idx: number) => (
                              <div key={idx} className="border border-gray-300 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-gray-900">Package {idx + 1}</h4>
                                  <button
                                    onClick={() => removePromotion(idx)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Package Title
                                    </label>
                                    <input
                                      type="text"
                                      value={promo.title || ''}
                                      onChange={(e) => updatePromotion(idx, 'title', e.target.value)}
                                      placeholder="e.g., 2 Nights Getaway Package"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Image URL
                                    </label>
                                    <input
                                      type="text"
                                      value={promo.image || ''}
                                      onChange={(e) => updatePromotion(idx, 'image', e.target.value)}
                                      placeholder="https://..."
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Link (optional)
                                    </label>
                                    <input
                                      type="text"
                                      value={promo.link || ''}
                                      onChange={(e) => updatePromotion(idx, 'link', e.target.value)}
                                      placeholder="/promotions/package-name"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={addPromotion}
                              className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                            >
                              + Add Promotion Package
                            </button>
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
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {section.sectionName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {section.title || section.description || 'No content set'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEditSection(section)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                        >
                          <Edit size={20} />
                          <span>Edit</span>
                        </button>
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
