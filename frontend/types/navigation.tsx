import { Attraction } from './attraction';

export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  Login: undefined;
  // PreferenceStack
  PreferenceStack: undefined;
  PreferenceCat: undefined;
  PreferenceArea: undefined;
  PreferenceImport: undefined;
  /// Bottom Tabs Nav
  Main: undefined;
  Discovery: undefined;
  // LikedStack
  Liked: undefined;
  LikedMain: undefined;
  LikedAreaScreen: { items: Attraction[]; areaName: string };
  // SettingStack
  Profile: undefined;
  Settings: undefined;
  UpdateGeoFilter: undefined;
  AttractionImport: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
