import React from 'react';

import 'fontsource-poppins';
import 'fontsource-ibm-plex-mono';
import './styles/baseline.less';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import { Route, HashRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';

import Theme from '../data/Theme';
import Routes from '../data/Routes';

import { TitleBar } from 'electron-react-titlebar';
import 'electron-react-titlebar/assets/style.css';

import planeIcon from '../images/plane-takeoff.png';

export default function App() {
  return [
    <TitleBar icon={planeIcon} disableMaximize>
      <p
        style={{
          fontFamily: 'Poppins',
          lineHeight: '27px',
          color: 'white',
          zIndex: 99999999999,
          margin: 0,
          fontSize: 13,
          fontWeight: 300,
          marginLeft: 4,
        }}
      >
        Flight Simulator Livery Manager
      </p>
    </TitleBar>,
    <main>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <HashRouter hashType="slash">
          <AnimatedSwitch atEnter={{ opacity: 0 }} atLeave={{ opacity: 0 }} atActive={{ opacity: 1 }} className="switch-wrapper">
            {Routes.map(route => (
              <Route key={route.path} path={route.path}>
                {route.component}
              </Route>
            ))}
          </AnimatedSwitch>
        </HashRouter>
      </ThemeProvider>
    </main>,
  ];
}
