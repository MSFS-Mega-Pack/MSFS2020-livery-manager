import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { GetPackagesDirectory, ValidateFSDirectory } from '../helpers/MSFS/Directories';
import { AllRoutes } from '../data/Routes';

import {
  Typography,
  Box,
  useTheme,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Link,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import FolderSearchOutlineIcon from 'mdi-react/FolderSearchOutlineIcon';

import Navigate from '../helpers/Navigate';

import Electron from 'electron';
import Config from 'electron-json-config';
import ConfigKeys from '../data/config-keys.json';
import PackageJson from '../../package.json';
import LocaleContext from '../locales/LocaleContext';
import { GetAllLocales } from '../locales/LocaleHelpers';

export default function Setup() {
  const [page, setPage] = useState(1);
  const [nextButtonEnabled, setNextButtonEnabled] = useState(true);
  const [data, setDataReal] = useState({ packageDir: undefined });

  const theme = useTheme();
  const CurrentLocale = React.useContext(LocaleContext);

  if (page === 2) {
    if (!ValidateFSDirectory(data.packageDir, CurrentLocale)[0]) {
      nextButtonEnabled !== false && setNextButtonEnabled(false);
    } else {
      nextButtonEnabled !== true && setNextButtonEnabled(true);
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
            {CurrentLocale.translate('manager.setup.back_button')}
          </Button>
        }
        <Box flex="1" />
        <Button
          onClick={() => {
            if (page !== Pages.length) {
              setPage(page + 1);
            } else {
              Config.setBulk({
                [ConfigKeys.state.setup_completed]: true,
                [ConfigKeys.settings.package_directory]: data.packageDir,
              });
              Navigate(AllRoutes.MULTI_PAGE_HOME);
            }
          }}
          disabled={!nextButtonEnabled}
        >
          {page === Pages.length ? CurrentLocale.translate('manager.setup.finish_button') : CurrentLocale.translate('manager.setup.next_button')}
        </Button>
      </Box>
    </Box>
  );
}

const Pages = [WelcomePage, LanguageSelectPage, SimInstallDirectoryPage, SetupCompletePage];

function WelcomePage() {
  const CurrentLocale = React.useContext(LocaleContext);

  return (
    <>
      <Typography gutterBottom component="h1" variant="h4">
        {CurrentLocale.translate('manager.setup.welcome_page.heading', { app_name: PackageJson.productName })}
      </Typography>
      <Typography gutterBottom component="p" variant="body1">
        {CurrentLocale.translate('manager.setup.welcome_page.description')}
      </Typography>
    </>
  );
}

function LanguageSelectPage({ data, setData }) {
  const CurrentLocale = React.useContext(LocaleContext);
  const forceUpdate = React.useReducer(x => x + 1, 0)[1];

  const activeLocaleId = CurrentLocale.locale;

  return (
    <>
      <Typography gutterBottom component="h1" variant="h4">
        {CurrentLocale.translate('manager.setup.locale_page.heading')}
      </Typography>
      <Typography gutterBottom component="p" variant="body1">
        {CurrentLocale.translate('manager.setup.locale_page.description')}
      </Typography>
      <Typography gutterBottom component="p" variant="body1">
        <Link color="primary" target="_blank" href="https://github.com/MSFS-Mega-Pack/MSFS2020-livery-manager/tree/main/src/locales/README.md">
          {CurrentLocale.translate('manager.setup.locale_page.help_translate_link')}
        </Link>
      </Typography>
      <FormControl variant="outlined" margin="normal">
        <InputLabel id="lang-label">{CurrentLocale.translate('manager.setup.locale_page.dropdown.label')}</InputLabel>
        <Select
          value={activeLocaleId}
          onChange={e => {
            CurrentLocale.updateLocale(e.target.value);
          }}
          label={CurrentLocale.translate('manager.setup.locale_page.dropdown.label')}
          labelId="lang-label"
        >
          {GetAllLocales().map(locale => (
            <MenuItem value={locale.info.localeId} key={locale.info.localeId}>
              {locale.info.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

function SimInstallDirectoryPage({ data, setData }) {
  const CurrentLocale = React.useContext(LocaleContext);
  const errorMsg = ValidateFSDirectory(data.packageDir, CurrentLocale)[1];

  function openBrowseDialog() {
    const d = Electron.remote.dialog.showOpenDialogSync(null, { properties: ['openDirectory'] });

    if (typeof d === 'undefined') {
      // Dialog cancelled
      return;
    }

    setData({ packageDir: d[0] });
  }

  return (
    <>
      <Typography gutterBottom component="h1" variant="h4">
        {CurrentLocale.translate('manager.setup.community_directory.heading')}
      </Typography>
      <Typography gutterBottom component="p" variant="body1">
        {CurrentLocale.translate('manager.setup.community_directory.description')}
      </Typography>
      <TextField
        error={!!errorMsg}
        helperText={errorMsg}
        InputLabelProps={{ shrink: true }}
        margin="normal"
        InputProps={{
          style: { fontFamily: 'IBM Plex Mono', letterSpacing: -0.2 },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={CurrentLocale.translate('manager.setup.community_directory.text_field.browse_button_sr_text')}
                onClick={openBrowseDialog}
              >
                <FolderSearchOutlineIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        variant="filled"
        label={CurrentLocale.translate('manager.setup.community_directory.text_field.label')}
        value={data.packageDir || ''}
        onChange={e => {
          setData({ packageDir: e.target.value });
        }}
        fullWidth
      />
    </>
  );
}

function SetupCompletePage() {
  const CurrentLocale = React.useContext(LocaleContext);

  return (
    <>
      <Typography gutterBottom component="h1" variant="h4">
        {CurrentLocale.translate('manager.setup.complete_page.heading')}
      </Typography>
      <Typography gutterBottom component="p" variant="body1">
        {CurrentLocale.translate('manager.setup.complete_page.description1')}
      </Typography>
      <Typography gutterBottom component="p" variant="body1">
        {CurrentLocale.translate('manager.setup.complete_page.description2')}
      </Typography>
    </>
  );
}

const PagePropTypes = {
  data: PropTypes.shape({
    packageDir: PropTypes.string.isRequired,
  }).isRequired,
  setData: PropTypes.func.isRequired,
};

SimInstallDirectoryPage.propTypes = {
  ...PagePropTypes,
};

SetupCompletePage.propTypes = {
  ...PagePropTypes,
};

WelcomePage.propTypes = {
  ...PagePropTypes,
};
