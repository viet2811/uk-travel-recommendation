import { Text } from 'components/ui/Text';
import { Globe, LayoutList, Map } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Attraction } from 'types/attraction';
import { Image } from 'expo-image';
import { CATEGORY_MAP } from 'components/ui/CategoryIcon';
import { colors } from 'theme/colors';
import { useQuery } from '@tanstack/react-query';
import { getLikedAttraction } from 'api/attraction';
import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';

const R2_URL = process.env.EXPO_PUBLIC_R2_URL;

const countryFlags: Record<string, any> = {
  England: require('../../assets/images/england.png'),
  Scotland: require('../../assets/images/scotland.png'),
  Wales: require('../../assets/images/wales.png'),
  'Northern Ireland': require('../../assets/images/northern-ireland.png'),
  'Isle of Man': require('../../assets/images/isle_of_man.png'),
  Gibraltar: require('../../assets/images/gibraltar.png'),
};

function HistoryCard({ item }: { item: Attraction }) {
  const labels = item.parentTypeLabel.split(',');

  return (
    <View className="h-[300px] w-[49%] overflow-hidden rounded-2xl border border-border bg-card pb-2">
      <Image
        source={{
          uri: `${R2_URL}/${item.image_path[0]}`,
        }}
        style={{ width: '100%', height: '75%' }}
        contentFit="cover"
      />
      <View className="mb-2 px-3 pt-2">
        {/* TODO: With long name, fade? */}
        <Text className="font-bold text-base !text-accent" numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text className="text-sm" numberOfLines={1} ellipsizeMode="tail">
          {item.county !== '' ? item.county : item.country}
        </Text>
        <View className="mt-1.5 flex-row justify-between">
          <Image
            source={countryFlags[item.country]}
            style={{
              height: 16,
              width: 24,
              borderWidth: 1,
              borderColor: colors.foreground,
              borderRadius: 2,
            }}
            contentFit="cover"
          />
          <View className="flex-row gap-1">
            {labels.map((label) => {
              // Get config from map, or use default if slug doesn't exist
              const config = CATEGORY_MAP[label];
              const IconComponent = config.icon;

              return (
                <IconComponent
                  size={16}
                  className="text-foreground"
                  key={`${item.id}-${label}_icon`}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

function ViewAll({ items }: { items: Attraction[] }) {
  return (
    <View className="mb-32 flex-row flex-wrap justify-between gap-2">
      {items.map((attraction) => (
        <HistoryCard item={attraction} key={`${attraction.id}-historyCard`} />
      ))}
    </View>
  );
}

type ViewDropdownProps = {
  curView: string;
  setCurView: React.Dispatch<React.SetStateAction<string>>;
};

const viewOption = [
  { label: 'List All', value: 'all' },
  { label: 'By County', value: 'county' },
  { label: 'By Region', value: 'region' },
  { label: 'By Country', value: 'country' },
  { label: 'Map View', value: 'map' },
];

function ViewDropdown({ curView, setCurView }: ViewDropdownProps) {
  return (
    <View className="w-48">
      <Dropdown
        data={viewOption}
        value={curView}
        labelField="label"
        valueField="value"
        onChange={(item) => setCurView(item.value)}
        style={{
          borderWidth: 1,
          borderColor: colors.input,
          backgroundColor: colors.card,
          borderRadius: 4,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        selectedTextStyle={{
          fontSize: 14,
          color: colors.foreground,
          fontFamily: 'Outfit',
          paddingLeft: 6,
        }}
        placeholderStyle={{
          color: colors.foreground,
          fontFamily: 'Outfit',
        }}
        containerStyle={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 6,
        }}
        renderItem={(item) => {
          const isSelected = item.value === curView;
          const Icon =
            item.value === 'map'
              ? Map
              : ['region', 'county', 'country'].includes(item.value)
                ? Globe
                : LayoutList;
          return (
            <View
              className={`flex-row items-center rounded px-2 py-2 ${isSelected ? 'bg-accent' : 'bg-card'}`}>
              <Icon
                size={16}
                color={isSelected ? colors['accent-foreground'] : colors.foreground}
              />

              <Text className={`ml-2 ${isSelected ? 'text-accent-foreground' : 'text-foreground'}`}>
                {item.label}
              </Text>
            </View>
          );
        }}
        renderLeftIcon={() => {
          if (!curView) return null;
          const Icon =
            curView === 'map'
              ? Map
              : ['region', 'county', 'country'].includes(curView)
                ? Globe
                : LayoutList;
          return <Icon size={16} />;
        }}
      />
    </View>
  );
}

export default function LikeHistoryScreen() {
  const { data: attractions, isLoading } = useQuery<Attraction[]>({
    queryKey: ['likedHistory'],
    queryFn: getLikedAttraction,
  });

  const [curView, setCurView] = useState('all');

  return (
    <ScrollView className="flex-1 bg-background px-6 pb-10 pt-20">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="font-bold text-2xl !text-accent">Liked Attractions</Text>
        <ViewDropdown curView={curView} setCurView={setCurView} />
      </View>
      {attractions && !isLoading ? (
        <ViewAll items={attractions} />
      ) : (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </ScrollView>
  );
}
