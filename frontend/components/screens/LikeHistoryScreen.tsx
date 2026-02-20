import { Text } from 'components/ui/Text';
import { Globe, LayoutList, Map } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Attraction } from 'types/attraction';

import { colors } from 'theme/colors';
import { useQuery } from '@tanstack/react-query';
import { getLikedAttraction } from 'api/attraction';
import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import ListAllView from 'components/history/ListAllView';
import HistoryMapView from 'components/history/HistoryMapView';
import GeoFilterView from 'components/history/GeoFilterView';

type ViewDropdownProps = {
  curView: string;
  setCurView: React.Dispatch<React.SetStateAction<string>>;
};

const viewOption = [
  { label: 'Map View', value: 'map' },
  { label: 'By County', value: 'county' },
  { label: 'By Region', value: 'region' },
  { label: 'By Country', value: 'country' },
  { label: 'List All', value: 'all' },
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

              <Text
                className={`ml-2 ${isSelected ? '!text-accent-foreground' : 'text-foreground'}`}>
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

  const [curView, setCurView] = useState('country');

  return (
    <View className="flex-1 bg-background">
      {attractions && !isLoading ? (
        curView === 'all' ? (
          <ListAllView items={attractions} />
        ) : curView === 'map' ? (
          <HistoryMapView items={attractions} />
        ) : (
          <GeoFilterView items={attractions} geo={curView} />
        )
      ) : (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-6 pt-20">
        {curView !== 'map' && (
          <Text className="font-bold text-2xl !text-accent">Liked Attractions</Text>
        )}

        <View className={`${curView === 'map' ? 'ml-auto' : ''}`}>
          <ViewDropdown curView={curView} setCurView={setCurView} />
        </View>
      </View>
    </View>
  );
}
