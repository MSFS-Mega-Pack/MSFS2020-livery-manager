import React from 'react';
import { Route, HashRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';

import '@fontsource/roboto';
import '@fontsource/ibm-plex-mono';
import './styles/baseline.less';

import { CssBaseline } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { TitleBar } from 'electron-react-titlebar';

import Config from 'electron-json-config';
import ConfigKeys from '../data/config-keys.json';

import Theme from '../data/Theme';
import Routes from '../data/Routes';

import ProjectMegaPackLogo from '../images/pmp-logo/icon-light.png';
import 'electron-react-titlebar/assets/style.css';

import { SnackbarProvider } from 'notistack';
import { LocaleProvider } from '../locales/LocaleContext';
import MainAppErrorBoundary from './ErrorBoundaries/MainAppErrorBoundary';

const useStyles = makeStyles({
  titlebar: {
    fontFamily: 'Roboto',
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
  const [language, setLanguage] = React.useState(Config.get(ConfigKeys.settings.locale, 'en-GB'));

  return (
    <>
      <TitleBar icon={ProjectMegaPackLogo}>
        <p className={classes.titlebar}>Project Mega Pack Manager</p>
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
