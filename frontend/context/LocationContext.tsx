// LocationContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';

type LocationCoords = { latitude: number; longitude: number } | null;

const LocationContext = createContext<LocationCoords>(null);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationCoords>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch (err) {
        console.error('Error getting location', err);
      }
    })();
  }, []);

  return <LocationContext.Provider value={location}>{children}</LocationContext.Provider>;
};

// Custom hook to access location
export const useLocation = () => useContext(LocationContext);
