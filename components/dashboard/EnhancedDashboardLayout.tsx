'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
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
  User,
  Bell,
  Search
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const EnhancedDashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
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
    { name: 'Booking Settings', href: '/dashboard/admin/booking-settings' },
    { name: 'Site Settings', href: '/dashboard/admin/site-settings' },
  ];

  const navItems = 
    user?.role === 'guest' ? guestNavItems :
    user?.role === 'staff' ? staffNavItems :
    adminNavItems;

  const isPageActive = pagesSubMenu.some(page => pathname === page.href);

  // Animation variants
  const sidebarVariants = {
    open: { width: 288 },
    closed: { width: 80 }
  };

  const contentVariants = {
    open: { marginLeft: 288 },
    closed: { marginLeft: 80 }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const submenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-2xl"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <motion.div 
            className={`flex items-center px-6 py-5 border-b border-white/10 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}
            layout
          >
            <AnimatePresence mode="wait">
              {sidebarOpen ? (
                <motion.div
                  key="logo-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between w-full"
                >
                  <Link href="/" className="flex flex-col leading-none group">
                    <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#59a4b5] transition-colors">
                      HOTEL
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.4em] text-white/70 ml-1">
                      BEACH
                    </span>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarOpen(false)}
                    className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                  >
                    <X size={20} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  key="menu-icon"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSidebarOpen(true)}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                >
                  <Menu size={20} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* User Info */}
          <motion.div 
            className={`px-6 py-5 border-b border-white/10 ${!sidebarOpen && 'px-3'}`}
            layout
          >
            <AnimatePresence mode="wait">
              {sidebarOpen ? (
                <motion.div
                  key="user-full"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-3 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div 
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#59a4b5] to-[#4a8a99] flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                    <p className="text-white/60 text-xs capitalize flex items-center gap-1">
                      <motion.span 
                        className="w-1.5 h-1.5 rounded-full bg-green-400"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      {user?.role}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="user-compact"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center"
                >
                  <motion.div 
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#59a4b5] to-[#4a8a99] flex items-center justify-center text-white font-bold text-lg shadow-lg cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-bold tracking-widest text-white/40 px-3 mb-3 uppercase"
                >
                  Main Menu
                </motion.div>
              )}
            </AnimatePresence>
            
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                >
                  <Link
                    href={item.href}
                    title={!sidebarOpen ? item.name : ''}
                  >
                    <motion.div
                      className={`flex items-center rounded-xl transition-all group relative ${
                        sidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center py-3'
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-[#59a4b5] to-[#4a8a99] text-white shadow-lg shadow-[#59a4b5]/20'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isActive && sidebarOpen && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <motion.div
                        whileHover={{ rotate: isActive ? 0 : 15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon size={20} />
                      </motion.div>
                      <AnimatePresence>
                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium text-sm"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Pages Menu (Admin Only) */}
            {user?.role === 'admin' && (
              <motion.div 
                className="pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] font-bold tracking-widest text-white/40 px-3 mb-3 uppercase"
                    >
                      Content
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button
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
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : ''}`}>
                    <motion.div whileHover={{ rotate: 15 }}>
                      <FileText size={20} />
                    </motion.div>
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="font-medium text-sm"
                        >
                          Pages
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.div
                        animate={{ rotate: pagesMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
                
                <AnimatePresence>
                  {pagesMenuOpen && sidebarOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={submenuVariants}
                      className="ml-3 mt-2 space-y-1 border-l-2 border-white/10 pl-3 overflow-hidden"
                    >
                      {pagesSubMenu.map((page, index) => {
                        const isActive = pathname === page.href;
                        return (
                          <motion.div
                            key={page.href}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link href={page.href}>
                              <motion.div
                                className={`flex items-center px-4 py-2.5 rounded-lg text-sm transition-all ${
                                  isActive
                                    ? 'bg-[#59a4b5]/20 text-white font-medium border-l-2 border-[#59a4b5] -ml-[14px] pl-[18px]'
                                    : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                                }`}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {page.name}
                              </motion.div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </nav>

          {/* Logout */}
          <motion.div 
            className="p-4 border-t border-white/10"
            layout
          >
            <motion.button
              onClick={handleLogout}
              title={!sidebarOpen ? 'Logout' : ''}
              className={`flex items-center rounded-xl text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all w-full group ${
                sidebarOpen ? 'space-x-3 px-4 py-3' : 'justify-center py-3'
              }`}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div whileHover={{ rotate: 15 }}>
                <LogOut size={20} />
              </motion.div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium text-sm"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.div
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={contentVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Top Bar */}
        <motion.header 
          className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-30 shadow-sm"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {user?.role === 'guest' ? 'Guest Dashboard' : 
                 user?.role === 'staff' ? 'Staff Dashboard' : 
                 'Admin Dashboard'}
              </h1>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell size={20} className="text-gray-600" />
                <motion.span 
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.button>
              <span className="text-sm text-gray-600 hidden sm:block bg-gray-100 px-4 py-2 rounded-lg">
                {user?.email}
              </span>
            </motion.div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="p-6 min-h-[calc(100vh-73px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
};

export default EnhancedDashboardLayout;
