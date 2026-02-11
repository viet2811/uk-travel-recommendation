import { Text, View, Image, Linking, ScrollView, Pressable } from 'react-native';
import { Attraction } from 'types/attraction';
import AttractionCard from 'components/AttractionCard';
import { Ellipsis, Heart, X } from 'lucide-react-native';
import { colors } from 'theme/colors';

const testItems: Attraction[] = [
  {
    id: 'Q83457',
    name: 'Old Trafford',
    parentTypeLabel: 'sports,topspot',
    typeLabel: 'association football venue',
    latitude: 53.463055555,
    longtitude: -2.291388888,
    image_path: [
      'https://utdreport.co.uk/wp-content/uploads/2020/12/1316e9e0c1ba71705d17b9163b8bba93-scaled.jpg',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/60/75/3d/old-trafford-featuring.jpg?w=900&h=500&s=1',
    ],
    wikipedia: 'https://en.wikipedia.org/wiki/Old_Trafford',
    summary:
      'Old Trafford is a football stadium in Old Trafford, Greater Manchester, England, and is the home of Manchester United. With a capacity of 74,197, it is the largest club football stadium (and second-largest football stadium overall after Wembley Stadium) in the United Kingdom, and the eleventh-largest in Europe.',
    county: 'Manchester (Greater Manchester)',
    region: 'North West',
    country: 'England',
  },
  {
    id: 'Q83457',
    name: 'New Trafford',
    parentTypeLabel: 'sports',
    typeLabel: 'association football venue',
    latitude: 53.463055555,
    longtitude: -2.291388888,
    image_path: [
      'https://utdreport.co.uk/wp-content/uploads/2020/12/1316e9e0c1ba71705d17b9163b8bba93-scaled.jpg',
    ],
    wikipedia: 'https://en.wikipedia.org/wiki/Old_Trafford',
    summary:
      'Old Trafford is a football stadium in Old Trafford, Greater Manchester, England, and is the home of Manchester United. With a capacity of 74,197, it is the largest club football stadium (and second-largest football stadium overall after Wembley Stadium) in the United Kingdom, and the eleventh-largest in Europe.',
    county: 'Liverpool (Merseyside)',
    region: 'North West',
    country: 'England',
  },
];

export default function DiscoveryScreen() {
  return (
    <View className="flex-1 bg-background px-6 py-20">
      <AttractionCard item={testItems[1]} />

      {/* Dislike/More Details/Like bottom deck */}
      <View className="absolute bottom-10 w-1/2 flex-row justify-between self-center">
        <View className="rounded-full border border-border p-3">
          <X size={32} color={colors.destructive} />
        </View>
        <View className="rounded-full border border-border p-3">
          <Ellipsis size={32} color={colors.border} />
        </View>
        <View className="rounded-full border border-border p-3">
          <Heart size={32} color={colors.secondary} />
        </View>
      </View>
    </View>
  );
}
