import { View } from 'react-native';
import CustomSwiperDeck from 'components/CustomSwiperDeck';

export default function DiscoveryScreen() {
  return (
    <View className="flex-1 bg-background px-6 pb-10 pt-32">
      <CustomSwiperDeck />
    </View>
  );
}
