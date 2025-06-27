import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
// react-leaflet components are not strictly necessary for basic setup if using L directly
// but could be used for more declarative approach. For now, using L directly.

// Default Ganei Tikva coordinates
const GANETI_TIKVA_COORDS = [32.0552, 34.8742];

const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null); // To store map instance

  useEffect(() => {
    // Initialize map only if it hasn't been initialized yet
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView(GANETI_TIKVA_COORDS, 14); // Set view and zoom

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add a marker for Ganei Tikva
      L.marker(GANETI_TIKVA_COORDS).addTo(map)
        .bindPopup('גני תקווה')
        .openPopup();

      mapInstanceRef.current = map; // Store the map instance
    }

    // Cleanup function to remove map instance when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return <div id="map" ref={mapRef} style={{ width: '100%', height: '450px' }} />;
};

export default MapComponent;
