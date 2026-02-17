import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from 'api/axios';
import { setUserPreferences } from 'api/user';
import { CATEGORY_MAP, CategoryConfig } from 'components/ui/CategoryIcon';
import { Text } from 'components/ui/Text';
import { ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { colors } from 'theme/colors';

type PreferenceCardProps = {
  content: CategoryConfig;
  isSelected: boolean;
  onPress: () => void;
};

function PreferenceCard({ content, isSelected, onPress }: PreferenceCardProps) {
  return (
    <Pressable
      className={`flex-row items-center self-start rounded-lg px-5 py-3 ${isSelected ? 'bg-accent' : 'bg-card'}`}
      onPress={onPress}>
      <content.icon size={16} color={isSelected ? colors['accent-foreground'] : content.color} />
      <Text
        className="ml-2 text-xl"
        style={{ color: isSelected ? colors['accent-foreground'] : content.color }}>
        {content.label}
      </Text>
    </Pressable>
  );
}

export default function PreferenceScreen() {
  // MHE order['animals', 'architecture', 'entertainment', 'history_culture', 'natural', 'sea','shopping','sports', 'topspot']
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    animals: false,
    architecture: false,
    entertainment: false,
    history_culture: false,
    natural: false,
    sea: false,
    shopping: false,
    sports: false,
    topspot: false,
  });

  const toggleCategory = (key: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const { navigate } = useNavigation();
  const preferenceMutation = useMutation({
    mutationFn: (mhe: (1 | 0)[]) => setUserPreferences(mhe),
    onSuccess: () => {
      navigate('Main');
    },
    onError: (e) => console.log('Error: ', e),
  });

  const handleSubmit = async () => {
    const mhe = Object.values(preferences).map((isSelected) => (isSelected ? 1 : 0));
    preferenceMutation.mutate(mhe);
  };

  const isSelectedEnough = Object.values(preferences).filter(Boolean).length >= 2;
  return (
    <View className="flex-1 gap-2 bg-background px-6 pb-10 pt-32">
      <Text className="!font-bold text-4xl !text-accent">Choose your travel preferences</Text>
      <Text>Minimum 2 categories</Text>
      <View className="mt-4 flex-row flex-wrap gap-4">
        {Object.entries(CATEGORY_MAP).map(([key, content]) => (
          <PreferenceCard
            content={content}
            key={key}
            isSelected={preferences[key]}
            onPress={() => toggleCategory(key)}
          />
        ))}
      </View>
      <Pressable
        className={`mt-24 flex-row items-center self-end rounded-lg px-5 py-3 ${isSelectedEnough ? 'bg-accent' : 'bg-card'}`}
        disabled={!isSelectedEnough}
        onPress={handleSubmit}>
        <Text
          className="mr-2 text-xl"
          style={{ color: isSelectedEnough ? colors['accent-foreground'] : colors.muted }}>
          Next
        </Text>
        <ArrowRight
          size={16}
          color={isSelectedEnough ? colors['accent-foreground'] : colors.muted}
        />
      </Pressable>
    </View>
  );
}
