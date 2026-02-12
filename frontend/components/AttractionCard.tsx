import { Text, View, Image, Linking, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { colors } from 'theme/colors';
import { useLocation } from 'context/LocationContext';

function ExpandableText({ summary }: { summary: string }) {
  const lineLimit = 3;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);

  return (
    <View className="mt-4 gap-y-2 rounded-xl border border-border bg-card p-6 shadow-sm">
      <Text className="font-bold text-xl text-foreground">About this attraction</Text>

      <View>
        <Text
          className="font-sans leading-relaxed text-foreground"
          numberOfLines={isExpanded ? undefined : lineLimit}
          onTextLayout={(e) => {
            if (e.nativeEvent.lines.length >= lineLimit && !isExpanded) {
              setShowSeeMore(true);
            }
          }}>
          {summary}
        </Text>

        {showSeeMore && (
          <Pressable onPress={() => setIsExpanded(!isExpanded)} className="mt-1" hitSlop={10}>
            <Text className="font-bold text-primary">{isExpanded ? 'Show less' : 'See more'}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

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

// distanceHelper.ts
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

export default function AttractionCard({ item }: { item: Attraction }) {
  // ignore county as it could make the str long; case where there's only country(Gibraltar, Isle of Man)
  const locationStr = item.county === '' ? item.country : `${item.county}, ${item.country}`;
  const labels = item.parentTypeLabel.split(',');
  const userLocation = useLocation();

  return (
    <View className="gap-y-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <View>
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
    </View>

    // <ExpandableText summary={item.summary} />
  );
}
