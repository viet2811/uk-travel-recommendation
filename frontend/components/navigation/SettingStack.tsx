import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GeoAreaPicker from 'components/screens/GeoAreaPicker';
import SettingScreen from 'components/screens/SettingScreen';

const SettingStack = createNativeStackNavigator();

export default function LikedStackScreen() {
  return (
    <SettingStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingStack.Screen name="Settings" component={SettingScreen} />
      <SettingStack.Screen name="UpdateGeoFilter" component={GeoAreaPicker} />
      {/* <SettingStack.Screen name="FilterListAll" component={FilterListView} /> */}
    </SettingStack.Navigator>
  );
}
