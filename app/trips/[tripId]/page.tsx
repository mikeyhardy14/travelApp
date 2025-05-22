"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaPlane, FaHotel, FaCar, FaUtensils, FaSuitcase, FaCalendarAlt, 
  FaMapMarkerAlt, FaUser, FaUsers, FaClock, FaArrowLeft, 
  FaPlus, FaTrash, FaEdit, FaCheck, FaList, FaMap, FaInfoCircle,
  FaChevronRight, FaChevronLeft, FaArrowRight, FaTimes, FaExpand,
  FaCompass, FaEye, FaEyeSlash, FaExchangeAlt, FaFilter, FaChevronUp, FaChevronDown, FaFilePdf
} from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import LeafletMapWrapper from '../../components/LeafletMapWrapper';

// Mock trip data - this would come from your API in a real app
const mockTripData = {
  "trip-123": {
    id: "trip-123",
    name: "Europe Summer Trip",
    destination: "Multiple Cities, Europe",
    dates: { start: "2023-06-15", end: "2023-07-05" },
    description: "A three-week exploration of Europe's most beautiful cities. We'll visit Paris, Amsterdam, Berlin, Prague, and Vienna.",
    participants: [
      { id: "user1", name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/32.jpg", flightInfo: { flightNumber: "AF1234", arrival: "2023-06-15T09:30:00", departure: "2023-07-05T17:45:00" }, color: "#4f46e5" },
      { id: "user2", name: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/44.jpg", flightInfo: { flightNumber: "LH5678", arrival: "2023-06-15T10:15:00", departure: "2023-07-05T16:30:00" }, color: "#10b981" },
      { id: "user3", name: "Mike Johnson", avatar: "https://randomuser.me/api/portraits/men/45.jpg", flightInfo: { flightNumber: "BA9012", arrival: "2023-06-15T08:45:00", departure: "2023-07-05T18:20:00" }, color: "#ef4444" }
    ],
    accommodations: [
      { 
        id: "acc1", 
        name: "Hotel de Paris", 
        location: { lat: 48.8566, lng: 2.3522, address: "123 Rue de Rivoli, Paris, France" },
        checkIn: "2023-06-15", 
        checkOut: "2023-06-18",
        price: "€200/night",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      { 
        id: "acc2", 
        name: "Amsterdam Boutique", 
        location: { lat: 52.3676, lng: 4.9041, address: "456 Prinsengracht, Amsterdam, Netherlands" },
        checkIn: "2023-06-18", 
        checkOut: "2023-06-21",
        price: "€180/night",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      { 
        id: "acc3", 
        name: "Berlin Apartment", 
        location: { lat: 52.5200, lng: 13.4050, address: "789 Unter den Linden, Berlin, Germany" },
        checkIn: "2023-06-21", 
        checkOut: "2023-06-25",
        price: "€150/night",
        image: "https://images.unsplash.com/photo-1565031491910-e57c426304e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ],
    events: [
      { 
        id: "evt1", 
        title: "Eiffel Tower Visit", 
        location: { lat: 48.8584, lng: 2.2945, address: "Champ de Mars, Paris, France" },
        date: "2023-06-16", 
        startTime: "10:00", 
        endTime: "12:30",
        type: "sightseeing",
        participants: ["user1", "user2", "user3"],
        confirmed: true,
        notes: "Don't forget to book tickets in advance"
      },
      { 
        id: "evt2", 
        title: "Louvre Museum", 
        location: { lat: 48.8606, lng: 2.3376, address: "Rue de Rivoli, Paris, France" },
        date: "2023-06-16", 
        startTime: "14:00", 
        endTime: "17:00",
        type: "sightseeing",
        participants: ["user1", "user2"],
        confirmed: true,
        notes: "Meet at the Pyramid entrance"
      },
      { 
        id: "evt3", 
        title: "Canal Cruise", 
        location: { lat: 52.3702, lng: 4.8952, address: "Amsterdam Central, Netherlands" },
        date: "2023-06-19", 
        startTime: "13:00", 
        endTime: "14:30",
        type: "activity",
        participants: ["user1", "user2", "user3"],
        confirmed: true,
        notes: "Boarding 15 minutes before departure"
      }
    ],
    transportation: [
      {
        id: "trans1",
        type: "flight",
        from: { lat: 40.7128, lng: -74.0060, name: "New York JFK" },
        to: { lat: 48.8566, lng: 2.3522, name: "Paris CDG" },
        date: "2023-06-15",
        departureTime: "01:30",
        arrivalTime: "09:30",
        participants: ["user1", "user2", "user3"],
        details: "Air France AF1234"
      },
      {
        id: "trans2",
        type: "train",
        from: { lat: 48.8566, lng: 2.3522, name: "Paris Gare du Nord" },
        to: { lat: 52.3676, lng: 4.9041, name: "Amsterdam Centraal" },
        date: "2023-06-18",
        departureTime: "10:15",
        arrivalTime: "13:30",
        participants: ["user1", "user2", "user3"],
        details: "Thalys 9429"
      }
    ],
    suggestedActivities: [
      {
        id: "sugg1",
        title: "Seine River Dinner Cruise",
        location: { lat: 48.8584, lng: 2.3300, address: "Port de la Bourdonnais, Paris" },
        type: "dining",
        price: "€80 per person",
        duration: "2 hours",
        description: "Enjoy a romantic dinner while cruising the Seine River with views of illuminated monuments",
        image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "sugg2",
        title: "Van Gogh Museum",
        location: { lat: 52.3584, lng: 4.8810, address: "Museumplein 6, Amsterdam" },
        type: "cultural",
        price: "€19 per person",
        duration: "3 hours",
        description: "Explore the world's largest collection of artworks by Vincent van Gogh",
        image: "https://images.unsplash.com/photo-1538681205587-77380321d1b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "sugg3",
        title: "Berlin Wall Bike Tour",
        location: { lat: 52.5351, lng: 13.3902, address: "Bernauer Straße, Berlin" },
        type: "activity",
        price: "€25 per person",
        duration: "4 hours",
        description: "Guided bicycle tour following the path of the Berlin Wall with historical commentary",
        image: "https://images.unsplash.com/photo-1581255283672-aa19e80ff205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ],
    route: [
      { lat: 48.8566, lng: 2.3522, name: "Paris", arriveDate: "2023-06-15", leaveDate: "2023-06-18" },
      { lat: 52.3676, lng: 4.9041, name: "Amsterdam", arriveDate: "2023-06-18", leaveDate: "2023-06-21" },
      { lat: 52.5200, lng: 13.4050, name: "Berlin", arriveDate: "2023-06-21", leaveDate: "2023-06-25" },
      { lat: 50.0755, lng: 14.4378, name: "Prague", arriveDate: "2023-06-25", leaveDate: "2023-06-30" },
      { lat: 48.2082, lng: 16.3738, name: "Vienna", arriveDate: "2023-06-30", leaveDate: "2023-07-05" }
    ]
  }
};

// Fix for Leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const AccommodationIcon = L.icon({
  iconUrl: '/images/accommodation-marker.png', 
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const TransportationIcon = L.icon({
  iconUrl: '/images/transportation-marker.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const EventIcon = L.icon({
  iconUrl: '/images/event-marker.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ActiveIcon = L.icon({
  iconUrl: '/images/active-marker.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -40],
  shadowSize: [41, 41]
});

// Set default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

// Dynamic Map View component to handle map updates
const MapView = ({ locations, currentDay, currentTime, activitiesForCurrentDay }: any) => {
  const map = useMap();
  
  useEffect(() => {
    if (locations && locations.length > 0) {
      // Calculate bounds to fit all locations
      const bounds = L.latLngBounds(locations.map((loc: any) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  
  useEffect(() => {
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
  }, [currentDay, currentTime, activitiesForCurrentDay, map]);
  
  return null;
};

// Map component using Leaflet with OpenStreetMap
const MapComponent = ({ locations, currentDay, currentTime, activitiesForCurrentDay }: any) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris
  const [mapZoom, setMapZoom] = useState(5);
  
  // Get current location markers
  const getCurrentMarkers = () => {
    if (!currentDay || !activitiesForCurrentDay) return [];
    
    return activitiesForCurrentDay.map((activity: any, index: number) => {
      let location = null;
      
      if (activity.location) {
        location = activity.location;
      } else if (activity.activityType === 'transportation') {
        // For transportation, use the "to" location as current position
        location = activity.to;
      }
      
      if (!location) return null;
      
      return {
        ...location,
        id: `marker-${index}`,
        activity
      };
    }).filter(Boolean);
  };
  
  const currentMarkers = getCurrentMarkers();
  
  // Calculate center of locations if available
  useEffect(() => {
    if (locations && locations.length > 0) {
      // Set initial center based on first location
      setMapCenter([locations[0].lat, locations[0].lng]);
      setMapLoaded(true);
    }
  }, [locations]);
  
  // Define route points for polyline
  const routePoints: [number, number][] = locations
    .filter((loc: any) => loc.lat && loc.lng)
    .map((loc: any) => [loc.lat, loc.lng]);
  
  // Create map bounds
  const getMapBounds = () => {
    if (locations && locations.length > 0) {
      return locations.map((loc: any) => [loc.lat, loc.lng]);
    }
    return [];
  };
  
  // Get icon based on location type
  const getMarkerIcon = (location: any, isActive: boolean) => {
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
  
  return (
    <div className="h-full w-full bg-blue-50 rounded-lg overflow-hidden">
      {!mapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {/* Add zoom control in top-right corner */}
          <div className="leaflet-top leaflet-right">
            <div className="leaflet-control leaflet-bar">
              <a href="#" title="Zoom in" role="button" aria-label="Zoom in"></a>
              <a href="#" title="Zoom out" role="button" aria-label="Zoom out"></a>
            </div>
          </div>
          
          {/* Base map layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Route polyline */}
          <Polyline 
            positions={routePoints}
            color="#3b82f6"
            weight={3}
            opacity={0.7}
            dashArray="5, 10"
          />
          
          {/* Location markers */}
          {locations.map((location: any, index: number) => {
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
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          {/* Dynamic map view to handle updates */}
          <MapView 
            locations={locations}
            currentDay={currentDay}
            currentTime={currentTime}
            activitiesForCurrentDay={activitiesForCurrentDay}
          />
        </MapContainer>
      )}
      
      {/* Current day activities information overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] flex justify-center">
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg max-w-md">
          <h3 className="text-sm font-medium text-gray-800">
            {currentDay ? `Activities on ${new Date(currentDay).toLocaleDateString()}` : 'No date selected'}
          </h3>
          {activitiesForCurrentDay && activitiesForCurrentDay.length > 0 ? (
            <div className="mt-2 text-xs text-gray-600 max-h-32 overflow-y-auto">
              {activitiesForCurrentDay.map((activity: any, index: number) => (
                <div key={index} className="mb-1 py-1 border-b border-gray-100 last:border-0">
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
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-gray-500">No activities scheduled for this day</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Timeline component 
const TimelineComponent = ({ trip, currentDate, setCurrentDate, isDragging, setIsDragging, onDragChange }: any) => {
  // Create an array of all dates in the trip
  const dateArray: Date[] = [];
  const startDate = new Date(trip.dates.start);
  const endDate = new Date(trip.dates.end);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timeSliderRef = useRef<HTMLDivElement>(null);
  const [dragPosition, setDragPosition] = useState(0);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<string>('12:00'); // Default to noon
  const [showTimeSlider, setShowTimeSlider] = useState(true); // Always show time slider by default
  
  // Calculate timeline width on mount and resize
  useEffect(() => {
    const updateTimelineWidth = () => {
      if (timelineRef.current) {
        setTimelineWidth(timelineRef.current.scrollWidth);
      }
    };
    
    updateTimelineWidth();
    window.addEventListener('resize', updateTimelineWidth);
    
    return () => {
      window.removeEventListener('resize', updateTimelineWidth);
    };
  }, []);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dateArray.push(new Date(d));
  }

  // Find index of current date in dateArray
  const currentDateIndex = dateArray.findIndex(
    d => d.toISOString().split('T')[0] === currentDate
  );
  
  // Hours of the day array for time slider
  const hoursOfDay = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];
  
  const goToPreviousDay = () => {
    if (currentDateIndex > 0) {
      setCurrentDate(dateArray[currentDateIndex - 1].toISOString().split('T')[0]);
      
      // Scroll to the date marker
      if (timelineContainerRef.current) {
        const dateElements = timelineContainerRef.current.querySelectorAll('.date-marker');
        if (dateElements[currentDateIndex - 1]) {
          dateElements[currentDateIndex - 1].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
        }
      }
    }
  };

  const goToNextDay = () => {
    if (currentDateIndex < dateArray.length - 1) {
      setCurrentDate(dateArray[currentDateIndex + 1].toISOString().split('T')[0]);
      
      // Scroll to the date marker
      if (timelineContainerRef.current) {
        const dateElements = timelineContainerRef.current.querySelectorAll('.date-marker');
        if (dateElements[currentDateIndex + 1]) {
          dateElements[currentDateIndex + 1].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          });
        }
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  // Get the current time position as a percentage
  const getTimePositionPercentage = () => {
    const [hours, minutes] = timeOfDay.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 100;
  };
  
  // Handle time slider change with enhanced visual feedback
  const handleTimeChange = (time: string) => {
    setTimeOfDay(time);
    
    // Notify parent component about time change
    if (onDragChange) {
      // Create a datetime by combining current date with selected time
      const [hours, minutes] = time.split(':').map(Number);
      const dateTime = new Date(currentDate);
      dateTime.setHours(hours, minutes);
      
      onDragChange(currentDate, time);
    }
  };
  
  // Enhanced time slider drag function with more granular control
  const handleTimeSliderDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timeSliderRef.current) return;
    
    const rect = timeSliderRef.current.getBoundingClientRect();
    const relativePosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    // Calculate time based on position (more granular)
    const totalMinutesInDay = 24 * 60;
    const minutesFromPosition = Math.floor(relativePosition * totalMinutesInDay);
    
    const hours = Math.floor(minutesFromPosition / 60);
    const minutes = minutesFromPosition % 60;
    
    // Format as HH:MM
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    handleTimeChange(formattedTime);
  };
  
  // Handle timeline scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrolling(true);
    // Clear previous timeout
    const timeoutId = setTimeout(() => {
      setScrolling(false);
    }, 150);
    
    return () => clearTimeout(timeoutId);
  };
  
  // Handle timeline drag start
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  };
  
  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    // Capture initial touch position
    const touchX = e.touches[0].clientX;
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX;
    const relativePosition = Math.max(0, Math.min(1, (touchX - rect.left) / rect.width));
    setDragPosition(relativePosition);
    
    updateDateFromPosition(relativePosition);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };
  
  // Handle timeline drag
  const handleDrag = (e: MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const relativePosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setDragPosition(relativePosition);
    
    updateDateFromPosition(relativePosition);
  };
  
  const updateDateFromPosition = (position: number) => {
    // Calculate the date based on drag position
    const dateIndex = Math.min(
      dateArray.length - 1,
      Math.floor(position * dateArray.length)
    );
    
    if (dateIndex >= 0 && dateIndex < dateArray.length) {
      const newDate = dateArray[dateIndex].toISOString().split('T')[0];
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
        if (onDragChange) {
          onDragChange(newDate, timeOfDay);
        }
      }
    }
  };
  
  // Handle timeline drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  };
  
  // Get current transportation activities for visualizing progress
  const getCurrentTransportation = () => {
    if (!currentDate || !trip) return null;
    
    // Find transportation that's happening at the current time
    for (const trans of trip.transportation) {
      if (trans.date === currentDate && trans.departureTime && trans.arrivalTime) {
        const [departHours, departMinutes] = trans.departureTime.split(':').map(Number);
        const [arriveHours, arriveMinutes] = trans.arrivalTime.split(':').map(Number);
        
        const departTimeInMinutes = departHours * 60 + (departMinutes || 0);
        const arriveTimeInMinutes = arriveHours * 60 + (arriveMinutes || 0);
        
        const [currentHours, currentMinutes] = timeOfDay.split(':').map(Number);
        const currentTimeInMinutes = currentHours * 60 + (currentMinutes || 0);
        
        if (currentTimeInMinutes >= departTimeInMinutes && currentTimeInMinutes <= arriveTimeInMinutes) {
          // Calculate progress percentage
          const totalTravelTime = arriveTimeInMinutes - departTimeInMinutes;
          const elapsedTime = currentTimeInMinutes - departTimeInMinutes;
          const progress = Math.min(100, Math.max(0, (elapsedTime / totalTravelTime) * 100));
          
          return {
            ...trans,
            progress
          };
        }
      }
    }
    
    return null;
  };
  
  const currentTransportation = getCurrentTransportation();

  return (
    <div className="bg-transparent text-white rounded-lg select-none">
      {/* Timeline header with date navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousDay}
          disabled={currentDateIndex <= 0}
          className={`p-2 rounded ${currentDateIndex <= 0 ? 'text-gray-500' : 'text-white hover:bg-white hover:bg-opacity-10'}`}
        >
          <FaChevronLeft />
        </button>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            {currentDate ? formatDate(new Date(currentDate)) : 'Select a date'}
          </div>
          <div className="text-sm text-gray-300 flex items-center justify-center">
            <span>Day {currentDateIndex + 1} of {dateArray.length}</span>
            <button 
              onClick={() => setShowTimeSlider(!showTimeSlider)}
              className="ml-2 text-blue-300 hover:text-blue-200 text-xs flex items-center"
            >
              <FaClock className="mr-1" />
              <span>{timeOfDay}</span>
            </button>
          </div>
        </div>
        
        <button 
          onClick={goToNextDay}
          disabled={currentDateIndex >= dateArray.length - 1}
          className={`p-2 rounded ${currentDateIndex >= dateArray.length - 1 ? 'text-gray-500' : 'text-white hover:bg-white hover:bg-opacity-10'}`}
        >
          <FaChevronRight />
        </button>
      </div>
      
      {/* Enhanced time of day slider - now more visual and prominent */}
      {showTimeSlider && (
        <div className="mb-4">
          <div 
            ref={timeSliderRef}
            className="relative h-10 bg-gray-800 bg-opacity-50 rounded-full cursor-pointer overflow-hidden"
            onClick={handleTimeSliderDrag}
          >
            {/* Time track background with gradient */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-2 bg-gradient-to-r from-indigo-900 via-blue-500 to-indigo-900 rounded-full"></div>
            
            {/* Show travel progress if there's ongoing transportation */}
            {currentTransportation && (
              <div 
                className="absolute top-0 bottom-0 bg-blue-600 bg-opacity-20 flex items-center justify-center"
                style={{ 
                  left: `${(parseInt(currentTransportation.departureTime.split(':')[0]) / 24) * 100}%`,
                  width: `${(parseInt(currentTransportation.arrivalTime.split(':')[0]) - 
                    parseInt(currentTransportation.departureTime.split(':')[0])) / 24 * 100}%`
                }}
              >
                <div className="text-xs text-white font-medium truncate px-2">
                  {currentTransportation.from?.name} → {currentTransportation.to?.name}
                </div>
              </div>
            )}
            
            {/* Hour markers */}
            <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-between px-2">
              {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                <div key={hour} className="h-full flex flex-col justify-center items-center">
                  <div className="w-1 h-2 bg-white bg-opacity-50 rounded-full"></div>
                  <span className="text-xs text-white mt-1">{hour}:00</span>
                </div>
              ))}
            </div>
            
            {/* Current time indicator - now more prominent with a pulse animation */}
            <div 
              className="absolute top-0 bottom-0 w-4 flex items-center justify-center z-10"
              style={{ 
                left: `calc(${getTimePositionPercentage()}% - 8px)`,
              }}
            >
              <div className="w-4 h-10 bg-white rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute w-2 h-10 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Quick time selection buttons */}
          <div className="grid grid-cols-8 gap-1 mt-2">
            {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
              <button
                key={hour}
                onClick={() => handleTimeChange(`${hour.toString().padStart(2, '0')}:00`)}
                className={`text-xs py-1 px-1 rounded ${
                  timeOfDay.startsWith(`${hour.toString().padStart(2, '0')}:`) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {hour}:00
              </button>
            ))}
          </div>
          
          {/* Transportation progress indicator */}
          {currentTransportation && (
            <div className="mt-2 p-2 bg-blue-900 bg-opacity-50 rounded-lg text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {currentTransportation.type === 'flight' ? 
                    <FaPlane className="text-blue-300 mr-2" /> : 
                    <FaCar className="text-blue-300 mr-2" />
                  }
                  <span>
                    {currentTransportation.from?.name} → {currentTransportation.to?.name}
                  </span>
                </div>
                <div className="text-blue-300">
                  {currentTransportation.progress.toFixed(0)}% complete
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full relative overflow-hidden"
                  style={{ width: `${currentTransportation.progress}%` }}
                >
                  {/* Animated pulse effect */}
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Visual timeline with dates - now more prominent and interactive */}
      <div 
        ref={timelineContainerRef}
        className="overflow-x-auto pb-3 pt-1 -mx-2 px-2"
        onScroll={handleScroll}
      >
        <div 
          ref={timelineRef}
          className="relative mt-6 mb-2 cursor-grab min-w-max"
          onMouseDown={handleDragStart}
          onTouchStart={handleTouchStart}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            minWidth: '100%',
            width: dateArray.length > 20 ? `${dateArray.length * 20}px` : '100%'
          }}
        >
          <div className="absolute left-0 right-0 h-2 bg-gray-600 bg-opacity-50 top-2 rounded-full"></div>
          
          {/* Highlight the current trip segment */}
          {currentTransportation && (
            <div 
              className="absolute h-2 bg-blue-500 top-2 rounded-full animate-pulse"
              style={{ 
                left: `${(currentDateIndex / (dateArray.length - 1)) * 100}%`,
                width: `${1 / (dateArray.length - 1) * 100}%`
              }}
            ></div>
          )}
          
          <div className="flex justify-between" style={{ minWidth: '100%' }}>
            {dateArray.map((date, i) => {
              const isActive = date.toISOString().split('T')[0] === currentDate;
              const isPast = date < new Date(currentDate);
              return (
                <button
                  key={i}
                  onClick={() => setCurrentDate(date.toISOString().split('T')[0])}
                  className={`date-marker w-6 h-6 rounded-full relative z-10 flex items-center justify-center ${
                    isActive ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : isPast ? 'bg-gray-400' : 'bg-gray-600'
                  }`}
                  title={formatDate(date)}
                >
                  {isActive && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-xs mt-2 text-gray-300">
            <div>{formatDate(dateArray[0])}</div>
            <div>{formatDate(dateArray[Math.floor(dateArray.length / 2)])}</div>
            <div>{formatDate(dateArray[dateArray.length - 1])}</div>
          </div>
          
          {/* Enhanced draggable handle with pulse effect */}
          {currentDateIndex >= 0 && (
            <div 
              className="absolute top-0 w-8 h-8 bg-blue-500 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center overflow-hidden"
              style={{ 
                left: `${((currentDateIndex) / (dateArray.length - 1)) * 100}%`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              <div className="w-3 h-3 bg-white rounded-full relative z-10"></div>
              {/* Pulse animation overlay */}
              <div className="absolute inset-0 bg-blue-300 animate-ping opacity-30"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Event Form Component for adding/editing events
const ItineraryEventForm = ({ 
  event, 
  onSave, 
  onCancel, 
  trip, 
  currentDate 
}: { 
  event?: any, 
  onSave: (eventData: any) => void, 
  onCancel: () => void,
  trip: any,
  currentDate: string
}) => {
  const isEditMode = !!event;
  const [eventData, setEventData] = useState({
    title: event?.title || '',
    location: event?.location ? {
      lat: event.location.lat,
      lng: event.location.lng,
      address: event.location.address
    } : { lat: 0, lng: 0, address: '' },
    date: event?.date || currentDate,
    startTime: event?.startTime || '09:00',
    endTime: event?.endTime || '10:00',
    type: event?.type || 'activity',
    participants: event?.participants || [],
    confirmed: event?.confirmed || false,
    notes: event?.notes || '',
    receiptUrl: event?.receiptUrl || '',
    cost: event?.cost || '',
    category: event?.category || 'other'
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [addressInput, setAddressInput] = useState(event?.location?.address || '');
  const [showParticipantSelector, setShowParticipantSelector] = useState(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setEventData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setEventData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle participant toggle
  const toggleParticipant = (participantId: string) => {
    setEventData(prev => {
      const participants = [...prev.participants];
      
      if (participants.includes(participantId)) {
        return {
          ...prev,
          participants: participants.filter(id => id !== participantId)
        };
      } else {
        return {
          ...prev,
          participants: [...participants, participantId]
        };
      }
    });
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
      
      // In a real app, you'd upload this to storage and get a URL back
      // For now, we'll just set a placeholder URL
      setEventData(prev => ({
        ...prev,
        receiptUrl: 'receipt-placeholder.jpg'
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(eventData);
  };
  
  // Simulate address search (in a real app, this would call a geocoding API)
  const searchAddress = () => {
    // Mock address lookup - in a real app, this would call a geocoding API
    if (addressInput) {
      setEventData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: addressInput,
          // For demo purposes, generate random coordinates near Paris
          lat: 48.8566 + (Math.random() * 0.02 - 0.01),
          lng: 2.3522 + (Math.random() * 0.02 - 0.01)
        }
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{isEditMode ? 'Edit Activity' : 'Add Activity'}</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Activity name"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={eventData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="sightseeing">Sightseeing</option>
            <option value="dining">Dining</option>
            <option value="activity">Activity</option>
            <option value="transportation">Transportation</option>
            <option value="accommodation">Accommodation</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="flex mt-1">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Address"
            />
            <button
              type="button"
              onClick={searchAddress}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-r-md border border-gray-300 hover:bg-gray-200"
            >
              <FaMapMarkerAlt />
            </button>
          </div>
          {eventData.location.address && (
            <p className="mt-1 text-sm text-green-600">
              Address set: {eventData.location.address}
            </p>
          )}
        </div>

        {/* Time range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={eventData.startTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              name="endTime"
              value={eventData.endTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Cost (optional)</label>
          <input
            type="text"
            name="cost"
            value={eventData.cost}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g. €25 per person"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={eventData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Any additional details..."
          />
        </div>

        {/* Receipt upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Receipt (optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/*"
          />
          {uploadedFile && (
            <p className="mt-1 text-sm text-green-600">File uploaded: {uploadedFile.name}</p>
          )}
          {eventData.receiptUrl && !uploadedFile && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-500 mr-2">Current receipt:</span>
              <a href="#" className="text-blue-500 hover:underline text-sm">View Receipt</a>
            </div>
          )}
        </div>

        {/* Participants */}
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Participants</label>
            <button
              type="button"
              onClick={() => setShowParticipantSelector(!showParticipantSelector)}
              className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
            >
              {showParticipantSelector ? (
                <><FaChevronUp className="mr-1" /> Hide</>
              ) : (
                <><FaChevronDown className="mr-1" /> Select</>
              )}
            </button>
          </div>

          {showParticipantSelector && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              {trip.participants.map((participant: any) => (
                <div key={participant.id} className="flex items-center mb-2 last:mb-0">
                  <input
                    type="checkbox"
                    id={`participant-${participant.id}`}
                    checked={eventData.participants.includes(participant.id)}
                    onChange={() => toggleParticipant(participant.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`participant-${participant.id}`} className="ml-2 flex items-center">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-700">{participant.name}</span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Show selected participants */}
          {eventData.participants.length > 0 && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-500 mr-2">Selected:</span>
              <div className="flex -space-x-2">
                {eventData.participants.map((participantId: string) => {
                  const participant = trip.participants.find((p: any) => p.id === participantId);
                  return participant ? (
                    <img
                      key={participant.id}
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-6 h-6 rounded-full border border-white"
                      title={participant.name}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Confirmation status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="confirmed"
            name="confirmed"
            checked={eventData.confirmed}
            onChange={(e) => setEventData(prev => ({ ...prev, confirmed: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="confirmed" className="ml-2 text-sm text-gray-700">
            Mark as confirmed
          </label>
        </div>

        {/* Submit button */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditMode ? 'Update Activity' : 'Add Activity'}
          </button>
        </div>
      </form>
    </div>
  );
};

const TripDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { tripId } = params as { tripId: string };
  
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'itinerary' | 'people'>('map');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('12:00'); // Default to noon
  const [showSuggestedActivities, setShowSuggestedActivities] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(true);
  const [timelineDragging, setTimelineDragging] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(true); // New state for side panel
  const [filteredParticipants, setFilteredParticipants] = useState<string[]>([]); // Store IDs of filtered participants
  const [currentUser, setCurrentUser] = useState<string>("user1"); // Assume user1 is the current user
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareUsers, setCompareUsers] = useState<string[]>([]); // Users to compare
  const [showEventForm, setShowEventForm] = useState(false); // New state for event form
  const [currentEditingEvent, setCurrentEditingEvent] = useState<any>(null); // Event being edited
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar'); // Default to calendar view
  
  // Refs for full-screen handling
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const loadTrip = () => {
      setLoading(true);
      try {
        // Simulate API delay
        setTimeout(() => {
          const tripData = mockTripData[tripId as keyof typeof mockTripData];
          if (!tripData) {
            setError('Trip not found');
            setLoading(false);
            return;
          }
          
          setTrip(tripData);
          // Set current date to the trip start date
          setCurrentDate(tripData.dates.start);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load trip details');
        setLoading(false);
      }
    };
    
    loadTrip();
  }, [tripId]);
  
  // Initialize filtered participants with all participants
  useEffect(() => {
    if (trip) {
      // Start with no filtered participants (show all)
      setFilteredParticipants([]);
    }
  }, [trip]);

  // Get all locations for the map
  const getAllLocations = () => {
    if (!trip) return [];
    
    const locations: Array<any> = [];
    
    // Add accommodations
    trip.accommodations.forEach((acc: any) => {
      locations.push({
        ...acc.location,
        name: acc.name,
        type: 'accommodation'
      });
    });
    
    // Add event locations with participant info
    trip.events.forEach((evt: any) => {
      // Skip if all participants of this event are filtered
      if (evt.participants && filteredParticipants.length > 0) {
        const allParticipantsFiltered = evt.participants.every(
          (id: string) => filteredParticipants.includes(id)
        );
        if (allParticipantsFiltered) return;
      }
      
      // Get first participant's color for this event
      let participantColor: string | null = null;
      let participantId: string | null = null;
      if (evt.participants && evt.participants.length > 0) {
        participantId = evt.participants[0];
        const participant = trip.participants.find((p: any) => p.id === participantId);
        if (participant) {
          participantColor = participant.color;
        }
      }
      
      locations.push({
        ...evt.location,
        name: evt.title,
        type: 'event',
        participantId,
        participantColor
      });
    });
    
    // Add transportation points with participant info
    trip.transportation.forEach((trans: any) => {
      // Skip if all participants are filtered
      if (trans.participants && filteredParticipants.length > 0) {
        const allParticipantsFiltered = trans.participants.every(
          (id: string) => filteredParticipants.includes(id)
        );
        if (allParticipantsFiltered) return;
      }
      
      // Get participant info
      let participantColor: string | null = null;
      let participantId: string | null = null;
      if (trans.participants && trans.participants.length > 0) {
        participantId = trans.participants[0];
        const participant = trip.participants.find((p: any) => p.id === participantId);
        if (participant) {
          participantColor = participant.color;
        }
      }
      
      locations.push({
        ...trans.from,
        type: 'transportation',
        participantId,
        participantColor
      });
      locations.push({
        ...trans.to,
        type: 'transportation',
        participantId,
        participantColor
      });
    });
    
    return locations;
  };
  
  // Modified to filter activities based on selected participants
  const getActivitiesForCurrentDate = () => {
    if (!trip || !currentDate) return [];
    
    const activities: Array<any> = [];
    
    // Add events for current date
    trip.events.forEach((evt: any) => {
      // Skip if this event is for a filtered participant
      if (evt.participants && filteredParticipants.length > 0) {
        const allParticipantsFiltered = evt.participants.every(
          (id: string) => filteredParticipants.includes(id)
        );
        if (allParticipantsFiltered) return;
      }
      
      if (evt.date === currentDate) {
        activities.push({
          ...evt,
          activityType: 'event'
        });
      }
    });
    
    // Add transportation for current date (filtered)
    trip.transportation.forEach((trans: any) => {
      if (trans.participants && filteredParticipants.length > 0) {
        const allParticipantsFiltered = trans.participants.every(
          (id: string) => filteredParticipants.includes(id)
        );
        if (allParticipantsFiltered) return;
      }
      
      if (trans.date === currentDate) {
        activities.push({
          ...trans,
          activityType: 'transportation'
        });
      }
    });
    
    // Check accommodations (filtering doesn't apply to accommodations)
    trip.accommodations.forEach((acc: any) => {
      if (acc.checkIn === currentDate) {
        activities.push({
          ...acc,
          activityType: 'check-in'
        });
      }
      if (acc.checkOut === currentDate) {
        activities.push({
          ...acc,
          activityType: 'check-out'
        });
      }
    });
    
    // Sort by time
    return activities.sort((a: any, b: any) => {
      const timeA = a.startTime || a.departureTime || '00:00';
      const timeB = b.startTime || b.departureTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  };
  
  // Get current location based on date
  const getCurrentLocation = () => {
    if (!trip || !currentDate) return null;
    
    // Find the current city from the route
    for (const city of trip.route) {
      const arriveDate = new Date(city.arriveDate);
      const leaveDate = new Date(city.leaveDate);
      const current = new Date(currentDate);
      
      if (current >= arriveDate && current <= leaveDate) {
        return city;
      }
    }
    
    return null;
  };
  
  // Function to get the icon for an activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sightseeing':
        return <FaMapMarkerAlt className="text-red-500" />;
      case 'activity':
        return <FaSuitcase className="text-blue-500" />;
      case 'transportation':
      case 'flight':
        return <FaPlane className="text-purple-500" />;
      case 'train':
        return <FaCar className="text-green-500" />;
      case 'check-in':
      case 'check-out':
        return <FaHotel className="text-teal-500" />;
      default:
        return <FaCalendarAlt className="text-gray-500" />;
    }
  };
  
  // Format time
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  // Handle timeline drag change with time
  const handleTimelineDragChange = (newDate: string, newTime?: string) => {
    if (newTime) {
      setCurrentTime(newTime);
    }
    
    // Filter activities that are happening at the current time
    if (trip && newDate) {
      // Here you would add logic to filter activities by time
      // and update the map view
    }
  };
  
  // Toggle participant filter
  const toggleParticipantFilter = (participantId: string) => {
    setFilteredParticipants(prev => {
      if (prev.includes(participantId)) {
        return prev.filter(id => id !== participantId);
      } else {
        return [...prev, participantId];
      }
    });
  };

  // Check if user can edit activity (only their own)
  const canEditActivity = (activity: any) => {
    if (!activity.participants) return false;
    return activity.participants.includes(currentUser);
  };

  // Toggle compare mode
  const toggleCompareMode = () => {
    setIsCompareMode(!isCompareMode);
    if (!isCompareMode) {
      // When entering compare mode, start with comparing to all other users
      const otherUsers = trip.participants
        .filter((p: any) => p.id !== currentUser)
        .map((p: any) => p.id);
      setCompareUsers(otherUsers);
    } else {
      setCompareUsers([]);
    }
  };

  // Toggle user for comparison
  const toggleCompareUser = (userId: string) => {
    setCompareUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Toggle side panel
  const toggleSidePanel = () => {
    setShowSidePanel(!showSidePanel);
  };

  // Toggle fullscreen map
  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  // Add useEffect to handle escape key for exiting fullscreen map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMapFullscreen) {
        toggleMapFullscreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMapFullscreen, toggleMapFullscreen]);

  // New function to handle saving an event
  const handleSaveEvent = (eventData: any) => {
    // In a real app, you would send this to an API
    // For now, we'll just update the local state
    
    if (currentEditingEvent) {
      // Update existing event
      const updatedEvents = trip.events.map((evt: any) => 
        evt.id === currentEditingEvent.id ? { ...evt, ...eventData } : evt
      );
      
      setTrip({
        ...trip,
        events: updatedEvents
      });
    } else {
      // Add new event with a generated ID
      const newEvent = {
        ...eventData,
        id: `evt${Date.now()}`, // Simple ID generation
        date: currentDate
      };
      
      setTrip({
        ...trip,
        events: [...trip.events, newEvent]
      });
    }
    
    setShowEventForm(false);
    setCurrentEditingEvent(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">{error || 'Failed to load trip'}</div>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentLocation = getCurrentLocation();
  const activitiesForDay = getActivitiesForCurrentDate();
  
  return (
    <div className="min-h-screen bg-gray-100 pt-[57px] overflow-auto">
      <div className={`relative ${isMapFullscreen ? 'h-[calc(100vh-57px)] overflow-hidden' : ''}`}>
        {/* Fullscreen Map Container */}
        {activeTab === 'map' && isMapFullscreen && (
          <div ref={mapContainerRef} className="absolute inset-0 z-10 flex">
            {/* Map area - adjusted width when side panel is open */}
            <div className={`h-full ${showSidePanel ? 'w-2/3' : 'w-full'} transition-all duration-300 relative`}>
              {/* Map wrapper with full height - timeline will be overlaid */}
              <div className="h-full w-full">
                <LeafletMapWrapper 
                  locations={getAllLocations()}
                  currentDay={currentDate}
                  currentTime={currentTime}
                  activitiesForCurrentDay={activitiesForDay}
                  filteredParticipants={filteredParticipants}
                />
              </div>
              
              {/* Floating controls for fullscreen map */}
              <div className="absolute top-4 left-4 right-4 z-[9999] flex justify-between">
                <button 
                  onClick={() => router.back()}
                  className="bg-white p-2 rounded-full shadow-lg text-gray-700 hover:bg-gray-100"
                >
                  <FaArrowLeft />
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={toggleSidePanel}
                    className="bg-white p-2 rounded-full shadow-lg text-gray-700 hover:bg-gray-100"
                    title={showSidePanel ? "Hide itinerary" : "Show itinerary"}
                  >
                    {showSidePanel ? <FaChevronRight /> : <FaChevronLeft />}
                  </button>
                  <button 
                    onClick={toggleMapFullscreen}
                    className="bg-white px-4 py-2 rounded-full shadow-lg text-gray-700 hover:bg-gray-100 flex items-center"
                    title="Exit fullscreen (ESC)"
                  >
                    <FaTimes className="mr-2" />
                    <span>Exit Fullscreen</span>
                  </button>
                </div>
              </div>
              
              {/* Timeline overlay positioned at the bottom and above the map */}
              <div className="h-auto w-full absolute bottom-0 left-0 right-0 z-[9999] bg-black bg-opacity-70 p-4 pt-3 backdrop-blur-sm">
                {/* Enhanced TimelineComponent */}
                <TimelineComponent 
                  trip={trip} 
                  currentDate={currentDate} 
                  setCurrentDate={setCurrentDate}
                  isDragging={timelineDragging}
                  setIsDragging={setTimelineDragging}
                  onDragChange={handleTimelineDragChange}
                />
              </div>
              
              {/* Current location badge */}
              {currentLocation && (
                <div className="absolute top-16 left-0 right-0 flex justify-center z-[9998]">
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center shadow-md">
                    <FaMapMarkerAlt className="mr-2" />
                    <span className="font-medium">Currently in: {currentLocation.name}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Side panel for itinerary in fullscreen map mode */}
            {showSidePanel && (
              <div className="h-full w-1/3 bg-white shadow-lg overflow-auto">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Itinerary</h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                        className={`p-2 rounded transition-all duration-200 ${
                          viewMode === 'calendar' 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300 transform active:scale-95' 
                            : 'hover:bg-gray-100 active:bg-gray-200 transform active:scale-95'
                        }`}
                        title={viewMode === 'list' ? 'Switch to Calendar View' : 'Switch to List View'}
                      >
                        {viewMode === 'list' ? <FaCalendarAlt /> : <FaList />}
                      </button>
                      <button 
                        onClick={toggleCompareMode}
                        className={`p-2 rounded transition-all duration-200 ${
                          isCompareMode 
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 active:bg-blue-300 transform active:scale-95' 
                            : 'hover:bg-gray-100 active:bg-gray-200 transform active:scale-95'
                        }`}
                        title="Compare Itineraries"
                      >
                        <FaExchangeAlt />
                      </button>
                      <button 
                        className="p-2 rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 transform active:scale-95"
                        title="Filter Travelers"
                        onClick={() => document.getElementById('traveler-filters')?.classList.toggle('hidden')}
                      >
                        <FaFilter />
                      </button>
                    </div>
                  </div>
                  
                  {/* Traveler filters */}
                  <div id="traveler-filters" className="mt-2 p-2 bg-gray-50 rounded-lg hidden">
                    <h3 className="text-sm font-medium mb-2">Show/Hide Travelers</h3>
                    <div className="space-y-2">
                      {trip.participants.map((participant: any) => (
                        <div key={participant.id} className="flex items-center">
                          <button
                            onClick={() => toggleParticipantFilter(participant.id)}
                            className={`p-1 rounded mr-2 ${filteredParticipants.includes(participant.id) ? 'text-gray-400' : 'text-gray-900'}`}
                          >
                            {filteredParticipants.includes(participant.id) ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <div className="flex items-center">
                            <span
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: participant.color }}
                            ></span>
                            <img
                              src={participant.avatar}
                              alt={participant.name}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className={`text-sm ${participant.id === currentUser ? 'font-bold' : ''} ${filteredParticipants.includes(participant.id) ? 'text-gray-400' : 'text-gray-900'}`}>
                              {participant.name} {participant.id === currentUser ? '(You)' : ''}
                            </span>
                          </div>
                          
                          {/* Compare checkbox in compare mode */}
                          {isCompareMode && participant.id !== currentUser && (
                            <button
                              onClick={() => toggleCompareUser(participant.id)}
                              className={`ml-auto p-1 rounded ${compareUsers.includes(participant.id) ? 'text-blue-600' : 'text-gray-400'}`}
                            >
                              <FaCheck />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Activities list / calendar view */}
                <div className="p-4">
                  {/* Current date header with add button */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium">
                      {currentDate ? `Activities on ${new Date(currentDate).toLocaleDateString()}` : 'Select a date'}
                    </h3>
                    {!showEventForm && (
                      <button 
                        onClick={() => {
                          setCurrentEditingEvent(null);
                          setShowEventForm(true);
                        }}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 transform active:scale-95 text-sm flex items-center shadow-sm hover:shadow"
                      >
                        <FaPlus className="mr-1" /> Add Activity
                      </button>
                    )}
                  </div>
                  
                  {/* Event Form */}
                  {showEventForm && (
                    <ItineraryEventForm
                      event={currentEditingEvent}
                      onSave={handleSaveEvent}
                      onCancel={() => {
                        setShowEventForm(false);
                        setCurrentEditingEvent(null);
                      }}
                      trip={trip}
                      currentDate={currentDate}
                    />
                  )}
                  
                  {/* Show calendar view if selected */}
                  {!showEventForm && viewMode === 'calendar' && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {/* Calendar header */}
                      <div className="border-b border-gray-200 py-2 px-4 bg-gray-50 flex items-center justify-between">
                        <h3 className="text-sm font-medium">{currentDate ? new Date(currentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}</h3>
                        <button 
                          onClick={() => {
                            setCurrentEditingEvent(null);
                            setShowEventForm(true);
                          }}
                          className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs flex items-center"
                        >
                          <FaPlus className="mr-1" /> Add
                        </button>
                      </div>
                      
                      {/* Time slots with events */}
                      <div className="relative">
                        {/* Time indicator column */}
                        <div className="absolute top-0 left-0 bottom-0 w-14 bg-gray-50 border-r border-gray-200 flex flex-col">
                          {Array.from({ length: 15 }).map((_, index) => {
                            const hour = index + 7; // Start at 7am
                            return (
                              <div 
                                key={hour} 
                                className="h-16 border-b border-gray-100 text-xs text-gray-500 font-medium flex items-start justify-end px-2 pt-1"
                              >
                                {hour === 12 ? '12pm' : hour > 12 ? `${hour-12}pm` : `${hour}am`}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Calendar content */}
                        <div className="ml-14 relative min-h-[800px]">
                          {/* Hour lines */}
                          {Array.from({ length: 15 }).map((_, index) => {
                            const hour = index + 7; // Start at 7am
                            return (
                              <div 
                                key={hour} 
                                className="absolute left-0 right-0 border-b border-gray-100 h-16"
                                style={{ top: `${index * 64}px` }}
                              >
                                {/* Half-hour line */}
                                <div className="absolute top-1/2 left-0 right-0 border-b border-gray-100 border-dashed opacity-50"></div>
                              </div>
                            );
                          })}
                          
                          {/* Current time indicator */}
                          {(() => {
                            const now = new Date();
                            const today = now.toISOString().split('T')[0];
                            
                            // Only show for current date
                            if (currentDate === today) {
                              const hours = now.getHours();
                              const minutes = now.getMinutes();
                              
                              // Only show if within visible range (7am-10pm)
                              if (hours >= 7 && hours < 22) {
                                const top = (hours - 7) * 64 + (minutes / 60) * 64;
                                
                                return (
                                  <div 
                                    className="absolute left-0 right-0 z-10"
                                    style={{ top: `${top}px` }}
                                  >
                                    <div className="absolute left-0 w-2 h-2 rounded-full bg-red-500 transform -translate-y-1/2 -translate-x-1"></div>
                                    <div className="border-t border-red-500 w-full"></div>
                                  </div>
                                );
                              }
                            }
                            return null;
                          })()}
                          
                          {/* Activity blocks */}
                          {activitiesForDay.map((activity: any, index: number) => {
                            // Skip all-day activities (no specific time)
                            if (!activity.startTime && !activity.departureTime) return null;
                            
                            const startHour = activity.startTime 
                              ? parseInt(activity.startTime.split(':')[0])
                              : (activity.departureTime ? parseInt(activity.departureTime.split(':')[0]) : 7); // Default to 7am if null
                              
                            const startMinute = activity.startTime 
                              ? parseInt(activity.startTime.split(':')[1])
                              : (activity.departureTime ? parseInt(activity.departureTime.split(':')[1]) : 0);
                              
                            const endHour = activity.endTime 
                              ? parseInt(activity.endTime.split(':')[0])
                              : (activity.arrivalTime ? parseInt(activity.arrivalTime.split(':')[0]) : startHour + 1);
                              
                            const endMinute = activity.endTime 
                              ? parseInt(activity.endTime.split(':')[1])
                              : (activity.arrivalTime ? parseInt(activity.arrivalTime.split(':')[1]) : 0);
                            
                            // Skip if outside our display range (7am-10pm)
                            if (startHour < 7 || startHour >= 22) return null;
                            
                            // Calculate position and height
                            const top = (startHour - 7) * 64 + (startMinute / 60) * 64;
                            const duration = (endHour - startHour) * 60 + (endMinute - startMinute);
                            const height = (duration / 60) * 64;
                            
                            // Determine color based on activity type
                            let bgColor = 'bg-gray-100';
                            let borderColor = 'border-gray-300';
                            let textColor = 'text-gray-800';
                            
                            if (activity.activityType === 'event') {
                              bgColor = 'bg-blue-50';
                              borderColor = 'border-blue-300';
                              textColor = 'text-blue-900';
                            } else if (activity.activityType === 'transportation') {
                              bgColor = 'bg-purple-50';
                              borderColor = 'border-purple-300';
                              textColor = 'text-purple-900';
                            } else if (activity.activityType === 'check-in') {
                              bgColor = 'bg-green-50';
                              borderColor = 'border-green-300';
                              textColor = 'text-green-900';
                            } else if (activity.activityType === 'check-out') {
                              bgColor = 'bg-red-50';
                              borderColor = 'border-red-300';
                              textColor = 'text-red-900';
                            }
                            
                            // If the activity belongs to a user with a color, use that color
                            if (activity.participants && activity.participants.length > 0) {
                              const participant = trip.participants.find((p: any) => p.id === activity.participants[0]);
                              if (participant) {
                                // Convert hex color to tailwind-like colors
                                const color = participant.color;
                                if (color === "#4f46e5") { // indigo
                                  bgColor = 'bg-indigo-50';
                                  borderColor = 'border-indigo-300';
                                  textColor = 'text-indigo-900';
                                } else if (color === "#10b981") { // emerald
                                  bgColor = 'bg-emerald-50';
                                  borderColor = 'border-emerald-300';
                                  textColor = 'text-emerald-900';
                                } else if (color === "#ef4444") { // red
                                  bgColor = 'bg-red-50';
                                  borderColor = 'border-red-300';
                                  textColor = 'text-red-900';
                                }
                              }
                            }
                            
                            // Add editable styling
                            const isEditable = canEditActivity(activity);
                            const editableBorder = isEditable ? 'border-l-4' : '';
                            
                            return (
                              <div 
                                key={index}
                                className={`absolute left-2 right-2 rounded-md ${bgColor} border ${borderColor} ${editableBorder} shadow-sm p-2 overflow-hidden`}
                                style={{ 
                                  top: `${top}px`, 
                                  height: `${Math.max(height, 32)}px`,
                                  borderLeftColor: isEditable ? activity.participants?.includes(currentUser) ? trip.participants.find((p: any) => p.id === currentUser)?.color : '' : ''
                                }}
                                onClick={() => {
                                  if (isEditable) {
                                    setCurrentEditingEvent(activity);
                                    setShowEventForm(true);
                                  }
                                }}
                              >
                                <div className={`text-xs font-medium ${textColor} truncate`}>
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
                                <div className={`text-xs ${textColor} opacity-75 truncate mt-1 flex items-center`}>
                                  <FaClock className="mr-1 text-xs" size={8} />
                                  {activity.startTime 
                                    ? `${formatTime(activity.startTime)} - ${formatTime(activity.endTime)}` 
                                    : (activity.departureTime 
                                      ? `${formatTime(activity.departureTime)} - ${formatTime(activity.arrivalTime)}` 
                                      : ''
                                    )}
                                </div>
                                
                                {/* Show location if available and there's enough space */}
                                {activity.location && height > 50 && (
                                  <div className={`text-xs ${textColor} opacity-75 truncate mt-1 flex items-center`}>
                                    <FaMapMarkerAlt className="mr-1 text-xs" size={8} />
                                    {activity.location.address.split(',')[0]}
                                  </div>
                                )}
                                
                                {/* Participants avatars if enough space */}
                                {activity.participants && activity.participants.length > 0 && height > 70 && (
                                  <div className="mt-1 flex -space-x-1">
                                    {activity.participants.slice(0, 3).map((userId: string) => {
                                      const participant = trip.participants.find((p: any) => p.id === userId);
                                      return participant ? (
                                        <img
                                          key={userId}
                                          src={participant.avatar}
                                          alt={participant.name}
                                          className="w-4 h-4 rounded-full border border-white"
                                          title={participant.name}
                                        />
                                      ) : null;
                                    })}
                                    {activity.participants.length > 3 && (
                                      <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] border border-white">
                                        +{activity.participants.length - 3}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          
                          {/* Empty state - no activities */}
                          {activitiesForDay.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center p-4">
                                <FaCalendarAlt className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                <p className="text-gray-500 text-sm">No activities planned for this day</p>
                                <button 
                                  onClick={() => {
                                    setCurrentEditingEvent(null);
                                    setShowEventForm(true);
                                  }}
                                  className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                                >
                                  Add Activity
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* List view - Classic Itinerary Style */}
                  {!showEventForm && viewMode === 'list' && (
                    <div className="py-2">
                      {/* Trip Summary at the top */}
                      <div className="mb-8 border-b pb-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs uppercase text-gray-500 mb-1">Destination</h4>
                            <p className="text-gray-900 border-b border-gray-300 pb-1">{trip.destination}</p>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase text-gray-500 mb-1">Duration</h4>
                            <p className="text-gray-900 border-b border-gray-300 pb-1">
                              {Math.ceil((new Date(trip.dates.end).getTime() - new Date(trip.dates.start).getTime()) / (1000 * 60 * 60 * 24))} days
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase text-gray-500 mb-1">Date</h4>
                            <p className="text-gray-900 border-b border-gray-300 pb-1">
                              {new Date(trip.dates.start).toLocaleDateString()} - {new Date(trip.dates.end).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase text-gray-500 mb-1">Departure</h4>
                            <p className="text-gray-900 border-b border-gray-300 pb-1">
                              {trip.transportation && trip.transportation[0] ? 
                                `${trip.transportation[0].from.name} at ${trip.transportation[0].departureTime}` : 
                                'Not specified'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Day by day itinerary */}
                      {activitiesForDay.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                              <FaCalendarAlt className="h-12 w-12 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No itinerary for this day</h3>
                            <p className="text-gray-500 mb-4">Add some activities to create your itinerary for this day.</p>
                            <button 
                              onClick={() => {
                                setCurrentEditingEvent(null);
                                setShowEventForm(true);
                              }}
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-flex items-center"
                            >
                              <FaPlus className="mr-2" /> Add Activity
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                              Day {Math.ceil((new Date(currentDate).getTime() - new Date(trip.dates.start).getTime()) / (1000 * 60 * 60 * 24)) + 1} - {currentLocation?.name || 'Travel Day'}
                            </h3>
                            <button 
                              onClick={() => {
                                setCurrentEditingEvent(null);
                                setShowEventForm(true);
                              }}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center"
                            >
                              <FaPlus className="mr-1" /> Add
                            </button>
                          </div>
                          
                          {/* Itinerary Timeline */}
                          <div className="relative pl-8 space-y-8">
                            {/* Vertical line */}
                            <div className="absolute top-0 left-3 bottom-0 w-0.5 bg-amber-200"></div>
                            
                            {/* Group activities by time of day */}
                            {(() => {
                              // Sort activities by start time
                              const sortedActivities = [...activitiesForDay].sort((a, b) => {
                                const timeA = a.startTime || a.departureTime || '00:00';
                                const timeB = b.startTime || b.departureTime || '00:00';
                                return timeA.localeCompare(timeB);
                              });
                              
                              // Group activities by time of day: morning (before 12), afternoon (12-17), evening (after 17)
                              const morning = sortedActivities.filter(a => {
                                const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                return hour < 12;
                              });
                              
                              const afternoon = sortedActivities.filter(a => {
                                const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                return hour >= 12 && hour < 17;
                              });
                              
                              const evening = sortedActivities.filter(a => {
                                const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                return hour >= 17;
                              });
                              
                              return (
                                <>
                                  {morning.length > 0 && (
                                    <div className="relative">
                                      <div className="absolute top-1 left-[-24px] w-6 h-6 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center z-10">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                      </div>
                                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                                        MORNING
                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                          ({formatTime(morning[0].startTime || morning[0].departureTime || '08:00')})
                                        </span>
                                      </h4>
                                      <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                          {morning[0].location && morning[0].location.lat && (
                                            <div className="rounded-lg overflow-hidden h-48 mb-4 relative">
                                              {/* This would be an actual image in a real implementation */}
                                              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                                <FaMapMarkerAlt className="text-gray-400 h-8 w-8" />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <div className="space-y-4">
                                          {morning.map((activity, index) => (
                                            <div 
                                              key={index} 
                                              className={`p-4 rounded-lg ${canEditActivity(activity) ? 'border-l-4 border-amber-500' : ''} ${index > 0 ? 'border-t border-gray-100 pt-4' : ''}`}
                                              onClick={() => {
                                                if (canEditActivity(activity)) {
                                                  setCurrentEditingEvent(activity);
                                                  setShowEventForm(true);
                                                }
                                              }}
                                            >
                                              <h5 className="font-medium text-lg mb-2">
                                                {activity.title || activity.name || 
                                                  (activity.activityType === 'transportation' ? 
                                                    `${activity.from.name} to ${activity.to.name}` : 
                                                    (activity.activityType === 'check-in' ? 
                                                      `Check-in: ${activity.name}` : 
                                                      `Check-out: ${activity.name}`
                                                    )
                                                  )
                                                }
                                              </h5>
                                              <div className="text-sm text-gray-500 flex items-center mb-2">
                                                <FaClock className="mr-2" />
                                                {activity.startTime 
                                                  ? `${formatTime(activity.startTime)} - ${formatTime(activity.endTime)}` 
                                                  : (activity.departureTime 
                                                    ? `${formatTime(activity.departureTime)} - ${formatTime(activity.arrivalTime)}` 
                                                    : 'All day'
                                                  )}
                                              </div>
                                              {activity.location && (
                                                <div className="text-sm text-gray-500 flex items-start mb-2">
                                                  <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                                                  <span>{activity.location.address}</span>
                                                </div>
                                              )}
                                              {activity.notes && (
                                                <p className="text-sm text-gray-600 mt-2">{activity.notes}</p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {afternoon.length > 0 && (
                                    <div className="relative">
                                      <div className="absolute top-1 left-[-24px] w-6 h-6 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center z-10">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                      </div>
                                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                                        AFTERNOON
                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                          ({formatTime(afternoon[0].startTime || afternoon[0].departureTime || '13:00')})
                                        </span>
                                      </h4>
                                      <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                          {afternoon[0].location && afternoon[0].location.lat && (
                                            <div className="rounded-lg overflow-hidden h-48 mb-4 relative">
                                              {/* This would be an actual image in a real implementation */}
                                              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                                <FaMapMarkerAlt className="text-gray-400 h-8 w-8" />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <div className="space-y-4">
                                          {afternoon.map((activity, index) => (
                                            <div 
                                              key={index} 
                                              className={`p-4 rounded-lg ${canEditActivity(activity) ? 'border-l-4 border-amber-500' : ''} ${index > 0 ? 'border-t border-gray-100 pt-4' : ''}`}
                                              onClick={() => {
                                                if (canEditActivity(activity)) {
                                                  setCurrentEditingEvent(activity);
                                                  setShowEventForm(true);
                                                }
                                              }}
                                            >
                                              <h5 className="font-medium text-lg mb-2">
                                                {activity.title || activity.name || 
                                                  (activity.activityType === 'transportation' ? 
                                                    `${activity.from.name} to ${activity.to.name}` : 
                                                    (activity.activityType === 'check-in' ? 
                                                      `Check-in: ${activity.name}` : 
                                                      `Check-out: ${activity.name}`
                                                    )
                                                  )
                                                }
                                              </h5>
                                              <div className="text-sm text-gray-500 flex items-center mb-2">
                                                <FaClock className="mr-2" />
                                                {activity.startTime 
                                                  ? `${formatTime(activity.startTime)} - ${formatTime(activity.endTime)}` 
                                                  : (activity.departureTime 
                                                    ? `${formatTime(activity.departureTime)} - ${formatTime(activity.arrivalTime)}` 
                                                    : 'All day'
                                                  )}
                                              </div>
                                              {activity.location && (
                                                <div className="text-sm text-gray-500 flex items-start mb-2">
                                                  <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                                                  <span>{activity.location.address}</span>
                                                </div>
                                              )}
                                              {activity.notes && (
                                                <p className="text-sm text-gray-600 mt-2">{activity.notes}</p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {evening.length > 0 && (
                                    <div className="relative">
                                      <div className="absolute top-1 left-[-24px] w-6 h-6 rounded-full bg-amber-500 border-4 border-white flex items-center justify-center z-10">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                      </div>
                                      <h4 className="text-md font-semibold text-gray-900 mb-4">
                                        EVENING
                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                          ({formatTime(evening[0].startTime || evening[0].departureTime || '18:00')})
                                        </span>
                                      </h4>
                                      <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                          {evening[0].location && evening[0].location.lat && (
                                            <div className="rounded-lg overflow-hidden h-48 mb-4 relative">
                                              {/* This would be an actual image in a real implementation */}
                                              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                                <FaMapMarkerAlt className="text-gray-400 h-8 w-8" />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <div className="space-y-4">
                                          {evening.map((activity, index) => (
                                            <div 
                                              key={index} 
                                              className={`p-4 rounded-lg ${canEditActivity(activity) ? 'border-l-4 border-amber-500' : ''} ${index > 0 ? 'border-t border-gray-100 pt-4' : ''}`}
                                              onClick={() => {
                                                if (canEditActivity(activity)) {
                                                  setCurrentEditingEvent(activity);
                                                  setShowEventForm(true);
                                                }
                                              }}
                                            >
                                              <h5 className="font-medium text-lg mb-2">
                                                {activity.title || activity.name || 
                                                  (activity.activityType === 'transportation' ? 
                                                    `${activity.from.name} to ${activity.to.name}` : 
                                                    (activity.activityType === 'check-in' ? 
                                                      `Check-in: ${activity.name}` : 
                                                      `Check-out: ${activity.name}`
                                                    )
                                                  )
                                                }
                                              </h5>
                                              <div className="text-sm text-gray-500 flex items-center mb-2">
                                                <FaClock className="mr-2" />
                                                {activity.startTime 
                                                  ? `${formatTime(activity.startTime)} - ${formatTime(activity.endTime)}` 
                                                  : (activity.departureTime 
                                                    ? `${formatTime(activity.departureTime)} - ${formatTime(activity.arrivalTime)}` 
                                                    : 'All day'
                                                  )}
                                              </div>
                                              {activity.location && (
                                                <div className="text-sm text-gray-500 flex items-start mb-2">
                                                  <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                                                  <span>{activity.location.address}</span>
                                                </div>
                                              )}
                                              {activity.notes && (
                                                <p className="text-sm text-gray-600 mt-2">{activity.notes}</p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Compare view in compare mode */}
                {isCompareMode && (
                  <div className="p-4 border-t border-gray-200">
                    <h3 className="text-md font-medium mb-4 flex items-center">
                      <FaExchangeAlt className="mr-2 text-blue-500" />
                      Comparing Itineraries
                    </h3>
                    
                    {/* Side-by-side comparison view */}
                    <div className="border rounded-lg overflow-hidden">
                      {/* Header row with traveler names */}
                      <div className="grid grid-cols-3 bg-gray-50 border-b">
                        <div className="p-3 font-medium text-sm border-r">Time</div>
                        <div className="p-3 font-medium text-sm border-r flex items-center">
                          <img 
                            src={trip.participants.find((p: any) => p.id === currentUser)?.avatar} 
                            alt="You" 
                            className="w-5 h-5 rounded-full mr-2"
                          />
                          Your Schedule
                        </div>
                        <div className="p-3 font-medium text-sm">
                          {compareUsers.length === 0 ? (
                            <span className="text-gray-400">Select travelers to compare</span>
                          ) : (
                            <div className="flex items-center">
                              <div className="flex -space-x-1 mr-2">
                                {compareUsers.slice(0, 3).map(userId => (
                                  <img 
                                    key={userId}
                                    src={trip.participants.find((p: any) => p.id === userId)?.avatar}
                                    alt={trip.participants.find((p: any) => p.id === userId)?.name}
                                    className="w-5 h-5 rounded-full border border-white"
                                  />
                                ))}
                                {compareUsers.length > 3 && (
                                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-white">
                                    +{compareUsers.length - 3}
                                  </div>
                                )}
                              </div>
                              <span>Other Travelers</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Time slots */}
                      {activitiesForDay.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          No activities scheduled for this day
                        </div>
                      ) : (
                        <>
                          {/* Morning */}
                          <div className="grid grid-cols-3 border-b">
                            <div className="p-3 bg-amber-50 border-r font-medium">Morning</div>
                            
                            {/* Your schedule */}
                            <div className="p-3 border-r">
                              {activitiesForDay
                                .filter(a => {
                                  const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                  return hour < 12 && a.participants && a.participants.includes(currentUser);
                                })
                                .map((activity, i) => (
                                  <div 
                                    key={i} 
                                    className="mb-2 last:mb-0 p-2 bg-indigo-50 rounded border-l-4"
                                    style={{ borderLeftColor: trip.participants.find((p: any) => p.id === currentUser)?.color }}
                                  >
                                    <div className="font-medium text-sm">
                                      {activity.title || activity.name || 
                                        (activity.activityType === 'transportation' ? 
                                         `${activity.from.name} to ${activity.to.name}` : 
                                         activity.activityType === 'check-in' ? 
                                         `Check-in: ${activity.name}` : 
                                         `Check-out: ${activity.name}`
                                        )
                                      }
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      <FaClock className="inline mr-1" />
                                      {activity.startTime 
                                        ? formatTime(activity.startTime)
                                        : activity.departureTime 
                                        ? formatTime(activity.departureTime)
                                        : ''}
                                    </div>
                                  </div>
                                ))}
                                {activitiesForDay
                                  .filter(a => {
                                    const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                    return hour < 12 && a.participants && a.participants.includes(currentUser);
                                  }).length === 0 && (
                                    <div className="text-sm text-gray-400 italic">No morning activities</div>
                                )}
                            </div>
                            
                            {/* Others' schedule */}
                            <div className="p-3">
                              {compareUsers.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                  <button
                                    onClick={() => document.getElementById('traveler-filters')?.classList.toggle('hidden')}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded text-sm transition-all duration-200 transform active:scale-95"
                                  >
                                    Select Travelers
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  {activitiesForDay
                                    .filter(a => {
                                      const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                      return hour < 12 && a.participants && a.participants.some(id => compareUsers.includes(id));
                                    })
                                    .map((activity, i) => {
                                      // Find the first participant who is being compared
                                      const participantId = activity.participants.find((id: string) => compareUsers.includes(id));
                                      const participant = trip.participants.find((p: any) => p.id === participantId);
                                      
                                      return (
                                        <div 
                                          key={i} 
                                          className="mb-2 last:mb-0 p-2 bg-gray-50 rounded border-l-4"
                                          style={{ borderLeftColor: participant?.color }}
                                        >
                                          <div className="font-medium text-sm flex items-center">
                                            <img 
                                              src={participant?.avatar} 
                                              alt={participant?.name} 
                                              className="w-4 h-4 rounded-full mr-1"
                                            />
                                            <span>
                                              {activity.title || activity.name || 
                                                (activity.activityType === 'transportation' ? 
                                                 `${activity.from.name} to ${activity.to.name}` : 
                                                 activity.activityType === 'check-in' ? 
                                                 `Check-in: ${activity.name}` : 
                                                 `Check-out: ${activity.name}`
                                                )
                                              }
                                            </span>
                                          </div>
                                          <div className="text-xs text-gray-500 mt-1">
                                            <FaClock className="inline mr-1" />
                                            {activity.startTime 
                                              ? formatTime(activity.startTime)
                                              : activity.departureTime 
                                              ? formatTime(activity.departureTime)
                                              : ''}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  {activitiesForDay
                                    .filter(a => {
                                      const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                      return hour < 12 && a.participants && a.participants.some(id => compareUsers.includes(id));
                                    }).length === 0 && (
                                      <div className="text-sm text-gray-400 italic">No morning activities</div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Afternoon */}
                          <div className="grid grid-cols-3 border-b">
                            <div className="p-3 bg-amber-50 border-r font-medium">Afternoon</div>
                            
                            {/* Your schedule */}
                            <div className="p-3 border-r">
                              {activitiesForDay
                                .filter(a => {
                                  const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                  return hour >= 12 && hour < 17 && a.participants && a.participants.includes(currentUser);
                                })
                                .map((activity, i) => (
                                  <div 
                                    key={i} 
                                    className="mb-2 last:mb-0 p-2 bg-indigo-50 rounded border-l-4"
                                    style={{ borderLeftColor: trip.participants.find((p: any) => p.id === currentUser)?.color }}
                                  >
                                    <div className="font-medium text-sm">
                                      {activity.title || activity.name || 
                                        (activity.activityType === 'transportation' ? 
                                         `${activity.from.name} to ${activity.to.name}` : 
                                         activity.activityType === 'check-in' ? 
                                         `Check-in: ${activity.name}` : 
                                         `Check-out: ${activity.name}`
                                        )
                                      }
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      <FaClock className="inline mr-1" />
                                      {activity.startTime 
                                        ? formatTime(activity.startTime)
                                        : activity.departureTime 
                                        ? formatTime(activity.departureTime)
                                        : ''}
                                    </div>
                                  </div>
                                ))}
                                {activitiesForDay
                                  .filter(a => {
                                    const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                    return hour >= 12 && hour < 17 && a.participants && a.participants.includes(currentUser);
                                  }).length === 0 && (
                                    <div className="text-sm text-gray-400 italic">No afternoon activities</div>
                                )}
                            </div>
                            
                            {/* Others' schedule */}
                            <div className="p-3">
                              {compareUsers.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                  <button
                                    onClick={() => document.getElementById('traveler-filters')?.classList.toggle('hidden')}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded text-sm transition-all duration-200 transform active:scale-95"
                                  >
                                    Select Travelers
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  {activitiesForDay
                                    .filter(a => {
                                      const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                      return hour >= 12 && hour < 17 && a.participants && a.participants.some(id => compareUsers.includes(id));
                                    })
                                    .map((activity, i) => {
                                      // Find the first participant who is being compared
                                      const participantId = activity.participants.find((id: string) => compareUsers.includes(id));
                                      const participant = trip.participants.find((p: any) => p.id === participantId);
                                      
                                      return (
                                        <div 
                                          key={i} 
                                          className="mb-2 last:mb-0 p-2 bg-gray-50 rounded border-l-4"
                                          style={{ borderLeftColor: participant?.color }}
                                        >
                                          <div className="font-medium text-sm flex items-center">
                                            <img 
                                              src={participant?.avatar} 
                                              alt={participant?.name} 
                                              className="w-4 h-4 rounded-full mr-1"
                                            />
                                            <span>
                                              {activity.title || activity.name || 
                                                (activity.activityType === 'transportation' ? 
                                                 `${activity.from.name} to ${activity.to.name}` : 
                                                 activity.activityType === 'check-in' ? 
                                                 `Check-in: ${activity.name}` : 
                                                 `Check-out: ${activity.name}`
                                                )
                                              }
                                            </span>
                                          </div>
                                          <div className="text-xs text-gray-500 mt-1">
                                            <FaClock className="inline mr-1" />
                                            {activity.startTime 
                                              ? formatTime(activity.startTime)
                                              : activity.departureTime 
                                              ? formatTime(activity.departureTime)
                                              : ''}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  {activitiesForDay
                                    .filter(a => {
                                      const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                      return hour >= 12 && hour < 17 && a.participants && a.participants.some(id => compareUsers.includes(id));
                                    }).length === 0 && (
                                      <div className="text-sm text-gray-400 italic">No afternoon activities</div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Evening */}
                          <div className="grid grid-cols-3">
                            <div className="p-3 bg-amber-50 border-r font-medium">Evening</div>
                            
                            {/* Your schedule */}
                            <div className="p-3 border-r">
                              {activitiesForDay
                                .filter(a => {
                                  const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                  return hour >= 17 && a.participants && a.participants.includes(currentUser);
                                })
                                .map((activity, i) => (
                                  <div 
                                    key={i} 
                                    className="mb-2 last:mb-0 p-2 bg-indigo-50 rounded border-l-4"
                                    style={{ borderLeftColor: trip.participants.find((p: any) => p.id === currentUser)?.color }}
                                  >
                                    <div className="font-medium text-sm">
                                      {activity.title || activity.name || 
                                        (activity.activityType === 'transportation' ? 
                                         `${activity.from.name} to ${activity.to.name}` : 
                                         activity.activityType === 'check-in' ? 
                                         `Check-in: ${activity.name}` : 
                                         `Check-out: ${activity.name}`
                                        )
                                      }
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      <FaClock className="inline mr-1" />
                                      {activity.startTime 
                                        ? formatTime(activity.startTime)
                                        : activity.departureTime 
                                        ? formatTime(activity.departureTime)
                                        : ''}
                                    </div>
                                  </div>
                                ))}
                                {activitiesForDay
                                  .filter(a => {
                                    const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                    return hour >= 17 && a.participants && a.participants.includes(currentUser);
                                  }).length === 0 && (
                                    <div className="text-sm text-gray-400 italic">No evening activities</div>
                                )}
                            </div>
                            
                            {/* Others' schedule */}
                            <div className="p-3">
                              {compareUsers.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                  <button
                                    onClick={() => document.getElementById('traveler-filters')?.classList.toggle('hidden')}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded text-sm transition-all duration-200 transform active:scale-95"
                                  >
                                    Select Travelers
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  {activitiesForDay
                                    .filter(a => {
                                      const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                      return hour >= 17 && a.participants && a.participants.some(id => compareUsers.includes(id));
                                    })
                                    .map((activity, i) => {
                                      // Find the first participant who is being compared
                                      const participantId = activity.participants.find((id: string) => compareUsers.includes(id));
                                      const participant = trip.participants.find((p: any) => p.id === participantId);
                                      
                                      return (
                                        <div 
                                          key={i} 
                                          className="mb-2 last:mb-0 p-2 bg-gray-50 rounded border-l-4"
                                          style={{ borderLeftColor: participant?.color }}
                                        >
                                          <div className="font-medium text-sm flex items-center">
                                            <img 
                                              src={participant?.avatar} 
                                              alt={participant?.name} 
                                              className="w-4 h-4 rounded-full mr-1"
                                            />
                                            <span>
                                              {activity.title || activity.name || 
                                                (activity.activityType === 'transportation' ? 
                                                 `${activity.from.name} to ${activity.to.name}` : 
                                                 activity.activityType === 'check-in' ? 
                                                 `Check-in: ${activity.name}` : 
                                                 `Check-out: ${activity.name}`
                                                )
                                              }
                                            </span>
                                          </div>
                                          <div className="text-xs text-gray-500 mt-1">
                                            <FaClock className="inline mr-1" />
                                            {activity.startTime 
                                              ? formatTime(activity.startTime)
                                              : activity.departureTime 
                                              ? formatTime(activity.departureTime)
                                              : ''}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  {activitiesForDay
                                    .filter(a => {
                                      const hour = parseInt((a.startTime || a.departureTime || '00:00').split(':')[0]);
                                      return hour >= 17 && a.participants && a.participants.some(id => compareUsers.includes(id));
                                    }).length === 0 && (
                                      <div className="text-sm text-gray-400 italic">No evening activities</div>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Non-fullscreen content */}
        {(activeTab !== 'map' || !isMapFullscreen) && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Back button and title */}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => router.back()}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FaArrowLeft className="mr-2" />
                <span>Back to Chat</span>
              </button>
              
              <h1 className="text-2xl font-bold text-center text-gray-800">{trip.name}</h1>
              
              <div className="w-24"></div> {/* Spacer for alignment */}
            </div>
            
            {/* Trip overview */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between flex-wrap">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{trip.name}</h2>
                  <p className="text-gray-600 mb-2">{trip.destination}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(trip.dates.start).toLocaleDateString()} - {new Date(trip.dates.end).toLocaleDateString()}
                    <span className="ml-2 text-gray-400">
                      ({Math.ceil((new Date(trip.dates.end).getTime() - new Date(trip.dates.start).getTime()) / (1000 * 60 * 60 * 24))} days)
                    </span>
                  </p>
                </div>
                
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-4">
                    {trip.participants.map((participant: any) => (
                      <img 
                        key={participant.id}
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-10 h-10 rounded-full border-2 border-white"
                        title={participant.name}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    {trip.participants.length} traveler{trip.participants.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              {trip.description && (
                <p className="text-gray-700 mt-4">{trip.description}</p>
              )}
            </div>
            
            {/* Timeline */}
            <div className="mb-6">
              <TimelineComponent 
                trip={trip} 
                currentDate={currentDate} 
                setCurrentDate={setCurrentDate}
                isDragging={timelineDragging}
                setIsDragging={setTimelineDragging}
                onDragChange={handleTimelineDragChange}
              />
            </div>
            
            {/* Current location badge */}
            {currentLocation && (
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span className="font-medium">Currently in: {currentLocation.name}</span>
                </div>
              </div>
            )}
            
            {/* Tab navigation */}
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg shadow-sm p-1 flex">
                <button
                  onClick={() => {
                    setActiveTab('map');
                    setIsMapFullscreen(true);
                  }}
                  className={`px-4 py-2 rounded ${activeTab === 'map' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaMap className="inline mr-2" />
                  Map View
                </button>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`px-4 py-2 rounded ${activeTab === 'itinerary' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaList className="inline mr-2" />
                  Itinerary
                </button>
                <button
                  onClick={() => setActiveTab('people')}
                  className={`px-4 py-2 rounded ${activeTab === 'people' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaUsers className="inline mr-2" />
                  People
                </button>
              </div>
            </div>
            
            {/* Content area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-auto">
              {/* Main content */}
              <div className={`lg:col-span-${showSuggestedActivities ? '2' : '3'} bg-white rounded-lg shadow-md p-6 overflow-auto`}>
                {activeTab === 'map' && !isMapFullscreen && (
                  <div className="h-[500px]">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Trip Map</h2>
                      <button 
                        onClick={toggleMapFullscreen}
                        className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                      >
                        <FaExpand className="mr-1" />
                        Fullscreen
                      </button>
                    </div>
                    <LeafletMapWrapper 
                      locations={getAllLocations()}
                      currentDay={currentDate}
                      currentTime={currentTime}
                      activitiesForCurrentDay={activitiesForDay}
                    />
                  </div>
                )}
                
                {activeTab === 'itinerary' && (
                  <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Daily Itinerary</h2>
                      <button className="text-blue-500 hover:text-blue-700 text-sm flex items-center">
                        <FaEdit className="mr-1" />
                        Edit Itinerary
                      </button>
                    </div>
                    
                    {activitiesForDay.length === 0 ? (
                      <div className="text-center py-8">
                        <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500">No activities planned for this day</p>
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                          Add Activity
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activitiesForDay.map((activity: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start">
                              <div className={`p-3 rounded-full mr-4 ${
                                activity.activityType === 'event' ? 'bg-blue-100' :
                                activity.activityType === 'transportation' ? 'bg-purple-100' :
                                activity.activityType === 'check-in' || activity.activityType === 'check-out' ? 'bg-green-100' :
                                'bg-gray-100'
                              }`}>
                                {activity.activityType === 'event' && <FaCalendarAlt className="text-blue-500" />}
                                {activity.activityType === 'transportation' && (
                                  activity.type === 'flight' ? <FaPlane className="text-purple-500" /> :
                                  activity.type === 'train' ? <FaCar className="text-green-500" /> :
                                  <FaCar className="text-orange-500" />
                                )}
                                {activity.activityType === 'check-in' && <FaHotel className="text-teal-500" />}
                                {activity.activityType === 'check-out' && <FaHotel className="text-red-500" />}
                              </div>
                              <div className="flex-grow">
                                <h3 className="font-medium text-lg">
                                  {activity.title || activity.name || 
                                    (activity.activityType === 'transportation' ? 
                                      `${activity.from.name} to ${activity.to.name}` : 
                                      (activity.activityType === 'check-in' ? 
                                        `Check-in: ${activity.name}` : 
                                        `Check-out: ${activity.name}`
                                      )
                                    )
                                  }
                                </h3>
                                <div className="text-sm text-gray-500 mt-1 flex items-center">
                                  <FaClock className="mr-1" />
                                  {activity.startTime ? `${formatTime(activity.startTime)} - ${formatTime(activity.endTime)}` :
                                    activity.departureTime ? `${formatTime(activity.departureTime)} - ${formatTime(activity.arrivalTime)}` :
                                    'All day'
                                  }
                                </div>
                                {activity.location && (
                                  <div className="text-sm text-gray-500 mt-1 flex items-center">
                                    <FaMapMarkerAlt className="mr-1" />
                                    {activity.location.address}
                                  </div>
                                )}
                                {activity.details && (
                                  <div className="text-sm text-gray-600 mt-2">
                                    {activity.details}
                                  </div>
                                )}
                                {activity.notes && (
                                  <div className="text-sm text-gray-600 mt-2 italic">
                                    {activity.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                            {activity.participants && (
                              <div className="mt-3 flex items-center">
                                <span className="text-xs text-gray-500 mr-2">Participants:</span>
                                <div className="flex -space-x-1">
                                  {activity.participants.map((userId: string) => {
                                    const participant = trip.participants.find((p: any) => p.id === userId);
                                    return participant ? (
                                      <img 
                                        key={userId}
                                        src={participant.avatar}
                                        alt={participant.name}
                                        className="w-6 h-6 rounded-full border border-white"
                                        title={participant.name}
                                      />
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'people' && (
                  <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-4">Trip Participants</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trip.participants.map((person: any) => (
                        <div key={person.id} className="border border-gray-200 rounded-lg p-4 flex">
                          <img 
                            src={person.avatar} 
                            alt={person.name}
                            className="w-16 h-16 rounded-full mr-4"
                          />
                          <div>
                            <h3 className="font-medium text-lg">{person.name}</h3>
                            {person.flightInfo && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 flex items-center">
                                  <FaPlane className="mr-1 text-blue-500" />
                                  Flight: {person.flightInfo.flightNumber}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Arrival: {new Date(person.flightInfo.arrival).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Departure: {new Date(person.flightInfo.departure).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Suggested activities sidebar */}
              <div className={`${showSuggestedActivities ? 'block' : 'hidden lg:block'} bg-white rounded-lg shadow-md p-6`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Suggested Activities</h2>
                  <button 
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                    onClick={() => setShowSuggestedActivities(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[calc(100vh-230px)] overflow-y-auto pr-2">
                  {trip.suggestedActivities.map((activity: any) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {activity.image && (
                        <img 
                          src={activity.image} 
                          alt={activity.title}
                          className="w-full h-32 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-medium">{activity.title}</h3>
                        <div className="text-sm text-gray-500 mt-1 flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {activity.location.address}
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>{activity.price}</span>
                          <span>{activity.duration}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {activity.description}
                        </p>
                        <button className="mt-3 w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                          Add to Itinerary
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Mobile show suggested activities button */}
            <div className="fixed bottom-4 right-4 lg:hidden">
              <button 
                onClick={() => setShowSuggestedActivities(!showSuggestedActivities)}
                className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
              >
                {showSuggestedActivities ? <FaTimes /> : <FaPlus />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetailsPage; 