"use client"; // Add this directive at the top

import React, { useEffect, useState } from 'react';
import Itinerary from '../components/Itinerary';
import styles from './Explore.module.css';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface Comment {
  text: string;
}

interface ItineraryType {
  id: string;
  title: string;
  profile: {
    name: string;
    avatarUrl: string;
  };
  flights: string[];
  accommodations: string;
  restaurants: string[];
  activities: string[];
  media: MediaItem[];
  likes: number;
  comments: Comment[];
}

const ExplorePage: React.FC = () => {
  const [exploreData, setExploreData] = useState<ItineraryType[]>([]);

  useEffect(() => {
    const fetchExploreData = async () => {
      const response = await fetch('/api/itineraries');
      const data = await response.json();
      setExploreData(data.itineraries);
    };

    fetchExploreData();
  }, []);

  return (
    <div className={styles.exploreContainer}>
      <h1>Explore Travel Itineraries</h1>
      {exploreData.map((item) => (
        <Itinerary key={item.id} itinerary={item} />
      ))}
    </div>
  );
};

export default ExplorePage;
