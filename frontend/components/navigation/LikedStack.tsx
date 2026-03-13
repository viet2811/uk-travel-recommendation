import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FilterListView from 'components/history/FilterListView';
import LikeHistoryScreen from 'components/screens/LikeHistoryScreen';
import { colors } from 'theme/colors';
import { Attraction } from 'types/attraction';

export type LikedRootStackParamList = {
  FilterListAll: { items: Attraction[]; catName: string };
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
      <LikedStack.Screen name="LikedMain" component={LikeHistoryScreen} />
      <LikedStack.Screen name="FilterListAll" component={FilterListView} />
    </LikedStack.Navigator>
  );
}
