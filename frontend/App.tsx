import { useFonts, Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import * as SplashScreen from 'expo-splash-screen';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import './global.css';
import BottomTabs from 'components/navigation/BottomTabs';
import { LocationProvider } from 'context/LocationContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import WelcomeScreen from 'components/screens/WelcomeScreen';
import { LoginScreen, RegisterScreen } from 'components/screens/UserAuthScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  strict: false,
});

const Stack = createNativeStackNavigator();

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
  const loggedIn = false;
  const RootStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={loggedIn ? 'Main' : 'Landing'}>
        <Stack.Screen name="Landing" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={BottomTabs} />
      </Stack.Navigator>
    );
  };

  return (
    <LocationProvider>
      <GestureHandlerRootView className="flex-1">
        <NavigationContainer>
          {/* <BottomTabs /> */}
          <RootStack />
        </NavigationContainer>
      </GestureHandlerRootView>
    </LocationProvider>
  );
}
