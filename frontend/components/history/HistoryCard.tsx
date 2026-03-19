import { Pressable, View } from 'react-native';
import { Attraction } from 'types/attraction';
import { Image } from 'expo-image';
import { CATEGORY_MAP } from 'components/ui/CategoryIcon';
import { Text } from 'components/ui/Text';
import { colors } from 'theme/colors';

const R2_URL = process.env.EXPO_PUBLIC_R2_URL;

export const countryFlags: Record<string, any> = {
  England: require('../../assets/images/england.png'),
  Scotland: require('../../assets/images/scotland.png'),
  Wales: require('../../assets/images/wales.png'),
  'Northern Ireland': require('../../assets/images/northern-ireland.png'),
  'Isle of Man': require('../../assets/images/isle_of_man.png'),
  Gibraltar: require('../../assets/images/gibraltar.png'),
};

export default function HistoryCard({ item, onPress }: { item: Attraction; onPress: () => void }) {
  const labels = item.parentTypeLabel.split(',');

  return (
    <Pressable
      className="h-[300px] w-[49%] overflow-hidden rounded-2xl border border-border bg-card pb-2"
      onPress={onPress}>
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
    </Pressable>
  );
}
