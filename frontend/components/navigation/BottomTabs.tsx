import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import { Binoculars, Heart, Settings, User } from 'lucide-react-native';
import { colors } from 'theme/colors';
import LikedStack from './LikedStack';
import SettingStack from './SettingStack';

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
        component={LikedStack}
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
        name="Profile"
        component={SettingStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <User color={color} size={size} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
