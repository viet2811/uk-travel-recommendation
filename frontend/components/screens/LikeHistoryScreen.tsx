import { Text } from 'components/ui/Text';
import { ChevronDown, Map } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Attraction } from 'types/attraction';
import { Image } from 'expo-image';
import { CATEGORY_MAP } from 'components/ui/CategoryIcon';
import { colors } from 'theme/colors';
import { useQuery } from '@tanstack/react-query';
import { getLikedAttraction } from 'api/attraction';

const testData = {
  id: 'Q1473348',
  image_path: ['images/Q1473348.webp', 'images/Q1473348_1.webp'],
  name: 'Glasgow Cathedral',
  parentTypeLabel: 'history_culture,architecture,topspot',
  typeLabel: 'cathedral, tourist attraction, Scottish civil parish',
  latitude: 55.8631,
  longtitude: -4.2346,
  wikipedia: 'https://en.wikipedia.org/wiki/Glasgow_Cathedral',
  summary:
    "Glasgow Cathedral (Scottish Gaelic: Cathair-eaglais Ghlaschu) is a parish church of the Church of Scotland in Glasgow, Scotland. It was the cathedral church  of the Archbishop of Glasgow, and the mother church of the Archdiocese of Glasgow and the province of Glasgow, from the 12th century until the Scottish Reformation in the 16th century. It is the oldest cathedral in mainland Scotland and the oldest building in Glasgow. With St Magnus Cathedral in Orkney, they are the only medieval cathedrals in Scotland to have survived the Reformation virtually intact. The medieval Bishop's Castle stood to the west of the cathedral until 1789.  Although notionally it lies within the Townhead area of the city, the Cathedral grounds and the neighbouring Necropolis are considered to be their own district within the city.\nThe cathedral is dedicated to Saint Mungo (also known as Kentigern), the patron saint of Glasgow, whose tomb lies at the centre of the building's Lower Church. The first stone cathedral was dedicated in 1136, in the presence of David I. Fragments of this building have been found beneath the structure of the present cathedral, which was dedicated in 1197, although much of the present cathedral dates from a major rebuilding in the 13th century. Following its foundation in 1451, the University of Glasgow held its first classes within the cathedral's chapter house. After the Reformation, Glasgow Cathedral was internally partitioned to serve three separate congregations (Inner High, Outer High and Barony). The early 19th century saw a growing appreciation of the cathedral's medieval architecture, and by 1835 both the Outer High and Barony congregations had moved elsewhere in the city, allowing the restoration of the cathedral to something approaching its former glory.\n\nGlasgow Cathedral has been Crown property since 1587. The entire cathedral building passed into the care of the state in 1857, and today it is the responsibility of Historic Environment Scotland. The congregation is today part of the Church of Scotland's Presbytery of Glasgow.",
  county: 'Glasgow City',
  region: 'Scotland',
  country: 'Scotland',
};

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

export default function LikeHistoryScreen() {
  const { data: attractions, isLoading } = useQuery<Attraction[]>({
    queryKey: ['likedHistory'],
    queryFn: getLikedAttraction,
  });
  return (
    <ScrollView className="flex-1 bg-background px-6 pb-10 pt-20">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="font-bold text-3xl !text-accent">Liked Attractions</Text>
        {/* TODO: Dropdown box */}
        <View className="flex-row items-center rounded border border-input bg-card px-4 py-2">
          <Text className="mr-1 text-lg">View</Text>

          <View className="mt-1">
            <ChevronDown size={20} />
          </View>
        </View>
      </View>
      {attractions && !isLoading ? (
        <View className="mb-32 flex-row flex-wrap justify-between gap-2">
          {attractions.map((attraction) => (
            <HistoryCard item={attraction} key={`${attraction.id}-historyCard`} />
          ))}
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </ScrollView>
  );
}
