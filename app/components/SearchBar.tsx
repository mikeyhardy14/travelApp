"use client"
import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const SearchBar: React.FC = () => {
  const [startingLocation, setStartingLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const handleSearch = () => {
    console.log({
      startingLocation,
      destination,
      departure: departure ? format(departure, 'EEE, MMM d') : null,
      returnDate: returnDate ? format(returnDate, 'EEE, MMM d') : null,
    });
    // Add your search logic here
  };

  return (
    <div className={styles.searchBarContainer}>
      <div className={`${styles.inputGroup} ${styles.wideInputGroup}`}>
        <input
          type="text"
          placeholder="Starting Location"
          value={startingLocation}
          onChange={(e) => setStartingLocation(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.separator}></div>
      <div className={`${styles.inputGroup} ${styles.wideInputGroup}`}>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.separator}></div>
      <div className={styles.inputGroup}>
        <DatePicker
          selected={departure}
          onChange={(date: Date | null) => setDeparture(date)}
          placeholderText="Departure"
          className={styles.datePickerInput}
          dateFormat="EEE, MMM d"
          popperPlacement="bottom-start" /* Ensure the calendar drops below */
        />
      </div>
      <div className={styles.separator}></div>
      <div className={styles.inputGroup}>
        <DatePicker
          selected={returnDate}
          onChange={(date: Date | null) => setReturnDate(date)}
          placeholderText="Return"
          className={styles.datePickerInput}
          dateFormat="EEE, MMM d"
          popperPlacement="bottom-start" /* Ensure the calendar drops below */
        />
      </div>
      <button onClick={handleSearch} className={styles.searchButton}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
