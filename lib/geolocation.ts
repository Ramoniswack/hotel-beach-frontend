// Geolocation utility for IP-based country and currency detection

export interface GeolocationData {
  country: string;
  countryCode: string;
  currency: string;
  timezone: string;
  ip: string;
}

// Currency mapping by country code
const countryCurrencyMap: { [key: string]: string } = {
  us: 'USD', ca: 'CAD', gb: 'GBP', au: 'AUD', nz: 'NZD',
  jp: 'JPY', cn: 'CNY', kr: 'KRW', in: 'INR', sg: 'SGD',
  hk: 'HKD', my: 'MYR', th: 'THB', ph: 'PHP', id: 'IDR',
  vn: 'VND', ae: 'AED', sa: 'SAR', il: 'ILS', tr: 'TRY',
  ru: 'RUB', ua: 'UAH', eg: 'EGP', za: 'ZAR', ng: 'NGN',
  ke: 'KES', mx: 'MXN', br: 'BRL', ar: 'ARS', cl: 'CLP',
  co: 'COP', pe: 'PEN', pk: 'PKR', bd: 'BDT',
  // European countries
  at: 'EUR', be: 'EUR', cy: 'EUR', ee: 'EUR', fi: 'EUR',
  fr: 'EUR', de: 'EUR', gr: 'EUR', ie: 'EUR', it: 'EUR',
  lv: 'EUR', lt: 'EUR', lu: 'EUR', mt: 'EUR', nl: 'EUR',
  pt: 'EUR', sk: 'EUR', si: 'EUR', es: 'EUR',
  // Nordic countries (non-EUR)
  se: 'SEK', no: 'NOK', dk: 'DKK', is: 'ISK',
  // Eastern Europe
  pl: 'PLN', cz: 'CZK', hu: 'HUF', ro: 'RON', bg: 'BGN',
  hr: 'HRK',
  // Switzerland
  ch: 'CHF',
};

// Fallback to browser's locale if IP lookup fails
export function getCurrencyFromLocale(): string {
  try {
    const locale = navigator.language || 'en-US';
    const region = locale.split('-')[1]?.toLowerCase();
    
    if (region && countryCurrencyMap[region]) {
      return countryCurrencyMap[region];
    }
    
    // Default to USD
    return 'USD';
  } catch {
    return 'USD';
  }
}

// Get country name from country code
export function getCountryName(countryCode: string): string {
  const countries: { [key: string]: string } = {
    af: 'Afghanistan', al: 'Albania', dz: 'Algeria', ad: 'Andorra',
    ao: 'Angola', ag: 'Antigua and Barbuda', ar: 'Argentina', am: 'Armenia',
    au: 'Australia', at: 'Austria', az: 'Azerbaijan', bs: 'Bahamas',
    bh: 'Bahrain', bd: 'Bangladesh', bb: 'Barbados', by: 'Belarus',
    be: 'Belgium', bz: 'Belize', bj: 'Benin', bt: 'Bhutan',
    bo: 'Bolivia', ba: 'Bosnia and Herzegovina', bw: 'Botswana', br: 'Brazil',
    bn: 'Brunei', bg: 'Bulgaria', bf: 'Burkina Faso', bi: 'Burundi',
    kh: 'Cambodia', cm: 'Cameroon', ca: 'Canada', cv: 'Cape Verde',
    cf: 'Central African Republic', td: 'Chad', cl: 'Chile', cn: 'China',
    co: 'Colombia', km: 'Comoros', cg: 'Congo', cr: 'Costa Rica',
    hr: 'Croatia', cu: 'Cuba', cy: 'Cyprus', cz: 'Czech Republic',
    dk: 'Denmark', dj: 'Djibouti', dm: 'Dominica', do: 'Dominican Republic',
    ec: 'Ecuador', eg: 'Egypt', sv: 'El Salvador', gq: 'Equatorial Guinea',
    er: 'Eritrea', ee: 'Estonia', et: 'Ethiopia', fj: 'Fiji',
    fi: 'Finland', fr: 'France', ga: 'Gabon', gm: 'Gambia',
    ge: 'Georgia', de: 'Germany', gh: 'Ghana', gr: 'Greece',
    gd: 'Grenada', gt: 'Guatemala', gn: 'Guinea', gw: 'Guinea-Bissau',
    gy: 'Guyana', ht: 'Haiti', hn: 'Honduras', hu: 'Hungary',
    is: 'Iceland', in: 'India', id: 'Indonesia', ir: 'Iran',
    iq: 'Iraq', ie: 'Ireland', il: 'Israel', it: 'Italy',
    jm: 'Jamaica', jp: 'Japan', jo: 'Jordan', kz: 'Kazakhstan',
    ke: 'Kenya', ki: 'Kiribati', kp: 'North Korea', kr: 'South Korea',
    kw: 'Kuwait', kg: 'Kyrgyzstan', la: 'Laos', lv: 'Latvia',
    lb: 'Lebanon', ls: 'Lesotho', lr: 'Liberia', ly: 'Libya',
    li: 'Liechtenstein', lt: 'Lithuania', lu: 'Luxembourg', mk: 'North Macedonia',
    mg: 'Madagascar', mw: 'Malawi', my: 'Malaysia', mv: 'Maldives',
    ml: 'Mali', mt: 'Malta', mh: 'Marshall Islands', mr: 'Mauritania',
    mu: 'Mauritius', mx: 'Mexico', fm: 'Micronesia', md: 'Moldova',
    mc: 'Monaco', mn: 'Mongolia', me: 'Montenegro', ma: 'Morocco',
    mz: 'Mozambique', mm: 'Myanmar', na: 'Namibia', nr: 'Nauru',
    np: 'Nepal', nl: 'Netherlands', nz: 'New Zealand', ni: 'Nicaragua',
    ne: 'Niger', ng: 'Nigeria', no: 'Norway', om: 'Oman',
    pk: 'Pakistan', pw: 'Palau', pa: 'Panama', pg: 'Papua New Guinea',
    py: 'Paraguay', pe: 'Peru', ph: 'Philippines', pl: 'Poland',
    pt: 'Portugal', qa: 'Qatar', ro: 'Romania', ru: 'Russia',
    rw: 'Rwanda', kn: 'Saint Kitts and Nevis', lc: 'Saint Lucia',
    vc: 'Saint Vincent and the Grenadines', ws: 'Samoa', sm: 'San Marino',
    st: 'Sao Tome and Principe', sa: 'Saudi Arabia', sn: 'Senegal',
    rs: 'Serbia', sc: 'Seychelles', sl: 'Sierra Leone', sg: 'Singapore',
    sk: 'Slovakia', si: 'Slovenia', sb: 'Solomon Islands', so: 'Somalia',
    za: 'South Africa', ss: 'South Sudan', es: 'Spain', lk: 'Sri Lanka',
    sd: 'Sudan', sr: 'Suriname', sz: 'Swaziland', se: 'Sweden',
    ch: 'Switzerland', sy: 'Syria', tw: 'Taiwan', tj: 'Tajikistan',
    tz: 'Tanzania', th: 'Thailand', tl: 'Timor-Leste', tg: 'Togo',
    to: 'Tonga', tt: 'Trinidad and Tobago', tn: 'Tunisia', tr: 'Turkey',
    tm: 'Turkmenistan', tv: 'Tuvalu', ug: 'Uganda', ua: 'Ukraine',
    ae: 'United Arab Emirates', gb: 'United Kingdom', us: 'United States',
    uy: 'Uruguay', uz: 'Uzbekistan', vu: 'Vanuatu', va: 'Vatican City',
    ve: 'Venezuela', vn: 'Vietnam', ye: 'Yemen', zm: 'Zambia',
    zw: 'Zimbabwe',
  };
  
  return countries[countryCode.toLowerCase()] || '';
}

/**
 * Fetch user's geolocation data based on IP address
 * Uses ipapi.co free API (no API key required, 1000 requests/day limit)
 */
export async function getUserGeolocation(): Promise<GeolocationData | null> {
  try {
    // Try ipapi.co first (free, no key required)
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch geolocation');
    }

    const data = await response.json();
    
    const countryCode = data.country_code?.toLowerCase() || '';
    const currency = countryCurrencyMap[countryCode] || getCurrencyFromLocale();
    
    return {
      country: getCountryName(countryCode) || data.country_name || '',
      countryCode: countryCode,
      currency: currency,
      timezone: data.timezone || '',
      ip: data.ip || '',
    };
  } catch (error) {
    console.error('Geolocation lookup failed:', error);
    
    // Fallback to browser locale
    const locale = navigator.language || 'en-US';
    const region = locale.split('-')[1]?.toLowerCase() || 'us';
    const currency = getCurrencyFromLocale();
    
    return {
      country: getCountryName(region),
      countryCode: region,
      currency: currency,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ip: 'unknown',
    };
  }
}

/**
 * Alternative: Use ip-api.com (free, no key, 45 requests/minute limit)
 */
export async function getUserGeolocationAlt(): Promise<GeolocationData | null> {
  try {
    const response = await fetch('http://ip-api.com/json/', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch geolocation');
    }

    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error('Geolocation API returned error');
    }
    
    const countryCode = data.countryCode?.toLowerCase() || '';
    const currency = countryCurrencyMap[countryCode] || getCurrencyFromLocale();
    
    return {
      country: data.country || getCountryName(countryCode),
      countryCode: countryCode,
      currency: currency,
      timezone: data.timezone || '',
      ip: data.query || '',
    };
  } catch (error) {
    console.error('Alternative geolocation lookup failed:', error);
    return null;
  }
}

/**
 * Get user's geolocation with fallback
 * Tries primary API, then fallback API, then browser locale
 */
export async function getSmartDefaults(): Promise<GeolocationData> {
  // Try primary API
  let geoData = await getUserGeolocation();
  
  // If primary fails, try alternative
  if (!geoData) {
    geoData = await getUserGeolocationAlt();
  }
  
  // If both fail, use browser locale as last resort
  if (!geoData) {
    const locale = navigator.language || 'en-US';
    const region = locale.split('-')[1]?.toLowerCase() || 'us';
    
    geoData = {
      country: getCountryName(region),
      countryCode: region,
      currency: getCurrencyFromLocale(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ip: 'unknown',
    };
  }
  
  return geoData;
}
