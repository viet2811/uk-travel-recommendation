import { Pressable, View } from 'react-native';
import { Text } from 'components/ui/Text';
import GbMap from '../../assets/images/gb.svg';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const nav = useNavigation();
  return (
    <View className="flex-1 items-center bg-background px-6 py-20 text-foreground">
      <View className="my-10 items-center">
        <Text className="flex-row text-4xl">
          <Text className="!font-bold"> See it.</Text>
          <Text className="!font-bold text-red-400"> Swipe it.</Text>
          <Text className="!font-bold !text-blue-400"> Sorted.</Text>
        </Text>
        <Text className="mt-1 text-wrap text-center !font-mono text-base">
          Personalized Travel Recommendation for the United Kingdom
        </Text>
      </View>
      <View>
        <GbMap style={{ aspectRatio: 1 }} height="75%" />
      </View>
      <View className="absolute bottom-24 items-center">
        <Pressable
          className="rounded-full border border-border bg-accent px-12 py-3"
          onPress={() => nav.navigate('Register')}>
          <Text className="font-bold text-secondary-foreground">Get started</Text>
        </Pressable>
        <Pressable className="mt-2" onPress={() => nav.navigate('Login')}>
          <Text className="underline">Log-in</Text>
        </Pressable>
      </View>
    </View>
  );
}
