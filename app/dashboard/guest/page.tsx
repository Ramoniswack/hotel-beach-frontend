'use client';

import { useAuthStore } from '@/store/authStore';

export default function GuestDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto mb-4 sm:mb-5 md:mb-6 px-4 sm:px-6">
      <div className="bg-gradient-to-r from-[#59a4b5] to-[#4a8a99] rounded-lg p-4 sm:p-6 md:p-8 text-white">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-white/90 text-sm sm:text-base">
          Manage your Santorini trips and access concierge services
        </p>
      </div>
    </div>
  );
}
