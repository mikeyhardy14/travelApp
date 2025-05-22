"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppIndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to dashboard without the /app prefix
    router.replace('/dashboard');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
} 