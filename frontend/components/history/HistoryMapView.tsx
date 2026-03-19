import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Attraction } from 'types/attraction';
import { memo, useEffect, useRef, useState } from 'react';
import AttractionBottomSheet, { AttractionBottomSheetRef } from 'hooks/useAttractionBottomSheet';

const initialRegionUK = {
  latitude: 54.166027347211596,
  longitude: -2.958164233714342,
  latitudeDelta: 13.249459970858986,
  longitudeDelta: 11.19159322232008,
};

const HistoryMapView = memo(({ items }: { items: Attraction[] }) => {
  const mapRef = useRef<MapView>(null);
  const [currentRegion, setCurrentRegion] = useState(initialRegionUK);
  const bottomSheetRef = useRef<AttractionBottomSheetRef>(null);
  const [selectedItem, setSelectedItem] = useState<Attraction | null>(null);

  const handleMarkerPress = (item: Attraction) => {
    setSelectedItem(item);
    bottomSheetRef?.current?.open(item);
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

      <AttractionBottomSheet ref={bottomSheetRef} onDismiss={() => setSelectedItem(null)} />
    </View>
  );
});

export default HistoryMapView;
