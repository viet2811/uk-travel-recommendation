import { RouteProp, useNavigation } from '@react-navigation/native';
import { Text } from 'components/ui/Text';
import ListAllView from './LikedAttractionGrid';
import { LikedRootStackParamList } from 'components/navigation/LikedStack';
import { Pressable, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

type ListAllProps = {
  route: RouteProp<LikedRootStackParamList, 'LikedAreaScreen'>;
};

export default function LikedAreaScreen({ route }: ListAllProps) {
  const { items, areaName } = route.params;
  const nav = useNavigation();
  return (
    <View className="flex-1 bg-background">
      <View className="absolute left-0 right-0 top-0 flex-row items-center justify-between px-6 pt-20">
        <Pressable className="flex-row items-center gap-1" onPress={() => nav.goBack()}>
          <ArrowLeft />
          <Text className="font-bold text-xl">Back</Text>
        </Pressable>
        <Text className="font-bold text-xl !text-accent">{areaName}</Text>
      </View>
      <ListAllView items={items} />
    </View>
  );
}
