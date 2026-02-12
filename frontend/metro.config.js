const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Merge NativeWind
const nativeWindConfig = withNativeWind(config, { input: './global.css' });

// Add SVG support
nativeWindConfig.transformer = {
  ...nativeWindConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

nativeWindConfig.resolver = {
  ...nativeWindConfig.resolver,
  assetExts: nativeWindConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...nativeWindConfig.resolver.sourceExts, 'svg'],
};

module.exports = nativeWindConfig;
