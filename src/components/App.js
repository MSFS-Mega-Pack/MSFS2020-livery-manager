import React from 'react';
import { Route, HashRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';

import '@fontsource/poppins';
import '@fontsource/ibm-plex-mono';
import './styles/baseline.less';

import { CssBaseline } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { TitleBar } from '@msfs/electron-react-titlebar';

import ConfigKeys from '../data/config-keys.json';

import Theme from '../data/Theme';
import Routes from '../data/Routes';
import PackageJson from '../../package.json';

import planeIcon from '../images/plane-takeoff.png';
import '@msfs/electron-react-titlebar/assets/style.css';

import { SnackbarProvider } from 'notistack';
import { LocaleProvider } from '../locales/LocaleContext';
import MainAppErrorBoundary from './ErrorBoundaries/MainAppErrorBoundary';
import getConfigInstance from '../helpers/getConfigInstance';

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
  const [language, setLanguage] = React.useState(getConfigInstance().get(ConfigKeys.settings.locale, 'en-GB'));

  return (
    <>
      <TitleBar icon={planeIcon}>
        <p className={classes.titlebar}>{PackageJson.productName}</p>
      </TitleBar>
      <main>
        <LocaleProvider locale={language} setLocale={setLanguage}>
          <ThemeProvider theme={Theme}>
            <SnackbarProvider maxSnack={5}>
              <CssBaseline />

              <MainAppErrorBoundary>
                <HashRouter hashType="slash">
                  <AnimatedSwitch atEnter={{ opacity: 0 }} atLeave={{ opacity: 0 }} atActive={{ opacity: 1 }} className="switch-wrapper">
                    {Routes.map(route => (
                      <Route key={route.path} path={route.path}>
                        {route.component}
                      </Route>
                    ))}
                  </AnimatedSwitch>
                </HashRouter>
              </MainAppErrorBoundary>
            </SnackbarProvider>
          </ThemeProvider>
        </LocaleProvider>
      </main>
    </>
  );
}

export default App;
