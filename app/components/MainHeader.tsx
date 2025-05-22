"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaInfoCircle, FaServicestack, FaPhone, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

const MainHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Close the menu whenever the route changes
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Navigation items for the center menu
  const navItems = [
    { name: 'About', path: '/about', icon: FaInfoCircle },
    { name: 'Services', path: '/services', icon: FaServicestack },
    { name: 'Contact', path: '/contact', icon: FaPhone },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white text-gray-800 shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        {/* Logo */}
        <div>
          <Link href="/" className="text-2xl font-bold text-orange-500 flex items-center hover:text-orange-600 transition">
            TravelApp
          </Link>
        </div>
        
        {/* Center navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path} 
              className={`text-gray-600 hover:text-orange-500 transition-all duration-200 flex items-center gap-1.5 py-1 px-2 rounded-md ${
                pathname === item.path ? 'text-orange-500 font-medium bg-orange-50' : ''
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Authentication buttons */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/account/login" 
            className="flex items-center gap-1.5 text-gray-600 hover:text-orange-500 transition py-1 px-3"
          >
            <FaSignInAlt className="h-4 w-4" />
            <span className="hidden sm:inline">Login</span>
          </Link>
          <Link 
            href="/account/signup" 
            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition shadow-sm flex items-center gap-1.5"
          >
            <FaUserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Up</span>
          </Link>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-2xl text-gray-600 hover:text-orange-500 transition"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      <div 
        className={`md:hidden bg-white overflow-hidden transition-all duration-300 shadow-inner ${
          isOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-3">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path} 
              className={`text-gray-600 hover:text-orange-500 transition flex items-center gap-2 py-2 px-3 rounded-md ${
                pathname === item.path ? 'text-orange-500 font-medium bg-orange-50' : ''
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default MainHeader; 