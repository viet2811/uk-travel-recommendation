import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dislikeAttraction, getRecommendations, likeAttraction } from 'api/attraction';
import { Attraction } from 'types/attraction';

export function useRecommendations() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
    Attraction[]
  >({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations(),
    getNextPageParam: (lastPage, allPages) => (lastPage.length > 0 ? allPages.length : undefined),
    initialPageParam: 0,
  });

  const allRecommendations = useMemo(() => {
    if (!data) return [];
    const seenIds = new Set<string>();
    return data.pages
      .flatMap((page) => page)
      .filter((attraction) => {
        if (seenIds.has(attraction.id)) return false;
        seenIds.add(attraction.id);
        return true;
      });
  }, [data]);

  // Fetch next page when 5 cards remain
  useEffect(() => {
    if (isLoading || isFetchingNextPage || !hasNextPage) return;
    const cardsRemaining = allRecommendations.length - currentIndex;
    if (allRecommendations.length > 0 && cardsRemaining <= 5) {
      fetchNextPage();
    }
  }, [currentIndex, allRecommendations.length, isFetchingNextPage, hasNextPage, isLoading]);

  // Reset index when query is invalidated and refreshed from scratch
  const prevPagesLength = useRef(0);
  useEffect(() => {
    const curPagesLength = data?.pages.length ?? 0;
    if (prevPagesLength.current > 1 && curPagesLength <= 1) {
      setCurrentIndex(0);
    }
    prevPagesLength.current = curPagesLength;
  }, [data?.pages.length]);

  // Swipe actions
  const likeMutation = useMutation({
    mutationFn: (id: string) => likeAttraction(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['likedHistory'] }),
  });

  const onSwipeLeft = (id: string) => dislikeAttraction(id);
  const onSwipeRight = (id: string) => likeMutation.mutate(id);

  return {
    allRecommendations,
    currentIndex,
    setCurrentIndex,
    isLoading,
    onSwipeLeft,
    onSwipeRight,
  };
}
