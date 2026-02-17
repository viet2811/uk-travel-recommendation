export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  Login: undefined;
  Preference: undefined;
  Main: undefined;
  Liked: undefined;
  Discovery: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
