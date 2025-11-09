'use client';

import { useMemo } from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

export default function Page() {
  // Load Google Maps script using your API Key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Put your key in .env.local
  });

  // Map center coordinates (example: New York City)
  const center = useMemo(() => ({ lat: 40.7128, lng: -74.006 }), []);

  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMap mapContainerStyle={{ height: '100%', width: '100%' }} zoom={12} center={center}>
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}
