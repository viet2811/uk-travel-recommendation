import { Pressable, ScrollView, View } from 'react-native';
import { Text } from 'components/ui/Text';
import { colors } from 'theme/colors';
import { COUNTRIES_SVG } from 'components/ui/GeoSvgRecord';
import { ChevronRight } from 'lucide-react-native';
import { Attraction } from 'types/attraction';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

function CountryCard({ country, attractions }: { country: string; attractions: Attraction[] }) {
  const item = COUNTRIES_SVG[country];
  const nav = useNavigation();
  return (
    <Pressable
      className="w-full flex-row items-center gap-6 rounded-2xl border border-border bg-card px-6 py-3"
      onPress={() => nav.navigate('FilterListAll', { items: attractions, catName: country })}>
      <View className="relative h-20 w-20">
        {item.type === 'svg' ? (
          <item.Component
            width="100%"
            height="100%"
            pointerEvents="box-none"
            stroke={colors.foreground}
            fill="none"
            strokeWidth={item.defaultStrokeWidth}
          />
        ) : (
          <Image
            source={item.imageSource}
            style={{ width: '100%', height: '100%' }}
            contentFit="scale-down"
          />
        )}
      </View>

      <Text className="text-2xl">{country}</Text>

      <View className="ml-auto mt-1">
        <ChevronRight />
      </View>
    </Pressable>
  );
}

export default function GeoFilterView({ items, geo }: { items: Attraction[]; geo: string }) {
  const geoGroups: Record<string, Attraction[]> = {};
  items.map((item) => {
    const groupCategory =
      geo === 'country' ? item.country : geo === 'region' ? item.region : item.county;
    if (groupCategory in geoGroups) {
      geoGroups[groupCategory].push(item);
    } else {
      geoGroups[groupCategory] = [item];
    }
  });
  return (
    <ScrollView className="mt-36 px-6" contentContainerClassName="gap-4">
      {Object.entries(geoGroups).map(([group, attractions]) => {
        return <CountryCard country={group} key={group} attractions={attractions} />;
      })}

      {/* <Pressable className="bg-accent px-4 py-4" onPress={() => console.log(geoGroups)}>
        <Text>To test</Text>
      </Pressable> */}
    </ScrollView>
  );
}
