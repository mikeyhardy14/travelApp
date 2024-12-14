"use client";

import React, { useState } from 'react';
import styles from './UserDashboard.module.css';
import UserProfile from './UserProfile'; // Ensure this path matches where UserProfile is located
import CreatePage from './CreatePage';   // Ensure this path matches where CreatePage is located

interface User {
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  homeLocation?: string;
}

const UserDashboard: React.FC = () => {
  // Mock user data; in a real app, fetch from API or auth provider
  const [user, setUser] = useState<User>({
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatarUrl: 'https://example.com/avatar.jpg',
    bio: 'World traveler, coffee enthusiast.',
    homeLocation: 'New York City'
  });

  const handleUserSave = (updatedUser: User) => {
    // Here you would call an API to save the user’s profile changes
    console.log('Saving user changes to backend...', updatedUser);
    setUser(updatedUser);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <UserProfile user={user} onSave={handleUserSave} />
      </div>
      <div className={styles.mainContent}>
        <CreatePage />
      </div>
    </div>
  );
};

export default UserDashboard;