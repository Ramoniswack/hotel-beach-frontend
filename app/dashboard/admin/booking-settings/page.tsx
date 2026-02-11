'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { contentAPI } from '@/lib/api';
import { Settings, Edit, X, Save, Eye, EyeOff } from 'lucide-react';

interface Section {
  sectionId: string;
  sectionName: string;
  title?: string;
  subtitle?: string;
  description?: string;
  items?: any[];
  isVisible: boolean;
  order: number;
}

interface BookingContent {
  _id?: string;
  pageName: string;
  sections: Section[];
  metadata: {
    pageTitle: string;
    pageDescription: string;
    keywords?: string[];
  };
}

export default function BookingSettingsManagement() {
  const [bookingContent, setBookingContent] = useState<BookingContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Section | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBookingContent();
  }, []);

  const fetchBookingContent = async () => {
    try {
      setIsLoading(true);
      const response = await contentAPI.getByPage('booking-settings');
      setBookingContent(response.data.data);
    } catch (err: any) {
      console.error('Error fetching booking settings:', err);
      // Initialize with default data if not found
      if (err.response?.status === 404) {
        const defaultContent: BookingContent = {
          pageName: 'booking-settings',
          sections: [
            {
              sectionId: 'check-times',
              sectionName: 'Check-in/Check-out Times',
              title: 'Check-in: from 11:00 am',
              subtitle: 'Check-out: until 10:00 am',
              isVisible: true,
              order: 1
            },
            {
              sectionId: 'policies',
              sectionName: 'Booking Policies',
              items: [
                {
                  title: 'Confirmations',
                  content: 'Confirmations that are received by email or fax will be processed and confirmed by our reservation office within 24 hours. A reservation is considered provisional until the hotel confirms acceptance of the reservation.'
                },
                {
                  title: 'Cancellations',
                  content: 'Cancellations and changes must be done in writing (e.g. email or fax). A confirmed reservation can be cancelled or changed until 3 full days prior scheduled arrival date. In case of non-arrival on the day (no-show) or cancellation less than 3 full days prior to arrival, the amount of the first night will be charged.'
                }
              ],
              isVisible: true,
              order: 2
            },
            {
              sectionId: 'sidebar-contact',
              sectionName: 'Sidebar Contact Info',
              title: 'Questions About Booking?',
              items: [
                { label: 'Tel', value: '+41 (0)54 2344 00' },
                { label: 'Fax', value: '+41 (0)542344 99' },
                { label: 'Email', value: 'reservations@hoteliercity.com' }
              ],
              isVisible: true,
              order: 3
            },
            {
              sectionId: 'sidebar-address',
              sectionName: 'Sidebar Address',
              title: 'Our Address',
              items: [
                { label: 'Hotel Name', value: 'Hotel Beach' },
                { label: 'Address Line 1', value: '45 Santorini Beach' },
                { label: 'Address Line 2', value: 'Santorini 847 00' },
                { label: 'Tel', value: '+41 (0)54 2344 00' },
                { label: 'Fax', value: '+41 (0)542344 99' },
                { label: 'Email', value: 'reservations@hotelbeach.com' }
              ],
              isVisible: true,
              order: 4
            }
          ],
          metadata: {
            pageTitle: 'Booking Confirmation Settings',
            pageDescription: 'Manage booking confirmation page content'
          }
        };
        setBookingContent(defaultContent);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section.sectionId);
    setFormData({ ...section });
  };

  const handleSaveSection = async () => {
    if (!bookingContent || !formData) return;

    setIsSaving(true);
    try {
      const updatedSections = bookingContent.sections.map(s =>
        s.sectionId === formData.sectionId ? formData : s
      );

      const updatedContent = {
        ...bookingContent,
        sections: updatedSections
      };

      // Try to update, if it fails (404), create new
      try {
        await contentAPI.update('booking-settings', updatedContent);
      } catch (updateErr: any) {
        if (updateErr.response?.status === 404) {
          // Content doesn't exist, create it
          await contentAPI.create({
            pageName: 'booking-settings',
            sections: updatedSections,
            metadata: bookingContent.metadata
          });
        } else {
          throw updateErr;
        }
      }

      setBookingContent(updatedContent);
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
    if (!bookingContent) return;

    const updatedSections = bookingContent.sections.map(s =>
      s.sectionId === sectionId ? { ...s, isVisible: !s.isVisible } : s
    );

    try {
      const updatedContent = { 
        pageName: bookingContent.pageName,
        sections: updatedSections,
        metadata: bookingContent.metadata
      };

      // Try to update, if it fails (404), create new
      try {
        await contentAPI.update('booking-settings', updatedContent);
      } catch (updateErr: any) {
        if (updateErr.response?.status === 404) {
          // Content doesn't exist, create it
          await contentAPI.create(updatedContent);
        } else {
          throw updateErr;
        }
      }

      setBookingContent({ ...bookingContent, sections: updatedSections });
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

  const updateItem = (index: number, field: string, value: string) => {
    if (!formData) return;
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    if (!formData) return;
    let newItem: any = {};
    
    if (formData.sectionId === 'policies') {
      newItem = { title: '', content: '' };
    } else if (formData.sectionId === 'additional-services') {
      newItem = { name: '', price: 0, priceLabel: 'Free', type: 'checkbox' };
    } else {
      newItem = { label: '', value: '' };
    }
    
    setFormData({ ...formData, items: [...(formData.items || []), newItem] });
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
            <p className="text-gray-600">Loading booking settings...</p>
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
              <h2 className="text-3xl font-bold">Booking Confirmation Settings</h2>
            </div>
            <p className="text-white/90">Manage booking confirmation page content</p>
          </div>

          {/* Sections List */}
          <div className="space-y-4">
            {bookingContent?.sections
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
                        {/* Check Times */}
                        {section.sectionId === 'check-times' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Check-in Time
                              </label>
                              <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => updateFormField('title', e.target.value)}
                                placeholder="Check-in: from 11:00 am"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Check-out Time
                              </label>
                              <input
                                type="text"
                                value={formData.subtitle || ''}
                                onChange={(e) => updateFormField('subtitle', e.target.value)}
                                placeholder="Check-out: until 10:00 am"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                          </>
                        )}

                        {/* Additional Services */}
                        {section.sectionId === 'additional-services' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Section Title
                              </label>
                              <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => updateFormField('title', e.target.value)}
                                placeholder="Choose Additional Services"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Services
                              </label>
                              {formData.items?.map((item: any, idx: number) => (
                                <div key={idx} className="border border-gray-300 rounded-lg p-4 mb-4">
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-900">Service {idx + 1}</h4>
                                    <button
                                      onClick={() => removeItem(idx)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X size={20} />
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Service Name
                                      </label>
                                      <input
                                        type="text"
                                        value={item.name || ''}
                                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                                        placeholder="Free-to-use smartphone"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Price ($)
                                      </label>
                                      <input
                                        type="number"
                                        value={item.price || 0}
                                        onChange={(e) => updateItem(idx, 'price', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Price Label
                                      </label>
                                      <input
                                        type="text"
                                        value={item.priceLabel || ''}
                                        onChange={(e) => updateItem(idx, 'priceLabel', e.target.value)}
                                        placeholder="Free or $60 / Once"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Type
                                      </label>
                                      <select
                                        value={item.type || 'checkbox'}
                                        onChange={(e) => updateItem(idx, 'type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      >
                                        <option value="checkbox">Checkbox</option>
                                        <option value="guests">With Guest Count</option>
                                      </select>
                                    </div>
                                    {item.type === 'guests' && (
                                      <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                          Guests Label
                                        </label>
                                        <input
                                          type="text"
                                          value={item.guestsLabel || ''}
                                          onChange={(e) => updateItem(idx, 'guestsLabel', e.target.value)}
                                          placeholder="for"
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={addItem}
                                className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium"
                              >
                                + Add Service
                              </button>
                            </div>
                          </>
                        )}

                        {/* Title for sidebar sections */}
                        {(section.sectionId === 'sidebar-contact' || section.sectionId === 'sidebar-address') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Section Title
                            </label>
                            <input
                              type="text"
                              value={formData.title || ''}
                              onChange={(e) => updateFormField('title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}

                        {/* Items */}
                        {formData.items && formData.items.length > 0 && section.sectionId !== 'additional-services' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {section.sectionId === 'policies' ? 'Policy Items' : 'Contact Items'}
                            </label>
                            {formData.items.map((item: any, idx: number) => (
                              <div key={idx} className="border border-gray-300 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium text-gray-900">
                                    {section.sectionId === 'policies' ? `Policy ${idx + 1}` : `Item ${idx + 1}`}
                                  </h4>
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
                                      {section.sectionId === 'policies' ? 'Title' : 'Label'}
                                    </label>
                                    <input
                                      type="text"
                                      value={item.title || item.label || ''}
                                      onChange={(e) => updateItem(idx, section.sectionId === 'policies' ? 'title' : 'label', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      {section.sectionId === 'policies' ? 'Content' : 'Value'}
                                    </label>
                                    <textarea
                                      value={item.content || item.value || ''}
                                      onChange={(e) => updateItem(idx, section.sectionId === 'policies' ? 'content' : 'value', e.target.value)}
                                      rows={section.sectionId === 'policies' ? 4 : 1}
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
                              + Add Item
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
                            {section.title || section.subtitle || `${section.items?.length || 0} items`}
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
