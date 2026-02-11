'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, differenceInDays } from 'date-fns';
import { ChevronDown, Minus } from 'lucide-react';
import Header from '@/components/Header';
import MainContentWrapper from '@/components/MainContentWrapper';
import Footer from '@/components/Footer';
import { roomsAPI, bookingsAPI, contentAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Room {
  _id: string;
  title: string;
  price: number;
}

interface BookingSettings {
  checkInTime?: string;
  checkOutTime?: string;
  additionalServices?: {
    title: string;
    items: Array<{ name: string; price: number; priceLabel: string; type: string; guestsLabel?: string }>;
  };
  policies?: Array<{ title: string; content: string }>;
  sidebarContact?: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
  sidebarAddress?: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
}

function BookingConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuthStore();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({});
  
  // Get search params
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const currencyParam = searchParams.get('currency') || 'USD';
  
  // Currency state
  const [selectedCurrency, setSelectedCurrency] = useState(currencyParam);
  
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
  
  // Form state
  const [adults, setAdults] = useState(searchParams.get('adults') || '1');
  const [children, setChildren] = useState(searchParams.get('children') || '0');
  const [guestName, setGuestName] = useState('');
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('woocommerce');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Additional services
  const [services, setServices] = useState({
    smartphone: false,
    safeBox: false,
    luggage: false,
    childcare: false,
    massage: false,
    massageGuests: 1,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch booking settings
  useEffect(() => {
    const fetchBookingSettings = async () => {
      try {
        const response = await contentAPI.getByPage('booking-settings');
        const sections = response.data.data.sections;
        
        const checkTimes = sections.find((s: any) => s.sectionId === 'check-times');
        const additionalServices = sections.find((s: any) => s.sectionId === 'additional-services');
        const policies = sections.find((s: any) => s.sectionId === 'policies');
        const sidebarContact = sections.find((s: any) => s.sectionId === 'sidebar-contact');
        const sidebarAddress = sections.find((s: any) => s.sectionId === 'sidebar-address');
        
        setBookingSettings({
          checkInTime: checkTimes?.title || 'Check-in: from 11:00 am',
          checkOutTime: checkTimes?.subtitle || 'Check-out: until 10:00 am',
          additionalServices: additionalServices ? {
            title: additionalServices.title,
            items: additionalServices.items
          } : undefined,
          policies: policies?.items || [],
          sidebarContact: sidebarContact ? {
            title: sidebarContact.title,
            items: sidebarContact.items
          } : undefined,
          sidebarAddress: sidebarAddress ? {
            title: sidebarAddress.title,
            items: sidebarAddress.items
          } : undefined
        });
      } catch (err) {
        console.error('Error fetching booking settings:', err);
      }
    };

    fetchBookingSettings();
  }, []);

  // Fetch user profile to pre-fill billing info
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            const profile = data.data;
            
            // Pre-fill name fields
            if (profile.name) {
              const nameParts = profile.name.split(' ');
              setFirstName(nameParts[0] || '');
              setLastName(nameParts.slice(1).join(' ') || '');
            }
            
            // Pre-fill email
            if (profile.email) {
              setEmail(profile.email);
            }
            
            // Pre-fill billing info if available
            if (profile.billingInfo) {
              if (profile.billingInfo.country) setCountry(profile.billingInfo.country);
              if (profile.billingInfo.address) setAddress(profile.billingInfo.address);
              if (profile.billingInfo.city) setCity(profile.billingInfo.city);
              if (profile.billingInfo.state) setState(profile.billingInfo.state);
              if (profile.billingInfo.postcode) setPostcode(profile.billingInfo.postcode);
            }
            
            // Pre-fill phone if available
            if (profile.phone) setPhone(profile.phone);
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }
    };

    fetchUserProfile();
  }, [user, token]);


  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) {
        setError('Room ID is required');
        setIsLoading(false);
        return;
      }

      try {
        const response = await roomsAPI.getById(roomId);
        setRoom(response.data.data);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('Failed to load room details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return differenceInDays(new Date(checkOut), new Date(checkIn));
  };

  const calculateTotal = () => {
    if (!room) return 0;
    const nights = calculateNights();
    let total = room.price * nights;
    
    // Add service costs dynamically
    if (bookingSettings.additionalServices?.items) {
      bookingSettings.additionalServices.items.forEach(service => {
        const serviceKey = service.name.toLowerCase().replace(/[^a-z]/g, '');
        if (services[serviceKey]) {
          if (service.type === 'guests') {
            const guestsKey = `${serviceKey}Guests`;
            const guestCount = services[guestsKey] || 1;
            total += service.price * guestCount;
          } else {
            total += service.price;
          }
        }
      });
    }
    
    return total;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    if (!roomId || !checkIn || !checkOut) {
      setError('Missing booking information');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const bookingData = {
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults: parseInt(adults),
        children: parseInt(children),
        guestInfo: {
          name: `${firstName} ${lastName}`,
          email,
          phone,
        },
      };

      const response = await bookingsAPI.create(bookingData);
      
      // Redirect to thank you page
      router.push(`/thank-you?bookingId=${response.data.data._id}`);
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5]"></div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/rooms')}
            className="px-6 py-3 bg-[#59a4b5] text-white rounded-full"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const total = calculateTotal();


  return (
    <div className="relative bg-white">
      <Header isScrolled={isScrolled} onMenuToggle={setIsMenuOpen} />
      <MainContentWrapper isMenuOpen={isMenuOpen} onOverlayClick={() => setIsMenuOpen(false)}>
        <div className="min-h-screen bg-white pt-32 pb-16">
          <div className="max-w-[1140px] mx-auto px-4 flex flex-col lg:flex-row gap-16">
            {/* LEFT COLUMN: MAIN CONTENT */}
            <div className="flex-1">
              {/* Booking Details Header */}
              <h2 className="text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-6">
                Booking Details
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-8 mb-10 text-xs text-gray-800">
                <div>
                  <span className="text-gray-500">Check-in: </span>
                  <span className="font-semibold">
                    {checkIn ? format(new Date(checkIn), 'MMMM dd, yyyy') : 'N/A'}
                  </span>
                  , {bookingSettings.checkInTime?.replace('Check-in: ', '') || 'from 11:00 am'}
                </div>
                <div>
                  <span className="text-gray-500">Check-out: </span>
                  <span className="font-semibold">
                    {checkOut ? format(new Date(checkOut), 'MMMM dd, yyyy') : 'N/A'}
                  </span>
                  , {bookingSettings.checkOutTime?.replace('Check-out: ', '') || 'until 10:00 am'}
                </div>
              </div>

              {/* Accommodation Box */}
              <div className="bg-[#f9f9f9] p-8 mb-10">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                  Accommodation #1
                </h3>
                <p className="text-xs text-gray-600 mb-6">
                  Accommodation Type: {room?.title}
                </p>

                {/* Selects */}
                <div className="flex gap-4 mb-6">
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-500 mb-1">
                      Adults <span className="text-[#59a4b5]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={adults}
                        onChange={(e) => setAdults(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-3 py-2 text-xs appearance-none rounded-sm focus:outline-none focus:border-[#59a4b5]"
                      >
                        <option value="">-- Select --</option>
                        {[1, 2, 3, 4].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs text-gray-500 mb-1">
                      Children <span className="text-[#59a4b5]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={children}
                        onChange={(e) => setChildren(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-3 py-2 text-xs appearance-none rounded-sm focus:outline-none focus:border-[#59a4b5]"
                      >
                        <option value="">-- Select --</option>
                        {[0, 1, 2, 3].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>
                  </div>
                </div>

                {/* Guest Name */}
                <div className="mb-8">
                  <label className="block text-xs text-gray-500 mb-1">Full Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-300 focus:border-[#59a4b5] focus:outline-none py-1 text-sm"
                  />
                </div>

                {/* Additional Services */}
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {bookingSettings.additionalServices?.title || 'Choose Additional Services'}
                </h4>
                <div className="space-y-3">
                  {bookingSettings.additionalServices?.items.map((service, idx) => (
                    service.type === 'guests' ? (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={services[service.name.toLowerCase().replace(/[^a-z]/g, '')] || false}
                          onChange={(e) => setServices({ ...services, [service.name.toLowerCase().replace(/[^a-z]/g, '')]: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>{service.name} <span className="italic text-gray-500">({service.priceLabel})</span> {service.guestsLabel || 'for'}</span>
                        <input
                          type="number"
                          value={services[`${service.name.toLowerCase().replace(/[^a-z]/g, '')}Guests`] || 1}
                          onChange={(e) => setServices({ ...services, [`${service.name.toLowerCase().replace(/[^a-z]/g, '')}Guests`]: parseInt(e.target.value) || 1 })}
                          className="w-10 border border-gray-300 px-1 py-0.5 text-center text-xs"
                          min="1"
                        />
                        <span>guest(s)</span>
                      </div>
                    ) : (
                      <label key={idx} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services[service.name.toLowerCase().replace(/[^a-z]/g, '')] || false}
                          onChange={(e) => setServices({ ...services, [service.name.toLowerCase().replace(/[^a-z]/g, '')]: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>{service.name} <span className="italic text-gray-500">({service.priceLabel})</span></span>
                      </label>
                    )
                  )) || (
                    // Fallback to default services if not loaded
                    <>
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.smartphone}
                          onChange={(e) => setServices({ ...services, smartphone: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>Free-to-use smartphone <span className="italic text-gray-500">(Free)</span></span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.safeBox}
                          onChange={(e) => setServices({ ...services, safeBox: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>Safe-deposit box <span className="italic text-gray-500">(Free)</span></span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.luggage}
                          onChange={(e) => setServices({ ...services, luggage: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>Luggage storage <span className="italic text-gray-500">(Free)</span></span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.childcare}
                          onChange={(e) => setServices({ ...services, childcare: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>Childcare <span className="italic text-gray-500">($60 / Once)</span></span>
                      </label>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={services.massage}
                          onChange={(e) => setServices({ ...services, massage: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>Massage <span className="italic text-gray-500">($15 / Once)</span> for</span>
                        <input
                          type="number"
                          value={services.massageGuests}
                          onChange={(e) => setServices({ ...services, massageGuests: parseInt(e.target.value) || 1 })}
                          className="w-10 border border-gray-300 px-1 py-0.5 text-center text-xs"
                          min="1"
                        />
                        <span>guest(s)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>


              {/* Price Breakdown */}
              <h2 className="text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-6">
                Price Breakdown
              </h2>
              <div className="border border-gray-200 rounded-sm mb-12">
                <div className="grid grid-cols-2 text-xs border-b border-gray-100 p-4">
                  <div className="text-gray-600 flex items-center gap-2">
                    <Minus size={12} className="text-gray-400" />
                    #{1} {room?.title}
                  </div>
                  <div className="text-right text-gray-800">{getCurrencySymbol()}{room ? convertPrice(room.price) : 0}</div>
                </div>
                <div className="grid grid-cols-2 text-xs border-b border-gray-100 p-4 bg-gray-50/50">
                  <div className="text-gray-600">Adults</div>
                  <div className="text-right text-gray-800">{adults}</div>
                </div>
                <div className="grid grid-cols-2 text-xs border-b border-gray-100 p-4 bg-gray-50/50">
                  <div className="text-gray-600">Children</div>
                  <div className="text-right text-gray-800">{children}</div>
                </div>
                <div className="grid grid-cols-2 text-xs border-b border-gray-100 p-4 bg-gray-50/50">
                  <div className="text-gray-600">Nights</div>
                  <div className="text-right text-gray-800">{nights}</div>
                </div>
                <div className="grid grid-cols-2 text-xs font-bold text-gray-700 border-b border-gray-100 p-4">
                  <div>Dates</div>
                  <div className="text-right">Amount</div>
                </div>
                {checkIn && (
                  <div className="grid grid-cols-2 text-xs text-gray-600 border-b border-gray-100 p-4">
                    <div>{format(new Date(checkIn), 'MMMM dd, yyyy')}</div>
                    <div className="text-right">{getCurrencySymbol()}{room ? convertPrice(room.price) : 0}</div>
                  </div>
                )}
                <div className="grid grid-cols-2 text-xs font-bold text-gray-800 border-b border-gray-100 p-4 bg-gray-50">
                  <div>Dates Subtotal</div>
                  <div className="text-right">{getCurrencySymbol()}{room ? convertPrice(room.price * nights) : 0}</div>
                </div>
                {bookingSettings.additionalServices?.items.map((service, idx) => {
                  const serviceKey = service.name.toLowerCase().replace(/[^a-z]/g, '');
                  const isChecked = services[serviceKey];
                  
                  if (!isChecked) return null;
                  
                  if (service.type === 'guests') {
                    const guestsKey = `${serviceKey}Guests`;
                    const guestCount = services[guestsKey] || 1;
                    return (
                      <div key={idx} className="grid grid-cols-2 text-xs text-gray-600 border-b border-gray-100 p-4">
                        <div>{service.name} ({guestCount} guest{guestCount > 1 ? 's' : ''})</div>
                        <div className="text-right">{getCurrencySymbol()}{convertPrice(service.price * guestCount)}</div>
                      </div>
                    );
                  } else if (service.price > 0) {
                    return (
                      <div key={idx} className="grid grid-cols-2 text-xs text-gray-600 border-b border-gray-100 p-4">
                        <div>{service.name}</div>
                        <div className="text-right">{getCurrencySymbol()}{convertPrice(service.price)}</div>
                      </div>
                    );
                  }
                  return null;
                })}
                <div className="grid grid-cols-2 text-xs font-bold text-gray-800 border-b border-gray-100 p-4 bg-gray-50">
                  <div>Subtotal</div>
                  <div className="text-right">{getCurrencySymbol()}{convertPrice(total)}</div>
                </div>
                <div className="grid grid-cols-2 text-xs font-bold text-gray-800 p-4 bg-gray-50">
                  <div>Total</div>
                  <div className="text-right">{getCurrencySymbol()}{convertPrice(total)}</div>
                </div>
              </div>

              {/* Policies */}
              <div className="space-y-4 mb-16">
                {bookingSettings.policies && bookingSettings.policies.length > 0 ? (
                  bookingSettings.policies.map((policy, idx) => (
                    <p key={idx} className="text-[10px] leading-relaxed text-gray-500">
                      <span className="font-bold text-gray-700">{policy.title}:</span> {policy.content}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="text-[10px] leading-relaxed text-gray-500">
                      <span className="font-bold text-gray-700">Confirmations:</span> Confirmations that are received by email or fax will be processed and confirmed by our reservation office within 24 hours. A reservation is considered provisional until the hotel confirms acceptance of the reservation.
                    </p>
                    <p className="text-[10px] leading-relaxed text-gray-500">
                      <span className="font-bold text-gray-700">Cancellations:</span> Cancellations and changes must be done in writing (e.g. email or fax). A confirmed reservation can be cancelled or changed until 3 full days prior scheduled arrival date. In case of non-arrival on the day (no-show) or cancellation less than 3 full days prior to arrival, the amount of the first night will be charged.
                    </p>
                  </>
                )}
              </div>

              {/* YOUR INFORMATION */}
              <form onSubmit={handleSubmit}>
                <h2 className="text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-6">
                  Your Information
                </h2>
                <p className="text-[10px] text-gray-500 mb-8 italic">
                  Required fields are followed by <span className="text-[#59a4b5]">*</span>
                </p>

                <div className="mb-16 space-y-6">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      First Name <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Last Name <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Email <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Phone <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Country of residence <span className="text-[#59a4b5]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        className="w-full border border-gray-300 py-2 px-3 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent appearance-none rounded-none"
                      >
                        <option value="">Select country</option>
                        <option value="us">United States</option>
                        <option value="uk">United Kingdom</option>
                        <option value="ch">Switzerland</option>
                        <option value="jp">Japan</option>
                        <option value="gr">Greece</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Address <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      City <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      State / County <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Postcode <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      required
                      className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full border-b border-gray-300 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent resize-y"
                    />
                  </div>
                </div>


                {/* PAYMENT METHOD */}
                <h2 className="text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-6">
                  Payment Method
                </h2>
                <div className="mb-10 space-y-3">
                
                  <PaymentOption
                    value="test"
                    label="Test Payment"
                    description="Use this mode or any below to test booking confirmation"
                    selected={paymentMethod}
                    onChange={setPaymentMethod}
                  />
                  <PaymentOption
                    value="arrival"
                    label="Pay on Arrival"
                    description="Pay with cash on arrival."
                    selected={paymentMethod}
                    onChange={setPaymentMethod}
                  />
                  <PaymentOption
                    value="bank"
                    label="Direct Bank Transfer"
                    description="Make your payment directly into our bank account. Please use your Booking ID as the payment reference."
                    selected={paymentMethod}
                    onChange={setPaymentMethod}
                  />
                  <PaymentOption
                    value="paypal"
                    label="PayPal"
                    description="Pay via PayPal; you can pay with your credit card if you don't have a PayPal account."
                    selected={paymentMethod}
                    onChange={setPaymentMethod}
                  />
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-sm">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-lg text-gray-600">Total Price:</span>
                    <span className="text-2xl font-bold text-gray-900">{getCurrencySymbol()}{convertPrice(total)}</span>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer mb-8">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                    />
                    <span>
                      I've read and accept the terms & conditions <span className="text-[#59a4b5]">*</span>
                    </span>
                  </label>

                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={isSubmitting || !acceptTerms}
                      className="bg-[#59a4b5] hover:bg-[#4a8a99] text-white text-sm font-bold py-3 px-8 rounded-full transition-colors shadow-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Processing...' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <div className="w-full lg:w-[300px] shrink-0">
              <Sidebar 
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                exchangeRates={exchangeRates}
                bookingSettings={bookingSettings}
              />
            </div>
          </div>
        </div>
        <Footer />
      </MainContentWrapper>
    </div>
  );
}

const PaymentOption: React.FC<{
  label: string;
  description: string;
  value: string;
  selected: string;
  onChange: (val: string) => void;
}> = ({ label, description, value, selected, onChange }) => (
  <div
    className={`border rounded-sm p-4 cursor-pointer transition-all ${
      selected === value ? 'border-[#59a4b5] bg-[#59a4b5]/5' : 'border-gray-200 hover:border-gray-300'
    }`}
    onClick={() => onChange(value)}
  >
    <label className="flex items-start gap-3 cursor-pointer">
      <div
        className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
          selected === value ? 'border-[#59a4b5]' : 'border-gray-300'
        }`}
      >
        {selected === value && <div className="w-2 h-2 rounded-full bg-[#59a4b5]" />}
      </div>
      <div>
        <span className="block text-xs font-bold text-gray-800 mb-1">{label}</span>
        <span className="block text-[10px] text-gray-500 leading-relaxed">{description}</span>
      </div>
    </label>
  </div>
);

const Sidebar: React.FC<{
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  exchangeRates: { [key: string]: { rate: number; symbol: string } };
  bookingSettings: BookingSettings;
}> = ({ selectedCurrency, setSelectedCurrency, exchangeRates, bookingSettings }) => (
  <div className="space-y-8 sticky top-8">
    {/* Currency Selector */}
    <div>
      <h3 className="text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-3">
        Currency
      </h3>
      <div className="relative">
        <select 
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="w-full appearance-none border border-gray-300 rounded-sm px-4 py-2 text-xs text-gray-600 bg-white focus:outline-none hover:border-gray-400 focus:border-[#59a4b5]"
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
    {bookingSettings.sidebarContact && (
      <div>
        <h3 className="text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-4">
          {bookingSettings.sidebarContact.title}
        </h3>
        <div className="text-xs text-gray-600 space-y-1 font-light">
          {bookingSettings.sidebarContact.items.map((item, idx) => (
            <p key={idx} className={item.label === 'Email' ? 'text-gray-500 hover:text-[#59a4b5] cursor-pointer' : ''}>
              {item.label !== 'Email' && `${item.label}: `}{item.value}
            </p>
          ))}
        </div>
      </div>
    )}

    {/* Address */}
    {bookingSettings.sidebarAddress && (
      <div>
        <h3 className="text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-4">
          {bookingSettings.sidebarAddress.title}
        </h3>
        <div className="text-xs text-gray-600 space-y-1 font-light">
          {bookingSettings.sidebarAddress.items.map((item, idx) => (
            <React.Fragment key={idx}>
              <p className={
                item.label === 'Hotel Name' ? 'font-medium text-gray-800' :
                item.label === 'Email' ? 'text-gray-500 hover:text-[#59a4b5] cursor-pointer' : ''
              }>
                {item.label !== 'Hotel Name' && item.label !== 'Address Line 1' && item.label !== 'Address Line 2' && item.label !== 'Email' && `${item.label}: `}
                {item.value}
              </p>
              {item.label === 'Address Line 2' && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5]"></div>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
