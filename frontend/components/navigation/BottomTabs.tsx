import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import { Binoculars, Heart, Settings } from 'lucide-react-native';
import { colors } from 'theme/colors';
import LikeHistoryScreen from 'components/screens/LikeHistoryScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabScreens() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: '#F8F1E0',
        },

        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.border,
      }}>
      <Tab.Screen
        name="Discovery"
        component={DiscoveryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Binoculars color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Liked"
        component={LikeHistoryScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Heart
              color={color}
              size={size}
              fill={focused ? color : 'transparent'}
              strokeWidth={focused ? 0 : 2}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={DiscoveryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
