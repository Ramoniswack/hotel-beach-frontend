'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ImageUpload from '@/components/ImageUpload';
import MultiImageUpload from '@/components/MultiImageUpload';
import { roomsAPI } from '@/lib/api';
import { 
  Hotel, 
  ToggleLeft, 
  ToggleRight, 
  Edit, 
  X, 
  Save, 
  RefreshCw,
  Plus,
  Bed,
  Ruler,
  Eye,
  Users,
  Loader2
} from 'lucide-react';
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

export default function RoomManagement() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const handleCancelEdit = () => {
    setShowCreateForm(false);
    setFormData({});
  };

  const handleCreateRoom = () => {
    setShowCreateForm(true);
    setFormData({
      title: '',
      subtitle: '',
      price: 0,
      heroImage: '',
      isAvailable: true,
      cleaningStatus: 'clean',
      occupancyStatus: 'vacant',
      specs: {
        bed: '',
        capacity: '',
        maxAdults: 2,
        maxChildren: 2,
        size: '',
        view: '',
      },
      description: [],
      gallery: [],
      amenities: [],
      services: [],
    });
  };

  const handleSaveNewRoom = async () => {
    // Validate required fields
    if (!formData.title || !formData.subtitle || !formData.price || !formData.heroImage) {
      alert('Please fill in all required fields: Title, Subtitle, Price, and Hero Image');
      return;
    }

    if (!formData.specs?.bed || !formData.specs?.capacity || !formData.specs?.size || !formData.specs?.view) {
      alert('Please fill in all room specifications: Bed, Capacity, Size, and View');
      return;
    }

    setIsSaving(true);
    try {
      // Generate a slug from the room title
      const slug = formData.title!
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const newRoomData = {
        ...formData,
        id: slug,
        // Ensure specs has all required fields with defaults
        specs: {
          bed: formData.specs?.bed || '',
          capacity: formData.specs?.capacity || '2 Adults',
          maxAdults: formData.specs?.maxAdults || 2,
          maxChildren: formData.specs?.maxChildren || 2,
          size: formData.specs?.size || '',
          view: formData.specs?.view || '',
        },
        // Ensure arrays are initialized
        description: formData.description || [],
        gallery: formData.gallery || [],
        amenities: formData.amenities || [],
        services: formData.services || [],
        // Ensure status fields have defaults
        cleaningStatus: formData.cleaningStatus || 'clean',
        occupancyStatus: formData.occupancyStatus || 'vacant',
        isAvailable: formData.isAvailable !== undefined ? formData.isAvailable : true,
      };

      console.log('Creating room with data:', newRoomData);
      
      const response = await roomsAPI.create(newRoomData);
      console.log('Create response:', response.data);
      
      setShowCreateForm(false);
      setFormData({});
      
      await fetchRooms();
      
      alert('Room created successfully!');
    } catch (err: any) {
      console.error('Create error:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Unknown error';
      alert('Failed to create room: ' + errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <RouteGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Hotel className="text-[#59a4b5]" size={32} />
                Room Management
              </h2>
              <p className="text-gray-600 mt-1">Manage room availability and details</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateRoom}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                Create New Room
              </button>
              <button
                onClick={fetchRooms}
                className="px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors flex items-center gap-2"
              >
                <RefreshCw size={20} />
                Refresh
              </button>
            </div>
          </div>

          {/* Rooms Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin h-12 w-12 text-[#59a4b5] mx-auto" />
              <p className="mt-4 text-gray-600">Loading rooms...</p>
            </div>
          ) : (
            <>
              {/* Create New Room Form */}
              {showCreateForm && (
                <div className="bg-white rounded-lg border-2 border-green-500 overflow-hidden shadow-lg">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Hotel className="text-green-600" size={24} />
                        Create New Room
                      </h3>
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
                            Room Title *
                          </label>
                          <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Deluxe Room"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle *
                          </label>
                          <input
                            type="text"
                            value={formData.subtitle || ''}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Luxury Accommodation"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price per Night ($) *
                          </label>
                          <input
                            type="number"
                            value={formData.price || ''}
                            onChange={(e) =>
                              setFormData({ ...formData, price: Number(e.target.value) })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., 250"
                            required
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., 101"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., 1"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="true">Available</option>
                            <option value="false">Unavailable</option>
                          </select>
                        </div>
                      </div>

                      {/* Specs */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-3">
                          Room Specifications *
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bed *
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="e.g., King Size"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Size *
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="e.g., 35 m²"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              View *
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="e.g., Sea View"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Capacity (Display Text) *
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
                              placeholder="e.g., 2 Adults"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Adults *
                            </label>
                            <select
                              value={formData.specs?.maxAdults || 2}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  specs: { ...formData.specs!, maxAdults: Number(e.target.value) },
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="1">1 Adult</option>
                              <option value="2">2 Adults</option>
                              <option value="3">3 Adults</option>
                              <option value="4">4 Adults</option>
                              <option value="5">5 Adults</option>
                              <option value="6">6 Adults</option>
                              <option value="8">8 Adults</option>
                              <option value="10">10 Adults</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Children *
                            </label>
                            <select
                              value={formData.specs?.maxChildren || 2}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  specs: { ...formData.specs!, maxChildren: Number(e.target.value) },
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="0">0 Children</option>
                              <option value="1">1 Child</option>
                              <option value="2">2 Children</option>
                              <option value="3">3 Children</option>
                              <option value="4">4 Children</option>
                              <option value="5">5 Children</option>
                              <option value="6">6 Children</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Hero Image */}
                      <div>
                        <ImageUpload
                          label="Hero Image *"
                          value={formData.heroImage || ''}
                          onChange={(url) => setFormData({ ...formData, heroImage: url })}
                        />
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      {/* Gallery Images */}
                      <div>
                        <MultiImageUpload
                          label="Gallery Images"
                          value={formData.gallery || []}
                          onChange={(urls) => setFormData({ ...formData, gallery: urls })}
                          maxImages={10}
                        />
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={handleSaveNewRoom}
                          disabled={isSaving}
                          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="animate-spin" size={20} />
                              <span>Creating...</span>
                            </>
                          ) : (
                            <>
                              <Save size={20} />
                              <span>Create Room</span>
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
                </div>
              )}

              {/* Existing Rooms */}
              {rooms.length === 0 && !showCreateForm ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <Hotel className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 mb-4">No rooms found</p>
                  <button
                    onClick={handleCreateRoom}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Your First Room
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* View Mode - Enhanced Card Design */}
                  <>
                    {/* Room Image with Overlay */}
                    <div className="relative h-56 group">
                        <Image
                          src={room.heroImage}
                          alt={room.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        {/* Availability Badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                              room.isAvailable
                                ? 'bg-green-500/90 text-white'
                                : 'bg-red-500/90 text-white'
                            }`}
                          >
                            {room.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                          </span>
                        </div>

                        {/* Room Number Badge */}
                        {room.roomNumber && (
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 text-gray-900 shadow-lg backdrop-blur-sm">
                              Room {room.roomNumber}
                            </span>
                          </div>
                        )}

                        {/* Price Tag */}
                        <div className="absolute bottom-3 right-3">
                          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                            <p className="text-2xl font-bold text-[#59a4b5]">${room.price}</p>
                            <p className="text-xs text-gray-600 text-center">per night</p>
                          </div>
                        </div>
                      </div>

                      {/* Room Details */}
                      <div className="p-5 flex-1 flex flex-col">
                        {/* Title and Subtitle */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                            {room.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">{room.subtitle}</p>
                          {room.floor && (
                            <p className="text-xs text-gray-500 mt-1">Floor {room.floor}</p>
                          )}
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Bed size={16} className="text-[#59a4b5]" />
                            <div>
                              <p className="text-xs text-gray-500">Bed</p>
                              <p className="font-medium text-gray-900 text-xs">{room.specs.bed}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Ruler size={16} className="text-[#59a4b5]" />
                            <div>
                              <p className="text-xs text-gray-500">Size</p>
                              <p className="font-medium text-gray-900 text-xs">{room.specs.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye size={16} className="text-[#59a4b5]" />
                            <div>
                              <p className="text-xs text-gray-500">View</p>
                              <p className="font-medium text-gray-900 text-xs">{room.specs.view}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-[#59a4b5]" />
                            <div>
                              <p className="text-xs text-gray-500">Capacity</p>
                              <p className="font-medium text-gray-900 text-xs">
                                {room.specs.maxAdults}A / {room.specs.maxChildren}C
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              room.occupancyStatus === 'occupied'
                                ? 'bg-red-100 text-red-700'
                                : room.occupancyStatus === 'reserved'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {room.occupancyStatus === 'occupied' ? '🔴 Occupied' : 
                             room.occupancyStatus === 'reserved' ? '🟡 Reserved' : 
                             '🟢 Vacant'}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              room.cleaningStatus === 'clean'
                                ? 'bg-blue-100 text-blue-700'
                                : room.cleaningStatus === 'in-progress'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {room.cleaningStatus === 'clean' ? '✨ Clean' :
                             room.cleaningStatus === 'in-progress' ? '🧹 Cleaning' :
                             '🧽 Needs Cleaning'}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-200">
                          <button
                            onClick={() => router.push(`/dashboard/admin/rooms/${room._id}/edit`)}
                            className="w-full px-4 py-2.5 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors flex items-center justify-center space-x-2 font-medium"
                          >
                            <Edit size={18} />
                            <span>Edit Room</span>
                          </button>
                          <button
                            onClick={() => toggleAvailability(room._id, room.isAvailable)}
                            className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                              room.isAvailable
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                            }`}
                          >
                            {room.isAvailable ? (
                              <>
                                <ToggleRight size={18} />
                                <span>Mark Unavailable</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={18} />
                                <span>Mark Available</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                </div>
              ))}
                </div>
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
