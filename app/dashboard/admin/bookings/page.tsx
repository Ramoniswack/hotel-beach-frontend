'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useBookings, useUpdateBookingStatus } from '@/lib/queries/useBookings';
import { useRooms } from '@/lib/queries/useRooms';
import { bookingsAPI } from '@/lib/api';
import { Calendar, Eye, Search, ArrowUpDown, Plus, X, Save, Loader2, User, Mail, Phone, Users, CalendarDays, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  _id: string;
  roomId: string;
  roomTitle: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  status: string;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
  additionalServices?: Array<{
    name: string;
    price: number;
    quantity?: number;
  }>;
  createdAt: string;
}

export default function BookingsManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 2,
    children: 0,
    guestInfo: {
      name: '',
      email: '',
      phone: '',
    },
  });

  // Use TanStack Query
  const { data: bookings = [], isLoading, refetch } = useBookings();
  const { data: rooms = [], isLoading: roomsLoading } = useRooms();
  const updateStatus = useUpdateBookingStatus();

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    updateStatus.mutate({ id: bookingId, status: newStatus });
  };

  const handleCreateBooking = async () => {
    // Validate form
    if (!formData.roomId || !formData.checkInDate || !formData.checkOutDate) {
      alert('Please fill in all required fields: Room, Check-in Date, and Check-out Date');
      return;
    }

    if (!formData.guestInfo.name || !formData.guestInfo.email || !formData.guestInfo.phone) {
      alert('Please fill in all guest information: Name, Email, and Phone');
      return;
    }

    if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    setIsCreating(true);
    try {
      await bookingsAPI.create(formData);
      alert('Booking created successfully!');
      setShowCreateForm(false);
      setFormData({
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
        adults: 2,
        children: 0,
        guestInfo: {
          name: '',
          email: '',
          phone: '',
        },
      });
      refetch();
    } catch (err: any) {
      console.error('Create booking error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      alert('Failed to create booking: ' + errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredBookings = bookings
    .filter((booking: Booking) => {
      if (filter !== 'all' && booking.status !== filter) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          booking.guestInfo.name.toLowerCase().includes(query) ||
          booking.guestInfo.email.toLowerCase().includes(query) ||
          booking.guestInfo.phone.toLowerCase().includes(query) ||
          booking.roomTitle.toLowerCase().includes(query) ||
          booking._id.toLowerCase().includes(query)
        );
      }
      
      return true;
    })
    .sort((a: Booking, b: Booking) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'guestName':
          aValue = a.guestInfo.name.toLowerCase();
          bValue = b.guestInfo.name.toLowerCase();
          break;
        case 'roomTitle':
          aValue = a.roomTitle.toLowerCase();
          bValue = b.roomTitle.toLowerCase();
          break;
        case 'checkInDate':
          aValue = new Date(a.checkInDate).getTime();
          bValue = new Date(b.checkInDate).getTime();
          break;
        case 'checkOutDate':
          aValue = new Date(a.checkOutDate).getTime();
          bValue = new Date(b.checkOutDate).getTime();
          break;
        case 'totalPrice':
          aValue = a.totalPrice;
          bValue = b.totalPrice;
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'checked-in':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <RouteGuard allowedRoles={['admin', 'staff']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="text-[#59a4b5]" size={32} />
                Bookings Manager
              </h2>
              <p className="text-gray-600 mt-1">Manage all reservations</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                Create Manual Booking
              </button>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Create Manual Booking Form */}
          {showCreateForm && (
            <div className="bg-white rounded-lg border-2 border-green-500 overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="text-green-600" size={24} />
                    Create Manual Booking
                  </h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Room Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Room *
                    </label>
                    {roomsLoading ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="animate-spin" size={16} />
                        <span>Loading rooms...</span>
                      </div>
                    ) : (
                      <select
                        value={formData.roomId}
                        onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">-- Select a room --</option>
                        {rooms.map((room: any) => (
                          <option key={room._id} value={room.id}>
                            {room.title} - ${room.price}/night ({room.isAvailable ? 'Available' : 'Unavailable'})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <CalendarDays size={16} className="text-gray-400" />
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        value={formData.checkInDate}
                        onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <CalendarDays size={16} className="text-gray-400" />
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        value={formData.checkOutDate}
                        onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                        min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        Adults *
                      </label>
                      <select
                        value={formData.adults}
                        onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} Adult{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        Children
                      </label>
                      <select
                        value={formData.children}
                        onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} Child{num !== 1 ? 'ren' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Guest Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.guestInfo.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              guestInfo: { ...formData.guestInfo, name: e.target.value },
                            })
                          }
                          placeholder="John Doe"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.guestInfo.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              guestInfo: { ...formData.guestInfo, email: e.target.value },
                            })
                          }
                          placeholder="john@example.com"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={formData.guestInfo.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              guestInfo: { ...formData.guestInfo, phone: e.target.value },
                            })
                          }
                          placeholder="+1 234 567 8900"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleCreateBooking}
                      disabled={isCreating}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Creating Booking...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          <span>Create Booking</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowCreateForm(false)}
                      disabled={isCreating}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by guest name, email, phone, room, or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
              />
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'checked-in', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? 'bg-[#59a4b5] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="animate-spin h-12 w-12 text-[#59a4b5] mx-auto" />
                <p className="mt-4 text-gray-600">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('guestName')}
                      >
                        <div className="flex items-center gap-1">
                          Guest
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('roomTitle')}
                      >
                        <div className="flex items-center gap-1">
                          Room
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('checkInDate')}
                      >
                        <div className="flex items-center gap-1">
                          Check-in
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('checkOutDate')}
                      >
                        <div className="flex items-center gap-1">
                          Check-out
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guests
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('totalPrice')}
                      >
                        <div className="flex items-center gap-1">
                          Total
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown size={14} />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking: Booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.guestInfo.name}
                            </div>
                            <div className="text-sm text-gray-500">{booking.guestInfo.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.roomTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.adults}A {booking.children > 0 && `${booking.children}C`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${booking.totalPrice}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/admin/bookings/${booking._id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}