import { View } from 'react-native';
import AttractionSwiperList from 'components/AttractionSwiperList';
import { testItems } from 'components/testItems';

export default function DiscoveryScreen() {
  return (
    <View className="flex-1 bg-background px-6 pb-10 pt-32">
      <AttractionSwiperList attractions={testItems} />
    </View>
  );
}
