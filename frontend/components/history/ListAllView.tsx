import { View } from 'react-native';
import { Attraction } from 'types/attraction';
import HistoryCard from './HistoryCard';
import { ScrollView } from 'react-native-gesture-handler';

export default function ListAllView({ items }: { items: Attraction[] }) {
  return (
    <ScrollView className="mt-32 px-6">
      <View className="mb-20 mt-3 flex-row flex-wrap justify-between gap-2">
        {items.map((attraction) => (
          <HistoryCard item={attraction} key={`${attraction.id}-historyCard`} />
        ))}
      </View>
    </ScrollView>
  );
}
