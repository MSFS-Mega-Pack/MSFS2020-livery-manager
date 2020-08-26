import React from 'react';

import Setup from '../pages/Setup';
import HomePage from '../pages/HomePage';
import SplashScreen from '../pages/SplashScreen';

const AllRoutes = Object.freeze({
  SPLASH_SCREEN: '/',
  SETUP: '/setup',
  MULTI_PAGE_HOME: '/home',
  SETTINGS: '/settings',
});

export default Object.freeze([
  { path: AllRoutes.SETUP, component: <Setup /> },
  { path: AllRoutes.MULTI_PAGE_HOME, component: <HomePage /> },
  { path: AllRoutes.SPLASH_SCREEN, component: <SplashScreen /> },
]);

export { AllRoutes };
