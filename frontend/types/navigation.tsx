import { Attraction } from './attraction';

export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  Login: undefined;
  Preference: undefined;
  PreferenceArea: undefined;
  Main: undefined;
  Liked: undefined;
  Discovery: undefined;
  // LikedStack
  LikedMain: undefined;
  FilterListAll: { items: Attraction[]; catName: string };
  // SettingStack
  Profile: undefined;
  Settings: undefined;
  UpdateGeoFilter: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
