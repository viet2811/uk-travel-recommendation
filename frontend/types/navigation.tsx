export type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
  Login: undefined;
  Main: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
