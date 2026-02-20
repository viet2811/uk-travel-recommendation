import { Attraction } from './attraction';

export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  Login: undefined;
  Preference: undefined;
  Main: undefined;
  Liked: undefined;
  Discovery: undefined;
  Profile: undefined;
  LikedMain: undefined;
  FilterListAll: { items: Attraction[]; catName: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
