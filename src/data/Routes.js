import React from 'react';

import Setup from '../pages/Setup';
import LiveryManager from '../pages/LiveryManager';
import SplashScreen from '../pages/SplashScreen';

const ROUTES = {
  SPLASH_SCREEN: '/',
  SETUP: '/setup',
  LIVERY_MANAGER: '/manager',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
};

export default Object.freeze([
  { path: ROUTES.SETUP, component: <Setup /> },
  { path: ROUTES.LIVERY_MANAGER, component: <LiveryManager /> },
  { path: ROUTES.SPLASH_SCREEN, component: <SplashScreen /> },
]);

export { ROUTES };
