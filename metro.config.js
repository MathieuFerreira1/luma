const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajoute tailwind CSS et utilitaire pour NativeWind v4
config.resolver.sourceExts.push('css');

module.exports = config;
