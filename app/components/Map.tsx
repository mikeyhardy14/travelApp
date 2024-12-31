// app/components/Map.tsx
"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  lat: number;
  lng: number;
  label: string;
}

const Map: React.FC<{ locations: Location[] }> = ({ locations }) => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} className="h-96 w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc, index) => (
        <Marker key={index} position={[loc.lat, loc.lng]}>
          <Popup>{loc.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
