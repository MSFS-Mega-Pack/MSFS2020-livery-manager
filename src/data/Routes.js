import React from 'react';

import Setup from '../pages/Setup';
import LiveryManager from '../pages/LiveryManager';
import SplashScreen from '../pages/SplashScreen';

export default Object.freeze([
  { path: '/setup', component: <Setup /> },
  { path: '/manager', component: <LiveryManager /> },
  { path: '/', component: <SplashScreen /> },
]);
