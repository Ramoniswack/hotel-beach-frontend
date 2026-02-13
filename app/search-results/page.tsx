'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, Calendar, Users } from 'lucide-react';
import Header from '@/components/Header';
import MainContentWrapper from '@/components/MainContentWrapper';
import Footer from '@/components/Footer';
import { roomsAPI } from '@/lib/api';

interface Room {
  _id: string;
  id: string; // slug like "deluxe-room"
  title: string;
  subtitle: string;
  heroImage: string;
  price: number; // Backend uses 'price', not 'pricePerNight'
  description: string[];
  specs: {
    bed: string;
    capacity: string;
    size: string;
    view: string;
  };
  amenities?: string[];
  categories?: string;
  isAvailable: boolean;
}

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Currency state
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: { rate: number; symbol: string } }>({
    USD: { rate: 1, symbol: '$' },
    EUR: { rate: 0.92, symbol: '€' },
    GBP: { rate: 0.79, symbol: '£' },
    JPY: { rate: 149.50, symbol: '¥' },
    CHF: { rate: 0.88, symbol: 'CHF' },
    CAD: { rate: 1.36, symbol: 'C$' },
    AUD: { rate: 1.53, symbol: 'A$' },
    INR: { rate: 83.12, symbol: '₹' },
    CNY: { rate: 7.24, symbol: '¥' },
    NZD: { rate: 1.67, symbol: 'NZ$' },
    SGD: { rate: 1.35, symbol: 'S$' },
    HKD: { rate: 7.83, symbol: 'HK$' },
    SEK: { rate: 10.87, symbol: 'kr' },
    NOK: { rate: 11.02, symbol: 'kr' },
    DKK: { rate: 6.86, symbol: 'kr' },
    MXN: { rate: 17.08, symbol: '$' },
    BRL: { rate: 4.97, symbol: 'R$' },
    ZAR: { rate: 18.65, symbol: 'R' },
    KRW: { rate: 1342.50, symbol: '₩' },
    THB: { rate: 34.85, symbol: '฿' },
    MYR: { rate: 4.47, symbol: 'RM' },
    PHP: { rate: 56.45, symbol: '₱' },
    IDR: { rate: 15789.50, symbol: 'Rp' },
    AED: { rate: 3.67, symbol: 'د.إ' },
    SAR: { rate: 3.75, symbol: '﷼' },
    TRY: { rate: 32.15, symbol: '₺' },
    RUB: { rate: 92.50, symbol: '₽' },
    PLN: { rate: 4.02, symbol: 'zł' },
    CZK: { rate: 23.15, symbol: 'Kč' },
    HUF: { rate: 360.25, symbol: 'Ft' },
    ILS: { rate: 3.65, symbol: '₪' },
  });
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  
  // Get search params
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';

  // Function to convert price
  const convertPrice = (priceUSD: number) => {
    const converted = priceUSD * exchangeRates[selectedCurrency].rate;
    return converted.toFixed(2);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch live exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoadingRates(true);
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (response.ok) {
          const data = await response.json();
          
          const currencySymbols: { [key: string]: string } = {
            USD: '$', EUR: '€', GBP: '£', JPY: '¥', CHF: 'CHF', CAD: 'C$', AUD: 'A$',
            INR: '₹', CNY: '¥', NZD: 'NZ$', SGD: 'S$', HKD: 'HK$', SEK: 'kr', NOK: 'kr',
            DKK: 'kr', MXN: '$', BRL: 'R$', ZAR: 'R', KRW: '₩', THB: '฿', MYR: 'RM',
            PHP: '₱', IDR: 'Rp', AED: 'د.إ', SAR: '﷼', TRY: '₺', RUB: '₽', PLN: 'zł',
            CZK: 'Kč', HUF: 'Ft', ILS: '₪',
          };
          
          const updatedRates: { [key: string]: { rate: number; symbol: string } } = {};
          
          Object.keys(currencySymbols).forEach(currency => {
            if (data.rates[currency]) {
              updatedRates[currency] = {
                rate: data.rates[currency],
                symbol: currencySymbols[currency]
              };
            }
          });
          
          setExchangeRates(updatedRates);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!checkIn || !checkOut) {
        setError('Please provide check-in and check-out dates');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await roomsAPI.getAvailable(checkIn, checkOut);
        setRooms(response.data.data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching available rooms:', err);
        setError(err.response?.data?.message || 'Failed to load available rooms');
        setRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableRooms();
  }, [checkIn, checkOut]);

  const handleBookRoom = (roomId: string) => {
    // Navigate to booking confirmation with params (use room.id slug, not _id)
    router.push(`/booking-confirmation?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}&currency=${selectedCurrency}`);
  };

  return (
    <div className="relative bg-white">
      <Header isScrolled={isScrolled} onMenuToggle={setIsMenuOpen} />
      <MainContentWrapper isMenuOpen={isMenuOpen} onOverlayClick={() => setIsMenuOpen(false)}>
        <div className="min-h-screen bg-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-12">
              {/* Main Content Area - Room List */}
              <div className="flex-1">
                {/* Search Summary */}
                <div className="mb-6 sm:mb-7 md:mb-8">
                  {checkIn && checkOut && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">
                          {format(new Date(checkIn), 'MMM dd, yyyy')} - {format(new Date(checkOut), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{adults} Adult(s), {children} Child(ren)</span>
                      </div>
                    </div>
                  )}
                  <h1 className="text-xs sm:text-sm font-semibold text-gray-800">
                    {isLoading ? 'Searching...' : `${rooms.length} accommodation${rooms.length !== 1 ? 's' : ''} found`}
                  </h1>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-8 sm:py-10 md:py-12">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#59a4b5] mx-auto mb-3 sm:mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600">Finding available rooms...</p>
                  </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                  <div className="text-center py-8 sm:py-10 md:py-12">
                    <p className="text-sm sm:text-base text-red-600 mb-3 sm:mb-4 px-4">{error}</p>
                    <button
                      onClick={() => router.push('/rooms')}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#59a4b5] text-white text-xs sm:text-sm rounded-full hover:bg-[#4a8a99] transition-colors"
                    >
                      Browse All Rooms
                    </button>
                  </div>
                )}

                {/* No Results */}
                {!isLoading && !error && rooms.length === 0 && (
                  <div className="text-center py-8 sm:py-10 md:py-12">
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4">No rooms available for the selected dates</p>
                    <button
                      onClick={() => router.push('/rooms')}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#59a4b5] text-white text-xs sm:text-sm rounded-full hover:bg-[#4a8a99] transition-colors"
                    >
                      View All Rooms
                    </button>
                  </div>
                )}

                {/* Room Cards */}
                {!isLoading && !error && rooms.length > 0 && (
                  <div className="space-y-8 sm:space-y-10 md:space-y-12">
                    {rooms.map((room, index) => (
                      <RoomCard
                        key={room._id}
                        room={room}
                        onBook={() => handleBookRoom(room.id)}
                        convertPrice={convertPrice}
                        currencySymbol={exchangeRates[selectedCurrency].symbol}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 order-first lg:order-last">
                <Sidebar
                  checkIn={checkIn}
                  checkOut={checkOut}
                  adults={adults}
                  children={children}
                  selectedCurrency={selectedCurrency}
                  setSelectedCurrency={setSelectedCurrency}
                  exchangeRates={exchangeRates}
                  isLoadingRates={isLoadingRates}
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </MainContentWrapper>
    </div>
  );
}

const RoomCard: React.FC<{ 
  room: Room; 
  onBook: () => void;
  convertPrice: (price: number) => string;
  currencySymbol: string;
  index: number;
}> = ({ room, onBook, convertPrice, currencySymbol, index }) => {
  const images = [room.heroImage];

  return (
    <motion.div 
      className="mb-8 sm:mb-12 md:mb-16"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {/* Image */}
      <div className="relative w-full mb-4 sm:mb-5 md:mb-6 bg-gray-100 overflow-hidden group rounded-sm">
        <div className="relative aspect-[16/10] sm:aspect-[16/9]">
          <Image
            src={images[0]}
            alt={room.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Title & Tagline */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{room.title}</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5 md:mb-6">{room.subtitle}</p>

      {/* Details List */}
      <div className="space-y-1.5 sm:space-y-2 mb-6 sm:mb-7 md:mb-8 text-xs sm:text-sm text-gray-600 font-light">
        <DetailItem label="Bed Type" value={room.specs.bed} />
        <DetailItem label="Capacity" value={room.specs.capacity} />
        <DetailItem label="View" value={room.specs.view} />
        <DetailItem label="Size" value={room.specs.size} />
        {room.amenities && room.amenities.length > 0 && (
          <DetailItem label="Amenities" value={room.amenities.slice(0, 3).join(', ')} />
        )}
        {room.categories && <DetailItem label="Categories" value={room.categories} />}
      </div>

      {/* Price */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <span className="font-bold text-gray-900 text-xs sm:text-sm">Prices start at:</span>{' '}
        <span className="text-gray-600 text-xs sm:text-sm">{currencySymbol}{convertPrice(room.price)} per night</span>
      </div>

      {/* Book Button */}
      <button
        onClick={onBook}
        className="bg-[#59a4b5] hover:bg-[#4a8a99] text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-colors shadow-sm w-full sm:w-auto"
      >
        Book Now
      </button>
    </motion.div>
  );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-start gap-1.5 sm:gap-2">
    <ChevronRight size={12} className="mt-0.5 sm:mt-1 text-gray-400 shrink-0" />
    <span className="leading-relaxed text-xs sm:text-sm">
      <span className="text-gray-700">{label}:</span> {value}
    </span>
  </div>
);

const Sidebar: React.FC<{
  checkIn: string | null;
  checkOut: string | null;
  adults: string;
  children: string;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  exchangeRates: { [key: string]: { rate: number; symbol: string } };
  isLoadingRates?: boolean;
}> = ({ checkIn, checkOut, adults, children, selectedCurrency, setSelectedCurrency, exchangeRates, isLoadingRates }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    checkIn: checkIn || '',
    checkOut: checkOut || '',
    adults: adults || '1',
    children: children || '0',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.checkIn && formData.checkOut) {
      router.push(
        `/search-results?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&adults=${formData.adults}&children=${formData.children}`
      );
    }
  };

  return (
    <div className="lg:sticky lg:top-8 space-y-4 sm:space-y-5 md:space-y-6">
      {/* Currency Selector */}
      <div className="bg-white border border-gray-200 p-4 sm:p-5 md:p-6 shadow-sm rounded-sm">
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
          Currency Converter {isLoadingRates && <span className="text-gray-400 font-normal text-[9px]">(updating...)</span>}
        </h3>
        
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            Display prices in
          </label>
          <div className="relative">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full appearance-none border border-gray-300 bg-white px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 rounded-sm focus:outline-none focus:border-[#59a4b5] focus:ring-1 focus:ring-[#59a4b5]"
            >
              {Object.entries(exchangeRates).map(([code, { symbol }]) => (
                <option key={code} value={code}>
                  {code} ({symbol})
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={14}
            />
          </div>
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 italic">
            Live exchange rates • Updates hourly
          </p>
        </div>
      </div>

      {/* Booking Form Card */}
      <div className="bg-[#f9f9f9] p-4 sm:p-5 md:p-6 shadow-sm rounded-sm">
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
          Modify Your Search
        </h3>
        <p className="text-[9px] sm:text-[10px] text-gray-400 mb-4 sm:mb-5 md:mb-6 italic">
          Required fields are followed by *
        </p>

        <form className="space-y-3 sm:space-y-4" onSubmit={handleSearch}>
          {/* Check-in */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Check-in: <span className="text-[#59a4b5]">*</span>
            </label>
            <input
              type="date"
              value={formData.checkIn}
              onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
              className="w-full bg-transparent border-b border-gray-300 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-600 focus:outline-none focus:border-[#59a4b5]"
              required
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Check-out: <span className="text-[#59a4b5]">*</span>
            </label>
            <input
              type="date"
              value={formData.checkOut}
              onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
              className="w-full bg-transparent border-b border-gray-300 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-600 focus:outline-none focus:border-[#59a4b5]"
              required
            />
          </div>

          {/* Adults & Children */}
          <div className="flex gap-3 sm:gap-4 pt-2">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Adults:</label>
              <div className="relative">
                <select
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                  className="w-full appearance-none border border-gray-300 bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 rounded-sm focus:outline-none"
                >
                  {[1, 2, 3, 4].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={12}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Children:</label>
              <div className="relative">
                <select
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                  className="w-full appearance-none border border-gray-300 bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 rounded-sm focus:outline-none"
                >
                  {[0, 1, 2, 3].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={12}
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="pt-4 sm:pt-5 md:pt-6">
            <button
              type="submit"
              className="w-full bg-[#59a4b5] hover:bg-[#4a8a99] text-white text-xs sm:text-sm font-bold py-2.5 sm:py-3 px-4 rounded-full transition-colors shadow-sm uppercase tracking-wide"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-blue-800">
          <strong>Tip:</strong> Modify your dates or guest count above to see different availability.
        </p>
      </div>
    </div>
  );
};

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5]"></div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
