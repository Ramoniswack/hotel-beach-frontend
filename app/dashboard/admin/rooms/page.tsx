'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { roomsAPI } from '@/lib/api';
import { Hotel, ToggleLeft, ToggleRight, Edit, X, Save } from 'lucide-react';
import Image from 'next/image';

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
    size: string;
    view: string;
  };
  description?: string[];
  gallery?: string[];
  amenities?: string[];
  services?: string[];
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await roomsAPI.getAll();
      setRooms(response.data.data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = async (roomId: string, currentStatus: boolean) => {
    try {
      await roomsAPI.update(roomId, { isAvailable: !currentStatus });
      fetchRooms();
    } catch (err: any) {
      alert('Failed to update room: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoomId(room._id);
    setFormData({
      title: room.title,
      subtitle: room.subtitle,
      price: room.price,
      heroImage: room.heroImage,
      roomNumber: room.roomNumber,
      floor: room.floor,
      cleaningStatus: room.cleaningStatus,
      occupancyStatus: room.occupancyStatus,
      isAvailable: room.isAvailable,
      specs: { ...room.specs },
      description: room.description || [],
      gallery: room.gallery || [],
      amenities: room.amenities || [],
      services: room.services || [],
    });
  };

  const handleUpdateRoom = async (roomId: string) => {
    setIsSaving(true);
    try {
      console.log('Updating room with data:', formData);
      
      const response = await roomsAPI.update(roomId, formData);
      console.log('Update response:', response.data);
      
      setEditingRoomId(null);
      setFormData({});
      
      // Fetch fresh data from server
      await fetchRooms();
      
      alert('Room updated successfully!');
    } catch (err: any) {
      console.error('Update error:', err);
      console.error('Error response:', err.response?.data);
      alert('Failed to update room: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setFormData({});
  };

  return (
    <RouteGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Room Management</h2>
              <p className="text-gray-600 mt-1">Manage room availability and details</p>
            </div>
            <button
              onClick={fetchRooms}
              className="px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors"
            >
              Refresh
            </button>
          </div>

          {/* Rooms Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading rooms...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Hotel className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No rooms found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {editingRoomId === room._id ? (
                    // Edit Mode
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Edit Room</h3>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Room Title
                            </label>
                            <input
                              type="text"
                              value={formData.title || ''}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Subtitle
                            </label>
                            <input
                              type="text"
                              value={formData.subtitle || ''}
                              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price per Night ($)
                            </label>
                            <input
                              type="number"
                              value={formData.price || ''}
                              onChange={(e) =>
                                setFormData({ ...formData, price: Number(e.target.value) })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Room Number
                            </label>
                            <input
                              type="text"
                              value={formData.roomNumber || ''}
                              onChange={(e) =>
                                setFormData({ ...formData, roomNumber: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Floor
                            </label>
                            <input
                              type="number"
                              value={formData.floor || ''}
                              onChange={(e) =>
                                setFormData({ ...formData, floor: Number(e.target.value) })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Availability
                            </label>
                            <select
                              value={formData.isAvailable ? 'true' : 'false'}
                              onChange={(e) =>
                                setFormData({ ...formData, isAvailable: e.target.value === 'true' })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                            >
                              <option value="true">Available</option>
                              <option value="false">Unavailable</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cleaning Status
                            </label>
                            <select
                              value={formData.cleaningStatus || 'clean'}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  cleaningStatus: e.target.value as 'clean' | 'dirty' | 'in-progress',
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                            >
                              <option value="clean">Clean</option>
                              <option value="dirty">Needs Cleaning</option>
                              <option value="in-progress">Cleaning in Progress</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Occupancy Status
                            </label>
                            <select
                              value={formData.occupancyStatus || 'vacant'}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  occupancyStatus: e.target.value as
                                    | 'vacant'
                                    | 'occupied'
                                    | 'reserved',
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                            >
                              <option value="vacant">Vacant</option>
                              <option value="occupied">Occupied</option>
                              <option value="reserved">Reserved</option>
                            </select>
                          </div>
                        </div>

                        {/* Specs */}
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-3">
                            Room Specifications
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bed
                              </label>
                              <input
                                type="text"
                                value={formData.specs?.bed || ''}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    specs: { ...formData.specs!, bed: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Capacity
                              </label>
                              <input
                                type="text"
                                value={formData.specs?.capacity || ''}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    specs: { ...formData.specs!, capacity: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Size
                              </label>
                              <input
                                type="text"
                                value={formData.specs?.size || ''}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    specs: { ...formData.specs!, size: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                View
                              </label>
                              <input
                                type="text"
                                value={formData.specs?.view || ''}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    specs: { ...formData.specs!, view: e.target.value },
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Hero Image */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hero Image URL
                          </label>
                          <input
                            type="text"
                            value={formData.heroImage || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, heroImage: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                          />
                          {formData.heroImage && (
                            <div className="mt-2 relative h-32 rounded-lg overflow-hidden">
                              <Image
                                src={formData.heroImage}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description (one paragraph per line)
                          </label>
                          <textarea
                            value={formData.description?.join('\n') || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value.split('\n').filter(line => line.trim()),
                              })
                            }
                            rows={6}
                            placeholder="Enter each paragraph on a new line"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.description?.length || 0} paragraphs
                          </p>
                        </div>

                        {/* Gallery Images */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gallery Images (one URL per line)
                          </label>
                          <textarea
                            value={formData.gallery?.join('\n') || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gallery: e.target.value.split('\n').filter(line => line.trim()),
                              })
                            }
                            rows={4}
                            placeholder="Enter image URLs, one per line"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.gallery?.length || 0} images
                          </p>
                          {formData.gallery && formData.gallery.length > 0 && (
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              {formData.gallery.slice(0, 3).map((img, idx) => (
                                <div key={idx} className="relative h-20 rounded overflow-hidden">
                                  <Image
                                    src={img}
                                    alt={`Gallery ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Amenities */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amenities (one per line)
                          </label>
                          <textarea
                            value={formData.amenities?.join('\n') || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                amenities: e.target.value.split('\n').filter(line => line.trim()),
                              })
                            }
                            rows={5}
                            placeholder="40-inch Samsung® LED TV&#10;Electronic safe with charging facility&#10;Mini bar"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.amenities?.length || 0} amenities
                          </p>
                        </div>

                        {/* Services */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Services (one per line)
                          </label>
                          <textarea
                            value={formData.services?.join('\n') || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                services: e.target.value.split('\n').filter(line => line.trim()),
                              })
                            }
                            rows={5}
                            placeholder="Free-to-use smartphone (Free)&#10;Safe-deposit box (Free)&#10;Massage ($15 / Once / Per Guest)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.services?.length || 0} services
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleUpdateRoom(room._id)}
                            disabled={isSaving}
                            className="flex-1 px-6 py-3 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <>
                      {/* Room Image */}
                      <div className="relative h-48">
                        <Image
                          src={room.heroImage}
                          alt={room.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              room.isAvailable
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}
                          >
                            {room.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                          </span>
                        </div>
                      </div>

                      {/* Room Details */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{room.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{room.subtitle}</p>
                            {room.roomNumber && (
                              <p className="text-xs text-gray-500 mt-1">
                                Room {room.roomNumber} • Floor {room.floor}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#59a4b5]">${room.price}</p>
                            <p className="text-xs text-gray-600">per night</p>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div>
                            <span className="text-gray-600">Bed:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {room.specs.bed}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Capacity:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {room.specs.capacity}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Size:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {room.specs.size}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">View:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {room.specs.view}
                            </span>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              room.occupancyStatus === 'occupied'
                                ? 'bg-red-100 text-red-800'
                                : room.occupancyStatus === 'reserved'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {room.occupancyStatus.toUpperCase()}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              room.cleaningStatus === 'clean'
                                ? 'bg-blue-100 text-blue-800'
                                : room.cleaningStatus === 'in-progress'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {room.cleaningStatus === 'in-progress'
                              ? 'CLEANING'
                              : room.cleaningStatus.toUpperCase()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => toggleAvailability(room._id, room.isAvailable)}
                            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              room.isAvailable
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {room.isAvailable ? (
                              <>
                                <ToggleRight size={20} />
                                <span>Mark Unavailable</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={20} />
                                <span>Mark Available</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleEditRoom(room)}
                            className="px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors flex items-center space-x-2"
                          >
                            <Edit size={20} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
