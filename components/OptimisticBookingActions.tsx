'use client';

import React, { useState } from 'react';
import { Check, X, Clock, Loader2 } from 'lucide-react';
import { bookingsAPI } from '@/lib/api';
import { withOptimisticUpdate, createArrayOptimisticUpdate } from '@/lib/optimisticUpdates';

interface Booking {
  _id: string;
  status: string;
  [key: string]: any;
}

interface OptimisticBookingActionsProps {
  booking: Booking;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  onSuccess?: () => void;
}

export default function OptimisticBookingActions({
  booking,
  bookings,
  setBookings,
  onSuccess,
}: OptimisticBookingActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const arrayHelper = createArrayOptimisticUpdate(bookings, setBookings);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);

    const success = await withOptimisticUpdate(
      // Optimistic update - happens immediately
      () => arrayHelper.update(
        (b) => b._id === booking._id,
        { status: newStatus }
      ),
      // Server update - happens in background
      () => bookingsAPI.updateStatus(booking._id, newStatus),
      // On success
      () => {
        showNotification(`Booking ${newStatus} successfully!`, 'success');
        if (onSuccess) onSuccess();
      },
      // On error - rollback already happened
      (error) => {
        showNotification(
          `Failed to update booking: ${error.response?.data?.message || 'Unknown error'}`,
          'error'
        );
      }
    );

    setIsUpdating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'checked-in':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked-out':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toastType === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {toastType === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            booking.status
          )} transition-all duration-200`}
        >
          {booking.status.toUpperCase()}
        </span>

        {/* Quick Actions */}
        {booking.status !== 'cancelled' && booking.status !== 'checked-out' && (
          <div className="flex items-center gap-1">
            {booking.status === 'pending' && (
              <button
                onClick={() => handleStatusUpdate('confirmed')}
                disabled={isUpdating}
                className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Confirm booking"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </button>
            )}

            {booking.status === 'confirmed' && (
              <button
                onClick={() => handleStatusUpdate('checked-in')}
                disabled={isUpdating}
                className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Check in"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </button>
            )}

            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={isUpdating}
                className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cancel booking"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
