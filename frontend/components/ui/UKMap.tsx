import layout from '../../assets/layouts/countries-layout.json';
import Svg, { G, Path } from 'react-native-svg';
import { colors } from 'theme/colors';
import { PanResponder, Pressable, View } from 'react-native';
import { useState } from 'react';

export default function UKMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Svg viewBox="0 0 800 1481" width="75%" height="75%">
        {Object.entries(layout).map(([country, position]) => {
          const isSelected = selectedCountry === country;
          return (
            <G transform={`translate(${position.offset_x}, ${position.offset_y})`} key={country}>
              <Path
                d={position.path}
                stroke={isSelected ? colors['accent-foreground'] : colors.foreground}
                fill={isSelected ? colors.accent : 'transparent'}
                onPressIn={
                  isSelected ? () => setSelectedCountry(null) : () => setSelectedCountry(country)
                }></Path>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
