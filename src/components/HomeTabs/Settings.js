import React, { useState, useRef } from 'react';

import { Paper, Typography, TextField, IconButton, InputAdornment, Box, Button, makeStyles, Link } from '@material-ui/core';

import { ValidateFSDirectory } from '../../helpers/MSFS/Directories';

import Config from 'electron-json-config';
import CONFIG_KEYS from '../../data/config-keys.json';

import Electron from 'electron';

import FolderSearchOutlineIcon from 'mdi-react/FolderSearchOutlineIcon';

const useStyles = makeStyles(theme => ({
  settingsRoot: {
    flex: '1',
  },
  settingsItem: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(3),
  },
  resetLink: {
    fontSize: 14,
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    float: 'right',
  },
  sectTitle: {
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  saveButtonContainer: {
    marginTop: theme.spacing(),
  },
}));

export default function Settings() {
  const classes = useStyles();

  const [error, setError] = useState(null);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  const PackagesDirTB = useRef('');

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
    <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
      <section className={classes.settingsRoot}>
        <Paper className={classes.settingsItem}>
          <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2">
            Simulator packages directory
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
                  <IconButton aria-label="toggle password visibility" onClick={openBrowseDialog}>
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
