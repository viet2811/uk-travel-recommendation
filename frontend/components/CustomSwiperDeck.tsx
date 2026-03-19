import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Pressable, View, ActivityIndicator } from 'react-native';
import { Attraction } from 'types/attraction';
import AttractionCard, { AttractionCardRef } from './AttractionCard';
import { useSharedValue } from 'react-native-reanimated';
import { colors } from 'theme/colors';
import { Ellipsis, Heart, X } from 'lucide-react-native';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dislikeAttraction, getRecommendations, likeAttraction } from 'api/attraction';

const MAX_ITEM = 3;

export default function CustomSwiperDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const topCardRef = useRef<AttractionCardRef>(null);
  const animatedValue = useSharedValue(0);

  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
    Attraction[]
  >({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations(),
    getNextPageParam: (lastPage, allPages) => (lastPage.length > 0 ? allPages.length : undefined),
    initialPageParam: 0,
  });

  const likeMutation = useMutation({
    mutationFn: (id: string) => likeAttraction(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['likedHistory'] }),
  });

  const allRecommendations = useMemo(() => {
    if (!data) return [];
    const flatList = data.pages.flatMap((page) => page);

    // Avoid repeating the remain 5 items, which is not recorded in the backend
    const seenIds = new Set<string>();
    return flatList.filter((attraction) => {
      if (seenIds.has(attraction.id)) return false;
      seenIds.add(attraction.id);
      return true;
    });
  }, [data]);

  // Trigger fetch when 5 cards are left
  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return; //Avoid refetching 3x times at the beginning

    const cardsRemaining = allRecommendations.length - currentIndex;
    if (allRecommendations.length > 0 && cardsRemaining <= 5) {
      fetchNextPage();
    }
  }, [currentIndex, allRecommendations.length, isFetchingNextPage, hasNextPage, isLoading]);

  // Reset index when the queries is invalidated and refreshed
  const prevPagesLength = useRef(0);
  useEffect(() => {
    const curPagesLength = data?.pages.length ?? 0;
    if (prevPagesLength.current > 1 && curPagesLength <= 1) {
      setCurrentIndex(0);
    }
    prevPagesLength.current = curPagesLength;
  }, [data?.pages.length]);

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
            onSwipeLeft={() => dislikeAttraction(attraction.id)}
            onSwipeRight={() => likeMutation.mutate(attraction.id)}
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
          {/* TODO: show summary  */}
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
