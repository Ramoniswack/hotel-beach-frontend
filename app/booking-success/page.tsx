'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import Header from '@/components/Header';
import MainContentWrapper from '@/components/MainContentWrapper';
import Footer from '@/components/Footer';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="relative bg-white">
      <Header isScrolled={true} onMenuToggle={() => {}} />
      <MainContentWrapper isMenuOpen={false} onOverlayClick={() => {}}>
        <div className="min-h-screen bg-white pt-32 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-green-600" size={40} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-2">
                Thank you for your reservation. Your booking has been successfully confirmed.
              </p>
              {bookingId && (
                <p className="text-sm text-gray-500">
                  Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-bold text-gray-900 mb-3">What's Next?</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>You will receive a confirmation email shortly with your booking details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Please check your email for payment instructions if applicable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>You can view and manage your booking from your dashboard</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/dashboard/guest')}
                className="px-8 py-3 bg-[#59a4b5] text-white rounded-full hover:bg-[#4a8a99] transition-colors font-semibold"
              >
                View My Bookings
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors font-semibold"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </MainContentWrapper>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5]"></div>
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
