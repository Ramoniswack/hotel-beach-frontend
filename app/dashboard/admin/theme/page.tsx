'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { themeAPI } from '@/lib/api';
import { Palette, Save, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

interface ThemeSection {
  sectionId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  content?: any;
  isVisible: boolean;
  order: number;
}

interface Theme {
  _id?: string;
  pageName: string;
  sections: ThemeSection[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  logo?: string;
  favicon?: string;
}

const pages = ['home', 'about', 'rooms', 'blog', 'explore', 'contact'];

export default function ThemeCustomization() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedPage, setSelectedPage] = useState('home');
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchPageTheme(selectedPage);
    }
  }, [selectedPage]);

  const fetchThemes = async () => {
    try {
      const response = await themeAPI.getAll();
      setThemes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching themes:', error);
    }
  };

  const fetchPageTheme = async (pageName: string) => {
    try {
      setIsLoading(true);
      const response = await themeAPI.getByPage(pageName);
      setCurrentTheme(response.data.data);
    } catch (error) {
      console.error('Error fetching page theme:', error);
      // Initialize with default theme if not found
      setCurrentTheme({
        pageName,
        sections: [],
        colors: {
          primary: '#59a4b5',
          secondary: '#4a8a99',
          accent: '#1a1a1a',
          background: '#ffffff',
          text: '#1a1a1a',
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTheme = async () => {
    if (!currentTheme) return;

    setIsSaving(true);
    try {
      if (currentTheme._id) {
        await themeAPI.update(currentTheme.pageName, currentTheme);
      } else {
        await themeAPI.create(currentTheme);
      }
      alert('Theme saved successfully!');
      fetchThemes();
    } catch (error: any) {
      console.error('Error saving theme:', error);
      alert('Failed to save theme: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = () => {
    if (!currentTheme) return;
    
    const newSection: ThemeSection = {
      sectionId: `section-${Date.now()}`,
      title: 'New Section',
      subtitle: '',
      description: '',
      images: [],
      buttonText: '',
      buttonLink: '',
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
      isVisible: true,
      order: currentTheme.sections.length,
    };

    setCurrentTheme({
      ...currentTheme,
      sections: [...currentTheme.sections, newSection],
    });
  };

  const updateSection = (index: number, updates: Partial<ThemeSection>) => {
    if (!currentTheme) return;

    const updatedSections = [...currentTheme.sections];
    updatedSections[index] = { ...updatedSections[index], ...updates };

    setCurrentTheme({
      ...currentTheme,
      sections: updatedSections,
    });
  };

  const deleteSection = (index: number) => {
    if (!currentTheme) return;
    if (!confirm('Are you sure you want to delete this section?')) return;

    const updatedSections = currentTheme.sections.filter((_, i) => i !== index);
    setCurrentTheme({
      ...currentTheme,
      sections: updatedSections,
    });
  };

  const toggleSectionVisibility = (index: number) => {
    if (!currentTheme) return;
    updateSection(index, { isVisible: !currentTheme.sections[index].isVisible });
  };

  return (
    <RouteGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-8 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <Palette size={32} />
              <h2 className="text-3xl font-bold">Theme Customization</h2>
            </div>
            <p className="text-white/90">Customize the look and feel of your website</p>
          </div>

          {/* Page Selector */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Page</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setSelectedPage(page)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors capitalize ${
                    selectedPage === page
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading theme...</p>
            </div>
          ) : currentTheme ? (
            <>
              {/* Global Colors */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Global Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(currentTheme.colors).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key}
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) =>
                            setCurrentTheme({
                              ...currentTheme,
                              colors: { ...currentTheme.colors, [key]: e.target.value },
                            })
                          }
                          className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            setCurrentTheme({
                              ...currentTheme,
                              colors: { ...currentTheme.colors, [key]: e.target.value },
                            })
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Page Sections</h3>
                  <button
                    onClick={addSection}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>Add Section</span>
                  </button>
                </div>

                {currentTheme.sections.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No sections yet. Click "Add Section" to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {currentTheme.sections.map((section, index) => (
                      <div
                        key={section.sectionId}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-gray-900">
                            Section {index + 1}: {section.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleSectionVisibility(index)}
                              className={`p-2 rounded-lg transition-colors ${
                                section.isVisible
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={section.isVisible ? 'Hide section' : 'Show section'}
                            >
                              {section.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button
                              onClick={() => deleteSection(index)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Delete section"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={section.title || ''}
                              onChange={(e) => updateSection(index, { title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Subtitle
                            </label>
                            <input
                              type="text"
                              value={section.subtitle || ''}
                              onChange={(e) => updateSection(index, { subtitle: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={section.description || ''}
                              onChange={(e) =>
                                updateSection(index, { description: e.target.value })
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Button Text
                            </label>
                            <input
                              type="text"
                              value={section.buttonText || ''}
                              onChange={(e) =>
                                updateSection(index, { buttonText: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Button Link
                            </label>
                            <input
                              type="text"
                              value={section.buttonLink || ''}
                              onChange={(e) =>
                                updateSection(index, { buttonLink: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Background Color
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={section.backgroundColor || '#ffffff'}
                                onChange={(e) =>
                                  updateSection(index, { backgroundColor: e.target.value })
                                }
                                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={section.backgroundColor || '#ffffff'}
                                onChange={(e) =>
                                  updateSection(index, { backgroundColor: e.target.value })
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Text Color
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="color"
                                value={section.textColor || '#1a1a1a'}
                                onChange={(e) =>
                                  updateSection(index, { textColor: e.target.value })
                                }
                                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={section.textColor || '#1a1a1a'}
                                onChange={(e) =>
                                  updateSection(index, { textColor: e.target.value })
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Images (one URL per line)
                            </label>
                            <textarea
                              value={section.images?.join('\n') || ''}
                              onChange={(e) =>
                                updateSection(index, {
                                  images: e.target.value.split('\n').filter((url) => url.trim()),
                                })
                              }
                              rows={3}
                              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveTheme}
                  disabled={isSaving}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Theme</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
