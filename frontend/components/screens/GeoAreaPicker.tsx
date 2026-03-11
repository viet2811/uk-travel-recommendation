import UKMap from 'components/ui/UKMap';
import { Pressable, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from 'theme/colors';
import { Text } from 'components/ui/Text';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react-native';

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
  const [curView, setCurView] = useState<'county' | 'region' | 'country'>('country');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
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
      <UKMap area={curView} selectedArea={selectedArea} setSelectedArea={setSelectedArea} />;
      <Text className="text-center font-bold text-xl !text-accent">
        {selectedArea ? selectedArea : 'United Kingdom'}
      </Text>
      <Pressable
        className="mr-6 mt-6 flex-row items-center self-end rounded-lg bg-accent px-5 py-3"
        onPress={() => console.log(selectedArea)}>
        <Text className="text-xl !text-accent-foreground">Next </Text>
        <ArrowRight size={16} color={colors['accent-foreground']} />
      </Pressable>
    </View>
  );
}
