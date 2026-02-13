'use client';

import { useEffect, useState, Suspense } from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { bookingsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Stats {
  total: number;
  upcoming: number;
  completed: number;
}

function StatsContent() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({ total: 0, upcoming: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;

      try {
        const response = await bookingsAPI.getMyBookings();
        const bookings = response.data.data || [];
        
        const now = new Date();
        const upcoming = bookings.filter((b: any) => 
          new Date(b.checkInDate) > now && b.status !== 'cancelled'
        ).length;
        
        const completed = bookings.filter((b: any) => 
          b.status === 'completed'
        ).length;

        setStats({
          total: bookings.length,
          upcoming,
          completed,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {/* Total Bookings */}
      <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Bookings</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Upcoming Trips</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.upcoming}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Completed Stays */}
      <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed Stays</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.completed}</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsSlot() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 sm:mb-5 md:mb-6">
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-gray-200 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      }>
        <StatsContent />
      </Suspense>
    </div>
  );
}
