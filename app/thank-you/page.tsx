'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import MainContentWrapper from '@/components/MainContentWrapper';
import Footer from '@/components/Footer';
import { bookingsAPI } from '@/lib/api';

interface Booking {
  _id: string;
  invoiceNumber: string;
  roomId: string;
  roomTitle: string; // Changed from room.title to roomTitle
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Currency state
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  // Exchange rates (base: USD)
  const exchangeRates: { [key: string]: { rate: number; symbol: string } } = {
    USD: { rate: 1, symbol: '$' },
    EUR: { rate: 0.92, symbol: '€' },
    GBP: { rate: 0.79, symbol: '£' },
    JPY: { rate: 149.50, symbol: '¥' },
    CHF: { rate: 0.88, symbol: 'CHF' },
    CAD: { rate: 1.36, symbol: 'C$' },
    AUD: { rate: 1.53, symbol: 'A$' },
  };
  
  // Function to convert price
  const convertPrice = (priceUSD: number) => {
    const converted = priceUSD * exchangeRates[selectedCurrency].rate;
    return converted.toFixed(2);
  };
  
  const getCurrencySymbol = () => exchangeRates[selectedCurrency].symbol;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError('Booking ID is required');
        setIsLoading(false);
        return;
      }

      try {
        const response = await bookingsAPI.getById(bookingId);
        setBooking(response.data.data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5]"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
          <button
            onClick={() => router.push('/dashboard/guest')}
            className="px-6 py-3 bg-[#59a4b5] text-white rounded-full hover:bg-[#4a8a99]"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white">
      <Header isScrolled={isScrolled} onMenuToggle={setIsMenuOpen} />
      <MainContentWrapper isMenuOpen={isMenuOpen} onOverlayClick={() => setIsMenuOpen(false)}>
        <div className="min-h-screen bg-white pt-32 pb-16">
          <div className="max-w-[1140px] mx-auto px-4 flex flex-col lg:flex-row gap-16">
            {/* LEFT COLUMN: MAIN CONTENT */}
            <div className="flex-1 pt-4">
              <p className="text-sm text-gray-600 mb-16 font-light">
                Thank you for your payment. Your transaction has been completed.
              </p>

              {/* Booking Details Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Booking Details</h2>
                
                <div className="flex flex-wrap gap-y-6 mb-8">
                  <DetailItem 
                    label="Booking:" 
                    value={booking.invoiceNumber || booking._id.slice(-4)} 
                    isBold 
                  />
                  <DetailItem 
                    label="Check-in:" 
                    value={format(new Date(booking.checkInDate), 'MMMM dd, yyyy')} 
                    isBold 
                  />
                  <DetailItem 
                    label="Check-out:" 
                    value={format(new Date(booking.checkOutDate), 'MMMM dd, yyyy')} 
                    isBold 
                  />
                  <DetailItem 
                    label="Total:" 
                    value={`${getCurrencySymbol()}${convertPrice(booking.totalPrice)}`} 
                    isBold 
                  />
                  <DetailItem 
                    label="Status:" 
                    value={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} 
                    isBold 
                    isLast 
                  />
                </div>

                <p className="text-sm text-gray-600 font-light">
                  Details: {booking.roomTitle}
                </p>
              </div>

              {/* Payment Details Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Details</h2>
                
                <div className="flex flex-wrap gap-y-6">
                  <DetailItem 
                    label="Payment:" 
                    value={booking.invoiceNumber || booking._id.slice(-4)} 
                    isBold 
                  />
                  <DetailItem 
                    label="Date:" 
                    value={format(new Date(booking.createdAt), 'MMMM dd, yyyy')} 
                    isBold 
                  />
                  <DetailItem 
                    label="Payment Method:" 
                    value="Test Payment" 
                    isBold 
                  />
                  <DetailItem 
                    label="Total:" 
                    value={`${getCurrencySymbol()}${convertPrice(booking.totalPrice)}`} 
                    isBold 
                  />
                  <DetailItem 
                    label="Status:" 
                    value={booking.paymentStatus ? booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) : 'Completed'} 
                    isBold 
                    isLast 
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/dashboard/guest')}
                  className="px-8 py-3 bg-[#59a4b5] text-white rounded-full hover:bg-[#4a8a99] transition-colors font-semibold text-sm"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors font-semibold text-sm"
                >
                  Back to Home
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <div className="w-full lg:w-[300px] shrink-0">
              <Sidebar 
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                exchangeRates={exchangeRates}
              />
            </div>
          </div>
        </div>
        <Footer />
      </MainContentWrapper>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  isBold?: boolean;
  isLast?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, isBold = false, isLast = false }) => (
  <div className={`flex-1 min-w-[120px] px-4 first:pl-0 ${!isLast ? 'border-r border-dotted border-gray-300' : ''}`}>
    <div className="text-xs text-gray-500 mb-2 font-light">{label}</div>
    <div className={`text-sm text-gray-800 ${isBold ? 'font-bold' : 'font-medium'}`}>{value}</div>
  </div>
);

const Sidebar: React.FC<{
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  exchangeRates: { [key: string]: { rate: number; symbol: string } };
}> = ({ selectedCurrency, setSelectedCurrency, exchangeRates }) => (
  <div className="space-y-12">
    {/* Currency Selector */}
    <div>
      <h3 className="text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-3">
        Currency
      </h3>
      <div className="relative">
        <select 
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="w-full appearance-none border border-gray-300 rounded-sm px-4 py-3 text-xs text-gray-600 bg-white focus:outline-none hover:border-gray-400 focus:border-[#59a4b5]"
        >
          {Object.entries(exchangeRates).map(([code, { symbol }]) => (
            <option key={code} value={code}>
              {code} ({symbol})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
      </div>
      <p className="text-[10px] text-gray-400 mt-2 italic">
        All prices will update automatically
      </p>
    </div>

    {/* Questions */}
    <div>
      <h3 className="text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-6">
        Questions About Booking?
      </h3>
      <div className="text-sm text-gray-600 space-y-2 font-light leading-relaxed">
        <p>Tel.: +41 (0)54 2344 00</p>
        <p>Fax: +41 (0)542344 99</p>
        <p className="text-gray-500 hover:text-[#59a4b5] cursor-pointer">
          reservations@hotelbeach.com
        </p>
      </div>
    </div>

    {/* Address */}
    <div>
      <h3 className="text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-6">
        Our Address
      </h3>
      <div className="text-sm text-gray-600 space-y-2 font-light leading-relaxed">
        <p className="font-semibold text-gray-800">Hotel Beach</p>
        <p>45 Santorini Beach</p>
        <p>Santorini 847 00</p>
        <br />
        <p>Tel.: +41 (0)54 2344 00</p>
        <p>Fax: +41 (0)542344 99</p>
        <p className="text-gray-500 hover:text-[#59a4b5] cursor-pointer">
          reservations@hotelbeach.com
        </p>
      </div>
    </div>
  </div>
);

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5]"></div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
