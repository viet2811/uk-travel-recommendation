import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GeoAreaPickerScreen from 'components/screens/GeoAreaPickerScreen';
import SettingScreen from 'components/screens/SettingScreen';
import { colors } from 'theme/colors';

const SettingStack = createNativeStackNavigator();

export default function LikedStackScreen() {
  return (
    <SettingStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <SettingStack.Screen name="Settings" component={SettingScreen} />
      <SettingStack.Screen name="UpdateGeoFilter" component={GeoAreaPickerScreen} />
      {/* <SettingStack.Screen name="FilterListAll" component={LikedAreaScreen} /> */}
    </SettingStack.Navigator>
  );
}
