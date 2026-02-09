import { Text, View, Image, Linking, ScrollView, Pressable } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { useFonts, Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { MapPin, Link2, Volleyball, Camera } from 'lucide-react-native';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();
import './global.css';

// interface Attraction {
//   id: string;
//   name: string;
//   parentTypeLabel: string;
//   typeLabel: string;
//   latitude: number;
//   longtitude: number;
//   image_path: string[];
//   wikipedia: string;
//   summary: string;
//   county: string;
//   region: string;
//   country: string;
// }

export default function App() {
  const [loaded, error] = useFonts({
    Outfit: Outfit_400Regular,
    'Outfit-Bold': Outfit_700Bold,
    SpaceMono: SpaceMono_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      // Once fonts are ready (or failed), hide the splash screen
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Render nothing while fonts are loading to avoid a flash of unstyled text
  if (!loaded && !error) {
    return null;
  }

  function ExpandableText() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSeeMore, setShowSeeMore] = useState(false);

    return (
      <View className="mt-4 gap-y-2 rounded-xl border border-border bg-card p-6 shadow-sm">
        <Text className="font-bold text-xl text-foreground">About this attraction</Text>

        <View>
          <Text
            className="font-sans leading-relaxed text-foreground"
            numberOfLines={isExpanded ? undefined : 4}
            onTextLayout={(e) => {
              // If the actual line count is greater than our limit, show the button
              if (e.nativeEvent.lines.length > 3 && !isExpanded) {
                setShowSeeMore(true);
              }
            }}>
            Old Trafford is a football stadium in Old Trafford, Greater Manchester, England, and is
            the home of Manchester United. With a capacity of 74,197, it is the largest club
            football stadium (and second-largest football stadium overall after Wembley Stadium) in
            the United Kingdom, and the eleventh-largest in Europe.
          </Text>

          {showSeeMore && (
            <Pressable
              onPress={() => setIsExpanded(!isExpanded)}
              className="mt-1" // Small margin to keep it tight to the text
              hitSlop={10} // Makes it easier to tap
            >
              <Text className="font-bold text-primary">
                {isExpanded ? 'Show less' : 'See more'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-10 py-20">
      <View>
        <Text className="bold font-bold text-3xl text-accent">Old Trafford</Text>
        <View className="flex-row items-center gap-x-1">
          <MapPin size={14} className="text-foreground" />
          <Text className="font-sans text-sm text-foreground">
            Greater Manchester, North West, England
          </Text>
        </View>
      </View>
      <Image
        source={{
          uri: 'https://utdreport.co.uk/wp-content/uploads/2020/12/1316e9e0c1ba71705d17b9163b8bba93-scaled.jpg',
        }}
        className="mt-6 h-[400px] w-full rounded-2xl"
      />
      <View className="mt-4 gap-y-2 rounded-xl border border-border bg-card p-6 shadow-sm">
        <View className="flex-row items-center gap-x-4">
          <View className="flex-row items-center gap-x-1 align-middle">
            <Volleyball size={16} className="text-foreground" />
            <Text className="font-sans text-foreground">Sports</Text>
          </View>
          <View className="flex-row items-center gap-x-1 align-middle">
            <Camera size={16} className="text-foreground" />
            <Text className="font-sans text-foreground">Tourist Attraction</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-x-1 align-middle">
          <Link2 size={16} className="text-foreground" />
          <Text
            className="font-sans text-foreground underline"
            onPress={() => Linking.openURL('https://en.wikipedia.org/wiki/Old_Trafford')}>
            More on Wiki
          </Text>
        </View>
      </View>
      <ExpandableText />
    </ScrollView>
  );
}
