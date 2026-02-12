import { Text, View, Linking, useWindowDimensions } from 'react-native';
import {
  MapPin,
  Volleyball,
  LucideProps,
  Landmark,
  FerrisWheel,
  Handbag,
  Leaf,
  Waves,
  PawPrint,
  Pyramid,
  Home,
  Users,
  Link2,
} from 'lucide-react-native';
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
import { runOnJS, scheduleOnRN } from 'react-native-worklets';

type CategoryConfig = {
  icon: React.ComponentType<LucideProps>;
  label: string;
};

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  history_culture: { icon: Landmark, label: 'History & Culture' },
  topspot: { icon: Users, label: 'Tourist Attraction' },
  sports: { icon: Volleyball, label: 'Sports' },
  entertainment: { icon: FerrisWheel, label: 'Entertainment' },
  shopping: { icon: Handbag, label: 'Shopping' },
  natural: { icon: Leaf, label: 'Nature' },
  sea: { icon: Waves, label: 'Sea' },
  animals: { icon: PawPrint, label: 'Animals' },
  architecture: { icon: Pyramid, label: 'Architecture' },
};

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
};

export default function AttractionCard({
  item,
  index,
  dataLength,
  maxVisibleItem,
  currentIndex,
  animatedValue,
  setCurrentIndex,
}: AttractionCardProps) {
  // ignore county as it could make the str long; case where there's only country(Gibraltar, Isle of Man)
  const locationStr = item.county === '' ? item.country : `${item.county}, ${item.country}`;
  const labels = item.parentTypeLabel.split(',');
  const userLocation = useLocation();

  // Animation
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const direction = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const isSwipeRight = e.translationX > 0;
      direction.value = isSwipeRight ? 1 : -1;
      if (currentIndex === index) {
        translateX.value = e.translationX;
        animatedValue.value = interpolate(Math.abs(e.translationX), [0, width], [index, index + 1]);
      }
    })
    .onEnd((e) => {
      if (currentIndex === index) {
        if (Math.abs(e.translationX) > 150 || Math.abs(e.velocityX) > 1000) {
          translateX.value = withTiming(width * 1.2 * direction.value, {}, () => {
            scheduleOnRN(setCurrentIndex, currentIndex + 1);
          });
          animatedValue.value = withTiming(currentIndex + 1);
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
          <Text className="bold font-bold text-xl text-accent">{item.name}</Text>
          <View className="flex-row items-center gap-x-1">
            <Home size={14} className="text-foreground" />
            <Text className="font-sans text-sm text-foreground">{locationStr}</Text>
          </View>

          <View className="flex-row items-center gap-x-1">
            <MapPin size={14} className="text-foreground" />
            <Text className="font-sans text-sm text-foreground">
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
        <ImageCarousel images={item.image_path} />
        <View
          className={`max-h-11 min-h-11 gap-x-3 gap-y-1 ${labels.length > 2 ? 'flex-row flex-wrap' : ''} `}>
          {labels.map((label) => {
            // Get config from map, or use default if slug doesn't exist
            const config = CATEGORY_MAP[label];
            const IconComponent = config.icon;

            return (
              <View key={label} className="flex-row items-center gap-x-1">
                <IconComponent size={16} className="text-foreground" />
                <Text className="font-sans text-sm text-foreground">{config.label}</Text>
              </View>
            );
          })}
          {labels.length == 1 && (
            <View className="flex-row items-center gap-x-1">
              <Link2 size={16} className="text-foreground" />
              <Text
                className="font-sans text-sm text-foreground underline"
                onPress={() => Linking.openURL(item.wikipedia)}>
                More on Wikipedia
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </GestureDetector>

    // <ExpandableText summary={item.summary} />
  );
}
