'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Home, 
  Calendar, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Hotel,
  BarChart3,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pagesMenuOpen, setPagesMenuOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Navigation items based on role
  const guestNavItems = [
    { name: 'My Bookings', href: '/dashboard/guest', icon: Calendar },
    { name: 'Contact', href: '/dashboard/guest/contact', icon: MessageSquare },
    { name: 'Back to Site', href: '/', icon: Home },
  ];

  const staffNavItems = [
    { name: 'Live Floor Plan', href: '/dashboard/staff', icon: Hotel },
    { name: 'Bookings', href: '/dashboard/admin/bookings', icon: Calendar },
    { name: 'Back to Site', href: '/', icon: Home },
  ];

  const adminNavItems = [
    { name: 'Overview', href: '/dashboard/admin', icon: BarChart3 },
    { name: 'Bookings', href: '/dashboard/admin/bookings', icon: Calendar },
    { name: 'Rooms', href: '/dashboard/admin/rooms', icon: Hotel },
    { name: 'Posts', href: '/dashboard/admin/posts', icon: FileText },
    { name: 'Site Settings', href: '/dashboard/admin/site-settings', icon: MessageSquare },
    { name: 'Financial Hub', href: '/dashboard/admin/financial', icon: BarChart3 },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Back to Site', href: '/', icon: Home },
  ];

  const pagesSubMenu = [
    { name: 'Home Page', href: '/dashboard/admin/home' },
    { name: 'Rooms Page', href: '/dashboard/admin/rooms-page' },
    { name: 'About Page', href: '/dashboard/admin/about' },
    { name: 'Explore Page', href: '/dashboard/admin/explore' },
    { name: 'Contact Page', href: '/dashboard/admin/contact' },
  ];

  const navItems = 
    user?.role === 'guest' ? guestNavItems :
    user?.role === 'staff' ? staffNavItems :
    adminNavItems;

  const isPageActive = pagesSubMenu.some(page => pathname === page.href);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1a1a1a] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/" className="flex flex-col leading-none">
              <span className="text-2xl font-bold tracking-tight text-white">
                HOTEL
              </span>
              <span className="text-[10px] font-bold tracking-[0.4em] text-white/80 ml-1">
                BEACH
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-[#59a4b5]"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#59a4b5] flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{user?.name}</p>
                <p className="text-white/60 text-xs capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#59a4b5] text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}

            {/* Pages Menu (Admin Only) */}
            {user?.role === 'admin' && (
              <div>
                <button
                  onClick={() => setPagesMenuOpen(!pagesMenuOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isPageActive
                      ? 'bg-[#59a4b5] text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FileText size={20} />
                    <span className="font-medium">Pages</span>
                  </div>
                  {pagesMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {pagesMenuOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {pagesSubMenu.map((page) => {
                      const isActive = pathname === page.href;
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          className={`flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-[#59a4b5] text-white'
                              : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                          }`}
                        >
                          {page.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition-colors w-full"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.role === 'guest' ? 'Guest Dashboard' : 
               user?.role === 'staff' ? 'Staff Dashboard' : 
               'Admin Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
