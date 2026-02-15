import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Attraction } from 'types/attraction';
import AttractionCard, { AttractionCardRef } from './AttractionCard';
import { useSharedValue } from 'react-native-reanimated';
import { colors } from 'theme/colors';
import { Ellipsis, Heart, X } from 'lucide-react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { dislikeAttraction, getRecommendations, likeAttraction } from 'api/attraction';
import { Text } from './ui/Text';

export default function CustomSwiperDeck() {
  //TODO: fetch new cards after 5 have been swiped
  const { data: recommendations, isLoading } = useQuery<Attraction[]>({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations(),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const topCardRef = useRef<AttractionCardRef>(null);

  const animatedValue = useSharedValue(0);
  const MAX_ITEM = 3;

  if (!recommendations && isLoading) {
    return (
      <View className="flex-1">
        <Text>Spinning or skeleton</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {recommendations?.map((attraction, index) => {
        if (index > currentIndex + MAX_ITEM || index < currentIndex) {
          return null;
        }
        return (
          <AttractionCard
            ref={index === currentIndex ? topCardRef : undefined}
            item={attraction}
            key={attraction.id}
            index={index}
            dataLength={recommendations.length}
            maxVisibleItem={MAX_ITEM}
            currentIndex={currentIndex}
            animatedValue={animatedValue}
            setCurrentIndex={setCurrentIndex}
            onSwipeLeft={() => console.log('Dislike')} //dislikeAttraction(attraction.id)}
            onSwipeRight={() => console.log('Like')} //likeAttraction(attraction.id)}
          />
        );
      })}

      <View className="absolute bottom-6 w-1/2 flex-row justify-between self-center">
        <Pressable
          className="rounded-full border border-border p-3"
          onPress={() => topCardRef.current?.swipeLeft()}>
          <X size={32} color={colors.destructive} />
        </Pressable>
        <Pressable className="rounded-full border border-border p-3">
          <Ellipsis size={32} color={colors.border} />
        </Pressable>
        <Pressable
          className="rounded-full border border-border p-3"
          onPress={() => topCardRef.current?.swipeRight()}>
          <Heart size={32} color={colors.secondary} />
        </Pressable>
      </View>
    </View>
  );
}
