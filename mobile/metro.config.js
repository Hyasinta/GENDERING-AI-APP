/**
 * Minimal Metro config for local bundling.
 * This uses @react-native/metro-config default settings.
 */
const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig();
  // include the repository root so imports like '../../App' (from
  // node_modules/expo/AppEntry.js) can resolve to the root App.js
  config.watchFolders = [path.resolve(__dirname, '..')];
  return config;
})();
