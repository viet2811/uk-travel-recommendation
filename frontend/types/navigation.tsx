import { Attraction } from './attraction';

export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  Login: undefined;
  // PreferenceStack
  Preference: undefined;
  PreferenceArea: undefined;
  /// Bottom Tabs Nav
  Main: undefined;
  Discovery: undefined;
  // LikedStack
  Liked: undefined;
  LikedMain: undefined;
  FilterListAll: { items: Attraction[]; areaName: string };
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
