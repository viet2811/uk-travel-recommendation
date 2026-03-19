import { useRef } from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
import AttractionCard, { AttractionCardRef } from './AttractionCard';
import { useSharedValue } from 'react-native-reanimated';
import { colors } from 'theme/colors';
import { Ellipsis, Heart, X } from 'lucide-react-native';
import { useRecommendations } from 'hooks/useRecommendation';
import AttractionBottomSheet, { AttractionBottomSheetRef } from 'hooks/useAttractionBottomSheet';

const MAX_ITEM = 3;

export default function CustomSwiperDeck() {
  const topCardRef = useRef<AttractionCardRef>(null);
  const bottomSheetRef = useRef<AttractionBottomSheetRef>(null);
  const animatedValue = useSharedValue(0);

  const {
    allRecommendations,
    currentIndex,
    setCurrentIndex,
    isLoading,
    onSwipeLeft,
    onSwipeRight,
  } = useRecommendations();

  if (isLoading && allRecommendations.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {allRecommendations.map((attraction, index) => {
        if (index > currentIndex + MAX_ITEM || index < currentIndex) {
          return null;
        }
        return (
          <AttractionCard
            ref={index === currentIndex ? topCardRef : undefined}
            item={attraction}
            key={attraction.id}
            index={index}
            dataLength={allRecommendations.length}
            maxVisibleItem={MAX_ITEM}
            currentIndex={currentIndex}
            animatedValue={animatedValue}
            setCurrentIndex={setCurrentIndex}
            onSwipeLeft={() => onSwipeLeft(attraction.id)}
            onSwipeRight={() => onSwipeRight(attraction.id)}
          />
        );
      })}

      <View className="absolute bottom-6 w-1/2 flex-row justify-between self-center">
        <Pressable
          className="rounded-full border border-border p-3"
          onPress={() => topCardRef.current?.swipeLeft()}>
          <X size={32} color={colors.destructive} />
        </Pressable>
        <Pressable
          className="rounded-full border border-border p-3"
          onPress={() => bottomSheetRef?.current?.open(allRecommendations[currentIndex])}>
          <Ellipsis size={32} color={colors.border} />
        </Pressable>
        <Pressable
          className="rounded-full border border-border p-3"
          onPress={() => topCardRef.current?.swipeRight()}>
          <Heart size={32} color={colors.secondary} />
        </Pressable>
      </View>
      <AttractionBottomSheet ref={bottomSheetRef} opacity={0.4} />
    </View>
  );
}
