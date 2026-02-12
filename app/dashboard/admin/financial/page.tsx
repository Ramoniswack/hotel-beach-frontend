'use client';

import React, { useState, useEffect } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { bookingsAPI } from '@/lib/api';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';

interface Booking {
  _id: string;
  totalPrice: number;
  status: string;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
}

export default function FinancialDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingsAPI.getAll();
      setBookings(response.data.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate revenue metrics
  const calculateMetrics = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const thisMonthRevenue = bookings
      .filter(b => {
        const bookingDate = new Date(b.createdAt);
        return (
          (b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out') &&
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const lastMonthRevenue = bookings
      .filter(b => {
        const bookingDate = new Date(b.createdAt);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return (
          (b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out') &&
          bookingDate.getMonth() === lastMonth &&
          bookingDate.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const growthRate = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    const averageBookingValue = bookings.length > 0 
      ? totalRevenue / bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out').length 
      : 0;

    return {
      totalRevenue,
      thisMonthRevenue,
      growthRate,
      averageBookingValue,
      totalBookings: bookings.length
    };
  };

  // Generate monthly revenue data for the chart
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthRevenue = bookings
        .filter(b => {
          const bookingDate = new Date(b.createdAt);
          return (
            (b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out') &&
            bookingDate.getMonth() === index &&
            bookingDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, b) => sum + b.totalPrice, 0);

      return {
        month,
        revenue: monthRevenue,
        bookings: bookings.filter(b => {
          const bookingDate = new Date(b.createdAt);
          return bookingDate.getMonth() === index && bookingDate.getFullYear() === currentYear;
        }).length
      };
    });
  };

  // Generate status distribution data
  const generateStatusData = () => {
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
      value: count
    }));
  };

  // Generate room revenue data
  const generateRoomRevenueData = () => {
    const roomRevenue = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out')
      .reduce((acc, booking: any) => {
        const roomName = booking.room?.title || booking.roomId || 'Unknown Room';
        if (!acc[roomName]) {
          acc[roomName] = {
            revenue: 0,
            bookings: 0
          };
        }
        acc[roomName].revenue += booking.totalPrice;
        acc[roomName].bookings += 1;
        return acc;
      }, {} as Record<string, { revenue: number; bookings: number }>);

    return Object.entries(roomRevenue)
      .map(([name, data]) => ({
        name,
        revenue: data.revenue,
        bookings: data.bookings,
        avgRevenue: data.revenue / data.bookings
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const metrics = calculateMetrics();
  const monthlyData = generateMonthlyData();
  const statusData = generateStatusData();
  const roomRevenueData = generateRoomRevenueData();

  const COLORS = ['#59a4b5', '#4a8a99', '#3b7080', '#2c5660', '#1d3c40'];

  if (isLoading) {
    return (
      <RouteGuard allowedRoles={['admin']}>
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5]"></div>
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Financial Dashboard</h2>
              <p className="text-gray-600 mt-1">Revenue analytics and financial insights</p>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-[#59a4b5] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <span className={`text-sm font-medium ${metrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.growthRate >= 0 ? '+' : ''}{metrics.growthRate.toFixed(1)}%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900">${metrics.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">All time earnings</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="text-blue-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">This Month</h3>
              <p className="text-3xl font-bold text-gray-900">${metrics.thisMonthRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Current month revenue</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <CreditCard className="text-purple-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Avg. Booking Value</h3>
              <p className="text-3xl font-bold text-gray-900">${metrics.averageBookingValue.toFixed(0)}</p>
              <p className="text-xs text-gray-500 mt-2">Per booking average</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Calendar className="text-orange-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Bookings</h3>
              <p className="text-3xl font-bold text-gray-900">{metrics.totalBookings}</p>
              <p className="text-xs text-gray-500 mt-2">All time bookings</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Revenue Analytics</h3>
              <p className="text-gray-600 text-sm">Monthly revenue trends and forecasts</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#666"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#59a4b5" 
                  strokeWidth={3}
                  dot={{ fill: '#59a4b5', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bookings Bar Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Bookings</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#666"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#666"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="bookings" fill="#59a4b5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution Pie Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Room Revenue Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Room Revenue Performance</h3>
              <p className="text-gray-600 text-sm">Revenue breakdown by room type</p>
            </div>
            
            {roomRevenueData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roomRevenueData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      type="number" 
                      stroke="#666"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis 
                      type="category"
                      dataKey="name" 
                      stroke="#666"
                      style={{ fontSize: '12px' }}
                      width={150}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                      formatter={(value: any) => [`$${value}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#59a4b5" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg. Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {roomRevenueData.map((room, index) => {
                        const totalRevenue = roomRevenueData.reduce((sum, r) => sum + r.revenue, 0);
                        const percentage = (room.revenue / totalRevenue) * 100;
                        
                        return (
                          <tr key={room.name} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-sm font-medium text-gray-900">{room.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              ${room.revenue.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {room.bookings} bookings
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${room.avgRevenue.toFixed(0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ maxWidth: '100px' }}>
                                  <div 
                                    className="bg-[#59a4b5] h-2 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No room revenue data available yet</p>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.slice(0, 10).map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${booking.totalPrice.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
