"use client";

import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile'; // assume this is created as per previous example
import CreatePage from './CreatePage';   // assume this is the itinerary creation page

interface User {
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  homeLocation?: string;
}

const UserDashboard: React.FC = () => {
  // In a real scenario, you would fetch the user data from an API or authentication
  // For demonstration, we set a default user
  const [user, setUser] = useState<User>({
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatarUrl: 'https://example.com/avatar.jpg',
    bio: 'World traveler, coffee enthusiast.',
    homeLocation: 'New York City'
  });

  const handleUserSave = (updatedUser: User) => {
    // Here you could call an API to persist user changes
    console.log('Saving user changes to backend...', updatedUser);
    setUser(updatedUser);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', padding: '20px', gap: '20px' }}>
      <div style={{ width: '300px', flexShrink: 0 }}>
        <UserProfile user={user} onSave={handleUserSave} />
      </div>
      <div style={{ flex: 1 }}>
        <CreatePage />
      </div>
    </div>
  );
};

export default UserDashboard;