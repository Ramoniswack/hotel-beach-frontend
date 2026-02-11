'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: ('guest' | 'staff' | 'admin')[];
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const { user, token, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Don't check auth until hydrated
    if (!_hasHydrated) return;

    // Check if user is authenticated
    if (!token || !user) {
      router.push('/login');
      return;
    }

    // Check if user has required role
    if (!allowedRoles.includes(user.role)) {
      // Redirect based on user role
      if (user.role === 'guest') {
        router.push('/dashboard/guest');
      } else if (user.role === 'staff' || user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, token, allowedRoles, router, _hasHydrated]);

  // Show loading while hydrating or checking auth
  if (!_hasHydrated || !token || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59a4b5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
