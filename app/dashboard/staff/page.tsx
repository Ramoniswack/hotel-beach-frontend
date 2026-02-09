'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { roomsAPI, bookingsAPI } from '@/lib/api';
import { Hotel, CheckCircle, XCircle, Clock, Users, Sparkles } from 'lucide-react';

interface Room {
  _id: string;
  id: string;
  title: string;
  roomNumber: string;
  floor: number;
  cleaningStatus: 'clean' | 'dirty' | 'in-progress';
  occupancyStatus: 'vacant' | 'occupied' | 'reserved';
  isAvailable: boolean;
}

export default function StaffDashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'occupied' | 'vacant' | 'dirty'>('all');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await roomsAPI.getAll();
      const roomsData = response.data.data || [];
      
      // Add mock room numbers and floors if not present
      const enhancedRooms = roomsData.map((room: any, index: number) => ({
        ...room,
        roomNumber: room.roomNumber || `${100 + index + 1}`,
        floor: room.floor || Math.floor(index / 3) + 1,
        cleaningStatus: room.cleaningStatus || 'clean',
        occupancyStatus: room.occupancyStatus || 'vacant',
      }));
      
      setRooms(enhancedRooms);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoomStatus = async (roomId: string, updates: any) => {
    try {
      await roomsAPI.update(roomId, updates);
      fetchRooms();
    } catch (err) {
      console.error('Error updating room:', err);
      alert('Failed to update room status');
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    if (filter === 'occupied') return room.occupancyStatus === 'occupied';
    if (filter === 'vacant') return room.occupancyStatus === 'vacant';
    if (filter === 'dirty') return room.cleaningStatus === 'dirty';
    return true;
  });

  const stats = {
    total: rooms.length,
    occupied: rooms.filter(r => r.occupancyStatus === 'occupied').length,
    vacant: rooms.filter(r => r.occupancyStatus === 'vacant').length,
    needsCleaning: rooms.filter(r => r.cleaningStatus === 'dirty').length,
  };

  return (
    <RouteGuard allowedRoles={['staff', 'admin']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Live Floor Plan</h2>
            <p className="text-white/90">Real-time room status and housekeeping management</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Rooms</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <Hotel className="text-gray-400" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Occupied</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.occupied}</p>
                </div>
                <Users className="text-red-400" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Vacant</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.vacant}</p>
                </div>
                <CheckCircle className="text-green-400" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Needs Cleaning</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.needsCleaning}</p>
                </div>
                <Sparkles className="text-orange-400" size={32} />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Rooms
              </button>
              <button
                onClick={() => setFilter('occupied')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'occupied'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Occupied
              </button>
              <button
                onClick={() => setFilter('vacant')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'vacant'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Vacant
              </button>
              <button
                onClick={() => setFilter('dirty')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'dirty'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Needs Cleaning
              </button>
            </div>
          </div>

          {/* Floor Plan */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Room Status Grid</h3>
              <p className="text-gray-600 text-sm mt-1">Click on a room to update its status</p>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading rooms...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRooms.map((room) => (
                    <div
                      key={room._id}
                      className={`border-2 rounded-lg p-6 transition-all hover:shadow-lg ${
                        room.occupancyStatus === 'occupied'
                          ? 'border-red-300 bg-red-50'
                          : room.occupancyStatus === 'reserved'
                          ? 'border-yellow-300 bg-yellow-50'
                          : room.cleaningStatus === 'dirty'
                          ? 'border-orange-300 bg-orange-50'
                          : 'border-green-300 bg-green-50'
                      }`}
                    >
                      {/* Room Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            Room {room.roomNumber}
                          </h4>
                          <p className="text-sm text-gray-600">Floor {room.floor}</p>
                        </div>
                        <Hotel size={24} className="text-gray-400" />
                      </div>

                      {/* Room Type */}
                      <p className="text-sm font-medium text-gray-700 mb-4">{room.title}</p>

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            room.occupancyStatus === 'occupied'
                              ? 'bg-red-500 text-white'
                              : room.occupancyStatus === 'reserved'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-green-500 text-white'
                          }`}
                        >
                          {room.occupancyStatus.toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            room.cleaningStatus === 'clean'
                              ? 'bg-blue-500 text-white'
                              : room.cleaningStatus === 'in-progress'
                              ? 'bg-purple-500 text-white'
                              : 'bg-orange-500 text-white'
                          }`}
                        >
                          {room.cleaningStatus === 'in-progress' ? 'CLEANING' : room.cleaningStatus.toUpperCase()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <select
                          value={room.cleaningStatus}
                          onChange={(e) =>
                            updateRoomStatus(room._id, { cleaningStatus: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="clean">Clean</option>
                          <option value="dirty">Needs Cleaning</option>
                          <option value="in-progress">Cleaning in Progress</option>
                        </select>

                        <select
                          value={room.occupancyStatus}
                          onChange={(e) =>
                            updateRoomStatus(room._id, { occupancyStatus: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="vacant">Vacant</option>
                          <option value="occupied">Occupied</option>
                          <option value="reserved">Reserved</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
