'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, Users, FileText } from 'lucide-react';
import { useMyBookings } from '@/lib/queries/useBookings';

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

function BookingsContent() {
  const router = useRouter();
  const { data: bookings = [], isLoading } = useMyBookings();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">My Bookings</h3>
        <a
          href="/dashboard/guest/bookings"
          className="text-xs sm:text-sm text-[#59a4b5] hover:text-[#4a8a99] font-medium"
        >
          View All
        </a>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">No bookings yet</p>
          <a
            href="/rooms"
            className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors text-sm sm:text-base"
          >
            Browse Rooms
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {bookings.slice(0, 4).map((booking: Booking, index: number) => (
            <motion.div
              key={booking._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
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

export default function BookingsSlot() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <Suspense fallback={
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      }>
        <BookingsContent />
      </Suspense>
    </div>
  );
}
