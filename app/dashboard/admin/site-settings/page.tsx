'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ImageUpload from '@/components/ImageUpload';
import { contentAPI } from '@/lib/api';
import { Settings, Edit, X, Save, Plus, Trash2 } from 'lucide-react';

interface NavItem {
  label: string;
  url: string;
  order?: number;
}

interface FooterSection {
  section: string;
  title?: string;
  content?: string;
  images?: string[];
  links?: NavItem[];
}

interface Section {
  sectionId: string;
  sectionName: string;
  title?: string;
  items?: any[];
  isVisible: boolean;
  order: number;
}

interface SiteSettings {
  _id?: string;
  pageName: string;
  sections: Section[];
  metadata: {
    pageTitle: string;
    pageDescription: string;
    keywords?: string[];
  };
}

export default function SiteSettingsManagement() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Section | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await contentAPI.getByPage('site-settings');
      setSettings(response.data.data);
    } catch (err: any) {
      console.error('Error fetching site settings:', err);
      alert('Failed to load site settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section.sectionId);
    setFormData({ ...section });
  };

  const handleSaveSection = async () => {
    if (!settings || !formData) return;

    setIsSaving(true);
    try {
      const updatedSections = settings.sections.map(s =>
        s.sectionId === formData.sectionId ? formData : s
      );

      const updatedSettings = {
        ...settings,
        sections: updatedSections
      };

      await contentAPI.update('site-settings', updatedSettings);
      setSettings(updatedSettings);
      setEditingSection(null);
      setFormData(null);
      alert('Settings updated successfully!');
    } catch (err: any) {
      console.error('Update error:', err);
      alert('Failed to update settings: ' + (err.response?.data?.message || err.message));
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

  const addNavItem = () => {
    if (!formData) return;
    const newItem = { label: '', url: '', order: (formData.items?.length || 0) + 1 };
    setFormData({ ...formData, items: [...(formData.items || []), newItem] });
  };

  const updateNavItem = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const removeNavItem = (index: number) => {
    if (!formData) return;
    const newItems = formData.items?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, items: newItems });
  };

  const updateFooterSection = (index: number, field: string, value: any) => {
    if (!formData) return;
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  if (isLoading) {
    return (
      <RouteGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading site settings...</p>
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
              <Settings size={32} />
              <h2 className="text-3xl font-bold">Site Settings</h2>
            </div>
            <p className="text-white/90">Manage global header and footer settings</p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {settings?.sections.map((section) => (
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
                      {/* Header Settings */}
                      {section.sectionId === 'header' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Logo Type
                            </label>
                            <select
                              value={formData.subtitle || 'Use text logo'}
                              onChange={(e) => updateFormField('subtitle', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                              <option value="Use text logo">Use Text Logo</option>
                              <option value="Use image logo">Use Image Logo</option>
                            </select>
                          </div>

                          {formData.subtitle === 'Use image logo' ? (
                            <div>
                              <ImageUpload
                                label="Logo Image"
                                value={formData.images?.[0] || ''}
                                onChange={(url) => {
                                  const newImages = [url];
                                  updateFormField('images', newImages);
                                }}
                              />
                            </div> 
                                    className="h-16 object-contain"
                                  />
                            </div>
                          ) : (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Logo Text
                              </label>
                              <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => updateFormField('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="HOTEL BEACH"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Separate words with space. First word will be main, rest will be subtitle.
                              </p>
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Navigation Menu Items
                            </label>
                            {formData.items?.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={item.label || ''}
                                  onChange={(e) => updateNavItem(idx, 'label', e.target.value)}
                                  placeholder="Label"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                  type="text"
                                  value={item.url || ''}
                                  onChange={(e) => updateNavItem(idx, 'url', e.target.value)}
                                  placeholder="URL"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <button
                                  onClick={() => removeNavItem(idx)}
                                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={addNavItem}
                              className="mt-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium flex items-center gap-2"
                            >
                              <Plus size={16} />
                              Add Menu Item
                            </button>
                          </div>
                        </>
                      )}

                      {/* Footer Settings */}
                      {section.sectionId === 'footer' && (
                        <div className="space-y-6">
                          {formData.items?.map((item: any, idx: number) => (
                            <div key={idx} className="border border-gray-300 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900 mb-3 capitalize">
                                {item.section?.replace('-', ' ')}
                              </h4>
                              
                              {item.title !== undefined && (
                                <div className="mb-3">
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Title
                                  </label>
                                  <input
                                    type="text"
                                    value={item.title || ''}
                                    onChange={(e) => updateFooterSection(idx, 'title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  />
                                </div>
                              )}

                              {item.content !== undefined && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Content
                                  </label>
                                  <textarea
                                    value={item.content || ''}
                                    onChange={(e) => updateFooterSection(idx, 'content', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  />
                                </div>
                              )}

                              {item.images && (
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Award Images (URLs, one per line)
                                  </label>
                                  <textarea
                                    value={item.images?.join('\n') || ''}
                                    onChange={(e) => updateFooterSection(idx, 'images', e.target.value.split('\n'))}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
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
                          {section.sectionId === 'header' 
                            ? `${section.items?.length || 0} menu items` 
                            : `${section.items?.length || 0} footer sections`}
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
