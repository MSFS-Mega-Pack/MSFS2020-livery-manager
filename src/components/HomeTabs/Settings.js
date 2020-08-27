import React, { useState } from 'react';

import { Paper, Typography, TextField, IconButton, InputAdornment, Box, Button, useTheme, makeStyles } from '@material-ui/core';

import { GetPackagesDirectory, ValidateFSDirectory } from '../../helpers/MSFS';
import Electron from 'electron';
import FolderSearchOutlineIcon from 'mdi-react/FolderSearchOutlineIcon';
const useStyles = makeStyles({
  settingsRoot: {
    flexGrow: 1,
    padding: 28,
  },
  pageDescription: {
    fontSize: 14,
    opacity: 0.75,
  },
});

export default function Settings() {
  const theme = useTheme();
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [data, setDataReal] = useState({ packageDir: undefined, SaveButtonEnabled: false });

  function setData(d) {
    setDataReal({ ...data, ...d });
  }

  if (typeof data.packageDir === 'undefined') {
    GetPackagesDirectory().then(p => {
      setData({ packageDir: p });
    });
  }

  function openBrowseDialog() {
    const d = Electron.remote.dialog.showOpenDialogSync(null, { properties: ['openDirectory'] });

    if (typeof d === 'undefined') {
      // Dialog cancelled
      return;
    }

    setData({ packageDir: d[0] });

    const [isValid, errorMsg] = ValidateFSDirectory(d[0]);

    if (isValid) {
      setError(null);
      setSaveButtonEnabled(true);
    } else {
      setError(errorMsg);
      setSaveButtonEnabled(false);
    }
  }

  function setSaveButtonEnabled(value) {
    console.log(data.SaveButtonEnabled);
    data.SaveButtonEnabled = value;
    console.log(data.SaveButtonEnabled);
  }

  return (
    <>
      <Paper className={classes.settingsRoot}>
        <Typography paragraph className={classes.pageDescription}>
          Change Simulator Package Directory
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
          variant="filled"
          label="Install path"
          value={data.packageDir || ''}
          onChange={e => {
            setData({ packageDir: e.target.value });
          }}
          fullWidth
        />

        <Box display="flex" padding={theme.spacing()} paddingBottom={theme.spacing(0.5)}>
          <Box flex="1" />
          <Button
            onClick={() => {
              console.log('saved');
            }}
            disabled={data.SaveButtonEnabled}
          >
            Save
          </Button>
        </Box>
      </Paper>
    </>
  );
}
