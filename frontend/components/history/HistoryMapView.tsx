import { Linking, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Attraction } from 'types/attraction';
import { colors } from 'theme/colors';
import { Link2 } from 'lucide-react-native';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Text } from 'components/ui/Text';
import { Image } from 'expo-image';
import { CATEGORY_MAP } from 'components/ui/CategoryIcon';
import ExpandableText from 'components/ExpandableText';

const initialRegionUK = {
  latitude: 54.166027347211596,
  longitude: -2.958164233714342,
  latitudeDelta: 13.249459970858986,
  longitudeDelta: 11.19159322232008,
};

const R2_URL = process.env.EXPO_PUBLIC_R2_URL;

const SameRatioImage = ({ image_path }: { image_path: string }) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isPortrait, setIsPortrait] = useState(false);

  return (
    <Image
      source={{ uri: `${R2_URL}/${image_path}` }}
      style={{
        // Condition 1: Landscape = 100% width.
        // Condition 2: Portrait = 75% width.
        width: isPortrait ? '75%' : '100%',
        aspectRatio: aspectRatio,
        borderRadius: 16,
      }}
      contentFit="cover"
      onLoad={(e) => {
        const { width, height } = e.source;
        setAspectRatio(width / height);
        setIsPortrait(height > width); // Detect verticality
      }}
    />
  );
};

function BottomSheetContent({ item }: { item: Attraction }) {
  const labels = item.parentTypeLabel.split(',');

  return (
    <View className="gap-y-3 pb-12">
      <View>
        <Text className="text-red- font-bold text-2xl !text-accent">{item.name}</Text>
        <Text>
          {Array.from(
            new Set([item.county, item.region, item.country].filter((part) => part !== ''))
          ).join(', ')}
        </Text>
      </View>
      <SameRatioImage image_path={item.image_path[0]} />
      <View
        className={`max-h-11 min-h-11 gap-x-3 gap-y-2 ${labels.length > 2 ? 'flex-row flex-wrap' : ''} `}>
        {labels.map((label) => {
          // Get config from map, or use default if slug doesn't exist
          const config = CATEGORY_MAP[label];
          const IconComponent = config.icon;

          return (
            <View key={label} className="flex-row items-center gap-x-1">
              <IconComponent size={16} className="text-foreground" />
              <Text>{config.label}</Text>
            </View>
          );
        })}
        {labels.length == 1 && (
          <View className="flex-row items-center gap-x-1">
            <Link2 size={16} className="text-foreground" />
            <Text className="underline" onPress={() => Linking.openURL(item.wikipedia)}>
              More on Wikipedia
            </Text>
          </View>
        )}
      </View>
      <View>
        {/* <Text>{item.typeLabel}</Text> */}
        <ExpandableText lineLimit={4} text={item.summary} />
      </View>
    </View>
  );
}

const HistoryMapView = memo(({ items }: { items: Attraction[] }) => {
  const mapRef = useRef<MapView>(null);
  const [currentRegion, setCurrentRegion] = useState(initialRegionUK);

  // Bottom Sheet
  const [selectedItem, setSelectedItem] = useState<Attraction | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.1}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleMarkerPress = (item: Attraction) => {
    setSelectedItem(item);
    bottomSheetRef.current?.snapToIndex(1); // Snap to the 50%

    const targetLatDelta = Math.min(currentRegion.latitudeDelta, 0.5);
    // Maintain aspect ratio for Longitude Delta
    const aspectRatio = currentRegion.longitudeDelta / currentRegion.latitudeDelta;
    const targetLngDelta = targetLatDelta * aspectRatio;
    mapRef.current?.animateToRegion({
      latitude: item.latitude - targetLatDelta * 0.28, // Offset slightly so the sheet doesn't cover the marker
      longitude: item.longtitude,
      latitudeDelta: targetLatDelta,
      longitudeDelta: targetLngDelta,
    });
  };

  useEffect(() => {
    if (items.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        items.map((i) => ({ latitude: i.latitude, longitude: i.longtitude })),
        {
          edgePadding: { top: 150, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [items]);
  return (
    <View className="h-full w-full">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={currentRegion}
        onRegionChangeComplete={(region) => setCurrentRegion(region)}>
        {items.map((item) => (
          <Marker
            coordinate={{
              latitude: item.latitude,
              longitude: item.longtitude,
            }}
            key={`${item.id}-marker`}
            onPress={() => handleMarkerPress(item)}
            image={
              selectedItem?.id === item.id ? undefined : require('../../assets/images/map-pin.png')
            }></Marker>
        ))}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: colors.background,
        }}
        onChange={(index) => {
          if (index <= -1) {
            setSelectedItem(null);
          }
        }}>
        <BottomSheetScrollView className="p-4">
          {selectedItem ? <BottomSheetContent item={selectedItem} /> : <></>}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
});

export default HistoryMapView;
