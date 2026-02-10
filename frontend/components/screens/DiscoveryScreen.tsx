import { Text, View, Image, Linking, ScrollView, Pressable } from 'react-native';
import { Attraction } from 'types/attraction';
import AttractionView from 'components/AttractionView';

const testItem: Attraction = {
  id: 'Q83457',
  name: 'Old Trafford',
  parentTypeLabel: 'natural,history_culture,topspot,animals',
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
  county: 'Greater Manchester',
  region: 'North West',
  country: 'England',
};

export default function DiscoveryScreen() {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-6 py-20">
      <AttractionView item={testItem} />
    </ScrollView>
  );
}
