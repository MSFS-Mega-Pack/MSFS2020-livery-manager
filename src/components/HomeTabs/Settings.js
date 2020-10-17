import React, { useState, useRef, useEffect, useReducer } from 'react';
import Electron from 'electron';

import { Paper, Typography, TextField, IconButton, InputAdornment, Box, Button, makeStyles, Link } from '@material-ui/core';
import FolderSearchOutlineIcon from 'mdi-react/FolderSearchOutlineIcon';

import { ValidateFSDirectory } from '../../helpers/MSFS/Directories';
import ShowNativeDialog from '../../helpers/ShowNativeDialog';
import ResetConfig from '../../helpers/ResetConfig';
import ClearCache from '../../helpers/CleanUp/ClearCache';

import CONFIG_KEYS from '../../data/config-keys.json';
import Constants from '../../data/Constants.json';
import { AllRoutes } from '../../data/Routes';
import IsAdvancedUser from '../../data/IsAdvancedUser';
import IsDev from '../../data/IsDev';
import packageJson from '../../../package.json';

import AdvancedSettingsToggleImage from '../../images/manager_text_advanced_settings.png';

import { useSnackbar } from 'notistack';
import Config from 'electron-json-config';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  },
  settingsRoot: {
    flex: '1',
    position: 'relative',
    paddingBottom: 90,
  },
  settingsItem: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  resetLink: {
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    float: 'right',
  },
  hintText: {
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
    paddingTop: theme.spacing(),
  },
  sectTitle: {
    textTransform: 'uppercase',
    marginBottom: 2,
    fontSize: theme.typography.pxToRem(16),
  },
  settingsButton: {
    float: 'right',
    '&::after': {
      content: "''",
      display: 'table',
      clear: 'both',
    },
  },
  saveButtonContainer: {
    marginTop: theme.spacing(),
    position: 'fixed',
    bottom: 16,
    left: 32,
    right: 32,
    '& > *': {
      backgroundColor: '#10101d',
    },
  },
  advancedSettingsToggle: {
    display: 'block',
    width: '50%',
    margin: 'auto',
    paddingTop: theme.spacing(4),
  },
  aboutFooter: {
    color: theme.palette.text.hint,
    padding: theme.spacing(4, 0),
    textAlign: 'center',
    '& p': {
      marginBottom: theme.spacing(0.5),
    },
  },
  versionNumber: {
    fontFamily: '"IBM Plex Mono"',
  },
}));

export default function Settings() {
  const classes = useStyles();

  const advancedSettingsToggleRef = useRef(null);
  const PackagesDirTB = useRef('');

  const [error, setError] = useState(null);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // eslint-disable-next-line
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    function toggleAdvanced(e) {
      if (e.detail === 5) {
        if (IsAdvancedUser()) {
          Config.set(CONFIG_KEYS.settings.show_advanced_settings, false);
          enqueueSnackbar('Disabled advanced settings', { variant: 'info' });
          forceUpdate();
        } else {
          let d = ShowNativeDialog(
            'Enable advanced settings?',
            'Enable advanced settings?',
            'Only do this if instructed to by a developer. This may have unintended consequences. You have been warned!'
          );

          if (d === 0) {
            Config.set(CONFIG_KEYS.settings.show_advanced_settings, true);
            enqueueSnackbar('Enabled advanced settings', { variant: 'warning' });
            forceUpdate();
          }
        }
      }
    }

    advancedSettingsToggleRef.current.addEventListener('click', toggleAdvanced);

    return () => {
      advancedSettingsToggleRef.current.removeEventListener('click', toggleAdvanced);
    };
  });

  function openBrowseDialog() {
    const d = Electron.remote.dialog.showOpenDialogSync(null, { properties: ['openDirectory'] });

    if (typeof d === 'undefined') {
      return;
    }

    const [isValid, errorMsg] = ValidateFSDirectory(d[0]);

    if (isValid) {
      setError(null);
      if (d[0] !== Config.get(CONFIG_KEYS.settings.package_directory)) {
        setSaveButtonEnabled(true);
      }
    } else {
      setError(errorMsg);
      setSaveButtonEnabled(false);
    }

    PackagesDirTB.current.value = d[0];
  }

  return (
    <div className={classes.root}>
      <section className={classes.settingsRoot}>
        <Paper className={classes.settingsItem}>
          <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2">
            Community folder
          </Typography>
          <TextField
            error={!!error}
            helperText={error}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            InputProps={{
              style: { fontFamily: 'IBM Plex Mono', letterSpacing: -0.2 },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="browse to folder" onClick={openBrowseDialog}>
                    <FolderSearchOutlineIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputRef={PackagesDirTB}
            variant="filled"
            label="Install path"
            defaultValue={Config.get(CONFIG_KEYS.settings.package_directory)}
            onChange={e => {
              const [isValid, errorMsg] = ValidateFSDirectory(e.currentTarget.value);

              if (isValid) {
                setError(null);
                if (e.currentTarget.value !== Config.get(CONFIG_KEYS.settings.package_directory)) {
                  setSaveButtonEnabled(true);
                }
              } else {
                setError(errorMsg);
                setSaveButtonEnabled(false);
              }
            }}
            fullWidth
          />
          <Link
            color="textSecondary"
            className={classes.resetLink}
            onClick={() => {
              PackagesDirTB.current.value = Config.get(CONFIG_KEYS.settings.package_directory);

              const [isValid, errorMsg] = ValidateFSDirectory(PackagesDirTB.current.value);

              if (isValid) {
                setError(null);
              } else {
                setError(errorMsg);
              }
            }}
          >
            Reset to previous value
          </Link>
        </Paper>

        {IsAdvancedUser() && (
          <>
            <Paper className={classes.settingsItem}>
              <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2">
                Caching
              </Typography>
              <Box mt={1}>
                <Button
                  onClick={async () => {
                    let s = enqueueSnackbar('Clearing cache. This might take a few mins.', { variant: 'info' });

                    const x = await ClearCache();

                    if (x === true) {
                      closeSnackbar(s);
                      enqueueSnackbar('Cache cleared successfully!', { variant: 'success' });
                    } else {
                      closeSnackbar(s);
                      enqueueSnackbar('Cache cleared with errors', { variant: 'error' });
                    }
                  }}
                >
                  Purge cache
                </Button>
              </Box>
            </Paper>

            <Paper className={classes.settingsItem}>
              <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2">
                Reset manager
              </Typography>
              <Box mt={1}>
                <Button
                  onClick={() => {
                    ResetConfig();

                    if (!IsDev) {
                      Electron.remote.app.relaunch();
                      Electron.remote.app.exit();
                    } else {
                      // workaround for reset during dev
                      window.__navigate(AllRoutes.SETUP);
                    }
                  }}
                >
                  Reset all settings
                </Button>
              </Box>
              <Typography className={classes.hintText}>
                This will reset all app settings and restart the manager. You won&apos;t lose any installed liveries, and any liveries that are
                already installed will be automatically re-detected.
              </Typography>
            </Paper>
          </>
        )}

        <img ref={advancedSettingsToggleRef} className={classes.advancedSettingsToggle} src={AdvancedSettingsToggleImage} />

        <footer className={classes.aboutFooter}>
          <Typography variant="body2" paragraph>
            {packageJson.productName} &mdash; Created for the Liveries Mega Pack
          </Typography>
          <Typography variant="body2" paragraph>
            &copy; {new Date().getFullYear()} &mdash; All rights reserved &mdash;{' '}
            <span className={classes.versionNumber}>v{packageJson.version}</span>
          </Typography>
          <Typography variant="body2" paragraph>
            <Link target="_blank" href={Constants.urls.managerRepo}>
              View the source code and license
            </Link>
          </Typography>
        </footer>
      </section>

      <Box className={classes.saveButtonContainer}>
        <Paper className={classes.settingsItem} style={{ display: 'flex' }}>
          <Box flex="1">
            <Typography color="textSecondary" variant="body2" style={{ lineHeight: '33px' }}>
              {error
                ? 'Please fix the error(s) above before saving.'
                : saveButtonEnabled
                ? "Click 'Save' to save changes."
                : 'All changes saved.'}
            </Typography>
          </Box>
          <Button
            onClick={() => {
              setSaveButtonEnabled(false);

              Config.setBulk({
                [CONFIG_KEYS.settings.package_directory]: PackagesDirTB.current.value,
              });
            }}
            disabled={!saveButtonEnabled}
          >
            Save
          </Button>
        </Paper>
      </Box>
    </div>
  );
}
