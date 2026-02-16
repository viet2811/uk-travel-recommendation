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

type CategoryConfig = {
  icon: React.ComponentType<LucideProps>;
  label: string;
};

export const CATEGORY_MAP: Record<string, CategoryConfig> = {
  history_culture: { icon: Landmark, label: 'History & Culture' },
  topspot: { icon: Users, label: 'Tourist Attraction' },
  sports: { icon: Volleyball, label: 'Sports' },
  entertainment: { icon: FerrisWheel, label: 'Entertainment' },
  shopping: { icon: Handbag, label: 'Shopping' },
  natural: { icon: Leaf, label: 'Nature' },
  sea: { icon: Waves, label: 'Sea' },
  animals: { icon: PawPrint, label: 'Animals' },
  architecture: { icon: Pyramid, label: 'Architecture' },
};
