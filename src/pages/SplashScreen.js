import React from 'react';

import { Box, CircularProgress, Typography, makeStyles } from '@material-ui/core';

import Navigate from '../helpers/Navigate';

import ConfigKeys from '../data/config-keys.json';
import defaultConfig from '../data/default-config';
import LocaleContext from '../locales/LocaleContext';
import getConfigInstance from '../helpers/getConfigInstance';

const useStyles = makeStyles(theme => ({ loadingHeading: { marginTop: theme.spacing(3) } }));

function CheckConfig() {
  const CurrentKeys = getConfigInstance().keys();

  Object.keys(defaultConfig).forEach(key => {
    if (!CurrentKeys.includes(key)) {
      getConfigInstance().set(key, defaultConfig[key]);
    }
  });
}

export default function SplashScreen() {
  CheckConfig();
  const CurrentLocale = React.useContext(LocaleContext);

  const styles = useStyles();

  if (getConfigInstance().get(ConfigKeys.state.setup_completed, false)) {
    console.log('Setup complete');
    setTimeout(() => {
      Navigate('/home');
    }, 2000);
  } else {
    console.log('Setup not complete');
    setTimeout(() => {
      Navigate('/setup');
    }, 2000);
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" height="100%">
      <CircularProgress size={64} />
      <Typography className={styles.loadingHeading} component="h1" variant="h4">
        {CurrentLocale.translate('manager.splash_screen.loading')}
      </Typography>
      {/* Loads font on first start */}
      <p style={{ position: 'absolute', height: 1, width: 1, top: 0, left: 0, opacity: 0, fontFamily: 'IBM Plex Mono' }}>a</p>
    </Box>
  );
}
