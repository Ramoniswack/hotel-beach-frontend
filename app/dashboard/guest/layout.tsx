'use client';

import { ReactNode } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function GuestDashboardLayout({
  children,
  stats,
  bookings,
}: {
  children: ReactNode;
  stats: ReactNode;
  bookings: ReactNode;
}) {
  return (
    <RouteGuard allowedRoles={['guest']}>
      <DashboardLayout>
        {children}
        {stats}
        {bookings}
      </DashboardLayout>
    </RouteGuard>
  );
}
