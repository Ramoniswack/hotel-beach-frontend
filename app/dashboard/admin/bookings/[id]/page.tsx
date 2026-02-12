'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
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
  CheckCircle,
  XCircle,
  Clock,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import QRCode from 'qrcode';

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

export default function BookingDetailsPage() {
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
      const qrData = `Booking ID: ${bookingData._id}\nGuest: ${bookingData.guestInfo.name}\nRoom: ${bookingData.roomTitle}\nCheck-in: ${format(new Date(bookingData.checkInDate), 'MMM dd, yyyy')}\nTotal: $${bookingData.totalPrice}`;
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

  const handleStatusUpdate = async (newStatus: string) => {
    if (!booking) return;
    
    // Prevent checkout if payment is pending
    if (newStatus === 'checked-out' && booking.paymentStatus === 'pending') {
      alert('Cannot check out: Payment is still pending. Please ensure payment is completed before checking out the guest.');
      return;
    }
    
    try {
      await bookingsAPI.updateStatus(booking._id, newStatus);
      fetchBookingDetails();
    } catch (err: any) {
      alert('Failed to update status: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus: string, paymentMethod?: string) => {
    if (!booking) return;
    
    const confirmMessage = newPaymentStatus === 'paid' 
      ? `Confirm that ${paymentMethod === 'cash' ? 'cash' : 'card'} payment has been received?`
      : 'Confirm that refund has been processed?';
    
    if (!confirm(confirmMessage)) return;
    
    try {
      await bookingsAPI.updatePaymentStatus(booking._id, newPaymentStatus, paymentMethod);
      fetchBookingDetails();
    } catch (err: any) {
      alert('Failed to update payment status: ' + (err.response?.data?.message || 'Unknown error'));
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
      <RouteGuard allowedRoles={['admin', 'staff']}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading booking details...</p>
            </div>
          </div>
        </DashboardLayout>
      </RouteGuard>
    );
  }

  if (error || !booking) {
    return (
      <RouteGuard allowedRoles={['admin', 'staff']}>
        <DashboardLayout>
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <XCircle className="mx-auto text-red-500 mb-4" size={48} />
              <p className="text-gray-600 mb-4">{error || 'Booking not found'}</p>
              <button
                onClick={() => router.push('/dashboard/admin/bookings')}
                className="px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99]"
              >
                Back to Bookings
              </button>
            </div>
          </div>
        </DashboardLayout>
      </RouteGuard>
    );
  }

  const numberOfNights = Math.ceil(
    (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <RouteGuard allowedRoles={['admin', 'staff']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/admin/bookings')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Booking Details</h2>
                <p className="text-gray-600 mt-1">
                  Invoice #{booking.invoiceNumber || booking._id.slice(-8)}
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={24} className="text-[#59a4b5]" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User size={20} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">{booking.guestInfo.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-900">{booking.guestInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{booking.guestInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users size={20} className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Number of Guests</p>
                      <p className="font-medium text-gray-900">
                        {booking.adults} Adult{booking.adults > 1 ? 's' : ''}, {booking.children} Child{booking.children !== 1 ? 'ren' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Hotel size={24} className="text-[#59a4b5]" />
                  Booking Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Room Type</p>
                      <p className="font-medium text-gray-900">{booking.roomTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Room ID</p>
                      <p className="font-medium text-gray-900 text-sm">{booking.roomId}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p className="font-medium text-gray-900">
                          {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar size={20} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p className="font-medium text-gray-900">
                          {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={20} className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium text-gray-900">
                          {numberOfNights} Night{numberOfNights > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{booking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment & Billing */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={24} className="text-[#59a4b5]" />
                  Payment & Billing
                </h3>
                <div className="space-y-4">
                  {booking.additionalServices && booking.additionalServices.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Additional Services</p>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        {booking.additionalServices.map((service, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-gray-900">
                              {service.name}
                              {service.quantity && service.quantity > 1 && (
                                <span className="text-gray-500 text-sm"> (x{service.quantity})</span>
                              )}
                            </span>
                            <span className="font-medium text-gray-900">
                              ${service.price * (service.quantity || 1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-[#59a4b5]">${booking.totalPrice}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CreditCard size={16} className="text-gray-400" />
                      <span>
                        Payment Status: 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(booking.paymentStatus || 'pending')}`}>
                          {(booking.paymentStatus || 'pending').toUpperCase()}
                        </span>
                      </span>
                    </div>
                    {booking.paymentMethod && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <CreditCard size={16} className="text-gray-400" />
                        <span>
                          Payment Method: 
                          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
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
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Status</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Status</p>
                    <span className={`px-3 py-2 rounded-lg text-sm font-medium border inline-block ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Update Status</p>
                    <div className="space-y-2">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate('confirmed')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle size={18} />
                          Confirm Booking
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate('checked-in')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <CheckCircle size={18} />
                          Check In
                        </button>
                      )}
                      {booking.status === 'checked-in' && (
                        <>
                          {booking.paymentStatus === 'pending' ? (
                            <div className="w-full px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-yellow-800 font-medium mb-1">Payment Required</p>
                              <p className="text-xs text-yellow-700">
                                Cannot check out until payment is completed
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStatusUpdate('checked-out')}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <CheckCircle size={18} />
                              Check Out
                            </button>
                          )}
                        </>
                      )}
                      {booking.status !== 'cancelled' && booking.status !== 'checked-out' && (
                        <button
                          onClick={() => handleStatusUpdate('cancelled')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle size={18} />
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Status Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Status</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Payment Status</p>
                    <span className={`px-3 py-2 rounded-lg text-sm font-medium border inline-block ${getPaymentStatusColor(booking.paymentStatus || 'pending')}`}>
                      {(booking.paymentStatus || 'pending').toUpperCase()}
                    </span>
                  </div>

                  {booking.paymentStatus === 'pending' && booking.status !== 'cancelled' && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Mark as Paid</p>
                      <div className="space-y-2">
                        <button
                          onClick={() => handlePaymentStatusUpdate('paid', 'cash')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CreditCard size={18} />
                          Mark as Paid (Cash)
                        </button>
                        <button
                          onClick={() => handlePaymentStatusUpdate('paid', 'card')}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <CreditCard size={18} />
                          Mark as Paid (Card)
                        </button>
                      </div>
                    </div>
                  )}

                  {booking.paymentStatus === 'paid' && booking.status === 'cancelled' && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Process Refund</p>
                      <button
                        onClick={() => handlePaymentStatusUpdate('refunded')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <CreditCard size={18} />
                        Mark as Refunded
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Booking QR Code</h3>
                <div className="flex flex-col items-center">
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt="Booking QR Code" 
                      className="w-48 h-48 border-2 border-gray-200 rounded-lg"
                    />
                  )}
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Scan to view booking details
                  </p>
                </div>
              </div>

              {/* Booking Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#59a4b5] rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Booking Created</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(booking.updatedAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
