"use client";

import React, { useState, useEffect } from 'react';
import '../globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaColumns, FaComments, FaCompass, FaBars, FaTimes, FaHome, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Redirect root path to dashboard
  useEffect(() => {
    // Only redirect if exactly at the root path
    if (pathname === '/') {
      router.replace('/dashboard');
    }
  }, [pathname, router]);
  
  // Determine which tab is active
  const isActive = (path: string) => {
    const normalizedPath = pathname?.replace('/app', '') || '';
    return normalizedPath === path || normalizedPath.startsWith(path + '/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        {/* App header bar */}
        <header className="bg-gray-800 text-white p-2 sticky top-0 z-50 flex items-center justify-between shadow-lg">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-700 mr-2 transition"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="text-xl font-bold text-orange-400">TravelApp</div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/account/profile" className="text-sm hover:text-orange-300 transition flex items-center gap-1">
              <FaUserCircle />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button 
              onClick={handleSignOut}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition text-sm flex items-center gap-1"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>
        
        <div className="flex flex-grow">
          {/* Side Navigation */}
          <nav className={`bg-gray-900 text-white w-64 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} fixed left-0 h-full top-10 pt-6 z-40 shadow-xl`}>
            <div className="flex flex-col space-y-1 px-3">
              <Link 
                href="/dashboard" 
                className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all ${isActive('/dashboard') ? 'bg-gray-700 text-orange-400 shadow-md' : 'text-gray-300'}`}
              >
                <FaHome className="text-lg" />
                <span className="font-medium">Home</span>
              </Link>
              <Link 
                href="/dashboard" 
                className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all ${isActive('/dashboard') ? 'bg-gray-700 text-orange-400 shadow-md' : 'text-gray-300'}`}
              >
                <FaColumns className="text-lg" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link 
                href="/chat" 
                className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all ${isActive('/chat') ? 'bg-gray-700 text-orange-400 shadow-md' : 'text-gray-300'}`}
              >
                <FaComments className="text-lg" />
                <span className="font-medium">Chat</span>
              </Link>
              <Link 
                href="/explore" 
                className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-all ${isActive('/explore') ? 'bg-gray-700 text-orange-400 shadow-md' : 'text-gray-300'}`}
              >
                <FaCompass className="text-lg" />
                <span className="font-medium">Explore</span>
              </Link>
            </div>
          </nav>
          
          {/* Main content */}
          <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <div className="p-6 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        
        {/* Footer */}
        <footer className={`bg-gray-800 text-white p-2 text-center text-sm transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <p>© {new Date().getFullYear()} TravelApp. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
} 