"use client"; 

import React, { useEffect, useState } from 'react';
import Itinerary from '../../components/Itinerary';

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

export default function ExplorePage() {
  const [exploreData, setExploreData] = useState<ItineraryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/itineraries');
        const data = await response.json();
        setExploreData(data.itineraries);
      } catch (error) {
        console.error('Error fetching itineraries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExploreData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Travel Itineraries</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : exploreData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No itineraries found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {exploreData.map((item) => (
            <Itinerary key={item.id} itinerary={item} />
          ))}
        </div>
      )}
    </div>
  );
} 