import UKMap, { CountyList } from 'components/ui/UKMap';
import { Pressable, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from 'theme/colors';
import { Text } from 'components/ui/Text';
import { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

type ViewDropdownProps = {
  curView: string;
  onChange: (item: any) => void;
};

const viewOption = [
  { label: 'Country', value: 'country' },
  { label: 'Region', value: 'region' },
  { label: 'County', value: 'county' },
];

function ViewDropdown({ curView, onChange }: ViewDropdownProps) {
  return (
    <View className="w-48">
      <Dropdown
        data={viewOption}
        value={curView}
        labelField="label"
        valueField="value"
        onChange={onChange}
        style={{
          borderWidth: 1,
          borderColor: colors.input,
          backgroundColor: colors.card,
          borderRadius: 4,
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        selectedTextStyle={{
          fontSize: 14,
          color: colors.foreground,
          fontFamily: 'Outfit',
          paddingLeft: 6,
        }}
        placeholderStyle={{
          color: colors.foreground,
          fontFamily: 'Outfit',
        }}
        containerStyle={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 6,
        }}
        renderItem={(item) => {
          const isSelected = item.value === curView;
          return (
            <View
              className={`flex-row items-center rounded px-2 py-2 ${isSelected ? 'bg-accent' : 'bg-card'}`}>
              <Text
                className={`ml-2 ${isSelected ? '!text-accent-foreground' : 'text-foreground'}`}>
                {item.label}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

export default function GeoAreaPicker() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [curView, setCurView] = useState<'county' | 'region' | 'country'>('country');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const { navigate } = useNavigation();

  useEffect(() => {
    const loadGeoFilter = async () => {
      const existGeoFilter = await AsyncStorage.getItem('geoFilter');
      if (existGeoFilter) {
        const [key, value] = existGeoFilter.replace('?', '').split('=');
        setCurView(key as 'county' | 'region' | 'country');
        setSelectedArea(value);
      }
      setIsLoaded(true);
    };
    loadGeoFilter();
  }, []);

  const route = useRoute();
  const queryClient = useQueryClient();
  const handleSubmit = async () => {
    let area;
    if (selectedArea) {
      area = `?${curView}=${selectedArea}`;
    } else {
      area = '';
    }
    await AsyncStorage.setItem('geoFilter', area);
    if (route.name === 'PreferenceArea') {
      navigate('Main');
    } else {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      navigate('Settings');
    }
  };
  if (!isLoaded) return null;

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-6 pt-20">
        <Text className="w-1/2 font-bold text-xl">Select an optional geographical area</Text>
        <ViewDropdown
          curView={curView}
          onChange={(item) => {
            setCurView(item.value);
            setSelectedArea(null);
          }}
        />
      </View>
      {/* TODO: County into a list */}
      {curView !== 'county' && (
        <UKMap area={curView} selectedArea={selectedArea} setSelectedArea={setSelectedArea} />
      )}
      <Text className="mt-6 text-center text-sm !text-muted">Current Filter</Text>
      <Text className="text-center font-bold text-xl !text-accent">
        {selectedArea ? selectedArea : 'United Kingdom'}
      </Text>
      {curView == 'county' && (
        <CountyList selectedArea={selectedArea} setSelectedArea={setSelectedArea} />
      )}
      <Pressable
        className="mr-6 mt-6 flex-row items-center self-end rounded-lg bg-accent px-5 py-3"
        onPress={handleSubmit}>
        <Text className="text-xl !text-accent-foreground">Done </Text>
        <Check size={16} color={colors['accent-foreground']} />
      </Pressable>
    </View>
  );
}
