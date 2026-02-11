'use client';

import { useState, useEffect } from 'react';
import { User, Save, Loader2 } from 'lucide-react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface BillingInfo {
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  billingInfo?: BillingInfo;
}

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const profile: UserProfile = response.data.data;
      
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        country: profile.billingInfo?.country || '',
        address: profile.billingInfo?.address || '',
        city: profile.billingInfo?.city || '',
        state: profile.billingInfo?.state || '',
        postcode: profile.billingInfo?.postcode || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        billingInfo: {
          country: formData.country,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
        },
      };

      const response = await authAPI.updateProfile(updateData);
      
      // Update auth store with new user data
      if (user) {
        setAuth(user.token, {
          ...user,
          name: response.data.data.name,
          phone: response.data.data.phone,
        });
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <RouteGuard allowedRoles={['guest']}>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[#59a4b5]" />
          </div>
        </DashboardLayout>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={['guest']}>
      <DashboardLayout>
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#59a4b5] to-[#4a8a99] flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            </div>
            <p className="text-gray-600">Manage your personal information and billing details</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Personal Information */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Billing Information</h2>
              <p className="text-sm text-gray-600 mb-4">
                Save your billing details to speed up future bookings
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                  >
                    <option value="">Select country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ch">Switzerland</option>
                    <option value="jp">Japan</option>
                    <option value="gr">Greece</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                    <option value="it">Italy</option>
                    <option value="es">Spain</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State / County
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode / ZIP
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#59a4b5] to-[#4a8a99] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
