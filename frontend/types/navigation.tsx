export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  Login: undefined;
  Discovery: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
