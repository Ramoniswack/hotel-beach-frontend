'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { bookingsAPI } from '@/lib/api';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Calendar, Users, MessageSquare, X, Download, FileText } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

interface Booking {
  _id: string;
  roomId: string;
  roomTitle: string; // Changed from room object to roomTitle string
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  invoiceNumber: string;
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

export default function GuestDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      const response = await bookingsAPI.getByEmail(user.email);
      setBookings(response.data.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingsAPI.cancel(bookingId);
      fetchBookings();
    } catch (err: any) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const downloadInvoice = async (booking: Booking) => {
    try {
      await generateInvoicePDF(booking);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate invoice PDF. Please try again.');
    }
  };

  return (
    <RouteGuard allowedRoles={['guest']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-[#59a4b5] to-[#4a8a99] rounded-lg p-4 sm:p-6 md:p-8 text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-white/90 text-sm sm:text-base">Manage your Santorini trips and access concierge services</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">Total Bookings</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{bookings.length}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#59a4b5]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="text-[#59a4b5]" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">Upcoming Trips</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                    {bookings.filter(b => 
                      (b.status === 'confirmed' || b.status === 'pending') && 
                      new Date(b.checkInDate) > new Date()
                    ).length}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-green-600" size={20} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200 sm:col-span-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">AI Concierge</p>
                  <button className="text-[#59a4b5] font-medium mt-1 sm:mt-2 hover:underline flex items-center space-x-2 text-sm sm:text-base">
                    <MessageSquare size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span>Chat Now</span>
                  </button>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-blue-600" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* My Bookings */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">My Santorini Trips</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">View bookings and download invoices</p>
            </div>

            <div className="p-4 sm:p-5 md:p-6">
              {isLoading ? (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
                  <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Loading bookings...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <p className="text-red-600 text-sm sm:text-base">{error}</p>
                  <button
                    onClick={fetchBookings}
                    className="mt-3 sm:mt-4 px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] text-sm sm:text-base"
                  >
                    Retry
                  </button>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <Calendar className="mx-auto text-gray-400 mb-3 sm:mb-4" size={40} />
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">No bookings yet</p>
                  <a
                    href="/rooms"
                    className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors text-sm sm:text-base"
                  >
                    Browse Rooms
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Room Image - Use placeholder since we don't have heroImage */}
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
                                : 'bg-gray-500 text-white'
                            }`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="p-4 sm:p-5 md:p-6">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                          {booking.roomTitle}
                        </h4>

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
                            <span>
                              {booking.adults} Adult{booking.adults > 1 ? 's' : ''}
                              {booking.children > 0 && `, ${booking.children} Child${booking.children > 1 ? 'ren' : ''}`}
                            </span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <FileText size={14} className="mr-2 shrink-0 sm:w-4 sm:h-4" />
                            <span className="truncate">Invoice: {booking.invoiceNumber || 'Pending'}</span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm font-bold text-gray-900">
                            <span className="mr-2">Total:</span>
                            <span className="text-[#59a4b5]">${booking.totalPrice}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <button
                            onClick={() => router.push(`/dashboard/guest/bookings/${booking._id}`)}
                            className="w-full px-3 sm:px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors font-medium flex items-center justify-center space-x-2 text-xs sm:text-sm"
                          >
                            <FileText size={16} />
                            <span>View Details</span>
                          </button>
                          
                          {/* <button
                            onClick={() => downloadInvoice(booking)}
                            className="w-full px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2 text-xs sm:text-sm"
                          >
                            <Download size={16} />
                            <span>Download Invoice</span>
                          </button> */}
                          
                          {/* {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="w-full px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center space-x-2 text-xs sm:text-sm"
                            >
                              <X size={16} />
                              <span>Cancel Booking</span>
                            </button>
                          )} */}
                        </div>
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


