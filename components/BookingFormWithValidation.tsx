'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  notes: string;
  acceptTerms: boolean;
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void>;
  defaultValues?: Partial<BookingFormData>;
  countries: Array<{ code: string; name: string }>;
}

export default function BookingFormWithValidation({
  onSubmit,
  defaultValues,
  countries,
}: BookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    control,
  } = useForm<BookingFormData>({
    mode: 'onBlur', // Validate when user leaves field
    reValidateMode: 'onChange', // Re-validate on change after first blur
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      address: '',
      city: '',
      state: '',
      postcode: '',
      notes: '',
      acceptTerms: false,
      ...defaultValues,
    },
  });

  const validationRules = {
    firstName: {
      required: 'First name is required',
      minLength: {
        value: 2,
        message: 'First name must be at least 2 characters',
      },
      pattern: {
        value: /^[a-zA-Z\s'-]+$/,
        message: 'Only letters, spaces, hyphens, and apostrophes allowed',
      },
    },
    lastName: {
      required: 'Last name is required',
      minLength: {
        value: 2,
        message: 'Last name must be at least 2 characters',
      },
      pattern: {
        value: /^[a-zA-Z\s'-]+$/,
        message: 'Only letters, spaces, hyphens, and apostrophes allowed',
      },
    },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    },
    phone: {
      required: 'Phone number is required',
      pattern: {
        value: /^[\d\s\-\+\(\)]+$/,
        message: 'Please enter a valid phone number',
      },
      minLength: {
        value: 10,
        message: 'Phone number must be at least 10 digits',
      },
    },
    country: {
      required: 'Country is required',
    },
    address: {
      required: 'Address is required',
      minLength: {
        value: 5,
        message: 'Address must be at least 5 characters',
      },
    },
    city: {
      required: 'City is required',
      minLength: {
        value: 2,
        message: 'City must be at least 2 characters',
      },
    },
    postcode: {
      required: 'Postcode is required',
      minLength: {
        value: 3,
        message: 'Postcode must be at least 3 characters',
      },
    },
    acceptTerms: {
      required: 'You must accept the terms and conditions',
    },
  };

  const getFieldClassName = (fieldName: keyof BookingFormData) => {
    const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent transition-all duration-200';
    
    if (errors[fieldName]) {
      return `${baseClasses} border-red-500 bg-red-50 focus:ring-red-200`;
    }
    
    if (touchedFields[fieldName] && !errors[fieldName]) {
      return `${baseClasses} border-green-500 bg-green-50`;
    }
    
    return `${baseClasses} border-gray-300`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('firstName', validationRules.firstName)}
              className={getFieldClassName('firstName')}
              placeholder="Enter your first name"
            />
            {touchedFields.firstName && !errors.firstName && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          {errors.firstName && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.firstName.message}</span>
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('lastName', validationRules.lastName)}
              className={getFieldClassName('lastName')}
              placeholder="Enter your last name"
            />
            {touchedFields.lastName && !errors.lastName && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          {errors.lastName && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.lastName.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="email"
              {...register('email', validationRules.email)}
              className={getFieldClassName('email')}
              placeholder="your.email@example.com"
            />
            {touchedFields.email && !errors.email && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              {...register('phone', validationRules.phone)}
              className={getFieldClassName('phone')}
              placeholder="+1 (555) 123-4567"
            />
            {touchedFields.phone && !errors.phone && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.phone.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country <span className="text-red-500">*</span>
        </label>
        <Controller
          name="country"
          control={control}
          rules={validationRules.country}
          render={({ field }) => (
            <div className="relative">
              <select
                {...field}
                className={getFieldClassName('country')}
              >
                <option value="">Select a country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {touchedFields.country && !errors.country && field.value && (
                <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
              )}
            </div>
          )}
        />
        {errors.country && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.country.message}</span>
          </p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            {...register('address', validationRules.address)}
            className={getFieldClassName('address')}
            placeholder="123 Main Street, Apt 4B"
          />
          {touchedFields.address && !errors.address && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
        </div>
        {errors.address && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.address.message}</span>
          </p>
        )}
      </div>

      {/* City, State, Postcode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('city', validationRules.city)}
              className={getFieldClassName('city')}
              placeholder="City"
            />
            {touchedFields.city && !errors.city && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          {errors.city && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.city.message}</span>
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Province
          </label>
          <input
            type="text"
            {...register('state')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent transition-all"
            placeholder="State"
          />
        </div>

        {/* Postcode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postcode <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('postcode', validationRules.postcode)}
              className={getFieldClassName('postcode')}
              placeholder="12345"
            />
            {touchedFields.postcode && !errors.postcode && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          {errors.postcode && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.postcode.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent transition-all resize-none"
          placeholder="Any special requests or requirements..."
        />
      </div>

      {/* Terms and Conditions */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register('acceptTerms', validationRules.acceptTerms)}
            className="mt-1 w-5 h-5 text-[#59a4b5] border-gray-300 rounded focus:ring-2 focus:ring-[#59a4b5] cursor-pointer"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">
            I accept the{' '}
            <a href="/terms" className="text-[#59a4b5] hover:underline font-medium">
              terms and conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-[#59a4b5] hover:underline font-medium">
              privacy policy
            </a>
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5 ml-8">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.acceptTerms.message}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          'Complete Booking'
        )}
      </button>
    </form>
  );
}
