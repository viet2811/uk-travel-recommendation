import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { setUserPreferences } from 'api/user';
import { CATEGORY_MAP, CategoryConfig } from 'components/ui/CategoryIcon';
import { Text } from 'components/ui/Text';
import { ArrowRight, Send, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

  const [userInputLabel, setUserInputLabel] = useState<string>('');
  const [userLabels, setUserLabels] = useState<string[]>([]);

  const toggleCategory = (key: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const { navigate } = useNavigation();
  const preferenceMutation = useMutation({
    mutationFn: setUserPreferences,
    onSuccess: () => {
      navigate('PreferenceArea');
    },
    onError: (e) => console.log('Error: ', e.message),
  });

  const handleSubmit = async () => {
    const mhe = Object.values(preferences).map((isSelected) => (isSelected ? 1 : 0));
    preferenceMutation.mutate({ preferences: mhe, labels: userLabels });
  };

  const isSelectedEnough = Object.values(preferences).filter(Boolean).length >= 2;

  const onEnterCustomLabel = () => {
    setUserLabels((prev) => [...prev, userInputLabel]);
    setUserInputLabel('');
  };
  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerClassName="flex-1 justify-center items-center"
      enableOnAndroid
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled">
      <View className="mt-10 gap-2 bg-background px-6 pb-10">
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
        <View className="mt-6 gap-3">
          <View>
            <Text className="!font-bold text-2xl !text-accent">Category too broad?</Text>
            <Text>Enter your preference category in more detail: </Text>
          </View>
          <View className="flex-row items-center rounded-lg border border-border">
            <TextInput
              className="flex-1 px-4 py-2"
              placeholder="e.g castle, premier league stadiums..."
              value={userInputLabel}
              onChangeText={setUserInputLabel}
              cursorColor={colors.accent}
              onSubmitEditing={onEnterCustomLabel}
              maxLength={50}
            />
            <Pressable onPress={onEnterCustomLabel} className="mt-0.5 px-4 py-2">
              <Send size={18} color={userInputLabel ? colors.accent : colors.muted} />
            </Pressable>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {userLabels.map((label, index) => (
              <View
                className="flex-row items-center gap-2 self-start rounded-full border border-border bg-card px-4 py-2"
                key={`label-${index}`}>
                <Text>{label}</Text>
                <Pressable
                  onPress={() => setUserLabels((prev) => prev.filter((_, i) => i !== index))}>
                  <X size={16} />
                </Pressable>
              </View>
            ))}
          </View>
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
    </KeyboardAwareScrollView>
  );
}
