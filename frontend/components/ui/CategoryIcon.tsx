import {
  Volleyball,
  LucideProps,
  Landmark,
  FerrisWheel,
  Handbag,
  Leaf,
  Waves,
  PawPrint,
  Pyramid,
  Users,
} from 'lucide-react-native';
import { colors } from 'theme/colors';

export type CategoryConfig = {
  icon: React.ComponentType<LucideProps>;
  label: string;
  color: string;
};

export const CATEGORY_MAP: Record<string, CategoryConfig> = {
  animals: { icon: PawPrint, label: 'Animals', color: '#ca8a04' },
  architecture: { icon: Pyramid, label: 'Architecture', color: '#0891b2' },
  entertainment: { icon: FerrisWheel, label: 'Entertainment', color: colors.accent },
  natural: { icon: Leaf, label: 'Nature', color: '#16a34a' },
  history_culture: { icon: Landmark, label: 'History & Culture', color: '#b45309' },
  sea: { icon: Waves, label: 'Sea', color: '#60a5fa' },
  shopping: { icon: Handbag, label: 'Shopping', color: colors.destructive },
  sports: { icon: Volleyball, label: 'Sports', color: '#7c3aed' },
  topspot: { icon: Users, label: 'Tourist Attraction', color: colors.primary },
};
