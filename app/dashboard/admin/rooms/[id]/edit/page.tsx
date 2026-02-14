'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ImageUpload from '@/components/ImageUpload';
import MultiImageUpload from '@/components/MultiImageUpload';
import { roomsAPI } from '@/lib/api';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import { 
  ArrowLeft, 
  Save, 
  Hotel, 
  Info,
  Ruler,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Wrench,
  Bed,
  Users,
  Eye,
  DollarSign,
  Hash,
  Building2,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

interface Room {
  _id: string;
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  price: number;
  isAvailable: boolean;
  roomNumber?: string;
  floor?: number;
  cleaningStatus: 'clean' | 'dirty' | 'in-progress';
  occupancyStatus: 'vacant' | 'occupied' | 'reserved';
  specs: {
    bed: string;
    capacity: string;
    maxAdults: number;
    maxChildren: number;
    size: string;
    view: string;
  };
  description?: string[];
  gallery?: string[];
  amenities?: string[];
  services?: string[];
}

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      setIsLoading(true);
      const response = await roomsAPI.getById(roomId);
      const roomData = response.data.data;
      setRoom(roomData);
      setFormData({
        title: roomData.title,
        subtitle: roomData.subtitle,
        price: roomData.price,
        heroImage: roomData.heroImage,
        roomNumber: roomData.roomNumber,
        floor: roomData.floor,
        cleaningStatus: roomData.cleaningStatus,
        occupancyStatus: roomData.occupancyStatus,
        isAvailable: roomData.isAvailable,
        specs: { ...roomData.specs },
        description: roomData.description || [],
        gallery: roomData.gallery || [],
        amenities: roomData.amenities || [],
        services: roomData.services || [],
      });
    } catch (err) {
      console.error('Error fetching room:', err);
      alert('Failed to load room details');
      router.push('/dashboard/admin/rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await roomsAPI.update(roomId, formData);
      alert('Room updated successfully!');
      router.push('/dashboard/admin/rooms');
    } catch (err: any) {
      console.error('Update error:', err);
      alert('Failed to update room: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <RouteGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="max-w-5xl mx-auto">
            <div className="text-center py-12">
              <Loader2 className="animate-spin h-12 w-12 text-[#59a4b5] mx-auto" />
              <p className="mt-4 text-gray-600">Loading room details...</p>
            </div>
          </div>
        </DashboardLayout>
      </RouteGuard>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <RouteGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/admin/rooms')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Hotel className="text-[#59a4b5]" size={32} />
                  Edit Room
                </h2>
                <p className="text-gray-600 mt-1">Update room details and settings</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

          {/* Edit Form with Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <Tabs.Root defaultValue="basic" className="w-full">
              {/* Tab List */}
              <Tabs.List className="flex border-b border-gray-200 bg-gray-50 px-6 overflow-x-auto">
                <Tabs.Trigger
                  value="basic"
                  className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-[#59a4b5] data-[state=active]:text-[#59a4b5] transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Info size={16} />
                  Basic Info
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="specs"
                  className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-[#59a4b5] data-[state=active]:text-[#59a4b5] transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Ruler size={16} />
                  Specifications
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="images"
                  className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-[#59a4b5] data-[state=active]:text-[#59a4b5] transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <ImageIcon size={16} />
                  Images
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="content"
                  className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-[#59a4b5] data-[state=active]:text-[#59a4b5] transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <FileText size={16} />
                  Content
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="amenities"
                  className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent data-[state=active]:border-[#59a4b5] data-[state=active]:text-[#59a4b5] transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Sparkles size={16} />
                  Amenities & Services
                </Tabs.Trigger>
              </Tabs.List>

              {/* Basic Information Tab */}
              <Tabs.Content value="basic" className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Hotel size={16} className="text-gray-400" />
                      Room Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="e.g., Deluxe Room"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      Subtitle *
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="e.g., Luxury Accommodation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" />
                      Price per Night ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="e.g., 250"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Hash size={16} className="text-gray-400" />
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={formData.roomNumber || ''}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="e.g., 101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Building2 size={16} className="text-gray-400" />
                      Floor
                    </label>
                    <input
                      type="number"
                      value={formData.floor || ''}
                      onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="e.g., 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability Status
                    </label>
                    <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg">
                      <Switch.Root
                        checked={formData.isAvailable}
                        onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                        className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-[#59a4b5] transition-colors"
                      >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
                      </Switch.Root>
                      <span className="text-sm font-medium text-gray-700">
                        {formData.isAvailable ? (
                          <span className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 size={16} />
                            Available
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-red-600">
                            <XCircle size={16} />
                            Unavailable
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cleaning Status
                    </label>
                    <select
                      value={formData.cleaningStatus || 'clean'}
                      onChange={(e) => setFormData({ ...formData, cleaningStatus: e.target.value as any })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                    >
                      <option value="clean">✨ Clean</option>
                      <option value="dirty">🧽 Needs Cleaning</option>
                      <option value="in-progress">🧹 Cleaning in Progress</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupancy Status
                    </label>
                    <select
                      value={formData.occupancyStatus || 'vacant'}
                      onChange={(e) => setFormData({ ...formData, occupancyStatus: e.target.value as any })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                    >
                      <option value="vacant">🟢 Vacant</option>
                      <option value="occupied">🔴 Occupied</option>
                      <option value="reserved">🟡 Reserved</option>
                    </select>
                  </div>
                </div>
              </Tabs.Content>

              {/* Specifications Tab */}
              <Tabs.Content value="specs" className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Bed size={16} className="text-gray-400" />
                      Bed Type *
                    </label>
                    <input
                      type="text"
                      value={formData.specs?.bed || ''}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs!, bed: e.target.value } })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="e.g., King Size"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Ruler size={16} className="text-gray-400" />
                      Room Size *
                    </label>
                    <input
                      type="text"
                      value={formData.specs?.size || ''}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs!, size: e.target.value } })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="e.g., 35 m²"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Eye size={16} className="text-gray-400" />
                      View *
                    </label>
                    <input
                      type="text"
                      value={formData.specs?.view || ''}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs!, view: e.target.value } })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="e.g., Sea View"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      Capacity (Display Text) *
                    </label>
                    <input
                      type="text"
                      value={formData.specs?.capacity || ''}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs!, capacity: e.target.value } })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                      placeholder="e.g., 2 Adults"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Adults *
                    </label>
                    <select
                      value={formData.specs?.maxAdults || 2}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs!, maxAdults: Number(e.target.value) } })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                        <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Children *
                    </label>
                    <select
                      value={formData.specs?.maxChildren || 2}
                      onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs!, maxChildren: Number(e.target.value) } })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Tabs.Content>

              {/* Images Tab */}
              <Tabs.Content value="images" className="p-8 space-y-6">
                <ImageUpload
                  label="Hero Image *"
                  value={formData.heroImage || ''}
                  onChange={(url) => setFormData({ ...formData, heroImage: url })}
                />
                <MultiImageUpload
                  label="Gallery Images"
                  value={formData.gallery || []}
                  onChange={(urls) => setFormData({ ...formData, gallery: urls })}
                  maxImages={10}
                />
              </Tabs.Content>

              {/* Content Tab */}
              <Tabs.Content value="content" className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Enter each paragraph on a new line</p>
                  <textarea
                    value={formData.description?.join('\n') || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value.split('\n').filter(line => line.trim()) })}
                    rows={10}
                    placeholder="Enter each paragraph on a new line"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.description?.length || 0} paragraph{formData.description?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </Tabs.Content>

              {/* Amenities & Services Tab */}
              <Tabs.Content value="amenities" className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-gray-400" />
                    Amenities
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Enter one amenity per line</p>
                  <textarea
                    value={formData.amenities?.join('\n') || ''}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value.split('\n').filter(line => line.trim()) })}
                    rows={8}
                    placeholder="40-inch Samsung® LED TV&#10;Electronic safe with charging facility&#10;Mini bar"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.amenities?.length || 0} amenity{formData.amenities?.length !== 1 ? 'ies' : ''}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Wrench size={16} className="text-gray-400" />
                    Services
                  </label>
                  <p className="text-sm text-gray-500 mb-2">Enter one service per line</p>
                  <textarea
                    value={formData.services?.join('\n') || ''}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value.split('\n').filter(line => line.trim()) })}
                    rows={8}
                    placeholder="Free-to-use smartphone (Free)&#10;Safe-deposit box (Free)&#10;Massage ($15 / Once / Per Guest)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.services?.length || 0} service{formData.services?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </Tabs.Content>
            </Tabs.Root>

            {/* Action Buttons - Always Visible */}
            <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <button
                onClick={() => router.push('/dashboard/admin/rooms')}
                disabled={isSaving}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
