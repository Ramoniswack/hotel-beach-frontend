'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { bookingsAPI, roomsAPI } from '@/lib/api';
import { Calendar, DollarSign, Hotel, TrendingUp, Users, Clock, CheckCircle, XCircle, UserPlus, MessageSquare } from 'lucide-react';

interface Stats {
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  totalRooms: number;
  availableRooms: number;
}

interface Activity {
  id: string;
  type: 'booking' | 'user' | 'comment';
  action: string;
  description: string;
  timestamp: string;
  status?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    totalRooms: 0,
    availableRooms: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch bookings
      const bookingsResponse = await bookingsAPI.getAll();
      const bookings = bookingsResponse.data.data || [];
      
      // Fetch rooms
      const roomsResponse = await roomsAPI.getAll();
      const rooms = roomsResponse.data.data || [];

      // Calculate stats
      const totalRevenue = bookings.reduce((sum: number, booking: any) => {
        return sum + (booking.totalPrice || 0);
      }, 0);

      const activeBookings = bookings.filter((b: any) => 
        b.status === 'confirmed' || b.status === 'pending'
      ).length;

      const availableRooms = rooms.filter((r: any) => r.isAvailable).length;

      setStats({
        totalBookings: bookings.length,
        totalRevenue,
        activeBookings,
        totalRooms: rooms.length,
        availableRooms,
      });

      // Generate recent activities from bookings
      const recentActivities: Activity[] = bookings
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
        .map((booking: any) => ({
          id: booking._id,
          type: 'booking' as const,
          action: `New booking ${booking.status}`,
          description: `${booking.guestName} booked ${booking.roomId?.name || 'a room'} for ${booking.numberOfNights} night(s)`,
          timestamp: booking.createdAt,
          status: booking.status,
        }));

      setActivities(recentActivities);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string, status?: string) => {
    if (type === 'booking') {
      if (status === 'confirmed') return <CheckCircle className="text-green-600" size={20} />;
      if (status === 'cancelled') return <XCircle className="text-red-600" size={20} />;
      return <Calendar className="text-blue-600" size={20} />;
    }
    if (type === 'user') return <UserPlus className="text-purple-600" size={20} />;
    if (type === 'comment') return <MessageSquare className="text-orange-600" size={20} />;
    return <Clock className="text-gray-600" size={20} />;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const colors: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <RouteGuard allowedRoles={['admin', 'staff']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading statistics...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Bookings */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <span className="text-green-600 text-sm font-medium flex items-center">
                      <TrendingUp size={16} className="mr-1" />
                      +12%
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBookings}</p>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-green-600" size={24} />
                    </div>
                    <span className="text-green-600 text-sm font-medium flex items-center">
                      <TrendingUp size={16} className="mr-1" />
                      +8%
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${stats.totalRevenue.toLocaleString()}
                  </p>
                </div>

                {/* Active Bookings */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#59a4b5]/10 rounded-lg flex items-center justify-center">
                      <Users className="text-[#59a4b5]" size={24} />
                    </div>
                    <span className="text-green-600 text-sm font-medium flex items-center">
                      <TrendingUp size={16} className="mr-1" />
                      +5%
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Active Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeBookings}</p>
                </div>

                {/* Available Rooms */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Hotel className="text-purple-600" size={24} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm font-medium">Available Rooms</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.availableRooms} / {stats.totalRooms}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a
                  href="/dashboard/admin/bookings"
                  className="bg-gradient-to-br from-[#59a4b5] to-[#4a8a99] rounded-lg p-6 text-white hover:shadow-xl transition-shadow"
                >
                  <Calendar size={32} className="mb-4" />
                  <h3 className="text-xl font-bold mb-2">Manage Bookings</h3>
                  <p className="text-white/90 text-sm">View and manage all reservations</p>
                </a>

                <a
                  href="/dashboard/admin/rooms"
                  className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white hover:shadow-xl transition-shadow"
                >
                  <Hotel size={32} className="mb-4" />
                  <h3 className="text-xl font-bold mb-2">Room Management</h3>
                  <p className="text-white/90 text-sm">Update room availability and details</p>
                </a>

                <a
                  href="/dashboard/admin/users"
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white hover:shadow-xl transition-shadow"
                >
                  <Users size={32} className="mb-4" />
                  <h3 className="text-xl font-bold mb-2">User Management</h3>
                  <p className="text-white/90 text-sm">Manage users and permissions</p>
                </a>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  <p className="text-gray-600 text-sm mt-1">Latest updates and actions</p>
                </div>
                <div className="p-6">
                  {activities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                      <p>No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            {getActivityIcon(activity.type, activity.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">{activity.action}</p>
                              {getStatusBadge(activity.status)}
                            </div>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Clock size={12} />
                              {formatTimestamp(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
