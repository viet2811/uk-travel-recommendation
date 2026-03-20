import county from '../../assets/layouts/counties-layout.json';
import region from '../../assets/layouts/regions-layout.json';
import country from '../../assets/layouts/countries-layout.json';

import Svg, { G, Path } from 'react-native-svg';
import { colors } from 'theme/colors';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Text } from './Text';
import { Search } from 'lucide-react-native';

type MapDropdownProps = {
  area: 'region' | 'country';
  selectedArea: string | null;
  setSelectedArea: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function UKAreaPicker({ area, selectedArea, setSelectedArea }: MapDropdownProps) {
  const layout = area === 'region' ? region : country;
  return (
    <View className="-my-32 items-center justify-center">
      <Svg viewBox="0 0 800 1481" width="75%" height="75%">
        {Object.entries(layout).map(([area, position]) => {
          const isSelected = selectedArea === area;
          return (
            <G transform={`translate(${position.offset_x}, ${position.offset_y})`} key={area}>
              <Path
                d={position.path}
                stroke={isSelected ? colors['accent-foreground'] : colors.foreground}
                fill={isSelected ? colors.accent : 'transparent'}
                onPressIn={
                  isSelected ? () => setSelectedArea(null) : () => setSelectedArea(area)
                }></Path>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

type CountyListProps = {
  selectedArea: string | null;
  setSelectedArea: React.Dispatch<React.SetStateAction<string | null>>;
};

export function CountyList({ selectedArea, setSelectedArea }: CountyListProps) {
  const [search, setSearch] = useState('');
  const filtered = Object.keys(county).filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <View className="px-6 pt-3">
      <View className="mb-3 flex-row items-center rounded-lg border border-border px-4">
        <Search size={16} className="text-muted-foreground" />
        <TextInput
          className="ml-2 flex-1 py-2"
          placeholder="Search counties..."
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>
      <ScrollView style={{ maxHeight: 450 }} keyboardShouldPersistTaps="handled">
        {filtered.map((name, i) => {
          const isSelected = selectedArea === name;
          return (
            <Pressable
              key={name}
              onPress={() => setSelectedArea(isSelected ? null : name)}
              className={`flex-row items-center justify-between border-b border-border px-4 py-3 ${
                isSelected ? 'bg-accent' : 'bg-background'
              }`}>
              <Text className={isSelected ? 'text-accent-foreground' : 'text-foreground'}>
                {name}
              </Text>
              {isSelected && <Text className="text-sm text-accent-foreground">✓</Text>}
            </Pressable>
          );
        })}
        {filtered.length === 0 && (
          <Text className="px-4 py-3 text-sm text-muted-foreground">No counties found</Text>
        )}
      </ScrollView>
    </View>
  );
}
