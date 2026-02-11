'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      router.push(`/login?error=${error}`);
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Store auth data
        setAuth(user, token);
        
        // Redirect based on role
        if (user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (user.role === 'staff') {
          router.push('/dashboard/staff');
        } else {
          router.push('/dashboard/guest');
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        router.push('/login?error=invalid_data');
      }
    } else {
      router.push('/login?error=missing_data');
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
