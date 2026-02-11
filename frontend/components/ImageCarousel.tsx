import { useState, useRef } from 'react';
import { Dimensions, Text, View, Image, Pressable } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';

const width = Dimensions.get('window').width;

export default function ImageCarousel({ images }: { images: string[] }) {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const goPrev = () => {
    const newIndex = Math.max(0, Math.floor(progress.value) - 1);
    ref.current?.scrollTo({ count: newIndex - progress.value, animated: true });
  };

  const goNext = () => {
    const newIndex = Math.min(images.length - 1, Math.ceil(progress.value) + 1);
    ref.current?.scrollTo({ count: newIndex - progress.value, animated: true });
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({ count: index - progress.value, animated: true });
  };

  return (
    <View
      className="w-full items-center"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      {containerWidth > 0 && (
        <View style={{ width: containerWidth, height: 400 }}>
          {/* Left clickable area */}
          <Pressable
            onPress={goPrev}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: containerWidth / 2,
              zIndex: 1,
            }}
          />

          {/* Right clickable area */}
          <Pressable
            onPress={goNext}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: containerWidth / 2,
              zIndex: 1,
            }}
          />

          <Carousel
            ref={ref}
            width={containerWidth}
            height={400}
            data={images}
            enabled={images.length > 1}
            onProgressChange={progress}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: '100%', height: '100%', borderRadius: 16 }}
                resizeMode="cover"
              />
            )}
          />
        </View>
      )}

      {images.length > 1 ? (
        <Pagination.Basic
          progress={progress}
          data={images}
          dotStyle={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            width: 30,
            height: 4,
            borderRadius: 2,
          }}
          activeDotStyle={{
            backgroundColor: '#cb4b16',
            width: 30,
          }}
          containerStyle={{ gap: 8, marginTop: 8 }}
          onPress={onPressPagination}
        />
      ) : (
        <View className="h-3"></View>
      )}
    </View>
  );
}
