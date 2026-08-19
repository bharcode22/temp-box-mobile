module.exports = {
  dependencies: {
    'react-native-reanimated': {
      platforms: {
        android: null, // Matikan autolinking native Android (hanya pakai JS runtime untuk NativeWind)
        ios: null,
      },
    },
    'react-native-worklets': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
  project: {
    android: {
      packageName: 'com.anonymous.wordpuzzle',
    },
  },
};
