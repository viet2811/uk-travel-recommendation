import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GeoAreaPickerScreen from '../screens/GeoAreaPickerScreen';
import { colors } from 'theme/colors';
import PreferenceScreen from 'components/screens/PreferenceScreen';
import AttractionImport from 'components/screens/AttractionImport';

const Stack = createNativeStackNavigator();

export default function PreferenceStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="PreferenceCat" component={PreferenceScreen} />
      <Stack.Screen name="PreferenceArea" component={GeoAreaPickerScreen} />
      <Stack.Screen name="PreferenceImport" component={AttractionImport} />
    </Stack.Navigator>
  );
}
