"use client";

import React, { useState } from 'react';
import styles from './UserDashboard.module.css';
import UserProfile from './UserProfile';
import CreatePage from './CreatePage';
import MyTrips from './MyTrips';
import TripPage from './TripPage';

interface User {
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  homeLocation?: string;
}

interface Trip {
  id: string;
  name: string;
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

  // Mock trips data
  const [trips] = useState<Trip[]>([
    { id: 'trip1', name: 'NYC to Boston Weekend' },
    { id: 'trip2', name: 'San Francisco Adventure' },
  ]);

  const [showMyTrips, setShowMyTrips] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const handleUserSave = (updatedUser: User) => {
    console.log('Saving user changes to backend...', updatedUser);
    setUser(updatedUser);
  };

  const handleSelectTrip = (tripId: string) => {
    setSelectedTripId(tripId);
    setShowMyTrips(false);
  };

  const selectedTrip = trips.find(t => t.id === selectedTripId);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <UserProfile user={user} onSave={handleUserSave} />
        <hr style={{ margin: '20px 0' }} />
        <button
          style={{
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left'
          }}
          onClick={() => { 
            setShowMyTrips(true); 
            setSelectedTripId(null); 
          }}
        >
          My Trips
        </button>
      </div>
      <div className={styles.mainContent}>
        {selectedTripId && selectedTrip ? (
          <TripPage tripName={selectedTrip.name} />
        ) : showMyTrips ? (
          <MyTrips trips={trips} onSelectTrip={handleSelectTrip} />
        ) : (
          <CreatePage />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;