import { View, Linking, useWindowDimensions } from 'react-native';
import { Text } from './ui/Text';
import { MapPin, Home, Link2 } from 'lucide-react-native';
import { Attraction } from 'types/attraction';
import ImageCarousel from './ImageCarousel';
import { useLocation } from 'context/LocationContext';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { forwardRef, useImperativeHandle } from 'react';
import { CATEGORY_MAP } from './ui/CategoryIcon';

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.floor(R * c); // Distance in km
}

type AttractionCardProps = {
  item: Attraction;
  index: number;
  dataLength: number;
  maxVisibleItem: number;
  currentIndex: number;
  animatedValue: SharedValue<number>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

export type AttractionCardRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

const AttractionCard = forwardRef<AttractionCardRef, AttractionCardProps>(
  (
    {
      item,
      index,
      dataLength,
      maxVisibleItem,
      currentIndex,
      animatedValue,
      setCurrentIndex,
      onSwipeLeft,
      onSwipeRight,
    },
    ref
  ) => {
    // ignore county as it could make the str long; case where there's only country(Gibraltar, Isle of Man)
    const locationStr = item.county === '' ? item.country : `${item.county}, ${item.country}`;
    const labels = item.parentTypeLabel.split(',');
    const userLocation = useLocation();

    // Animation
    const { width } = useWindowDimensions();
    const translateX = useSharedValue(0);
    const direction = useSharedValue(0);

    const swipe = (dir: 1 | -1) => {
      if (currentIndex !== index) return;
      direction.value = dir;

      translateX.value = withTiming(width * 1.2 * dir, {}, () => {
        scheduleOnRN(setCurrentIndex, currentIndex + 1);
      });
      animatedValue.value = withTiming(currentIndex + 1);

      dir === -1 ? onSwipeLeft() : onSwipeRight();
    };

    useImperativeHandle(ref, () => ({
      swipeLeft: () => swipe(-1),
      swipeRight: () => swipe(1),
    }));

    const pan = Gesture.Pan()
      .onUpdate((e) => {
        const isSwipeRight = e.translationX > 0;
        direction.value = isSwipeRight ? 1 : -1;
        if (currentIndex === index) {
          translateX.value = e.translationX;
          animatedValue.value = interpolate(
            Math.abs(e.translationX),
            [0, width],
            [index, index + 1]
          );
        }
      })
      .onEnd((e) => {
        if (currentIndex === index) {
          if (Math.abs(e.translationX) > 150 || Math.abs(e.velocityX) > 1000) {
            translateX.value = withTiming(width * 1.2 * direction.value, {}, () => {
              scheduleOnRN(setCurrentIndex, currentIndex + 1);
            });
            animatedValue.value = withTiming(currentIndex + 1);
            direction.value === -1 ? scheduleOnRN(onSwipeLeft) : scheduleOnRN(onSwipeRight);
          } else {
            translateX.value = withTiming(0, { duration: 500 });
            animatedValue.value = withTiming(currentIndex, { duration: 500 });
          }
        }
      });

    const animatedStyle = useAnimatedStyle(() => {
      const currentItem = index === currentIndex;
      const rotateZ = interpolate(Math.abs(translateX.value), [0, width], [0, 20]);
      const translateY = interpolate(animatedValue.value, [index - 1, index], [-30, 0]);
      const opacity = interpolate(animatedValue.value + maxVisibleItem, [index, index + 1], [0, 1]);
      const scale = interpolate(animatedValue.value, [index - 1, index], [0.94, 1]);

      return {
        transform: [
          { scale: currentItem ? 1 : scale },
          { translateY: currentItem ? 0 : translateY },
          { translateX: translateX.value },
          { rotateZ: currentItem ? `${direction.value * rotateZ}deg` : '0deg' },
        ],
        opacity: index < maxVisibleItem + currentIndex ? 1 : opacity,
      };
    });
    return (
      <GestureDetector gesture={pan}>
        <Animated.View
          className="absolute w-full gap-y-2 rounded-2xl border border-border bg-card p-6 shadow-sm"
          style={[
            {
              zIndex: dataLength - index,
            },
            animatedStyle,
          ]}>
          <View className="flex-1">
            <Text className="font-bold text-xl !text-accent" numberOfLines={1}>
              {item.name}
            </Text>
            <View className="flex-row items-center gap-x-1">
              <Home size={14} className="text-foreground" />
              <Text className="text-sm">{locationStr}</Text>
            </View>

            <View className="flex-row items-center gap-x-1">
              <MapPin size={14} className="text-foreground" />
              <Text className="text-sm">
                {!userLocation
                  ? 'Distance unavailable'
                  : `${getDistanceFromLatLonInKm(
                      userLocation.latitude,
                      userLocation.longitude,
                      item.latitude,
                      item.longtitude
                    )} km away`}
              </Text>
            </View>
          </View>
          <ImageCarousel images={item.image_path} height={420} />
          <View
            className={`max-h-11 min-h-11 gap-x-3 gap-y-1 ${labels.length > 2 ? 'flex-row flex-wrap' : ''} `}>
            {labels.map((label) => {
              // Get config from map, or use default if slug doesn't exist
              const config = CATEGORY_MAP[label];
              const IconComponent = config.icon;

              return (
                <View key={label} className="flex-row items-center gap-x-1">
                  <IconComponent size={16} className="text-foreground" />
                  <Text className=" text-sm">{config.label}</Text>
                </View>
              );
            })}
            {labels.length == 1 && (
              <View className="flex-row items-center gap-x-1">
                <Link2 size={16} className="text-foreground" />
                <Text className="text-sm underline" onPress={() => Linking.openURL(item.wikipedia)}>
                  More on Wikipedia
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

export default AttractionCard;
// <ExpandableText summary={item.summary} />
