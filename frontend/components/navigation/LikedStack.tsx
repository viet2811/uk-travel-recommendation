import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LikedAreaScreen from 'components/liked/LikedAreaScreen';
import LikedScreen from '../screens/LikedScreen';
import { colors } from 'theme/colors';
import { Attraction } from 'types/attraction';

export type LikedRootStackParamList = {
  FilterListAll: { items: Attraction[]; areaName: string };
  LikedMain: undefined;
};

const LikedStack = createNativeStackNavigator<LikedRootStackParamList>();

export default function LikedStackScreen() {
  return (
    <LikedStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'ios_from_right',
      }}>
      <LikedStack.Screen name="LikedMain" component={LikedScreen} />
      <LikedStack.Screen name="FilterListAll" component={LikedAreaScreen} />
    </LikedStack.Navigator>
  );
}
