import { Pressable, View, Text } from 'react-native';
import GbMap from '../../assets/images/gb.svg';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 items-center bg-background px-6 py-20 text-foreground">
      <View className="my-10 items-center">
        <Text className="flex-row font-bold text-4xl ">
          <Text> See it.</Text>
          <Text className="text-red-400"> Swipe it.</Text>
          <Text className="text-blue-400"> Sorted.</Text>
        </Text>
        <Text className="mt-1 text-wrap text-center font-mono text-base">
          Travel Recommendation for the United Kingdom
        </Text>
      </View>
      <View>
        <GbMap style={{ aspectRatio: 1 }} height="75%" />
      </View>
      <View className="absolute bottom-24 items-center">
        <Pressable className="rounded-full border border-border bg-accent px-12 py-3">
          <Text className="font-bold font-sans text-secondary-foreground">Get started</Text>
        </Pressable>
        <Pressable className="mt-2">
          <Text className="font-sans underline">Log-in</Text>
        </Pressable>
      </View>
    </View>
  );
}
