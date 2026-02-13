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
    CLP: { rate: 975.30, symbol: '$' },
    ARS: { rate: 1015.50, symbol: '$' },
    COP: { rate: 3925.75, symbol: '$' },
    PEN: { rate: 3.72, symbol: 'S/' },
    EGP: { rate: 48.95, symbol: '£' },
    NGN: { rate: 1545.80, symbol: '₦' },
    KES: { rate: 129.45, symbol: 'KSh' },
    PKR: { rate: 278.50, symbol: '₨' },
    BDT: { rate: 109.85, symbol: '৳' },
    VND: { rate: 25385.00, symbol: '₫' },
    UAH: { rate: 41.25, symbol: '₴' },
    RON: { rate: 4.58, symbol: 'lei' },
    BGN: { rate: 1.80, symbol: 'лв' },
    HRK: { rate: 6.93, symbol: 'kn' },
    ISK: { rate: 137.85, symbol: 'kr' },
  });
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  
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
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  
  // Additional services - using dynamic keys to support admin-configured services
  const [services, setServices] = useState<{ [key: string]: boolean | number }>({
    smartphone: false,
    safeBox: false,
    luggage: false,
    childcare: false,
    massage: false,
    massageGuests: 1,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Comprehensive country list
  const countries = [
    { code: 'af', name: 'Afghanistan' },
    { code: 'al', name: 'Albania' },
    { code: 'dz', name: 'Algeria' },
    { code: 'ad', name: 'Andorra' },
    { code: 'ao', name: 'Angola' },
    { code: 'ag', name: 'Antigua and Barbuda' },
    { code: 'ar', name: 'Argentina' },
    { code: 'am', name: 'Armenia' },
    { code: 'au', name: 'Australia' },
    { code: 'at', name: 'Austria' },
    { code: 'az', name: 'Azerbaijan' },
    { code: 'bs', name: 'Bahamas' },
    { code: 'bh', name: 'Bahrain' },
    { code: 'bd', name: 'Bangladesh' },
    { code: 'bb', name: 'Barbados' },
    { code: 'by', name: 'Belarus' },
    { code: 'be', name: 'Belgium' },
    { code: 'bz', name: 'Belize' },
    { code: 'bj', name: 'Benin' },
    { code: 'bt', name: 'Bhutan' },
    { code: 'bo', name: 'Bolivia' },
    { code: 'ba', name: 'Bosnia and Herzegovina' },
    { code: 'bw', name: 'Botswana' },
    { code: 'br', name: 'Brazil' },
    { code: 'bn', name: 'Brunei' },
    { code: 'bg', name: 'Bulgaria' },
    { code: 'bf', name: 'Burkina Faso' },
    { code: 'bi', name: 'Burundi' },
    { code: 'kh', name: 'Cambodia' },
    { code: 'cm', name: 'Cameroon' },
    { code: 'ca', name: 'Canada' },
    { code: 'cv', name: 'Cape Verde' },
    { code: 'cf', name: 'Central African Republic' },
    { code: 'td', name: 'Chad' },
    { code: 'cl', name: 'Chile' },
    { code: 'cn', name: 'China' },
    { code: 'co', name: 'Colombia' },
    { code: 'km', name: 'Comoros' },
    { code: 'cg', name: 'Congo' },
    { code: 'cr', name: 'Costa Rica' },
    { code: 'hr', name: 'Croatia' },
    { code: 'cu', name: 'Cuba' },
    { code: 'cy', name: 'Cyprus' },
    { code: 'cz', name: 'Czech Republic' },
    { code: 'dk', name: 'Denmark' },
    { code: 'dj', name: 'Djibouti' },
    { code: 'dm', name: 'Dominica' },
    { code: 'do', name: 'Dominican Republic' },
    { code: 'ec', name: 'Ecuador' },
    { code: 'eg', name: 'Egypt' },
    { code: 'sv', name: 'El Salvador' },
    { code: 'gq', name: 'Equatorial Guinea' },
    { code: 'er', name: 'Eritrea' },
    { code: 'ee', name: 'Estonia' },
    { code: 'et', name: 'Ethiopia' },
    { code: 'fj', name: 'Fiji' },
    { code: 'fi', name: 'Finland' },
    { code: 'fr', name: 'France' },
    { code: 'ga', name: 'Gabon' },
    { code: 'gm', name: 'Gambia' },
    { code: 'ge', name: 'Georgia' },
    { code: 'de', name: 'Germany' },
    { code: 'gh', name: 'Ghana' },
    { code: 'gr', name: 'Greece' },
    { code: 'gd', name: 'Grenada' },
    { code: 'gt', name: 'Guatemala' },
    { code: 'gn', name: 'Guinea' },
    { code: 'gw', name: 'Guinea-Bissau' },
    { code: 'gy', name: 'Guyana' },
    { code: 'ht', name: 'Haiti' },
    { code: 'hn', name: 'Honduras' },
    { code: 'hu', name: 'Hungary' },
    { code: 'is', name: 'Iceland' },
    { code: 'in', name: 'India' },
    { code: 'id', name: 'Indonesia' },
    { code: 'ir', name: 'Iran' },
    { code: 'iq', name: 'Iraq' },
    { code: 'ie', name: 'Ireland' },
    { code: 'il', name: 'Israel' },
    { code: 'it', name: 'Italy' },
    { code: 'jm', name: 'Jamaica' },
    { code: 'jp', name: 'Japan' },
    { code: 'jo', name: 'Jordan' },
    { code: 'kz', name: 'Kazakhstan' },
    { code: 'ke', name: 'Kenya' },
    { code: 'ki', name: 'Kiribati' },
    { code: 'kp', name: 'North Korea' },
    { code: 'kr', name: 'South Korea' },
    { code: 'kw', name: 'Kuwait' },
    { code: 'kg', name: 'Kyrgyzstan' },
    { code: 'la', name: 'Laos' },
    { code: 'lv', name: 'Latvia' },
    { code: 'lb', name: 'Lebanon' },
    { code: 'ls', name: 'Lesotho' },
    { code: 'lr', name: 'Liberia' },
    { code: 'ly', name: 'Libya' },
    { code: 'li', name: 'Liechtenstein' },
    { code: 'lt', name: 'Lithuania' },
    { code: 'lu', name: 'Luxembourg' },
    { code: 'mk', name: 'North Macedonia' },
    { code: 'mg', name: 'Madagascar' },
    { code: 'mw', name: 'Malawi' },
    { code: 'my', name: 'Malaysia' },
    { code: 'mv', name: 'Maldives' },
    { code: 'ml', name: 'Mali' },
    { code: 'mt', name: 'Malta' },
    { code: 'mh', name: 'Marshall Islands' },
    { code: 'mr', name: 'Mauritania' },
    { code: 'mu', name: 'Mauritius' },
    { code: 'mx', name: 'Mexico' },
    { code: 'fm', name: 'Micronesia' },
    { code: 'md', name: 'Moldova' },
    { code: 'mc', name: 'Monaco' },
    { code: 'mn', name: 'Mongolia' },
    { code: 'me', name: 'Montenegro' },
    { code: 'ma', name: 'Morocco' },
    { code: 'mz', name: 'Mozambique' },
    { code: 'mm', name: 'Myanmar' },
    { code: 'na', name: 'Namibia' },
    { code: 'nr', name: 'Nauru' },
    { code: 'np', name: 'Nepal' },
    { code: 'nl', name: 'Netherlands' },
    { code: 'nz', name: 'New Zealand' },
    { code: 'ni', name: 'Nicaragua' },
    { code: 'ne', name: 'Niger' },
    { code: 'ng', name: 'Nigeria' },
    { code: 'no', name: 'Norway' },
    { code: 'om', name: 'Oman' },
    { code: 'pk', name: 'Pakistan' },
    { code: 'pw', name: 'Palau' },
    { code: 'pa', name: 'Panama' },
    { code: 'pg', name: 'Papua New Guinea' },
    { code: 'py', name: 'Paraguay' },
    { code: 'pe', name: 'Peru' },
    { code: 'ph', name: 'Philippines' },
    { code: 'pl', name: 'Poland' },
    { code: 'pt', name: 'Portugal' },
    { code: 'qa', name: 'Qatar' },
    { code: 'ro', name: 'Romania' },
    { code: 'ru', name: 'Russia' },
    { code: 'rw', name: 'Rwanda' },
    { code: 'kn', name: 'Saint Kitts and Nevis' },
    { code: 'lc', name: 'Saint Lucia' },
    { code: 'vc', name: 'Saint Vincent and the Grenadines' },
    { code: 'ws', name: 'Samoa' },
    { code: 'sm', name: 'San Marino' },
    { code: 'st', name: 'Sao Tome and Principe' },
    { code: 'sa', name: 'Saudi Arabia' },
    { code: 'sn', name: 'Senegal' },
    { code: 'rs', name: 'Serbia' },
    { code: 'sc', name: 'Seychelles' },
    { code: 'sl', name: 'Sierra Leone' },
    { code: 'sg', name: 'Singapore' },
    { code: 'sk', name: 'Slovakia' },
    { code: 'si', name: 'Slovenia' },
    { code: 'sb', name: 'Solomon Islands' },
    { code: 'so', name: 'Somalia' },
    { code: 'za', name: 'South Africa' },
    { code: 'ss', name: 'South Sudan' },
    { code: 'es', name: 'Spain' },
    { code: 'lk', name: 'Sri Lanka' },
    { code: 'sd', name: 'Sudan' },
    { code: 'sr', name: 'Suriname' },
    { code: 'sz', name: 'Eswatini' },
    { code: 'se', name: 'Sweden' },
    { code: 'ch', name: 'Switzerland' },
    { code: 'sy', name: 'Syria' },
    { code: 'tw', name: 'Taiwan' },
    { code: 'tj', name: 'Tajikistan' },
    { code: 'tz', name: 'Tanzania' },
    { code: 'th', name: 'Thailand' },
    { code: 'tl', name: 'Timor-Leste' },
    { code: 'tg', name: 'Togo' },
    { code: 'to', name: 'Tonga' },
    { code: 'tt', name: 'Trinidad and Tobago' },
    { code: 'tn', name: 'Tunisia' },
    { code: 'tr', name: 'Turkey' },
    { code: 'tm', name: 'Turkmenistan' },
    { code: 'tv', name: 'Tuvalu' },
    { code: 'ug', name: 'Uganda' },
    { code: 'ua', name: 'Ukraine' },
    { code: 'ae', name: 'United Arab Emirates' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'us', name: 'United States' },
    { code: 'uy', name: 'Uruguay' },
    { code: 'uz', name: 'Uzbekistan' },
    { code: 'vu', name: 'Vanuatu' },
    { code: 'va', name: 'Vatican City' },
    { code: 've', name: 'Venezuela' },
    { code: 'vn', name: 'Vietnam' },
    { code: 'ye', name: 'Yemen' },
    { code: 'zm', name: 'Zambia' },
    { code: 'zw', name: 'Zimbabwe' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch live exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoadingRates(true);
      try {
        // Using exchangerate-api.com (free tier: 1,500 requests/month)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (response.ok) {
          const data = await response.json();
          
          // Map currency symbols
          const currencySymbols: { [key: string]: string } = {
            USD: '$', EUR: '€', GBP: '£', JPY: '¥', CHF: 'CHF', CAD: 'C$', AUD: 'A$',
            INR: '₹', CNY: '¥', NZD: 'NZ$', SGD: 'S$', HKD: 'HK$', SEK: 'kr', NOK: 'kr',
            DKK: 'kr', MXN: '$', BRL: 'R$', ZAR: 'R', KRW: '₩', THB: '฿', MYR: 'RM',
            PHP: '₱', IDR: 'Rp', AED: 'د.إ', SAR: '﷼', TRY: '₺', RUB: '₽', PLN: 'zł',
            CZK: 'Kč', HUF: 'Ft', ILS: '₪', CLP: '$', ARS: '$', COP: '$', PEN: 'S/',
            EGP: '£', NGN: '₦', KES: 'KSh', PKR: '₨', BDT: '৳', VND: '₫', UAH: '₴',
            RON: 'lei', BGN: 'лв', HRK: 'kn', ISK: 'kr',
          };
          
          // Update exchange rates with live data
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
        // Keep default rates if fetch fails
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchExchangeRates();
    
    // Refresh rates every 1 hour
    const interval = setInterval(fetchExchangeRates, 3600000);
    
    return () => clearInterval(interval);
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
        const isServiceChecked = services[serviceKey];
        
        if (isServiceChecked === true) {
          if (service.type === 'guests') {
            const guestsKey = `${serviceKey}Guests`;
            const guestCount = typeof services[guestsKey] === 'number' ? services[guestsKey] : 1;
            total += service.price * (guestCount as number);
          } else {
            total += service.price;
          }
        }
      });
    }
    
    return total;
  };

  // Form validation function
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Validate adults and children
    if (!adults || adults === '') {
      errors.adults = 'Please select number of adults';
    }
    if (!children || children === '') {
      errors.children = 'Please select number of children';
    }

    // Validate first name
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    // Validate last name
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    // Validate email
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate phone
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      errors.phone = 'Please enter a valid phone number';
    } else if (phone.replace(/[\s\-\+\(\)]/g, '').length < 7) {
      errors.phone = 'Phone number must be at least 7 digits';
    }

    // Validate country
    if (!country) {
      errors.country = 'Please select a country';
    }

    // Validate address
    if (!address.trim()) {
      errors.address = 'Address is required';
    } else if (address.trim().length < 5) {
      errors.address = 'Address must be at least 5 characters';
    }

    // Validate city
    if (!city.trim()) {
      errors.city = 'City is required';
    } else if (city.trim().length < 2) {
      errors.city = 'City must be at least 2 characters';
    }

    // Validate state
    if (!state.trim()) {
      errors.state = 'State/County is required';
    }

    // Validate postcode
    if (!postcode.trim()) {
      errors.postcode = 'Postcode is required';
    } else if (postcode.trim().length < 3) {
      errors.postcode = 'Postcode must be at least 3 characters';
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      setError('Please fix the errors in the form before submitting');
      // Scroll to first error
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!roomId || !checkIn || !checkOut) {
      setError('Missing booking information');
      return;
    }

    setIsSubmitting(true);

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
        <div className="min-h-screen bg-white pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-16">
            {/* LEFT COLUMN: MAIN CONTENT */}
            <div className="flex-1">
              {/* Booking Details Header */}
              <h2 className="text-[10px] sm:text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-4 sm:mb-5 md:mb-6">
                Booking Details
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-9 md:mb-10 text-[11px] sm:text-xs text-gray-800">
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
              <div className="bg-[#f9f9f9] p-4 sm:p-6 md:p-8 mb-8 sm:mb-9 md:mb-10 rounded-sm">
                <h3 className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 sm:mb-5 md:mb-6">
                  Accommodation #1
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 mb-4 sm:mb-5 md:mb-6">
                  Accommodation Type: {room?.title}
                </p>

                {/* Selects */}
                <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                  <div className="w-1/2">
                    <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                      Adults <span className="text-[#59a4b5]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={adults}
                        onChange={(e) => {
                          setAdults(e.target.value);
                          setValidationErrors(prev => ({ ...prev, adults: '' }));
                        }}
                        className={`w-full bg-white border ${validationErrors.adults ? 'border-red-500' : 'border-gray-300'} px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs appearance-none rounded-sm focus:outline-none focus:border-[#59a4b5]`}
                      >
                        <option value="">-- Select --</option>
                        {[1, 2, 3, 4].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                    </div>
                    {validationErrors.adults && (
                      <p className="text-[9px] sm:text-[10px] text-red-600 mt-1">{validationErrors.adults}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                      Children <span className="text-[#59a4b5]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={children}
                        onChange={(e) => {
                          setChildren(e.target.value);
                          setValidationErrors(prev => ({ ...prev, children: '' }));
                        }}
                        className={`w-full bg-white border ${validationErrors.children ? 'border-red-500' : 'border-gray-300'} px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs appearance-none rounded-sm focus:outline-none focus:border-[#59a4b5]`}
                      >
                        <option value="">-- Select --</option>
                        {[0, 1, 2, 3].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                    </div>
                    {validationErrors.children && (
                      <p className="text-[9px] sm:text-[10px] text-red-600 mt-1">{validationErrors.children}</p>
                    )}
                  </div>
                </div>

                {/* Guest Name */}
                <div className="mb-6 sm:mb-7 md:mb-8">
                  <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">Full Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-300 focus:border-[#59a4b5] focus:outline-none py-1 text-xs sm:text-sm"
                  />
                </div>

                {/* Additional Services */}
                <h4 className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
                  {bookingSettings.additionalServices?.title || 'Choose Additional Services'}
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {bookingSettings.additionalServices?.items.map((service, idx) => {
                    const serviceKey = service.name.toLowerCase().replace(/[^a-z]/g, '');
                    const guestsKey = `${serviceKey}Guests`;
                    
                    return service.type === 'guests' ? (
                      <div key={idx} className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={services[serviceKey] === true}
                          onChange={(e) => setServices({ ...services, [serviceKey]: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>{service.name} <span className="italic text-gray-500">({service.priceLabel})</span> {service.guestsLabel || 'for'}</span>
                        <input
                          type="number"
                          value={typeof services[guestsKey] === 'number' ? services[guestsKey] : 1}
                          onChange={(e) => setServices({ ...services, [guestsKey]: parseInt(e.target.value) || 1 })}
                          className="w-8 sm:w-10 border border-gray-300 px-1 py-0.5 text-center text-[11px] sm:text-xs"
                          min="1"
                        />
                        <span>guest(s)</span>
                      </div>
                    ) : (
                      <label key={idx} className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services[serviceKey] === true}
                          onChange={(e) => setServices({ ...services, [serviceKey]: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>{service.name} <span className="italic text-gray-500">({service.priceLabel})</span></span>
                      </label>
                    );
                  }) || (
                    // Fallback to default services if not loaded
                    <>
                      <label className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.smartphone === true}
                          onChange={(e) => setServices({ ...services, smartphone: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>Free-to-use smartphone <span className="italic text-gray-500">(Free)</span></span>
                      </label>
                      <label className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.safeBox === true}
                          onChange={(e) => setServices({ ...services, safeBox: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>Safe-deposit box <span className="italic text-gray-500">(Free)</span></span>
                      </label>
                      <label className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.luggage === true}
                          onChange={(e) => setServices({ ...services, luggage: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>Luggage storage <span className="italic text-gray-500">(Free)</span></span>
                      </label>
                      <label className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={services.childcare === true}
                          onChange={(e) => setServices({ ...services, childcare: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>Childcare <span className="italic text-gray-500">($60 / Once)</span></span>
                      </label>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={services.massage === true}
                          onChange={(e) => setServices({ ...services, massage: e.target.checked })}
                          className="accent-[#59a4b5] rounded-sm border-gray-300 w-3 h-3"
                        />
                        <span>Massage <span className="italic text-gray-500">($15 / Once)</span> for</span>
                        <input
                          type="number"
                          value={typeof services.massageGuests === 'number' ? services.massageGuests : 1}
                          onChange={(e) => setServices({ ...services, massageGuests: parseInt(e.target.value) || 1 })}
                          className="w-8 sm:w-10 border border-gray-300 px-1 py-0.5 text-center text-[11px] sm:text-xs"
                          min="1"
                        />
                        <span>guest(s)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>


              {/* Price Breakdown */}
              <h2 className="text-[10px] sm:text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-4 sm:mb-5 md:mb-6">
                Price Breakdown
              </h2>
              <div className="border border-gray-200 rounded-sm mb-8 sm:mb-10 md:mb-12 overflow-x-auto">
                <div className="grid grid-cols-2 text-[11px] sm:text-xs border-b border-gray-100 p-3 sm:p-4">
                  <div className="text-gray-600 flex items-center gap-1.5 sm:gap-2">
                    <Minus size={10} className="text-gray-400 sm:w-3 sm:h-3" />
                    <span className="truncate">#{1} {room?.title}</span>
                  </div>
                  <div className="text-right text-gray-800">{getCurrencySymbol()}{room ? convertPrice(room.price) : 0}</div>
                </div>
                <div className="grid grid-cols-2 text-[11px] sm:text-xs border-b border-gray-100 p-3 sm:p-4 bg-gray-50/50">
                  <div className="text-gray-600">Adults</div>
                  <div className="text-right text-gray-800">{adults}</div>
                </div>
                <div className="grid grid-cols-2 text-[11px] sm:text-xs border-b border-gray-100 p-3 sm:p-4 bg-gray-50/50">
                  <div className="text-gray-600">Children</div>
                  <div className="text-right text-gray-800">{children}</div>
                </div>
                <div className="grid grid-cols-2 text-[11px] sm:text-xs border-b border-gray-100 p-3 sm:p-4 bg-gray-50/50">
                  <div className="text-gray-600">Nights</div>
                  <div className="text-right text-gray-800">{nights}</div>
                </div>
                <div className="grid grid-cols-2 text-[11px] sm:text-xs font-bold text-gray-700 border-b border-gray-100 p-3 sm:p-4">
                  <div>Dates</div>
                  <div className="text-right">Amount</div>
                </div>
                {checkIn && (
                  <div className="grid grid-cols-2 text-[11px] sm:text-xs text-gray-600 border-b border-gray-100 p-3 sm:p-4">
                    <div className="truncate">{format(new Date(checkIn), 'MMMM dd, yyyy')}</div>
                    <div className="text-right">{getCurrencySymbol()}{room ? convertPrice(room.price) : 0}</div>
                  </div>
                )}
                <div className="grid grid-cols-2 text-[11px] sm:text-xs font-bold text-gray-800 border-b border-gray-100 p-3 sm:p-4 bg-gray-50">
                  <div>Dates Subtotal</div>
                  <div className="text-right">{getCurrencySymbol()}{room ? convertPrice(room.price * nights) : 0}</div>
                </div>
                {bookingSettings.additionalServices?.items.map((service, idx) => {
                  const serviceKey = service.name.toLowerCase().replace(/[^a-z]/g, '');
                  const isChecked = services[serviceKey] === true;
                  
                  if (!isChecked) return null;
                  
                  if (service.type === 'guests') {
                    const guestsKey = `${serviceKey}Guests`;
                    const guestCount = typeof services[guestsKey] === 'number' ? services[guestsKey] : 1;
                    return (
                      <div key={idx} className="grid grid-cols-2 text-[11px] sm:text-xs text-gray-600 border-b border-gray-100 p-3 sm:p-4">
                        <div className="truncate">{service.name} ({guestCount} guest{guestCount > 1 ? 's' : ''})</div>
                        <div className="text-right">{getCurrencySymbol()}{convertPrice(service.price * guestCount)}</div>
                      </div>
                    );
                  } else if (service.price > 0) {
                    return (
                      <div key={idx} className="grid grid-cols-2 text-[11px] sm:text-xs text-gray-600 border-b border-gray-100 p-3 sm:p-4">
                        <div className="truncate">{service.name}</div>
                        <div className="text-right">{getCurrencySymbol()}{convertPrice(service.price)}</div>
                      </div>
                    );
                  }
                  return null;
                })}
                <div className="grid grid-cols-2 text-[11px] sm:text-xs font-bold text-gray-800 border-b border-gray-100 p-3 sm:p-4 bg-gray-50">
                  <div>Subtotal</div>
                  <div className="text-right">{getCurrencySymbol()}{convertPrice(total)}</div>
                </div>
                <div className="grid grid-cols-2 text-[11px] sm:text-xs font-bold text-gray-800 p-3 sm:p-4 bg-gray-50">
                  <div>Total</div>
                  <div className="text-right">{getCurrencySymbol()}{convertPrice(total)}</div>
                </div>
              </div>

              {/* Policies */}
              <div className="space-y-3 sm:space-y-4 mb-12 sm:mb-14 md:mb-16">
                {bookingSettings.policies && bookingSettings.policies.length > 0 ? (
                  bookingSettings.policies.map((policy, idx) => (
                    <p key={idx} className="text-[9px] sm:text-[10px] leading-relaxed text-gray-500">
                      <span className="font-bold text-gray-700">{policy.title}:</span> {policy.content}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="text-[9px] sm:text-[10px] leading-relaxed text-gray-500">
                      <span className="font-bold text-gray-700">Confirmations:</span> Confirmations that are received by email or fax will be processed and confirmed by our reservation office within 24 hours. A reservation is considered provisional until the hotel confirms acceptance of the reservation.
                    </p>
                    <p className="text-[9px] sm:text-[10px] leading-relaxed text-gray-500">
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
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setValidationErrors(prev => ({ ...prev, firstName: '' }));
                      }}
                      required
                      className={`w-full border-b ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'} py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent`}
                    />
                    {validationErrors.firstName && (
                      <p className="text-[10px] sm:text-xs text-red-600 mt-1">{validationErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Last Name <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setValidationErrors(prev => ({ ...prev, lastName: '' }));
                      }}
                      required
                      className={`w-full border-b ${validationErrors.lastName ? 'border-red-500' : 'border-gray-300'} py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent`}
                    />
                    {validationErrors.lastName && (
                      <p className="text-[10px] sm:text-xs text-red-600 mt-1">{validationErrors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Email <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setValidationErrors(prev => ({ ...prev, email: '' }));
                      }}
                      required
                      className={`w-full border-b ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent`}
                    />
                    {validationErrors.email && (
                      <p className="text-[10px] sm:text-xs text-red-600 mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Phone <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setValidationErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      required
                      className={`w-full border-b ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent`}
                    />
                    {validationErrors.phone && (
                      <p className="text-[10px] sm:text-xs text-red-600 mt-1">{validationErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Country of residence <span className="text-[#59a4b5]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          setValidationErrors(prev => ({ ...prev, country: '' }));
                        }}
                        required
                        className={`w-full border ${validationErrors.country ? 'border-red-500' : 'border-gray-300'} py-2 px-3 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent appearance-none rounded-none`}
                      >
                        <option value="">Select country</option>
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>
                    {validationErrors.country && (
                      <p className="text-[10px] sm:text-xs text-red-600 mt-1">{validationErrors.country}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Address <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setValidationErrors(prev => ({ ...prev, address: '' }));
                      }}
                      required
                      className={`w-full border-b ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent`}
                    />
                    {validationErrors.address && (
                      <p className="text-[10px] sm:text-xs text-red-600 mt-1">{validationErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      City <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setValidationErrors(prev => ({ ...prev, city: '' }));
                      }}
                      required
                      className={`w-full border-b ${validationErrors.city ? 'border-red-500' : 'border-gray-300'} py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent`}
                    />
                    {validationErrors.city && (
                      <p className="text-[10px] sm:text-xs text-red-600 mt-1">{validationErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      State / County <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setValidationErrors(prev => ({ ...prev, state: '' }));
                      }}
                      required
                      className={`w-full border-b ${validationErrors.state ? 'border-red-500' : 'border-gray-300'} py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent`}
                    />
                    {validationErrors.state && (
                      <p className="text-[10px] sm:text-xs text-red-600 mt-1">{validationErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2 font-light">
                      Postcode <span className="text-[#59a4b5]">*</span>
                    </label>
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => {
                        setPostcode(e.target.value);
                        setValidationErrors(prev => ({ ...prev, postcode: '' }));
                      }}
                      required
                      className={`w-full border-b ${validationErrors.postcode ? 'border-red-500' : 'border-gray-300'} py-2 text-sm text-gray-700 focus:outline-none focus:border-[#59a4b5] bg-transparent`}
                    />
                    {validationErrors.postcode && (
                      <p className="text-[10px] sm:text-xs text-red-600 mt-1">{validationErrors.postcode}</p>
                    )}
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
                  <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-sm">
                    <p className="text-[11px] sm:text-xs text-red-600">{error}</p>
                  </div>
                )}

                <div className="mb-6 sm:mb-7 md:mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 mb-5 sm:mb-6">
                    <span className="text-base sm:text-lg text-gray-600">Total Price:</span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{getCurrencySymbol()}{convertPrice(total)}</span>
                  </div>

                  <div>
                    <label className={`flex items-start sm:items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs ${validationErrors.acceptTerms ? 'text-red-600' : 'text-gray-600'} cursor-pointer mb-2`}>
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => {
                          setAcceptTerms(e.target.checked);
                          setValidationErrors(prev => ({ ...prev, acceptTerms: '' }));
                        }}
                        className={`accent-[#59a4b5] rounded-sm ${validationErrors.acceptTerms ? 'border-red-500' : 'border-gray-300'} w-3 h-3 mt-0.5 sm:mt-0 shrink-0`}
                      />
                      <span>
                        I've read and accept the terms & conditions <span className="text-[#59a4b5]">*</span>
                      </span>
                    </label>
                    {validationErrors.acceptTerms && (
                      <p className="text-[10px] sm:text-xs text-red-600 mb-4">{validationErrors.acceptTerms}</p>
                    )}
                  </div>

                  <div className="text-center sm:text-right mt-6 sm:mt-7 md:mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-[#59a4b5] hover:bg-[#4a8a99] text-white text-xs sm:text-sm font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-colors shadow-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Processing...' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 order-first lg:order-last">
              <Sidebar 
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                exchangeRates={exchangeRates}
                bookingSettings={bookingSettings}
                isLoadingRates={isLoadingRates}
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
    className={`border rounded-sm p-3 sm:p-4 cursor-pointer transition-all ${
      selected === value ? 'border-[#59a4b5] bg-[#59a4b5]/5' : 'border-gray-200 hover:border-gray-300'
    }`}
    onClick={() => onChange(value)}
  >
    <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
      <div
        className={`mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border flex items-center justify-center shrink-0 ${
          selected === value ? 'border-[#59a4b5]' : 'border-gray-300'
        }`}
      >
        {selected === value && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#59a4b5]" />}
      </div>
      <div>
        <span className="block text-[11px] sm:text-xs font-bold text-gray-800 mb-0.5 sm:mb-1">{label}</span>
        <span className="block text-[9px] sm:text-[10px] text-gray-500 leading-relaxed">{description}</span>
      </div>
    </label>
  </div>
);

const Sidebar: React.FC<{
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  exchangeRates: { [key: string]: { rate: number; symbol: string } };
  bookingSettings: BookingSettings;
  isLoadingRates?: boolean;
}> = ({ selectedCurrency, setSelectedCurrency, exchangeRates, bookingSettings, isLoadingRates }) => (
  <div className="space-y-6 sm:space-y-7 md:space-y-8 lg:sticky lg:top-8">
    {/* Currency Selector */}
    <div>
      <h3 className="text-[10px] sm:text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-2 sm:mb-3">
        Currency {isLoadingRates && <span className="text-gray-400 font-normal">(updating...)</span>}
      </h3>
      <div className="relative">
        <select 
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="w-full appearance-none border border-gray-300 rounded-sm px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs text-gray-600 bg-white focus:outline-none hover:border-gray-400 focus:border-[#59a4b5]"
        >
          {Object.entries(exchangeRates).map(([code, { symbol }]) => (
            <option key={code} value={code}>
              {code} ({symbol})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
      </div>
      <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1.5 sm:mt-2 italic">
        Live exchange rates • Updates hourly
      </p>
    </div>

    {/* Questions */}
    {bookingSettings.sidebarContact && (
      <div>
        <h3 className="text-[10px] sm:text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-3 sm:mb-4">
          {bookingSettings.sidebarContact.title}
        </h3>
        <div className="text-[11px] sm:text-xs text-gray-600 space-y-0.5 sm:space-y-1 font-light">
          {bookingSettings.sidebarContact.items.map((item, idx) => (
            <p key={idx} className={item.label === 'Email' ? 'text-gray-500 hover:text-[#59a4b5] cursor-pointer break-all' : ''}>
              {item.label !== 'Email' && `${item.label}: `}{item.value}
            </p>
          ))}
        </div>
      </div>
    )}

    {/* Address */}
    {bookingSettings.sidebarAddress && (
      <div>
        <h3 className="text-[10px] sm:text-[11px] font-bold text-[#59a4b5] uppercase tracking-widest mb-3 sm:mb-4">
          {bookingSettings.sidebarAddress.title}
        </h3>
        <div className="text-[11px] sm:text-xs text-gray-600 space-y-0.5 sm:space-y-1 font-light">
          {bookingSettings.sidebarAddress.items.map((item, idx) => (
            <React.Fragment key={idx}>
              <p className={
                item.label === 'Hotel Name' ? 'font-medium text-gray-800' :
                item.label === 'Email' ? 'text-gray-500 hover:text-[#59a4b5] cursor-pointer break-all' : ''
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
