import React, { useState, useReducer } from 'react';

import Path from 'path';

import Config from 'electron-json-config';

import { GetPackagesDirectory, ValidateFSDirectory } from '../helpers/MSFS';

import { Typography, Box, useTheme, Button, TextField, InputAdornment, IconButton, makeStyles, CircularProgress } from '@material-ui/core';
import FolderSearchOutlineIcon from 'mdi-react/FolderSearchOutlineIcon';

import Electron from 'electron';
import GetLiverySources from '../helpers/Manifest/GetLiverySources';
import LiverySourcesTable from '../components/LiveryManager/SourceListTable';
import LiverySource from '../models/LiverySource';

export default function Setup() {
  const [page, setPage] = useState(1);
  const [nextButtonEnabled, setNextButtonEnabled] = useState(true);
  const [data, setDataReal] = useState({ packageDir: undefined, liverySources: undefined });

  if (page === 2) {
    if (!data.packageDir || data.packageDir.trim() === '') {
      nextButtonEnabled !== false && setNextButtonEnabled(false);
    }
  }

  function setData(d) {
    setDataReal({ ...data, ...d });
  }

  if (typeof data.packageDir === 'undefined') {
    GetPackagesDirectory().then(p => {
      setData({ packageDir: p });
    });
  }

  if (typeof data.liverySources === 'undefined') {
    GetLiverySources().then(ls => {
      setData({ liverySources: ls });
    });
  }

  const theme = useTheme();

  let CurrentPage = Pages[page - 1] || <></>;

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box flex="1" padding={theme.spacing()} paddingTop={theme.spacing(0.5)}>
        <CurrentPage key={page} data={data} setData={setData} setNextButtonEnabled={setNextButtonEnabled} />
      </Box>
      <Box display="flex" padding={theme.spacing()} paddingBottom={theme.spacing(0.5)}>
        {
          <Button
            onClick={() => {
              setPage(page - 1);
              setNextButtonEnabled(true);
            }}
            disabled={page === 1}
          >
            Back
          </Button>
        }
        <Box flex="1" />
        <Button
          onClick={() => {
            if (page !== Pages.length) {
              setPage(page + 1);
            } else {
              Navigate();
            }
          }}
          disabled={!nextButtonEnabled}
        >
          {page === Pages.length ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}

const Pages = [WelcomePage, SimInstallDirectoryPage, ChooseLiverySourcesPage, SetupCompletePage];

function WelcomePage() {
  return (
    <>
      <Typography gutterBottom component="h1" variant="h4">
        Welcome to the Flight Simulator 2020 Livery Manager
      </Typography>
      <Typography gutterBottom component="p" variant="body1">
        We need to go through a few brief setup pages before you can use the app, just to give you the best experience.
      </Typography>
    </>
  );
}

function SimInstallDirectoryPage({ data, setData, setNextButtonEnabled }) {
  const [error, setError] = useState(null);

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
      setNextButtonEnabled(true);
    } else {
      setError(errorMsg);
      setNextButtonEnabled(false);
    }
  }

  return (
    <>
      <Typography gutterBottom component="h1" variant="h4">
        Simulator packages directory
      </Typography>
      <Typography gutterBottom component="p" variant="body1">
        Please check that the directory below matches your flight simulator packages directory. If it doesn't, choose the right directory with
        the browse button.
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
    </>
  );
}

function ChooseLiverySourcesPage({ data, setData }) {
  return (
    <>
      <Typography gutterBottom component="h1" variant="h4">
        Review livery sources
      </Typography>
      {data.liverySources ? (
        <LiverySourcesTable sourceList={data.liverySources} />
      ) : (
        <CircularProgress style={{ margin: 'auto', marginTop: 32 }} />
      )}
    </>
  );
}

function SetupCompletePage() {
  return (
    <>
      <Typography gutterBottom component="h1" variant="h4">
        Setup complete
      </Typography>
    </>
  );
}
