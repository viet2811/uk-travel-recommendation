import { Text, View, Image, Linking, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Link2,
  Volleyball,
  Camera,
  LucideProps,
  Landmark,
  FerrisWheel,
  Handbag,
  Leaf,
  Waves,
  PawPrint,
  Pyramid,
} from 'lucide-react-native';
import { Attraction } from 'types/attraction';
import ImageCarousel from './ImageCarousel';

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
            // If the actual line count is greater than our limit, show the button
            if (e.nativeEvent.lines.length >= lineLimit && !isExpanded) {
              setShowSeeMore(true);
            }
          }}>
          {summary}
        </Text>

        {showSeeMore && (
          <Pressable
            onPress={() => setIsExpanded(!isExpanded)}
            className="mt-1" // Small margin to keep it tight to the text
            hitSlop={10} // Makes it easier to tap
          >
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
  topspot: { icon: Camera, label: 'Tourist Topspot' },
  sports: { icon: Volleyball, label: 'Sports' },
  entertainment: { icon: FerrisWheel, label: 'Entertainment' },
  shopping: { icon: Handbag, label: 'Shopping' },
  natural: { icon: Leaf, label: 'Nature' },
  sea: { icon: Waves, label: 'Sea' },
  animals: { icon: PawPrint, label: 'Animals' },
  architecture: { icon: Pyramid, label: 'Architecture' },
};

export default function AttractionView({ item }: { item: Attraction }) {
  const uniqueLocations = Array.from(
    new Set([item.county, item.region, item.country].filter((part) => part !== ''))
  );
  const labels = item.parentTypeLabel.split(',');
  return (
    <>
      <View className="mt-4 gap-y-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <View>
          <Text className="bold font-bold text-3xl text-accent">{item.name}</Text>
          <View className="flex-row items-center gap-x-1">
            <MapPin size={14} className="text-foreground" />
            <Text className="font-sans text-sm text-foreground">{uniqueLocations.join(', ')}</Text>
          </View>
        </View>
        <ImageCarousel images={item.image_path} />
        {labels.map((label) => {
          // Get config from map, or use default if slug doesn't exist
          const config = CATEGORY_MAP[label];
          const IconComponent = config.icon;

          return (
            <View key={label} className="flex-row items-center gap-x-2 align-middle">
              <IconComponent size={16} className="text-foreground" />
              <Text className="font-sans text-foreground">{config.label}</Text>
            </View>
          );
        })}
      </View>
      {/* <View className="flex-row items-center gap-x-2 align-middle">
          <Link2 size={16} className="text-foreground" />
          <Text
            className="font-sans text-foreground underline"
            onPress={() => Linking.openURL(item.wikipedia)}>
            More on Wikipedia
          </Text>
        </View> */}

      {/* <ExpandableText summary={item.summary} /> */}
    </>
  );
}
