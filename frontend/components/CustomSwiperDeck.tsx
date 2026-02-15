import { useEffect, useRef, useState, useMemo } from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
import { Attraction } from 'types/attraction';
import AttractionCard, { AttractionCardRef } from './AttractionCard';
import { useSharedValue } from 'react-native-reanimated';
import { colors } from 'theme/colors';
import { Ellipsis, Heart, X } from 'lucide-react-native';
import { useInfiniteQuery } from '@tanstack/react-query'; // Changed to Infinite
import { dislikeAttraction, getRecommendations, likeAttraction } from 'api/attraction';

export default function CustomSwiperDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const topCardRef = useRef<AttractionCardRef>(null);
  const animatedValue = useSharedValue(0);
  const MAX_ITEM = 3;

  // 1. Use useInfiniteQuery to handle batching
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations(), // Backend returns 10
    getNextPageParam: (lastPage, allPages) => allPages.length, // Simple increment for page tracking
    initialPageParam: 0,
  });

  // 2. Flatten the pages into a single array for the deck
  const allRecommendations = useMemo(() => {
    if (!data) return [];
    const flatList = data.pages.flatMap((page) => page);

    const seenIds = new Set();
    return flatList.filter((attraction) => {
      if (seenIds.has(attraction.id)) return false;
      seenIds.add(attraction.id);
      return true;
    });
  }, [data]);

  // 3. Trigger fetch when 5 cards are left
  useEffect(() => {
    // 1. Guard: Don't do anything if we are already loading the initial data
    if (isLoading) return;

    // 2. Guard: Don't fetch if a request is already in flight
    if (isFetchingNextPage) return;

    // 3. Guard: Don't fetch if there is no more data to get
    if (!hasNextPage) return;

    const cardsRemaining = allRecommendations.length - currentIndex;

    // 4. Only trigger if we are actually low on cards AND have cards to begin with
    if (allRecommendations.length > 0 && cardsRemaining <= 5) {
      fetchNextPage();
    }
  }, [currentIndex, allRecommendations.length, isFetchingNextPage, hasNextPage, isLoading]);

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
        // Keep the rendering optimization
        if (index > currentIndex + MAX_ITEM || index < currentIndex) {
          return null;
        }
        return (
          <AttractionCard
            ref={index === currentIndex ? topCardRef : undefined}
            item={attraction}
            key={`${attraction.id}`} // Composite key to avoid issues with duplicates
            index={index}
            dataLength={allRecommendations.length}
            maxVisibleItem={MAX_ITEM}
            currentIndex={currentIndex}
            animatedValue={animatedValue}
            setCurrentIndex={setCurrentIndex}
            onSwipeLeft={() => dislikeAttraction(attraction.id)}
            onSwipeRight={() => likeAttraction(attraction.id)}
          />
        );
      })}

      {/* Optional: Indicator that more cards are loading in the background */}
      {isFetchingNextPage && (
        <View className="absolute top-10 self-center rounded-full bg-white/80 p-2">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

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
