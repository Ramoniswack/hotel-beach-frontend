'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { roomsAPI } from '@/lib/api';
import { Hotel, ToggleLeft, ToggleRight, Edit } from 'lucide-react';
import Image from 'next/image';

interface Room {
  _id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  pricePerNight: number;
  isAvailable: boolean;
  specs: {
    bed: string;
    capacity: string;
    size: string;
    view: string;
  };
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      // Refresh rooms
      fetchRooms();
    } catch (err: any) {
      alert('Failed to update room: ' + (err.response?.data?.message || 'Unknown error'));
    }
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
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
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#59a4b5]">
                          ${room.pricePerNight}
                        </p>
                        <p className="text-xs text-gray-600">per night</p>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">Bed:</span>
                        <span className="ml-2 font-medium text-gray-900">{room.specs.bed}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Capacity:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {room.specs.capacity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Size:</span>
                        <span className="ml-2 font-medium text-gray-900">{room.specs.size}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">View:</span>
                        <span className="ml-2 font-medium text-gray-900">{room.specs.view}</span>
                      </div>
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
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Edit size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
