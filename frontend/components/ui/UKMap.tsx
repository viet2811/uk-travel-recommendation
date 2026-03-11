import county from '../../assets/layouts/counties-layout.json';
import region from '../../assets/layouts/regions-layout.json';
import country from '../../assets/layouts/countries-layout.json';

import Svg, { G, Path } from 'react-native-svg';
import { colors } from 'theme/colors';
import { View } from 'react-native';

type MapDropdownProps = {
  area: 'county' | 'region' | 'country';
  selectedArea: string | null;
  setSelectedArea: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function UKMap({ area, selectedArea, setSelectedArea }: MapDropdownProps) {
  const layout = area === 'county' ? county : area === 'region' ? region : country;
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
