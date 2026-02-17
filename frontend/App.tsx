/* For font */
import { useFonts, Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import * as SplashScreen from 'expo-splash-screen';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import './global.css';

/* Gesture Animation */
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';

/* React-Navigation */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* General React */
import React, { useEffect } from 'react';
import { LocationProvider } from 'context/LocationContext';
import BottomTabs from 'components/navigation/BottomTabs';
import WelcomeScreen from 'components/screens/WelcomeScreen';
import { LoginScreen, RegisterScreen } from 'components/screens/UserAuthScreen';
import { AuthProvider, useAuth } from 'context/AuthContext';
import PreferenceScreen from 'components/screens/PreferenceScreen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  strict: false,
});

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const RootStack = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? 'Main' : 'Landing'}>
      <Stack.Screen name="Landing" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Preference" component={PreferenceScreen} />
      <Stack.Screen name="Main" component={BottomTabs} />
    </Stack.Navigator>
  );
};

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <GestureHandlerRootView className="flex-1">
            <NavigationContainer>
              {/* <BottomTabs /> */}
              <RootStack />
            </NavigationContainer>
          </GestureHandlerRootView>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
