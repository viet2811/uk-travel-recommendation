import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Attraction } from 'types/attraction';
import { testItems } from './testItems';
import AttractionCard from './AttractionCard';
import { useSharedValue } from 'react-native-reanimated';
import { colors } from 'theme/colors';
import { Ellipsis, Heart, X } from 'lucide-react-native';

export default function CustomSwiperDeck() {
  const [cardList, setCardList] = useState<Attraction[]>(testItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useSharedValue(0);
  const MAX_ITEM = 3;
  return (
    <View className="flex-1">
      {cardList.map((attraction, index) => {
        if (index > currentIndex + MAX_ITEM || index < currentIndex) {
          return null;
        }
        return (
          <AttractionCard
            item={attraction}
            key={index}
            index={index}
            dataLength={cardList.length}
            maxVisibleItem={MAX_ITEM}
            currentIndex={currentIndex}
            animatedValue={animatedValue}
            setCurrentIndex={setCurrentIndex}
          />
        );
      })}

      <View className="absolute bottom-6 w-1/2 flex-row justify-between self-center">
        <Pressable className="rounded-full border border-border p-3">
          <X size={32} color={colors.destructive} />
        </Pressable>
        <Pressable className="rounded-full border border-border p-3">
          <Ellipsis size={32} color={colors.border} />
        </Pressable>
        <Pressable className="rounded-full border border-border p-3">
          <Heart size={32} color={colors.secondary} />
        </Pressable>
      </View>
    </View>
  );
}
