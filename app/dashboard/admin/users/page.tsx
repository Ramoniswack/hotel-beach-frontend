'use client';

import React from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Users } from 'lucide-react';

export default function UserManagement() {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600 mt-1">Manage users and permissions</p>
          </div>

          {/* Coming Soon */}
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">User management features will be available soon</p>
          </div>
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
