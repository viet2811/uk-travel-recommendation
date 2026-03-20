import { View } from 'react-native';
import { Attraction } from 'types/attraction';
import LikedCard from './LikedCard';
import { ScrollView } from 'react-native-gesture-handler';
import { useRef } from 'react';
import AttractionBottomSheet, { AttractionBottomSheetRef } from 'hooks/useAttractionBottomSheet';

export default function ListAllView({ items }: { items: Attraction[] }) {
  const sheetRef = useRef<AttractionBottomSheetRef>(null);
  return (
    <ScrollView className="mt-32 px-6">
      <View className="mb-20 mt-3 flex-row flex-wrap justify-between gap-2">
        {items.map((attraction) => (
          <LikedCard
            item={attraction}
            key={`${attraction.id}-LikedCard`}
            onPress={() => sheetRef?.current?.open(attraction)}
          />
        ))}
      </View>
      <AttractionBottomSheet ref={sheetRef} opacity={0.4} />
    </ScrollView>
  );
}
