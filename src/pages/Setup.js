import React, { useState } from 'react';

import Path from 'path';

import Config from 'electron-json-config';

import GetPackagesDirectory from '../helpers/GetPackagesDirectory';

import { Typography, Box, useTheme, Button, TextField, InputAdornment, IconButton } from '@material-ui/core';
import FolderSearchOutlineIcon from 'mdi-react/FolderSearchOutlineIcon';

import Electron from 'electron';
import ValidateFSDirectory from '../helpers/ValidateFSDirectory';

export default function Setup() {
  const [page, setPage] = useState(1);
  const [data, setDataReal] = useState({ packageDir: undefined, liverySources: undefined });

  function setData(d) {
    setDataReal({ ...data, ...d });
  }

  if (data.packageDir === undefined) {
    GetPackagesDirectory().then(p => {
      console.log(p);
      setData({ packageDir: p });
    });
  }

  const theme = useTheme();

  let CurrentPage = Pages[page - 1] || <></>;

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box flex="1" padding={theme.spacing()} paddingTop={theme.spacing(0.5)}>
        <CurrentPage key={page} data={data} setData={setData} />
      </Box>
      <Box display="flex" padding={theme.spacing()} paddingBottom={theme.spacing(0.5)}>
        {
          <Button
            onClick={() => {
              setPage(page - 1);
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
        >
          {page === Pages.length ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}

const Pages = [Page1, Page2, SetupCompletePage];

function Page1() {
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

function Page2({ data, setData }) {
  const [error, setError] = useState(null);

  function openBrowseDialog() {
    const d = Electron.remote.dialog.showOpenDialogSync(null, { properties: ['openDirectory'] });
    const [isValid, errorMsg] = ValidateFSDirectory(d);

    isValid && setData({ packageDir: d });
  }

  return (
    <>
      <Typography gutterBottom component="h1" variant="h4">
        Simulator install directory
      </Typography>
      <Typography gutterBottom component="p" variant="body1">
        Please check that the directory below matches your flight simulator install directory. If it doesn't choose the right directory.
      </Typography>
      {data.packageDir !== null && (
        <TextField
          InputLabelProps={{ shrink: true }}
          style={{ marginTop: 32 }}
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
          value={data.packageDir}
          onChange={e => {
            setData({ packageDir: e.target.value });
          }}
          fullWidth
        />
      )}
    </>
  );
}

function Page3({ data, setData }) {}

function SetupCompletePage() {
  return (
    <>
      <Typography gutterBottom component="h1" variant="h4">
        Setup complete
      </Typography>
    </>
  );
}
