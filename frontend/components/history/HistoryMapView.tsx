import { TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { Attraction } from 'types/attraction';
import HistoryCard from './HistoryCard';
import { colors } from 'theme/colors';
import { MapPin, Pin } from 'lucide-react-native';
import { Text } from 'components/ui/Text';
import { memo, useEffect, useRef } from 'react';

const initialRegionUK = {
  latitude: 54.166027347211596,
  longitude: -2.958164233714342,
  latitudeDelta: 13.249459970858986,
  longitudeDelta: 11.19159322232008,
};

const HistoryMapView = memo(({ items }: { items: Attraction[] }) => {
  const mapRef = useRef<MapView>(null);
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
      <MapView ref={mapRef} style={{ flex: 1 }} initialRegion={initialRegionUK}>
        {items.map((item) => (
          <Marker
            coordinate={{
              latitude: item.latitude,
              longitude: item.longtitude,
            }}
            key={`${item.id}-marker`}
            title={item.name}
            description={item.county}
            //onPress={() => console.log(item)}
          >
            {/* <View className="h-2 w-2 rounded-full bg-accent" /> */}
            <View className="flex-row items-center rounded-full border border-border bg-card px-1 py-1">
              <View className="relative items-center justify-center">
                {/* The Layered Pin Hack for the "Hollow" look */}
                <MapPin size={20} color={colors.accent} fill={colors.accent} />
                <View
                  style={{
                    position: 'absolute',
                    top: 5,
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.card,
                  }}
                />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
});

export default HistoryMapView;
