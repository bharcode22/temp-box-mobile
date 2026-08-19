import './global.css';
/**
 * @format
 */
console.log('📱 index.js is starting...');

import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';

enableScreens(true);

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
