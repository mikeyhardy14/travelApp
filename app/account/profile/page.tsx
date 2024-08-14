// app/account/profile/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for app directory
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter(); // Use next/navigation for app directory

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/account/login');
        return;
      }

      try {
        const res = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          router.push('/account/login');
        }
      } catch (error) {
        router.push('/account/login');
      }
    };

    fetchUser();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/account/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        {user.profilePicture && (
          <img src={user.profilePicture} alt="Profile" className="mb-4 w-32 h-32 rounded-full mx-auto" />
        )}
        <h2 className="text-xl font-bold mb-4">{user.name}</h2>
        <p className="text-gray-700 mb-4">{user.email}</p>
        <p className="text-gray-700 mb-4">{user.description}</p>
        <button 
          onClick={handleSignOut} 
          className="w-full bg-red-500 text-white p-2 rounded mt-4"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
