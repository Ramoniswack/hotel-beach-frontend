'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { contentAPI } from '@/lib/api';
import { FileText, Save, Eye, EyeOff, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface PageSection {
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

interface PageContent {
  _id?: string;
  pageName: string;
  sections: PageSection[];
  metadata: {
    pageTitle: string;
    pageDescription: string;
    keywords?: string[];
  };
}

const pages = [
  { id: 'home', name: 'Home Page', icon: '🏠' },
  { id: 'about', name: 'About Page', icon: 'ℹ️' },
  { id: 'rooms', name: 'Rooms Page', icon: '🛏️' },
  { id: 'blog', name: 'Blog Page', icon: '📝' },
  { id: 'explore', name: 'Explore Page', icon: '🗺️' },
  { id: 'contact', name: 'Contact Page', icon: '📞' },
];

export default function ContentManager() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [currentContent, setCurrentContent] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedPage) {
      fetchPageContent(selectedPage);
    }
  }, [selectedPage]);

  const fetchPageContent = async (pageName: string) => {
    try {
      setIsLoading(true);
      const response = await contentAPI.getByPage(pageName);
      setCurrentContent(response.data.data);
    } catch (error) {
      console.error('Error fetching page content:', error);
      // Initialize with default content if not found
      setCurrentContent({
        pageName,
        sections: [],
        metadata: {
          pageTitle: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - Hotel Beach`,
          pageDescription: `Welcome to our ${pageName} page`,
          keywords: [pageName, 'hotel', 'beach', 'santorini'],
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContent = async () => {
    if (!currentContent) return;

    setIsSaving(true);
    try {
      if (currentContent._id) {
        await contentAPI.update(currentContent.pageName, currentContent);
      } else {
        await contentAPI.create(currentContent);
      }
      alert('Content saved successfully!');
      fetchPageContent(currentContent.pageName);
    } catch (error: any) {
      console.error('Error saving content:', error);
      alert('Failed to save content: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = () => {
    if (!currentContent) return;
    
    const newSection: PageSection = {
      sectionId: `section-${Date.now()}`,
      sectionName: 'New Section',
      title: 'Section Title',
      subtitle: 'Section Subtitle',
      description: 'Section description goes here...',
      content: '',
      images: [],
      buttonText: '',
      buttonLink: '',
      items: [],
      isVisible: true,
      order: currentContent.sections.length,
    };

    setCurrentContent({
      ...currentContent,
      sections: [...currentContent.sections, newSection],
    });
  };

  const updateSection = (index: number, updates: Partial<PageSection>) => {
    if (!currentContent) return;

    const updatedSections = [...currentContent.sections];
    updatedSections[index] = { ...updatedSections[index], ...updates };

    setCurrentContent({
      ...currentContent,
      sections: updatedSections,
    });
  };

  const deleteSection = (index: number) => {
    if (!currentContent) return;
    if (!confirm('Are you sure you want to delete this section?')) return;

    const updatedSections = currentContent.sections.filter((_, i) => i !== index);
    setCurrentContent({
      ...currentContent,
      sections: updatedSections,
    });
  };

  const toggleSectionVisibility = (index: number) => {
    if (!currentContent) return;
    updateSection(index, { isVisible: !currentContent.sections[index].isVisible });
  };

  return (
    <RouteGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <FileText size={32} />
              <h2 className="text-3xl font-bold">Content Manager</h2>
            </div>
            <p className="text-white/90">Edit page content, text, images, and descriptions</p>
          </div>

          {/* Page Selector */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Select Page to Edit</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page.id)}
                  className={`px-4 py-4 rounded-lg font-medium transition-colors text-left ${
                    selectedPage === page.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{page.icon}</div>
                  <div className="text-sm">{page.name}</div>
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading content...</p>
            </div>
          ) : currentContent ? (
            <>
              {/* Page Metadata */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Page Metadata (SEO)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Title
                    </label>
                    <input
                      type="text"
                      value={currentContent.metadata.pageTitle}
                      onChange={(e) =>
                        setCurrentContent({
                          ...currentContent,
                          metadata: { ...currentContent.metadata, pageTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Description
                    </label>
                    <textarea
                      value={currentContent.metadata.pageDescription}
                      onChange={(e) =>
                        setCurrentContent({
                          ...currentContent,
                          metadata: { ...currentContent.metadata, pageDescription: e.target.value },
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Page Sections</h3>
                  <button
                    onClick={addSection}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>Add Section</span>
                  </button>
                </div>

                {currentContent.sections.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 mb-4">No sections yet. Click "Add Section" to get started.</p>
                    <button
                      onClick={addSection}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First Section
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentContent.sections.map((section, index) => (
                      <div
                        key={section.sectionId}
                        className={`border-2 rounded-lg p-6 transition-all ${
                          section.isVisible
                            ? 'border-gray-200 bg-white'
                            : 'border-gray-300 bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                            <input
                              type="text"
                              value={section.sectionName}
                              onChange={(e) => updateSection(index, { sectionName: e.target.value })}
                              className="text-lg font-bold text-gray-900 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-600 outline-none px-2 py-1"
                              placeholder="Section Name"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleSectionVisibility(index)}
                              className={`p-2 rounded-lg transition-colors ${
                                section.isVisible
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Section title"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Section subtitle"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Section description"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Content (HTML supported)
                            </label>
                            <textarea
                              value={section.content || ''}
                              onChange={(e) =>
                                updateSection(index, { content: e.target.value })
                              }
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                              placeholder="Additional content..."
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Learn More"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="/about"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2">
                              <ImageIcon size={16} />
                              <span>Images (one URL per line)</span>
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {section.images?.length || 0} image(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => fetchPageContent(currentContent.pageName)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Reset Changes
                </button>
                <button
                  onClick={handleSaveContent}
                  disabled={isSaving}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Content</span>
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
