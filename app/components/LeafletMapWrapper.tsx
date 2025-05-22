"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet (no SSR)
const DynamicMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

interface MapWrapperProps {
  locations: any[];
  currentDay: string;
  currentTime: string;
  activitiesForCurrentDay: any[];
  filteredParticipants?: string[];
}

const LeafletMapWrapper: React.FC<MapWrapperProps> = ({ 
  locations, 
  currentDay, 
  currentTime,
  activitiesForCurrentDay,
  filteredParticipants = []
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DynamicMap
      locations={locations}
      currentDay={currentDay}
      currentTime={currentTime}
      activitiesForCurrentDay={activitiesForCurrentDay}
      filteredParticipants={filteredParticipants}
    />
  );
};

export default LeafletMapWrapper; 