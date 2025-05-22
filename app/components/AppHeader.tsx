"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUserCircle, FaBell, FaInfoCircle, FaSearch, FaSignOutAlt, FaTachometerAlt, FaCompass, FaMap, FaCommentAlt, FaCog } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

const AppHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items for the sidebar
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt },
    { name: 'Explore', path: '/explore', icon: FaCompass },
    { name: 'My Trips', path: '/trips', icon: FaMap },
    { name: 'Messages', path: '/chat', icon: FaCommentAlt },
    { name: 'Settings', path: '/settings', icon: FaCog },
  ];

  useEffect(() => {
    // Close the menu whenever the route changes
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    // Store in localStorage to share state with other components
    localStorage.setItem('appSidebarOpen', String(newState));
    // Trigger storage event for other components to detect
    window.dispatchEvent(new Event('storage'));
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/account/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for search functionality
    console.log(`Searching for: ${searchQuery}`);
    // You can implement actual search routing here
  };

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 bg-white text-gray-800 shadow-md z-40 h-[57px]">
        <div className="container mx-auto flex items-center justify-between h-full px-4 md:px-6">
          {/* App Logo & Sidebar Toggle */}
          <div className="flex items-center">
            {/* Sidebar Toggle Button - visible on all screens */}
            <button 
              onClick={toggleSidebar}
              className="mr-3 p-2 rounded-md hover:bg-gray-100 transition"
              aria-label="Toggle Sidebar"
            >
              <GiHamburgerMenu className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* App Logo */}
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600 flex items-center hover:text-blue-700 transition">
              TravelApp
            </Link>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-6 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search trips, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                <FaSearch />
              </button>
            </div>
          </form>

          {/* App Navigation */}
          <nav className="flex items-center space-x-5">
            {/* Notifications - visible on all screens */}
            <button className="relative p-2 text-gray-600 hover:text-blue-500 transition rounded-full hover:bg-gray-100">
              <FaBell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* Information - hidden on mobile */}
            <Link 
              href="/information" 
              className="hidden sm:block p-2 text-gray-600 hover:text-blue-500 transition rounded-full hover:bg-gray-100"
            >
              <FaInfoCircle className="h-5 w-5" />
            </Link>
            
            {/* User Profile - compressed on mobile */}
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition">
                <FaUserCircle className="h-6 w-6" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 invisible group-hover:visible">
                <div className="py-2">
                  <Link 
                    href="/account/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={handleSignOut} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <FaSignOutAlt className="h-4 w-4" />
                      <span>Sign out</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden text-2xl text-gray-600 hover:text-blue-500 transition"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <GiHamburgerMenu />
            </button>
          </nav>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
        
        {/* Mobile menu */}
        <div 
          className={`sm:hidden bg-white overflow-hidden transition-all duration-300 shadow-inner ${
            isOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col p-4 space-y-3">
            <Link 
              href="/account/profile"
              className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-100"
            >
              <FaUserCircle className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link 
              href="/information"
              className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-100"
            >
              <FaInfoCircle className="h-5 w-5" />
              <span>Information</span>
            </Link>
            <Link 
              href="/settings"
              className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-100"
            >
              <FaInfoCircle className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-100 w-full text-left"
            >
              <FaSignOutAlt className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      </header>
      
      {/* Left Sidebar Navigation */}
      <div className={`fixed top-[57px] left-0 h-[calc(100vh-57px)] bg-white w-64 shadow-md z-30 transition-all duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 h-full overflow-y-auto">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  pathname === item.path 
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Content padding spacer */}
      <div className="h-[57px]"></div>
    </>
  );
};

export default AppHeader; 