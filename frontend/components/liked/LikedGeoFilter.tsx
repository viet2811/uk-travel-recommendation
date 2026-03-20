import { Pressable, ScrollView, View } from 'react-native';
import { Text } from 'components/ui/Text';
import { colors } from 'theme/colors';
import { ChevronRight } from 'lucide-react-native';
import { Attraction } from 'types/attraction';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import countriesLayout from '../../assets/layouts/countries-layout.json';
import regionsLayout from '../../assets/layouts/regions-layout.json';
import countiesLayout from '../../assets/layouts/counties-layout.json';
import { countryFlags } from './LikedCard';
import Svg, { Path } from 'react-native-svg';

function GeoCard({
  geo,
  geoName,
  attractions,
}: {
  geo: string;
  geoName: string;
  attractions: Attraction[];
}) {
  const nav = useNavigation();
  let MapComponent: React.ReactElement;
  if (geo === 'country' && ['Gibraltar', 'Isle of Man'].includes(geoName)) {
    MapComponent = (
      <Image
        source={countryFlags[geoName]}
        style={{ width: '100%', height: '100%' }}
        contentFit="scale-down"
      />
    );
  } else {
    const item =
      geo === 'country'
        ? countriesLayout[geoName as keyof typeof countriesLayout]
        : geo === 'region'
          ? regionsLayout[geoName as keyof typeof regionsLayout]
          : countiesLayout[geoName as keyof typeof countiesLayout];
    MapComponent = (
      <Svg width="100%" height="100%" viewBox={`0 0 ${item.width} ${item.height}`}>
        <Path
          d={item.path}
          stroke={colors.foreground}
          fill="none"
          strokeWidth={item.defaultStrokeWidth}
        />
      </Svg>
    );
  }
  return (
    <Pressable
      className="w-full flex-row items-center gap-6 rounded-2xl border border-border bg-card px-6 py-3"
      onPress={() => nav.navigate('FilterListAll', { items: attractions, areaName: geoName })}>
      <View className="relative h-20 w-20">{MapComponent}</View>
      <Text className="max-w-52 text-wrap text-xl">{geoName}</Text>
      <View className="ml-auto mt-1">
        <ChevronRight />
      </View>
    </Pressable>
  );
}

export default function LikedGeoFilter({ items, geo }: { items: Attraction[]; geo: string }) {
  const geoGroups: Record<string, Attraction[]> = {};
  items.forEach((item) => {
    const groupCategory =
      geo === 'country' ? item.country : geo === 'region' ? item.region : item.county;
    if (groupCategory === '') return;
    if (groupCategory in geoGroups) {
      geoGroups[groupCategory].push(item);
    } else {
      geoGroups[groupCategory] = [item];
    }
  });
  return (
    <ScrollView className="mt-36 px-6" contentContainerClassName="gap-4">
      {Object.entries(geoGroups).map(([group, attractions]) => {
        return <GeoCard geoName={group} key={group} attractions={attractions} geo={geo} />;
      })}
    </ScrollView>
  );
}
