// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
    transformer,
  } = await getDefaultConfig();

  return {
    transformer: {
      ...transformer,
    },
    resolver: {
      assetExts: [...assetExts, 'db', 'ttf'],
      sourceExts: [...sourceExts, 'cjs', 'ts', 'tsx'],
    },
  };
})();