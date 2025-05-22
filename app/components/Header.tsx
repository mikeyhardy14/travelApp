"use client";

import React, { useState, useEffect } from 'react';
import MainHeader from './MainHeader';
import AppHeader from './AppHeader';

const Header: React.FC = () => {
  // Initialize with null to avoid rendering anything during server-side rendering
  const [headerType, setHeaderType] = useState<'app' | 'main' | null>(null);

  useEffect(() => {
    // Only run on client-side
    const hostname = window.location.hostname;
    setHeaderType(hostname.startsWith('app.') ? 'app' : 'main');
  }, []);

  // Don't render anything during server-side rendering
  if (headerType === null) {
    return null;
  }

  // Use headerType to conditionally render the appropriate header once client-side
  return <div className="z-0">{headerType === 'app' ? <AppHeader /> : <MainHeader />}</div>;
};

export default Header;
