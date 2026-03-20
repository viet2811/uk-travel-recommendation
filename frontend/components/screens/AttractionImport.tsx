import { TextInput, View, Pressable, ScrollView } from 'react-native';
import { Text } from 'components/ui/Text';
import { useEffect, useState } from 'react';
import { colors } from 'theme/colors';
import { ArrowLeft, ArrowRight, CircleCheck, CirclePlus, Search } from 'lucide-react-native';
import { useDebounce } from 'hooks/useDebounce';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addVisitedAttractions, searchAttractions } from 'api/attraction';
import { useNavigation, useRoute } from '@react-navigation/native';

type AttractionSearch = {
  id: string;
  name: string;
};

export default function AttractionImport() {
  const [userInput, setUserInput] = useState<string>('');
  const debouncedInput = useDebounce(userInput, 400);
  const [filteredAttraction, setFilteredAttraction] = useState<AttractionSearch[]>([]);
  const filterMutation = useMutation({
    mutationFn: searchAttractions,
    onSuccess: (data: AttractionSearch[]) => setFilteredAttraction(data),
    onError: (e) => console.log(e),
  });

  const [addedAttractions, setAddedAttractions] = useState<AttractionSearch[]>([]);
  const route = useRoute();
  const isRegistering = route.name === 'PreferenceImport';

  const queryClient = useQueryClient();
  const { navigate } = useNavigation();

  const navigateNext = (skip: boolean = false) => {
    if (isRegistering) {
      navigate('Main');
    } else {
      !skip && queryClient.resetQueries({ queryKey: ['recommendations'] });
      navigate('Settings');
    }
  };

  const submitMutation = useMutation({
    mutationFn: addVisitedAttractions,
    onSuccess: () => navigateNext(),
  });

  useEffect(() => {
    filterMutation.mutate(debouncedInput);
  }, [debouncedInput]);

  return (
    <View className="mt-24 flex-1 gap-2 bg-background px-6 pb-10">
      <Text className="!font-bold text-4xl !text-accent">Add existing preference</Text>
      <Text>Find place you have visited(and liked) in the UK</Text>
      <View className="flex-row items-center rounded-lg border border-border px-3">
        <Search size={16} className="text-muted-foreground" />
        <TextInput
          className="flex-1 px-3 py-2"
          placeholder="e.g london eye, old trafford..."
          value={userInput}
          onChangeText={setUserInput}
          cursorColor={colors.accent}
        />
      </View>
      <ScrollView style={{ maxHeight: 450 }} keyboardShouldPersistTaps="handled">
        {filteredAttraction.map((attraction, idx) => (
          <View
            className="flex-row items-center justify-between border-b border-border px-4 py-3"
            key={`filter-${attraction.id}-${idx}`}>
            <Text className="text-foreground">{attraction.name}</Text>
            <Pressable
              className="flex-row items-center gap-4 rounded px-2 py-2"
              onPress={() => {
                setAddedAttractions(
                  (prev) =>
                    prev.some((added) => added.id === attraction.id) // Exist in addedAttractions before?
                      ? prev.filter((added) => added.id !== attraction.id) // Remove from added
                      : [...prev, attraction] // Add to added
                );
              }}>
              {addedAttractions.some((a) => a.id === attraction.id) ? (
                <CircleCheck size={24} color={colors.accent} />
              ) : (
                <CirclePlus size={24} color={colors.foreground} />
              )}
            </Pressable>
          </View>
        ))}
        <Text className="px-4 py-3 text-center text-sm text-muted-foreground">
          {filteredAttraction.length === 0 &&
            userInput &&
            !filterMutation.isPending &&
            'No place found'}
          {/* isLoading??? */}
        </Text>
      </ScrollView>
      <Text className="mt-6 text-center text-sm !text-muted">Added Attractions Count</Text>
      <Text className="text-center font-bold text-xl !text-accent">{addedAttractions.length}</Text>

      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between px-6 pb-10">
        <Pressable
          className="flex-row items-center gap-2 px-5 py-3"
          onPress={() => navigateNext(true)}>
          {!isRegistering && <ArrowLeft size={16} color={colors.accent} />}
          <Text className="mr-2 text-xl text-destructive">{isRegistering ? 'Skip' : 'Back'}</Text>
        </Pressable>
        <Pressable
          className="flex-row items-center rounded-lg bg-accent px-5 py-3"
          onPress={() => submitMutation.mutate(addedAttractions.map((attr) => attr.id))}>
          <Text className="mr-2 text-xl !text-accent-foreground">Submit</Text>
          <ArrowRight size={16} color={colors['accent-foreground']} />
        </Pressable>
      </View>
    </View>
  );
}
