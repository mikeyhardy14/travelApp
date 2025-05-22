// app/layout.tsx
"use client";

import './globals.css';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { useRouter, usePathname } from 'next/navigation';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppDomain, setIsAppDomain] = useState(false);

  // Paths that don't require redirection (login, signup, etc.)
  const authExemptPaths = ['/account/login', '/account/signup', '/about', '/contact'];

  useEffect(() => {
    // Check if on app subdomain
    const hostname = window.location.hostname;
    setIsAppDomain(hostname.startsWith('app.'));

    // Check authentication status
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setIsLoading(false);

    // If logged in and not on exempt path, redirect to app subdomain
    if (token && !authExemptPaths.includes(pathname || '') && !pathname?.startsWith('/app/')) {
      window.location.href = 'http://app.localhost:3000';
    }
  }, [pathname]);

  if (isLoading) {
    return (
      <html lang="en">
        <body>
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={isAppDomain ? "h-screen overflow-hidden" : "min-h-screen"}>
        <Header />
        <main className={isAppDomain ? "h-full" : "flex-grow"}>
          {children}
        </main>
        {!isAppDomain && <Footer />}
      </body>
    </html>
  );
};

export default RootLayout;
