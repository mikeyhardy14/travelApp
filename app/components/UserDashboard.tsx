// app/userDashboard/UserDashboard.tsx
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Map from '../components/Map';
import Card from '../components/Card';
import styles from './UserDashboard.module.css'; // Import the CSS module

const mockTrips = [
  {
    id: 'trip1',
    title: 'Summer Vacation 2024',
    destination: 'Paris, France',
    dates: {
      start: '2024-06-01',
      end: '2024-06-15',
    },
    locations: [
      { lat: 48.8566, lng: 2.3522, label: 'Eiffel Tower' },
      { lat: 48.8606, lng: 2.3376, label: 'Louvre Museum' },
    ],
  },
  {
    id: 'trip2',
    title: 'Winter Getaway 2024',
    destination: 'Zurich, Switzerland',
    dates: {
      start: '2024-12-20',
      end: '2024-12-30',
    },
    locations: [
      { lat: 47.3769, lng: 8.5417, label: 'Lake Zurich' },
      { lat: 47.3667, lng: 8.55, label: 'Old Town' },
    ],
  },
  // Add more mock trips as needed
];

const mockMessages = [
  { id: 'msg1', user: 'Alice', content: 'Looking forward to our trip!' },
  { id: 'msg2', user: 'Bob', content: "Don't forget to pack warm clothes." },
  // Add more mock messages
];

const mockNotifications = [
  { id: 'notif1', message: 'Bob voted for Louvre Museum.' },
  { id: 'notif2', message: 'Alice added a new location to the trip.' },
  // Add more mock notifications
];

const UserDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/account/login');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.sectionHeader}>My Dashboard</h1>
      
      {/* My Trips Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>My Trips</h2>
          <button className={`${styles.actionButton} ${styles['button--primary']}`}>Add Trip</button>
        </div>
        <div className={styles.tripsGrid}>
          {mockTrips.map((trip) => (
            <Card
              key={trip.id}
              title={trip.title}
              description={`${trip.destination} from ${trip.dates.start} to ${trip.dates.end}`}
              href={`/trips/${trip.id}`}
            />
          ))}
        </div>
      </section>
      
      {/* Messages Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Messages</h2>
          <button className={`${styles.actionButton} ${styles['button--secondary']}`}>View All</button>
        </div>
        <div className={`${styles.scrollableContainer} ${styles.messagesContainer}`}>
          {mockMessages.length > 0 ? (
            mockMessages.map((msg) => (
              <div key={msg.id} className={styles.message}>
                <p className={styles.username}>{msg.user}:</p>
                <p className={styles.content}>{msg.content}</p>
              </div>
            ))
          ) : (
            <p className={styles.noContent}>No messages yet.</p>
          )}
        </div>
      </section>
      
      {/* Notifications Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Notifications</h2>
          <button className={`${styles.actionButton} ${styles['button--secondary']}`}>Clear All</button>
        </div>
        <div className={`${styles.scrollableContainer} ${styles.notificationsContainer}`}>
          {mockNotifications.length > 0 ? (
            mockNotifications.map((notif) => (
              <div key={notif.id} className={styles.notification}>
                <p>{notif.message}</p>
              </div>
            ))
          ) : (
            <p className={styles.noContent}>No notifications.</p>
          )}
        </div>
      </section>
      
      {/* Settings Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Settings</h2>
          <button className={`${styles.actionButton} ${styles['button--primary']}`}>Edit Profile</button>
        </div>
        <div className={styles.settingsContainer}>
          <p>User settings will be available here.</p>
          {/* Future settings components can be added here */}
        </div>
      </section>
      
      {/* Your Trips on Map Section */}
      <section>
        <h2 className={styles.sectionHeader}>Your Trips on Map</h2>
        <div className={styles.mapsSection}>
          {mockTrips.map((trip) => (
            <div key={trip.id} className={styles.mapsSection}>
              <h3>{trip.title}</h3>
              <div className={styles.mapContainer}>
                <Map locations={trip.locations} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
