"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaClock, FaCompass, FaExpand, FaSearchMinus, FaSearchPlus } from 'react-icons/fa';

// Define custom icons
const DefaultIcon = new L.Icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const AccommodationIcon = new L.Icon({
  iconUrl: '/images/marker-icon.png', // Would be a custom accommodation icon in production
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'accommodation-icon', // Add custom CSS class for styling
});

const TransportationIcon = new L.Icon({
  iconUrl: '/images/marker-icon.png', // Would be a custom transportation icon in production
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'transportation-icon', // Add custom CSS class for styling
});

const EventIcon = new L.Icon({
  iconUrl: '/images/marker-icon.png', // Would be a custom event icon in production
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'event-icon', // Add custom CSS class for styling
});

const ActiveIcon = new L.Icon({
  iconUrl: '/images/marker-icon.png', // Would be a custom active icon in production
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [30, 45], // Slightly larger
  iconAnchor: [15, 45],
  popupAnchor: [1, -40],
  shadowSize: [41, 41],
  className: 'active-icon', // Add custom CSS class for styling
});

// Dynamic Map View component to handle map updates
const MapView = ({ locations, currentDay, currentTime, activitiesForCurrentDay, autoFollow }: any) => {
  const map = useMap();
  
  // Initial fit bounds to show all locations - only run once on mount
  useEffect(() => {
    if (locations && locations.length > 0) {
      // Calculate bounds to fit all locations
      const bounds = L.latLngBounds(locations.map((loc: any) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    // Empty dependency array means this runs once on mount
  }, []);
  
  // Only recenter map when current day changes if autoFollow is enabled
  useEffect(() => {
    // Skip if autoFollow is disabled
    if (!autoFollow) return;
    
    // When current day changes, recenter map if there are activities
    if (activitiesForCurrentDay && activitiesForCurrentDay.length > 0) {
      const currentActivities = activitiesForCurrentDay.filter((act: any) => {
        return (act.location && act.location.lat && act.location.lng) || 
               (act.activityType === 'transportation' && act.to && act.to.lat && act.to.lng);
      });
      
      if (currentActivities.length > 0) {
        // Get coordinates of first activity with location
        const activity = currentActivities[0];
        const location = activity.location || activity.to;
        
        // Fly to location with animation
        map.flyTo([location.lat, location.lng], 13, {
          duration: 1.5
        });
      }
    }
  }, [currentDay, activitiesForCurrentDay, map, autoFollow]);
  
  return null;
};

interface LeafletMapProps {
  locations: any[];
  currentDay: string;
  currentTime: string;
  activitiesForCurrentDay: any[];
  filteredParticipants?: string[];
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  locations, 
  currentDay,
  currentTime,
  activitiesForCurrentDay,
  filteredParticipants = []
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris
  const [mapZoom, setMapZoom] = useState(5);
  const [autoFollow, setAutoFollow] = useState(false); // Default to not auto-following
  const [map, setMap] = useState<L.Map | null>(null);
  
  // Fix Leaflet icon issues in Next.js
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconUrl: '/images/marker-icon.png',
      iconRetinaUrl: '/images/marker-icon-2x.png',
      shadowUrl: '/images/marker-shadow.png',
    });
  }, []);
  
  // Function to show the entire trip
  const showEntireTrip = () => {
    setAutoFollow(false);
    
    if (map && locations && locations.length > 0) {
      // Create bounds from all locations
      const bounds = L.latLngBounds(
        locations.map((loc) => [loc.lat, loc.lng])
      );
      
      // Fit the map to these bounds with some padding
      map.fitBounds(bounds, { 
        padding: [50, 50],
        animate: true,
        duration: 1.0
      });
    }
  };
  
  // Toggle the auto-follow feature
  const toggleAutoFollow = () => {
    setAutoFollow(!autoFollow);
  };
  
  // Get time-filtered markers
  const getTimeFilteredMarkers = () => {
    if (!currentDay || !activitiesForCurrentDay || !currentTime) return [];
    
    // Current time in minutes for easy comparison
    const [hours, minutes] = currentTime.split(':').map(Number);
    const currentTimeInMinutes = hours * 60 + (minutes || 0);
    
    return activitiesForCurrentDay
      .filter((activity: any) => {
        // Skip if all participants of this activity are filtered out
        if (activity.participants && filteredParticipants.length > 0) {
          const allParticipantsFiltered = activity.participants.every(
            (id: string) => filteredParticipants.includes(id)
          );
          if (allParticipantsFiltered) return false;
        }

        // Include all activities if they have no specific time
        if (!activity.startTime && !activity.departureTime) return true;
        
        // For activities with time ranges, check if current time falls within them
        if (activity.startTime && activity.endTime) {
          const [startHours, startMinutes] = activity.startTime.split(':').map(Number);
          const [endHours, endMinutes] = activity.endTime.split(':').map(Number);
          
          const startTimeInMinutes = startHours * 60 + (startMinutes || 0);
          const endTimeInMinutes = endHours * 60 + (endMinutes || 0);
          
          return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
        }
        
        // For transportation
        if (activity.departureTime && activity.arrivalTime) {
          const [departHours, departMinutes] = activity.departureTime.split(':').map(Number);
          const [arriveHours, arriveMinutes] = activity.arrivalTime.split(':').map(Number);
          
          const departTimeInMinutes = departHours * 60 + (departMinutes || 0);
          const arriveTimeInMinutes = arriveHours * 60 + (arriveMinutes || 0);
          
          return currentTimeInMinutes >= departTimeInMinutes && currentTimeInMinutes <= arriveTimeInMinutes;
        }
        
        return true;
      })
      .map((activity: any, index: number) => {
        let location = null;
        
        if (activity.location) {
          location = activity.location;
        } else if (activity.activityType === 'transportation') {
          // For transportation, calculate interpolated position based on time
          if (activity.departureTime && activity.arrivalTime && activity.from && activity.to) {
            const [departHours, departMinutes] = activity.departureTime.split(':').map(Number);
            const [arriveHours, arriveMinutes] = activity.arrivalTime.split(':').map(Number);
            
            const departTimeInMinutes = departHours * 60 + (departMinutes || 0);
            const arriveTimeInMinutes = arriveHours * 60 + (arriveMinutes || 0);
            
            // If travel hasn't started yet, use from location
            if (currentTimeInMinutes < departTimeInMinutes) {
              location = activity.from;
            } 
            // If travel has finished, use to location
            else if (currentTimeInMinutes > arriveTimeInMinutes) {
              location = activity.to;
            } 
            // Otherwise, calculate an intermediate point
            else {
              const totalTravelTime = arriveTimeInMinutes - departTimeInMinutes;
              if (totalTravelTime <= 0) {
                location = activity.to;
              } else {
                const travelProgress = (currentTimeInMinutes - departTimeInMinutes) / totalTravelTime;
                
                // Interpolate between from and to locations
                const lat = activity.from.lat + (activity.to.lat - activity.from.lat) * travelProgress;
                const lng = activity.from.lng + (activity.to.lng - activity.from.lng) * travelProgress;
                
                location = {
                  lat,
                  lng,
                  name: `${activity.from.name} to ${activity.to.name} (In Transit)`,
                  type: 'transportation'
                };
              }
            }
          } else {
            location = activity.to;
          }
        }
        
        if (!location) return null;
        
        // Add participant color information to the marker
        let participantColor = null;
        if (activity.participants && activity.participants.length > 0) {
          // Use the first non-filtered participant's color for simplicity
          const firstParticipantId = activity.participants.find(
            (id: string) => !filteredParticipants.includes(id)
          );
          if (firstParticipantId) {
            // This would come from the trip.participants in a real app
            // Here we're just hard-coding some example colors
            const colorMap: Record<string, string> = {
              "user1": "#4f46e5", // indigo
              "user2": "#10b981", // emerald
              "user3": "#ef4444"  // red
            };
            participantColor = colorMap[firstParticipantId];
          }
        }
        
        return {
          ...location,
          id: `marker-${index}`,
          activity,
          participantColor
        };
      })
      .filter(Boolean);
  };
  
  // Get current location markers based on time
  const getCurrentMarkers = () => {
    if (!currentDay || !activitiesForCurrentDay) return [];
    
    // Use time filtering if available
    if (currentTime) {
      return getTimeFilteredMarkers();
    }
    
    // If no time is specified, use a simplified version
    return activitiesForCurrentDay
      .filter((activity: any) => {
        // Skip if all participants of this activity are filtered out
        if (activity.participants && filteredParticipants.length > 0) {
          const allParticipantsFiltered = activity.participants.every(
            (id: string) => filteredParticipants.includes(id)
          );
          if (allParticipantsFiltered) return false;
        }
        return true;
      })
      .map((activity: any, index: number) => {
        let location = null;
        
        if (activity.location) {
          location = activity.location;
        } else if (activity.activityType === 'transportation') {
          location = activity.to;
        }
        
        if (!location) return null;
        
        // Add participant color
        let participantColor = null;
        if (activity.participants && activity.participants.length > 0) {
          const firstParticipantId = activity.participants.find(
            (id: string) => !filteredParticipants.includes(id)
          );
          if (firstParticipantId) {
            const colorMap: Record<string, string> = {
              "user1": "#4f46e5",
              "user2": "#10b981",
              "user3": "#ef4444"
            };
            participantColor = colorMap[firstParticipantId];
          }
        }
        
        return {
          ...location,
          id: `marker-${index}`,
          activity,
          participantColor
        };
      })
      .filter(Boolean);
  };
  
  const currentMarkers = getCurrentMarkers();
  
  // Get current transportation activity for highlighting the route
  const getCurrentTransportation = () => {
    if (!currentDay || !currentTime || !activitiesForCurrentDay) return null;
    
    // Find transportation that's happening at the current time
    const transportation = activitiesForCurrentDay.find((activity: any) => {
      if (activity.activityType !== 'transportation') return false;
      if (!activity.departureTime || !activity.arrivalTime) return false;
      
      const [departHours, departMinutes] = activity.departureTime.split(':').map(Number);
      const [arriveHours, arriveMinutes] = activity.arrivalTime.split(':').map(Number);
      
      const departTimeInMinutes = departHours * 60 + (departMinutes || 0);
      const arriveTimeInMinutes = arriveHours * 60 + (arriveMinutes || 0);
      
      const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
      const currentTimeInMinutes = currentHours * 60 + (currentMinutes || 0);
      
      return currentTimeInMinutes >= departTimeInMinutes && currentTimeInMinutes <= arriveTimeInMinutes;
    });
    
    if (transportation) {
      // Calculate progress percentage
      const [departHours, departMinutes] = transportation.departureTime.split(':').map(Number);
      const [arriveHours, arriveMinutes] = transportation.arrivalTime.split(':').map(Number);
      
      const departTimeInMinutes = departHours * 60 + (departMinutes || 0);
      const arriveTimeInMinutes = arriveHours * 60 + (arriveMinutes || 0);
      
      const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
      const currentTimeInMinutes = currentHours * 60 + (currentMinutes || 0);
      
      const totalTravelTime = arriveTimeInMinutes - departTimeInMinutes;
      const elapsedTime = currentTimeInMinutes - departTimeInMinutes;
      const progress = Math.min(100, Math.max(0, (elapsedTime / totalTravelTime) * 100));
      
      return {
        ...transportation,
        progress,
        progressRatio: elapsedTime / totalTravelTime
      };
    }
    
    return null;
  };
  
  const currentTransportation = getCurrentTransportation();
  
  // Create a pulsing dot marker for transit animation
  const createPulsingDotMarker = (color: string) => {
    return new L.DivIcon({
      className: 'custom-pulsing-dot',
      html: `
        <div style="
          position: relative;
          width: 20px;
          height: 20px;
        ">
          <div style="
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: ${color};
            opacity: 0.3;
            animation: pulse 1.5s ease-out infinite;
          "></div>
          <div style="
            position: absolute;
            top: 5px;
            left: 5px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: ${color};
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(0.5); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
          }
        </style>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });
  };
  
  // Calculate center of locations if available
  useEffect(() => {
    if (locations && locations.length > 0) {
      // Set initial center based on first location
      setMapCenter([locations[0].lat, locations[0].lng]);
    }
  }, [locations]);
  
  // Define route points for polyline, filtering out markers for filtered participants
  const routePoints: [number, number][] = locations
    .filter((loc: any) => {
      // If location has participant info, check if they're filtered
      if (loc.participantId && filteredParticipants.includes(loc.participantId)) {
        return false;
      }
      return loc.lat && loc.lng;
    })
    .map((loc: any) => [loc.lat, loc.lng]);
  
  // Create custom marker icon with participant color
  const createColoredMarkerIcon = (color: string, isActive: boolean = false) => {
    // Create a custom colored marker if a color is provided
    return new L.DivIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: ${color}; 
          width: ${isActive ? '30px' : '25px'}; 
          height: ${isActive ? '30px' : '25px'}; 
          border-radius: 50%; 
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 6px;
            height: 6px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: isActive ? [30, 30] : [25, 25],
      iconAnchor: isActive ? [15, 15] : [12, 12],
      popupAnchor: [0, -10]
    });
  };
  
  // Get icon based on location type and participant
  const getMarkerIcon = (location: any, isActive: boolean) => {
    // If we have a participant color, use a colored marker
    if (location.participantColor) {
      return createColoredMarkerIcon(location.participantColor, isActive);
    }
    
    // Otherwise use the default type-based icons
    if (isActive) return ActiveIcon;
    
    switch (location.type) {
      case 'accommodation':
        return AccommodationIcon;
      case 'transportation':
        return TransportationIcon;
      case 'event':
        return EventIcon;
      default:
        return DefaultIcon;
    }
  };
  
  // Create a map reference component
  const MapController = () => {
    const mapInstance = useMap();
    
    useEffect(() => {
      setMap(mapInstance);
    }, [mapInstance]);
    
    return null;
  };
  
  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Hide default zoom control to use custom controls
      >
        {/* Base map layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map controller to get reference */}
        <MapController />
        
        {/* Background route polyline */}
        <Polyline 
          positions={routePoints}
          color="#3b82f6"
          weight={3}
          opacity={0.3}
          dashArray="5, 10"
        />
        
        {/* Active route polyline for current transportation - shown with animation */}
        {currentTransportation && currentTransportation.from && currentTransportation.to && (
          <>
            {/* Completed portion of the route */}
            <Polyline 
              positions={[
                [currentTransportation.from.lat, currentTransportation.from.lng],
                [
                  currentTransportation.from.lat + 
                  (currentTransportation.to.lat - currentTransportation.from.lat) * 
                  currentTransportation.progressRatio,
                  
                  currentTransportation.from.lng + 
                  (currentTransportation.to.lng - currentTransportation.from.lng) * 
                  currentTransportation.progressRatio
                ]
              ]}
              color="#10b981"
              weight={5}
              opacity={0.8}
            />
            
            {/* Remaining portion of the route - with dash animation */}
            <Polyline 
              positions={[
                [
                  currentTransportation.from.lat + 
                  (currentTransportation.to.lat - currentTransportation.from.lat) * 
                  currentTransportation.progressRatio,
                  
                  currentTransportation.from.lng + 
                  (currentTransportation.to.lng - currentTransportation.from.lng) * 
                  currentTransportation.progressRatio
                ],
                [currentTransportation.to.lat, currentTransportation.to.lng]
              ]}
              color="#3b82f6"
              weight={4}
              opacity={0.6}
              dashArray="10, 10"
              className="leaflet-line-pulse"
            />
            
            {/* Pulsing dot at current position */}
            <Marker
              position={[
                currentTransportation.from.lat + 
                (currentTransportation.to.lat - currentTransportation.from.lat) * 
                currentTransportation.progressRatio,
                
                currentTransportation.from.lng + 
                (currentTransportation.to.lng - currentTransportation.from.lng) * 
                currentTransportation.progressRatio
              ]}
              icon={createPulsingDotMarker('#10b981')}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-medium">Currently in transit</h3>
                  <p className="text-sm">
                    {currentTransportation.from.name} → {currentTransportation.to.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentTransportation.progress.toFixed(0)}% complete
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}
        
        {/* Location markers */}
        {locations.map((location: any, index: number) => {
          // Skip locations for filtered participants
          if (location.participantId && filteredParticipants.includes(location.participantId)) {
            return null;
          }
          
          // Check if this location is in the current activities
          const isActive = currentMarkers.some((marker: any) => 
            marker.lat === location.lat && marker.lng === location.lng
          );
          
          return (
            <Marker
              key={`marker-${index}`}
              position={[location.lat, location.lng]}
              icon={getMarkerIcon(location, isActive)}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-medium">{location.name || 'Location'}</h3>
                  {location.address && (
                    <p className="text-sm text-gray-600">{location.address}</p>
                  )}
                  {location.participantId && (
                    <p className="text-xs mt-2 text-blue-600">
                      Traveler: {location.participantId === "user1" ? "John Doe" : 
                                location.participantId === "user2" ? "Jane Smith" : "Mike Johnson"}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Current filtered markers */}
        {currentMarkers.map((marker: any, index: number) => (
          <Marker
            key={`current-${index}`}
            position={[marker.lat, marker.lng]}
            icon={createColoredMarkerIcon(marker.participantColor || '#3b82f6', true)}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-medium">{marker.name || 'Current Location'}</h3>
                {marker.activity && marker.activity.title && (
                  <p className="text-sm font-medium text-blue-600">{marker.activity.title}</p>
                )}
                {marker.activity && marker.activity.participants && (
                  <div className="text-xs mt-2">
                    Participants: {marker.activity.participants.filter(
                      (id: string) => !filteredParticipants.includes(id)
                    ).join(', ')}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Dynamic map view to handle updates */}
        <MapView 
          locations={locations}
          currentDay={currentDay}
          currentTime={currentTime}
          activitiesForCurrentDay={activitiesForCurrentDay}
          autoFollow={autoFollow}
        />
      </MapContainer>
      
      {/* Custom map controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        {/* View mode toggle */}
        <button 
          onClick={toggleAutoFollow} 
          className={`p-2 rounded-full shadow-lg text-sm flex items-center justify-center ${
            autoFollow 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          title={autoFollow ? "Following current day" : "Showing entire trip"}
        >
          <FaCompass className={autoFollow ? 'animate-pulse' : ''} />
        </button>
        
        {/* Show entire trip button */}
        <button 
          onClick={showEntireTrip}
          className="p-2 rounded-full shadow-lg bg-white text-gray-700 hover:bg-gray-100"
          title="Zoom out to see entire trip"
        >
          <FaExpand />
        </button>
      </div>
      
      {/* Custom zoom controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <button 
            onClick={() => map?.zoomIn()}
            className="p-2 hover:bg-gray-100 border-b border-gray-200 flex items-center justify-center"
            title="Zoom in"
          >
            <FaSearchPlus className="text-gray-700" />
          </button>
          <button 
            onClick={() => map?.zoomOut()}
            className="p-2 hover:bg-gray-100 flex items-center justify-center"
            title="Zoom out"
          >
            <FaSearchMinus className="text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Time indicator overlay */}
      <div className="absolute top-4 right-16 z-[1000] pointer-events-none">
        <div className="bg-white px-3 py-1 rounded-full shadow-lg pointer-events-auto flex items-center">
          <FaClock className="text-blue-500 mr-1" />
          <span className="text-sm font-medium">{currentTime}</span>
        </div>
      </div>
      
      {/* Current day activities information overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] flex justify-center pointer-events-none">
        <div className="bg-white dark:bg-gray-800 bg-opacity-90 px-4 py-2 rounded-lg shadow-lg max-w-md pointer-events-auto border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {currentDay ? `Activities on ${new Date(currentDay).toLocaleDateString()}` : 'No date selected'}
          </h3>
          {activitiesForCurrentDay && activitiesForCurrentDay.length > 0 ? (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 max-h-32 overflow-y-auto">
              {activitiesForCurrentDay
                .filter((activity: any) => {
                  // Skip if all participants are filtered
                  if (activity.participants && filteredParticipants.length > 0) {
                    const allParticipantsFiltered = activity.participants.every(
                      (id: string) => filteredParticipants.includes(id)
                    );
                    return !allParticipantsFiltered;
                  }
                  return true;
                })
                .map((activity: any, index: number) => (
                  <div key={index} className="mb-1 py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    {activity.title || activity.name || 
                      (activity.activityType === 'transportation' ? 
                        `${activity.from.name} to ${activity.to.name}` : 
                        (activity.activityType === 'check-in' ? 
                          `Check-in: ${activity.name}` : 
                          `Check-out: ${activity.name}`
                        )
                      )
                    }
                  </div>
                ))
              }
            </div>
          ) : (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">No activities scheduled for this day</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeafletMap; 