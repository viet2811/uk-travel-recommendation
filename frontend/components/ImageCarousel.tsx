import { useState, useRef } from 'react';
import { Dimensions, Text, View, Image } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';

// Use your image_path array here
const width = Dimensions.get('window').width;

export default function ImageCarousel({ images }: { images: string[] }) {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View
      className="w-full items-center"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      {containerWidth > 0 && (
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
              className="h-full w-full rounded-2xl"
              resizeMode="cover"
            />
          )}
        />
      )}

      {images.length > 1 && (
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
      )}
    </View>
  );
}
