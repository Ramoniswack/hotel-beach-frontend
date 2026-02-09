'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: ('guest' | 'staff' | 'admin')[];
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for zustand to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Don't check auth until hydrated
    if (!isHydrated) return;

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
  }, [user, token, allowedRoles, router, isHydrated]);

  // Show loading while hydrating or checking auth
  if (!isHydrated || !token || !user || !allowedRoles.includes(user.role)) {
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
