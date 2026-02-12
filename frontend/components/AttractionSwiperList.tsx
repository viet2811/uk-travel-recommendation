import React, { useCallback, useRef } from 'react';
import { Attraction } from 'types/attraction';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';
import { Pressable, View } from 'react-native';
import AttractionCard from './AttractionCard';
import { colors } from 'theme/colors';
import { Ellipsis, Heart, X } from 'lucide-react-native';

export default function AttractionSwiperList({ attractions }: { attractions: Attraction[] }) {
  const ref = useRef<SwiperCardRefType>(null);

  const renderCard = useCallback((attraction: Attraction) => {
    return <AttractionCard item={attraction} />;
  }, []);

  const OverlayLabelLeft = useCallback(() => {
    return (
      <View>
        <X size={36} color={colors.destructive} />
      </View>
    );
  }, []);

  const OverlayLabelRight = useCallback(() => {
    return (
      <View>
        <Heart size={36} color={colors.secondary} fill={colors.secondary} />
      </View>
    );
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1">
        <Swiper
          ref={ref}
          data={attractions}
          renderCard={renderCard}
          disableBottomSwipe={true}
          direction="x"
          disableTopSwipe={true}
          onSwipeLeft={() => console.log('Dislike')}
          onSwipeRight={() => console.log('Like')}
          cardStyle={{ width: '100%', flex: 1 }}
          prerenderItems={3}
          OverlayLabelLeft={OverlayLabelLeft}
          OverlayLabelRight={OverlayLabelRight}
        />
      </View>

      <View className="absolute bottom-0 w-1/2 flex-row justify-between self-center">
        <Pressable
          className="rounded-full border border-border p-3"
          onPress={() => ref.current?.swipeLeft()}>
          <X size={32} color={colors.destructive} />
        </Pressable>
        <Pressable className="rounded-full border border-border p-3">
          <Ellipsis size={32} color={colors.border} />
        </Pressable>
        <Pressable
          className="rounded-full border border-border p-3"
          onPress={() => ref.current?.swipeRight()}>
          <Heart size={32} color={colors.secondary} />
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}
