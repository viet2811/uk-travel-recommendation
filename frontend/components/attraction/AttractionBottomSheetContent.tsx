import { Image } from 'expo-image';
import { CATEGORY_MAP } from 'components/ui/CategoryIcon';
import { useState } from 'react';
import { Text } from 'components/ui/Text';
import { Linking, View } from 'react-native';
import { Attraction } from 'types/attraction';
import { Link2 } from 'lucide-react-native';
import ExpandableText from 'components/ui/ExpandableText';

const R2_URL = process.env.EXPO_PUBLIC_R2_URL;

const SameRatioImage = ({ image_path }: { image_path: string }) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isPortrait, setIsPortrait] = useState(false);

  return (
    <Image
      source={{ uri: `${R2_URL}/${image_path}` }}
      style={{
        // Condition 1: Landscape = 100% width.
        // Condition 2: Portrait = 75% width.
        width: isPortrait ? '75%' : '100%',
        aspectRatio: aspectRatio,
        borderRadius: 16,
      }}
      contentFit="cover"
      onLoad={(e) => {
        const { width, height } = e.source;
        setAspectRatio(width / height);
        setIsPortrait(height > width); // Detect verticality
      }}
    />
  );
};

export default function AttractionBottomSheetContent({ item }: { item: Attraction }) {
  const labels = item.parentTypeLabel.split(',');

  return (
    <View className="gap-y-3 pb-12">
      <View>
        <Text className="text-red- font-bold text-2xl !text-accent">{item.name}</Text>
        <Text>
          {Array.from(
            new Set([item.county, item.region, item.country].filter((part) => part !== ''))
          ).join(', ')}
        </Text>
      </View>
      <SameRatioImage image_path={item.image_path[0]} />
      <View
        className={`max-h-11 min-h-11 gap-x-3 gap-y-2 ${labels.length > 2 ? 'flex-row flex-wrap' : ''} `}>
        {labels.map((label) => {
          // Get config from map, or use default if slug doesn't exist
          const config = CATEGORY_MAP[label];
          const IconComponent = config.icon;

          return (
            <View key={label} className="flex-row items-center gap-x-1">
              <IconComponent size={16} className="text-foreground" />
              <Text>{config.label}</Text>
            </View>
          );
        })}
        {labels.length == 1 && (
          <View className="flex-row items-center gap-x-1">
            <Link2 size={16} className="text-foreground" />
            <Text className="underline" onPress={() => Linking.openURL(item.wikipedia)}>
              More on Wikipedia
            </Text>
          </View>
        )}
      </View>
      <View>
        {/* <Text>{item.typeLabel}</Text> */}
        <ExpandableText lineLimit={4} text={item.summary} />
      </View>
    </View>
  );
}
