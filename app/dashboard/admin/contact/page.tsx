'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { contentAPI } from '@/lib/api';
import { Mail, Edit, X, Save, Eye, EyeOff } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface Section {
  sectionId: string;
  sectionName: string;
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  items?: any[];
  buttonText?: string;
  buttonLink?: string;
  isVisible: boolean;
  order: number;
}

interface ContactContent {
  _id?: string;
  pageName: string;
  sections: Section[];
  metadata: {
    pageTitle: string;
    pageDescription: string;
    keywords?: string[];
  };
}

export default function ContactManagement() {
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Section | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      setIsLoading(true);
      const response = await contentAPI.getByPage('contact');
      setContactContent(response.data.data);
    } catch (err: any) {
      console.error('Error fetching contact content:', err);
      alert('Failed to load contact content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section.sectionId);
    setFormData({ ...section });
  };

  const handleSaveSection = async () => {
    if (!contactContent || !formData) return;

    setIsSaving(true);
    try {
      const updatedSections = contactContent.sections.map(s =>
        s.sectionId === formData.sectionId ? formData : s
      );

      const updatedContent = {
        ...contactContent,
        sections: updatedSections
      };

      await contentAPI.update('contact', updatedContent);
      setContactContent(updatedContent);
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
    if (!contactContent) return;

    const updatedSections = contactContent.sections.map(s =>
      s.sectionId === sectionId ? { ...s, isVisible: !s.isVisible } : s
    );

    try {
      const updatedContent = { 
        pageName: contactContent.pageName,
        sections: updatedSections,
        metadata: contactContent.metadata
      };
      await contentAPI.update('contact', updatedContent);
      setContactContent({ ...contactContent, sections: updatedSections });
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

  const addItem = () => {
    if (!formData) return;
    let newItem: any = {};
    
    if (formData.sectionId === 'info-columns') {
      newItem = { title: '', content: '' };
    } else if (formData.sectionId === 'contact-info') {
      newItem = { type: 'address', content: '' };
    } else if (formData.sectionId === 'social-media') {
      newItem = { platform: 'facebook', url: '#', color: '#3b5998' };
    }
    
    setFormData({ ...formData, items: [...(formData.items || []), newItem] });
  };

  const updateItem = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) => {
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
            <p className="text-gray-600">Loading contact content...</p>
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
              <Mail size={32} />
              <h2 className="text-3xl font-bold">Contact Page Management</h2>
            </div>
            <p className="text-white/90">Manage all sections of the contact page</p>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {contactContent?.sections
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
                        {(section.sectionId === 'header' || section.sectionId === 'contact-form' || section.sectionId === 'contact-info' || section.sectionId === 'social-media') && (
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

                        {/* Button Text & Link */}
                        {section.sectionId === 'header' && (
                          <>
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
                                placeholder="https://maps.google.com"
                              />
                            </div>
                          </>
                        )}

                        {/* Description */}
                        {section.sectionId === 'contact-form' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Consent Text
                            </label>
                            <textarea
                              value={formData.description || ''}
                              onChange={(e) => updateFormField('description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}

                        {/* Map Address */}
                        {section.sectionId === 'map' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Map Address or Location
                            </label>
                            <input
                              type="text"
                              value={formData.description || ''}
                              onChange={(e) => updateFormField('description', e.target.value)}
                              placeholder="Santorini, Greece"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Enter the address or location name to display on Google Maps
                            </p>
                          </div>
                        )}

                        {/* Info Columns Items */}
                        {section.sectionId === 'info-columns' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Information Columns
                            </label>
                            {formData.items?.map((item: any, idx: number) => (
                              <div key={idx} className="border border-gray-300 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-gray-900">Column {idx + 1}</h4>
                                  <button
                                    onClick={() => removeItem(idx)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      value={item.title || ''}
                                      onChange={(e) => updateItem(idx, 'title', e.target.value)}
                                      placeholder="Our Address"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Content
                                    </label>
                                    <textarea
                                      value={item.content || ''}
                                      onChange={(e) => updateItem(idx, 'content', e.target.value)}
                                      placeholder="Address or directions..."
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={addItem}
                              className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                            >
                              + Add Column
                            </button>
                          </div>
                        )}

                        {/* Contact Info Items */}
                        {section.sectionId === 'contact-info' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Contact Information
                            </label>
                            {formData.items?.map((item: any, idx: number) => (
                              <div key={idx} className="border border-gray-300 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-gray-900">{item.type}</h4>
                                  <button
                                    onClick={() => removeItem(idx)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Type
                                    </label>
                                    <select
                                      value={item.type || 'address'}
                                      onChange={(e) => updateItem(idx, 'type', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                      <option value="address">Address</option>
                                      <option value="contact">Contact</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Content
                                    </label>
                                    <textarea
                                      value={item.content || ''}
                                      onChange={(e) => updateItem(idx, 'content', e.target.value)}
                                      placeholder="Contact details..."
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={addItem}
                              className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                            >
                              + Add Info Block
                            </button>
                          </div>
                        )}

                        {/* Social Media Items */}
                        {section.sectionId === 'social-media' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Social Media Links
                            </label>
                            {formData.items?.map((item: any, idx: number) => (
                              <div key={idx} className="border border-gray-300 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-gray-900 capitalize">{item.platform}</h4>
                                  <button
                                    onClick={() => removeItem(idx)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Platform
                                    </label>
                                    <select
                                      value={item.platform || 'facebook'}
                                      onChange={(e) => updateItem(idx, 'platform', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    >
                                      <option value="facebook">Facebook</option>
                                      <option value="twitter">Twitter</option>
                                      <option value="youtube">YouTube</option>
                                      <option value="instagram">Instagram</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      URL
                                    </label>
                                    <input
                                      type="text"
                                      value={item.url || ''}
                                      onChange={(e) => updateItem(idx, 'url', e.target.value)}
                                      placeholder="https://..."
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Color
                                    </label>
                                    <input
                                      type="text"
                                      value={item.color || ''}
                                      onChange={(e) => updateItem(idx, 'color', e.target.value)}
                                      placeholder="#3b5998"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={addItem}
                              className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                            >
                              + Add Social Link
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
                            {section.title || section.subtitle || 'No content set'}
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
