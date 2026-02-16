import { useNavigation } from '@react-navigation/native';
import { Text } from 'components/ui/Text';
import { useAuth } from 'context/AuthContext';
import {
  CirclePlus,
  Filter,
  Heart,
  LogOut,
  RotateCcw,
  Settings,
  SlidersHorizontal,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { colors } from 'theme/colors';

export default function SettingScreen() {
  const nav = useNavigation();
  const { logout } = useAuth();
  return (
    <View className="flex-1 gap-6 bg-background px-6 pb-10 pt-20">
      <View className="flex-row items-center gap-4 rounded px-2 py-2">
        <Settings size={24} color={colors.foreground} />
        <Text className="text-2xl">General Settings</Text>
      </View>
      <Pressable
        className="flex-row items-center gap-4 rounded px-2 py-2"
        onPress={() => nav.navigate('Liked')}>
        <Heart size={24} color={colors.secondary} fill={colors.secondary} />
        <Text className="text-2xl !text-secondary">Liked Attractions</Text>
      </Pressable>
      <View className="flex-row items-center gap-4 rounded px-2 py-2">
        <ThumbsDown size={24} color={colors.destructive} />
        <Text className="text-2xl !text-destructive">Disliked Attractions</Text>
      </View>
      <View className="flex-row items-center gap-4 rounded px-2 py-2">
        <SlidersHorizontal size={24} color={colors.foreground} />
        <Text className="text-2xl">Recommendations Filter</Text>
      </View>
      <View className="flex-row items-center gap-4 rounded px-2 py-2">
        <CirclePlus size={24} color={colors.foreground} />
        <Text className="text-2xl">Add Visited Places</Text>
      </View>
      <View className="flex-row items-center gap-4 rounded px-2 py-2">
        <RotateCcw size={24} color={colors.foreground} />
        <Text className="text-2xl">Reset Preferences</Text>
      </View>
      <Pressable
        className="flex-row items-center gap-4 rounded px-2 py-2"
        onPress={() => {
          logout();
          nav.navigate('Landing');
        }}>
        <LogOut size={24} color={colors.destructive} />
        <Text className="text-2xl !text-destructive">Log out</Text>
      </Pressable>
    </View>
  );
}
