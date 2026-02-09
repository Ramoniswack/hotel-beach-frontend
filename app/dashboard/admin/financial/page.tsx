'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { roomsAPI, bookingsAPI } from '@/lib/api';
import { DollarSign, TrendingUp, Calendar, PieChart, Save } from 'lucide-react';

interface Room {
  _id: string;
  id: string;
  title: string;
  price: number;
  seasonalPricing?: {
    season: string;
    startDate: string;
    endDate: string;
    price: number;
  }[];
}

export default function FinancialHub() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [revenue, setRevenue] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch rooms
      const roomsResponse = await roomsAPI.getAll();
      setRooms(roomsResponse.data.data || []);

      // Fetch bookings for revenue
      const bookingsResponse = await bookingsAPI.getAll();
      const bookings = bookingsResponse.data.data || [];

      const now = new Date();
      const thisMonth = bookings.filter((b: any) => {
        const date = new Date(b.createdAt);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      });

      const lastMonth = bookings.filter((b: any) => {
        const date = new Date(b.createdAt);
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
        return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
      });

      setRevenue({
        total: bookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0),
        thisMonth: thisMonth.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0),
        lastMonth: lastMonth.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0),
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoomPrice = async (roomId: string, newPrice: number) => {
    try {
      await roomsAPI.update(roomId, { price: newPrice });
      fetchData();
      setEditingRoom(null);
    } catch (err) {
      console.error('Error updating price:', err);
      alert('Failed to update price');
    }
  };

  const growthRate = revenue.lastMonth > 0
    ? ((revenue.thisMonth - revenue.lastMonth) / revenue.lastMonth * 100).toFixed(1)
    : '0';

  return (
    <RouteGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Financial Hub</h2>
            <p className="text-white/90">Manage pricing, revenue analytics, and financial operations</p>
          </div>

          {/* Revenue Stats */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading financial data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Revenue */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-green-600" size={24} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${revenue.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">All time</p>
                </div>

                {/* This Month */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <span className={`text-sm font-medium flex items-center ${
                      parseFloat(growthRate) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp size={16} className="mr-1" />
                      {growthRate}%
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${revenue.thisMonth.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">vs ${revenue.lastMonth.toLocaleString()} last month</p>
                </div>

                {/* Average Booking */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <PieChart className="text-purple-600" size={24} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Avg. Room Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${rooms.length > 0 ? Math.round(rooms.reduce((sum, r) => sum + r.price, 0) / rooms.length) : 0}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Per night</p>
                </div>
              </div>

              {/* Room Pricing Management */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Room Pricing Management</h3>
                  <p className="text-gray-600 text-sm mt-1">Update base rates and seasonal pricing</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {rooms.map((room) => (
                      <div
                        key={room._id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{room.title}</h4>
                            <p className="text-sm text-gray-600">Room ID: {room.id}</p>
                          </div>
                          <div className="text-right">
                            {editingRoom === room._id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  defaultValue={room.price}
                                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                  id={`price-${room._id}`}
                                />
                                <button
                                  onClick={() => {
                                    const input = document.getElementById(`price-${room._id}`) as HTMLInputElement;
                                    updateRoomPrice(room._id, parseFloat(input.value));
                                  }}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                                >
                                  <Save size={16} />
                                  <span>Save</span>
                                </button>
                                <button
                                  onClick={() => setEditingRoom(null)}
                                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <>
                                <p className="text-2xl font-bold text-green-600">${room.price}</p>
                                <p className="text-sm text-gray-600">per night</p>
                                <button
                                  onClick={() => setEditingRoom(room._id)}
                                  className="mt-2 text-sm text-blue-600 hover:underline"
                                >
                                  Edit Price
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Seasonal Pricing Section */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-bold text-gray-700 mb-3">Seasonal Pricing</h5>
                          {room.seasonalPricing && room.seasonalPricing.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {room.seasonalPricing.map((season, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-3">
                                  <p className="font-medium text-gray-900">{season.season}</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(season.startDate).toLocaleDateString()} - {new Date(season.endDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-lg font-bold text-green-600 mt-1">${season.price}/night</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                              <p className="text-sm text-gray-600 mb-2">No seasonal pricing configured</p>
                              <button className="text-sm text-blue-600 hover:underline">
                                Add Seasonal Rate
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Revenue Chart Placeholder */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Revenue Analytics</h3>
                  <p className="text-gray-600 text-sm mt-1">Monthly revenue trends and forecasts</p>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-12 text-center">
                    <PieChart size={64} className="mx-auto text-green-600 mb-4" />
                    <p className="text-gray-700 font-medium">Revenue Chart Coming Soon</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Interactive charts and analytics will be available here
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
