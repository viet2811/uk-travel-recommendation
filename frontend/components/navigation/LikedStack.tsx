import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LikedAreaScreen from 'components/liked/LikedAreaScreen';
import LikedScreen from '../screens/LikedScreen';
import { colors } from 'theme/colors';
import { Attraction } from 'types/attraction';

export type LikedRootStackParamList = {
  LikedAreaScreen: { items: Attraction[]; areaName: string };
  LikedMain: undefined;
};

const Stack = createNativeStackNavigator<LikedRootStackParamList>();

export default function LikedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'ios_from_right',
      }}>
      <Stack.Screen name="LikedMain" component={LikedScreen} />
      <Stack.Screen name="LikedAreaScreen" component={LikedAreaScreen} />
    </Stack.Navigator>
  );
}
