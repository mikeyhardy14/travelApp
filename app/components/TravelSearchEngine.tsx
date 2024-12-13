"use client";

import React, { useState } from 'react';
import styles from './TravelSearchEngine.module.css';

interface Result {
  mode: string;
  duration: string;
  cost: string;
  bookingUrl?: string;
  routeDescription: string;
}

interface TravelSearchEngineProps {
  // In a full integration, this would be passed from a parent component
  // that manages formData. For demonstration, we keep it self-contained.
}

const MODES = [
  { key: 'flight', label: 'Flights', icon: '✈️' },
  { key: 'train', label: 'Trains', icon: '🚆' },
  { key: 'bus', label: 'Buses', icon: '🚌' },
  { key: 'car', label: 'Car', icon: '🚗' },
  { key: 'rideshare', label: 'Rideshare', icon: '🚕' } // Added rideshare option
];

const TravelSearchEngine: React.FC<TravelSearchEngineProps> = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [results, setResults] = useState<{ [key: string]: Result[] }>({});
  const [showMap, setShowMap] = useState(false);

  const handleSearch = () => {
    // Mock data showing multiple transportation options (NYC -> Boston)
    const trainResults: Result[] = [
      { mode: 'train', duration: '3h 45m', cost: '$70', bookingUrl: 'https://trains.example.com', routeDescription: `${startLocation} → ${endLocation}` },
      { mode: 'train', duration: '4h 10m', cost: '$60', bookingUrl: 'https://trains.example.com', routeDescription: `${startLocation} → ${endLocation}` }
    ];

    const busResults: Result[] = [
      { mode: 'bus', duration: '4h 20m', cost: '$25', bookingUrl: 'https://buses.example.com', routeDescription: `${startLocation} → ${endLocation}` },
      { mode: 'bus', duration: '4h 45m', cost: '$20', bookingUrl: 'https://buses.example.com', routeDescription: `${startLocation} → ${endLocation}` }
    ];

    const flightResults: Result[] = [
      { mode: 'flight', duration: '1h 20m', cost: '$120', bookingUrl: 'https://flights.example.com', routeDescription: `${startLocation} → ${endLocation}` }
    ];

    const carResults: Result[] = [
      { mode: 'car', duration: '3h 30m', cost: 'Tolls: ~$20', routeDescription: `${startLocation} → ${endLocation}` }
    ];

    const rideshareResults: Result[] = [
      { mode: 'rideshare', duration: '3h 45m', cost: 'Uber ~$150', bookingUrl: 'https://uber.example.com', routeDescription: `${startLocation} → ${endLocation}` },
      { mode: 'rideshare', duration: '3h 45m', cost: 'Lyft ~$140', bookingUrl: 'https://lyft.example.com', routeDescription: `${startLocation} → ${endLocation}` }
    ];

    // Combine all results into an object keyed by mode
    const combinedResults: { [key: string]: Result[] } = {
      flight: flightResults,
      train: trainResults,
      bus: busResults,
      car: carResults,
      rideshare: rideshareResults
    };

    setResults(combinedResults);
    setShowMap(true);
  };

  const allModes = Object.keys(results);

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Start (e.g., New York City)"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Destination (e.g., Boston)"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
        />
        <button className={styles.searchButton} onClick={handleSearch} disabled={!startLocation || !endLocation}>
          Search
        </button>
      </div>

      {allModes.length > 0 && (
        <div className={styles.results}>
          {allModes.map(modeKey => {
            const modeData = MODES.find(m => m.key === modeKey);
            const modeResults = results[modeKey];
            if (!modeData || !modeResults) return null;

            return (
              <div key={modeKey} className={styles.modeSection}>
                <h3><span className={styles.modeIcon}>{modeData.icon}</span> {modeData.label}</h3>
                <ul className={styles.resultList}>
                  {modeResults.map((r, i) => (
                    <li key={i} className={styles.resultItem}>
                      <div><strong>Route:</strong> {r.routeDescription}</div>
                      <div><strong>Duration:</strong> {r.duration}</div>
                      <div><strong>Cost:</strong> {r.cost}</div>
                      {r.bookingUrl && (
                        <a href={r.bookingUrl} target="_blank" rel="noopener noreferrer" className={styles.bookingLink}>
                          Book Now
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {showMap && (
        <div className={styles.mapContainer}>
          {/* Placeholder: In a real app, integrate a real map component */}
          <div className={styles.mapPlaceholder}>
            <p>Interactive Map Showing {startLocation} to {endLocation} Routes</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelSearchEngine;
