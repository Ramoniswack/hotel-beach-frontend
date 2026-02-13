'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { bookingsAPI } from '@/lib/api';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Hotel, 
  Users, 
  DollarSign,
  Download,
  XCircle,
  Clock,
  CreditCard,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import QRCode from 'qrcode';
import Image from 'next/image';

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
  paymentMethod?: string;
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
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export default function GuestBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true);
      const response = await bookingsAPI.getById(bookingId);
      const bookingData = response.data.data;
      setBooking(bookingData);
      
      // Generate QR Code
      const qrData = `Booking ID: ${bookingData._id}\nGuest: ${bookingData.guestInfo.name}\nRoom: ${bookingData.roomTitle}\nCheck-in: ${format(new Date(bookingData.checkInDate), 'MMM dd, yyyy')}\nTotal: ${bookingData.totalPrice}`;
      const qrUrl = await QRCode.toDataURL(qrData, { width: 200, margin: 2 });
      setQrCodeUrl(qrUrl);
    } catch (err: any) {
      console.error('Error fetching booking:', err);
      setError(err.response?.data?.message || 'Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!booking) return;
    try {
      await generateInvoicePDF(booking);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF');
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await bookingsAPI.cancel(booking._id);
      fetchBookingDetails();
    } catch (err: any) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
      case 'checked-out':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'checked-in':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'refunded':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center py-8 sm:py-10 md:py-12">
          <XCircle className="mx-auto text-red-500 mb-3 sm:mb-4" size={40} />
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{error || 'Booking not found'}</p>
          <button
            onClick={() => router.push('/dashboard/guest')}
            className="px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] text-sm sm:text-base"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const numberOfNights = Math.ceil(
    (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.push('/dashboard/guest')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Your Booking</h2>
            <p className="text-gray-600 mt-0.5 sm:mt-1 text-xs sm:text-sm">
              Invoice #{booking.invoiceNumber || booking._id.slice(-8)}
            </p>
          </div>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <Download size={18} className="sm:w-5 sm:h-5" />
          <span>Download Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Room Image & Info */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="relative h-48 sm:h-56 md:h-64">
              <Image
                src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200"
                alt={booking.roomTitle}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 left-4 sm:left-5 md:left-6 right-4 sm:right-5 md:right-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{booking.roomTitle}</h3>
                <div className="flex items-center gap-1.5 sm:gap-2 text-white/90 text-sm sm:text-base">
                  <MapPin size={14} className="sm:w-4 sm:h-4" />
                  <span>Santorini, Greece</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-[#59a4b5] sm:w-6 sm:h-6" />
              <span>Stay Details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Check-in</p>
                <p className="font-bold text-gray-900 text-sm sm:text-base">
                  {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">After 3:00 PM</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Check-out</p>
                <p className="font-bold text-gray-900 text-sm sm:text-base">
                  {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Before 11:00 AM</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 sm:col-span-2 md:col-span-1">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Duration</p>
                <p className="font-bold text-gray-900 text-sm sm:text-base">
                  {numberOfNights} Night{numberOfNights > 1 ? 's' : ''}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Total stay</p>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={18} className="text-gray-400 sm:w-5 sm:h-5" />
                  <p className="text-xs sm:text-sm text-gray-500">Guests</p>
                </div>
                <p className="font-bold text-gray-900 text-sm sm:text-base">
                  {booking.adults} Adult{booking.adults > 1 ? 's' : ''}
                  {booking.children > 0 && `, ${booking.children} Child${booking.children !== 1 ? 'ren' : ''}`}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Hotel size={18} className="text-gray-400 sm:w-5 sm:h-5" />
                  <p className="text-xs sm:text-sm text-gray-500">Room ID</p>
                </div>
                <p className="font-medium text-gray-900 text-xs sm:text-sm break-all">{booking.roomId}</p>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Special Requests</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-xs sm:text-sm">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Guest Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <User size={20} className="text-[#59a4b5] sm:w-6 sm:h-6" />
              <span>Guest Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <User size={18} className="text-gray-400 mt-1 shrink-0 sm:w-5 sm:h-5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{booking.guestInfo.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Mail size={18} className="text-gray-400 mt-1 shrink-0 sm:w-5 sm:h-5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{booking.guestInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 sm:col-span-2 md:col-span-1">
                <Phone size={18} className="text-gray-400 mt-1 shrink-0 sm:w-5 sm:h-5" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">{booking.guestInfo.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-[#59a4b5] sm:w-6 sm:h-6" />
              <span>Payment Summary</span>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {booking.additionalServices && booking.additionalServices.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Additional Services</p>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                    {booking.additionalServices.map((service, idx) => (
                      <div key={idx} className="flex justify-between items-center gap-2">
                        <span className="text-gray-900 text-xs sm:text-sm">
                          {service.name}
                          {service.quantity && service.quantity > 1 && (
                            <span className="text-gray-500 text-xs"> (x{service.quantity})</span>
                          )}
                        </span>
                        <span className="font-medium text-gray-900 text-xs sm:text-sm shrink-0">
                          ${service.price * (service.quantity || 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 sm:pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#59a4b5]">${booking.totalPrice}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <CreditCard size={14} className="text-gray-400 shrink-0 sm:w-4 sm:h-4" />
                  <span className="flex flex-wrap items-center gap-2">
                    Payment Status: 
                    <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getPaymentStatusColor(booking.paymentStatus || 'pending')}`}>
                      {(booking.paymentStatus || 'pending').toUpperCase()}
                    </span>
                  </span>
                </div>
                {booking.paymentMethod && (
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                    <CreditCard size={14} className="text-gray-400 shrink-0 sm:w-4 sm:h-4" />
                    <span className="flex flex-wrap items-center gap-2">
                      Payment Method: 
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-[10px] sm:text-xs font-medium">
                        {booking.paymentMethod.toUpperCase()}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Booking Status</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Current Status</p>
                <span className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border inline-block ${getStatusColor(booking.status)}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>

              {booking.status !== 'cancelled' && booking.status !== 'checked-out' && (
                <button
                  onClick={handleCancelBooking}
                  className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  <XCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Cancel Booking</span>
                </button>
              )}
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Booking QR Code</h3>
            <div className="flex flex-col items-center">
              {qrCodeUrl && (
                <img 
                  src={qrCodeUrl} 
                  alt="Booking QR Code" 
                  className="w-40 h-40 sm:w-48 sm:h-48 border-2 border-gray-200 rounded-lg"
                />
              )}
              <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-2 sm:mt-3">
                Show this QR code at check-in
              </p>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 sm:p-5 md:p-6">
            <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-2 sm:mb-3">Important Information</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <Clock size={14} className="mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <span>Check-in: 3:00 PM - 11:00 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={14} className="mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <span>Check-out: Before 11:00 AM</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                <span>Contact: +30 22860 12345</span>
              </li>
            </ul>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 md:p-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-[#59a4b5] rounded-full mt-2"></div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Booking Created</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {format(new Date(booking.updatedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
