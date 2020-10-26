import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Route, HashRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';

import 'fontsource-poppins';
import 'fontsource-ibm-plex-mono';
import './styles/baseline.less';

import { CssBaseline } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { TitleBar } from 'electron-react-titlebar';

import Config from 'electron-json-config';
import ConfigKeys from '../data/config-keys.json';

import Theme from '../data/Theme';
import Routes from '../data/Routes';
import PackageJson from '../../package.json';

import planeIcon from '../images/plane-takeoff.png';
import 'electron-react-titlebar/assets/style.css';

import { SnackbarProvider } from 'notistack';
import { LocaleProvider } from '../locales/LocaleContext';

const useStyles = makeStyles({
  titlebar: {
    fontFamily: 'Poppins',
    lineHeight: '27px',
    color: 'white',
    zIndex: 99999999999,
    margin: 0,
    fontSize: 13,
    fontWeight: 300,
    marginLeft: 4,
  },
});

function App() {
  const classes = useStyles();
  return (
    <>
      <TitleBar icon={planeIcon} disableMaximize>
        <p className={classes.titlebar}>{PackageJson.productName}</p>
      </TitleBar>
      <main>
        <LocaleProvider locale={Config.get(ConfigKeys.settings.locale, 'en-GB')}>
          <ThemeProvider theme={Theme}>
            <SnackbarProvider maxSnack={5}>
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
            </SnackbarProvider>
          </ThemeProvider>
        </LocaleProvider>
      </main>
    </>
  );
}

export default hot(App);
