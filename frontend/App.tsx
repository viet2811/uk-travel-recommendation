import { useFonts, Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import * as SplashScreen from 'expo-splash-screen';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import './global.css';
import BottomTabs from 'components/navigation/BottomTabs';
import { LocationProvider } from 'context/LocationContext';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();
export default function App() {
  const [loaded, error] = useFonts({
    Outfit: Outfit_400Regular,
    'Outfit-Bold': Outfit_700Bold,
    SpaceMono: SpaceMono_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      // Once fonts are ready (or failed), hide the splash screen
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Render nothing while fonts are loading to avoid a flash of unstyled text
  if (!loaded && !error) {
    return null;
  }

  return (
    <LocationProvider>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </LocationProvider>
  );
}
