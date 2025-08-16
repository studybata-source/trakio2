const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const { resolver } = defaultConfig;

const config = {
  resolver: {
    assetExts: [...resolver.assetExts, 'ttf', 'db'],
    sourceExts: [...resolver.sourceExts, 'cjs', 'ts', 'tsx'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
