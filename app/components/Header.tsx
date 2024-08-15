"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUserCircle, FaHome, FaWpexplorer, FaInfoCircle, FaServicestack, FaPhone, FaFacebookMessenger } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    // Close the menu whenever the route changes
    setIsOpen(false);
  }, [pathname]); // Runs when the path changes

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/account/login');
  };

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 bg-white text-gray-800 flex items-center justify-between p-4 shadow-md z-50">
        <div className="flex items-center">
          <button
            className="text-2xl mr-4 text-gray-600"
            onClick={toggleMenu}
          >
            <GiHamburgerMenu />
          </button>
          <div className="text-2xl font-bold text-orange-500">TravelApp</div>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/account/profile" className="text-md text-gray-600">
                Profile
              </Link>
              <Link href="/chat" className="text-md text-gray-600">
                Messenger
              </Link>
              <button onClick={handleSignOut} className="text-md text-gray-600">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/account/login" className="text-md text-gray-600">
                Login
              </Link>
              <Link href="/account/signup" className="text-md text-gray-600">
                Signup
              </Link>
            </>
          )}
        </div>
      </header>

      <nav
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-40'
        } z-40 flex flex-col items-center w-52`} // Update the width to 52
      >
        <div className="p-4 flex justify-between items-center w-full">
          <button
            className="text-2xl text-gray-600"
            onClick={toggleMenu}
          >
            &times;
          </button>
        </div>
        <div className="flex-1 flex flex-col mt-4 w-full">
          <Link href="/" className="flex items-center justify-between p-2 text-md w-full">
            <span className={`${isOpen ? 'inline' : 'hidden'} md:inline`}>Home</span>
            <FaHome className="text-gray-600 ml-2" />
          </Link>
          <Link href="/about" className="flex items-center justify-between p-2 text-md w-full">
            <span className={`${isOpen ? 'inline' : 'hidden'} md:inline`}>About</span>
            <FaInfoCircle className="text-gray-600 ml-2" />
          </Link>
          <Link href="/services" className="flex items-center justify-between p-2 text-md w-full">
            <span className={`${isOpen ? 'inline' : 'hidden'} md:inline`}>Services</span>
            <FaServicestack className="text-gray-600 ml-2" />
          </Link>
          <Link href="/contact" className="flex items-center justify-between p-2 text-md w-full">
            <span className={`${isOpen ? 'inline' : 'hidden'} md:inline`}>Contact</span>
            <FaPhone className="text-gray-600 ml-2" />
          </Link>
          <Link href="/chat" className="flex items-center justify-between p-2 text-md w-full">
            <span className={`${isOpen ? 'inline' : 'hidden'} md:inline`}>Chat</span>
            <FaFacebookMessenger className="text-gray-600 ml-2" />
          </Link>
          <Link href="/explore" className="flex items-center justify-between p-2 text-md w-full">
            <span className={`${isOpen ? 'inline' : 'hidden'} md:inline`}>Explore</span>
            <FaWpexplorer className="text-gray-600 ml-2" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Header;
