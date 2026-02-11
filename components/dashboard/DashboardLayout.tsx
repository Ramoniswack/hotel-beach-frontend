'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import PageTransition from '@/components/PageTransition';
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
  ChevronRight,
  User
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
    { name: 'Profile', href: '/dashboard/guest/profile', icon: User },
    { name: 'Browse Rooms', href: '/rooms', icon: Hotel },
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
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-[#0f172a] to-[#1e293b] shadow-2xl transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center px-6 py-5 border-b border-white/10 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {sidebarOpen ? (
              <>
                <Link href="/" className="flex flex-col leading-none group">
                  <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#59a4b5] transition-colors">
                    HOTEL
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.4em] text-white/70 ml-1">
                    BEACH
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <Menu size={20} />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className={`px-6 py-5 border-b border-white/10 ${!sidebarOpen && 'px-3'}`}>
            {sidebarOpen ? (
              <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#59a4b5] to-[#4a8a99] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                  <p className="text-white/60 text-xs capitalize flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    {user?.role}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#59a4b5] to-[#4a8a99] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            {sidebarOpen && (
              <div className="text-[10px] font-bold tracking-widest text-white/40 px-3 mb-3 uppercase">
                Main Menu
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!sidebarOpen ? item.name : ''}
                  className={`flex items-center rounded-xl transition-all group relative ${
                    sidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center py-3'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-[#59a4b5] to-[#4a8a99] text-white shadow-lg shadow-[#59a4b5]/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isActive && sidebarOpen && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                  <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                  {sidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                </Link>
              );
            })}

            {/* Pages Menu (Admin Only) */}
            {user?.role === 'admin' && (
              <div className="pt-4">
                {sidebarOpen && (
                  <div className="text-[10px] font-bold tracking-widest text-white/40 px-3 mb-3 uppercase">
                    Content
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (sidebarOpen) {
                      setPagesMenuOpen(!pagesMenuOpen);
                    }
                  }}
                  title={!sidebarOpen ? 'Pages' : ''}
                  className={`w-full flex items-center rounded-xl transition-all group ${
                    sidebarOpen ? 'justify-between px-4 py-3' : 'justify-center py-3'
                  } ${
                    isPageActive
                      ? 'bg-gradient-to-r from-[#59a4b5] to-[#4a8a99] text-white shadow-lg shadow-[#59a4b5]/20'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : ''}`}>
                    <FileText size={20} className={isPageActive ? '' : 'group-hover:scale-110 transition-transform'} />
                    {sidebarOpen && <span className="font-medium text-sm">Pages</span>}
                  </div>
                  {sidebarOpen && (
                    <div className={`transition-transform duration-200 ${pagesMenuOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown size={16} />
                    </div>
                  )}
                </button>
                
                {pagesMenuOpen && sidebarOpen && (
                  <div className="ml-3 mt-2 space-y-1 border-l-2 border-white/10 pl-3">
                    {pagesSubMenu.map((page) => {
                      const isActive = pathname === page.href;
                      return (
                        <Link
                          key={page.href}
                          href={page.href}
                          className={`flex items-center px-4 py-2.5 rounded-lg text-sm transition-all ${
                            isActive
                              ? 'bg-[#59a4b5]/20 text-white font-medium border-l-2 border-[#59a4b5] -ml-[14px] pl-[18px]'
                              : 'text-white/60 hover:bg-white/5 hover:text-white/90'
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
              title={!sidebarOpen ? 'Logout' : ''}
              className={`flex items-center rounded-xl text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all w-full group ${
                sidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center py-3'
              }`}
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.role === 'guest' ? 'Guest Dashboard' : 
                 user?.role === 'staff' ? 'Staff Dashboard' : 
                 'Admin Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block bg-gray-100 px-4 py-2 rounded-lg">
                {user?.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-gray-50 min-h-[calc(100vh-73px)]">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
