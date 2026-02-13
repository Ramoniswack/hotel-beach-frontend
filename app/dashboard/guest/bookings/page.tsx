'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, Users, FileText, Filter, Search } from 'lucide-react';
import { bookingsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

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
  paymentStatus: string;
  invoiceNumber?: string;
  createdAt: string;
}

export default function GuestBookingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, [user]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    if (!user?.email) return;

    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.roomTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">My Bookings</h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          View and manage all your reservations
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by room, invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent appearance-none text-sm sm:text-base"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
          Showing {filteredBookings.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-10 md:p-12 text-center">
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            {searchTerm || statusFilter !== 'all' ? 'No bookings match your filters' : 'No bookings yet'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <a
              href="/rooms"
              className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors text-sm sm:text-base"
            >
              Browse Rooms
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Room Image */}
              <div className="relative h-40 sm:h-44 md:h-48 bg-gray-200">
                <Image
                  src={`https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800`}
                  alt={booking.roomTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <span
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                      booking.status === 'confirmed'
                        ? 'bg-green-500 text-white'
                        : booking.status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : booking.status === 'cancelled'
                        ? 'bg-red-500 text-white'
                        : booking.status === 'checked-in'
                        ? 'bg-purple-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-4 sm:p-5 md:p-6">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                  {booking.roomTitle}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  Invoice #{booking.invoiceNumber || booking._id.slice(-8)}
                </p>

                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Calendar size={14} className="mr-2 shrink-0 sm:w-4 sm:h-4" />
                    <span className="truncate">
                      {format(new Date(booking.checkInDate), 'MMM dd, yyyy')} -{' '}
                      {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Users size={14} className="mr-2 shrink-0 sm:w-4 sm:h-4" />
                    <span className="truncate">
                      {booking.adults} Adult{booking.adults > 1 ? 's' : ''}
                      {booking.children > 0 && `, ${booking.children} Child${booking.children > 1 ? 'ren' : ''}`}
                    </span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm font-bold text-gray-900">
                    <span className="mr-2">Total:</span>
                    <span className="text-[#59a4b5]">${booking.totalPrice}</span>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => router.push(`/dashboard/guest/bookings/${booking._id}`)}
                  className="w-full px-3 sm:px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors font-medium flex items-center justify-center space-x-2 text-xs sm:text-sm"
                >
                  <FileText size={16} />
                  <span>View Details</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
