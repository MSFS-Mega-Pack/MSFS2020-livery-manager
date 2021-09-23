import React, { useState, useRef, useEffect, useReducer } from 'react';
import * as ElectronRemote from '@electron/remote';

import {
  Paper,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Button,
  makeStyles,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
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
import LocaleContext from '../../locales/LocaleContext';
import { GetAllLocales } from '../../locales/LocaleHelpers';
import getConfigInstance from '../../helpers/getConfigInstance';

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
    maxWidth: 1000,
    width: '100%',
    margin: 'auto',
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
    '&:not(:first-child)': {
      marginLeft: theme.spacing(),
    },
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

  const forceUpdate = useReducer(x => x + 1, 0)[1];

  const CurrentLocale = React.useContext(LocaleContext);

  useEffect(() => {
    function toggleAdvanced(e) {
      if (e.detail === 5) {
        if (IsAdvancedUser()) {
          getConfigInstance().set(CONFIG_KEYS.settings.show_advanced_settings, false);
          enqueueSnackbar(CurrentLocale.translate('manager.pages.settings.advanced_settings.disabled_notification'), {
            variant: 'info',
          });
          forceUpdate();
        } else {
          let d = ShowNativeDialog(
            CurrentLocale,
            CurrentLocale.translate('manager.pages.settings.advanced_settings.dialog_body'),
            CurrentLocale.translate('manager.pages.settings.advanced_settings.dialog_title'),
            CurrentLocale.translate('manager.pages.settings.advanced_settings.dialog_detail')
          );

          if (d === 0) {
            getConfigInstance().set(CONFIG_KEYS.settings.show_advanced_settings, true);
            enqueueSnackbar(CurrentLocale.translate('manager.pages.settings.advanced_settings.enabled_notification'), {
              variant: 'warning',
            });
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
    const d = ElectronRemote.dialog.showOpenDialogSync(null, { properties: ['openDirectory'] });

    if (typeof d === 'undefined') {
      return;
    }

    const [isValid, errorMsg] = ValidateFSDirectory(d[0], CurrentLocale);

    if (isValid) {
      setError(null);
      if (d[0] !== getConfigInstance().get(CONFIG_KEYS.settings.package_directory)) {
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
            {CurrentLocale.translate('manager.pages.settings.user_settings.community_folder.name')}
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
                  <IconButton
                    aria-label={CurrentLocale.translate('manager.pages.settings.user_settings.community_folder.browse_button_sr_text')}
                    onClick={openBrowseDialog}
                  >
                    <FolderSearchOutlineIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputRef={PackagesDirTB}
            variant="filled"
            label={CurrentLocale.translate('manager.pages.settings.user_settings.community_folder.input_label')}
            defaultValue={getConfigInstance().get(CONFIG_KEYS.settings.package_directory)}
            onChange={e => {
              const [isValid, errorMsg] = ValidateFSDirectory(e.currentTarget.value, CurrentLocale);

              if (isValid) {
                setError(null);
                if (e.currentTarget.value !== getConfigInstance().get(CONFIG_KEYS.settings.package_directory)) {
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
              PackagesDirTB.current.value = getConfigInstance().get(CONFIG_KEYS.settings.package_directory);

              const [isValid, errorMsg] = ValidateFSDirectory(PackagesDirTB.current.value, CurrentLocale);

              if (isValid) {
                setError(null);
              } else {
                setError(errorMsg);
              }
            }}
          >
            {CurrentLocale.translate('manager.pages.settings.user_settings.community_folder.reset_button')}
          </Link>
          <Link
            color="textSecondary"
            className={classes.resetLink}
            onClick={e => {
              const target = e.currentTarget;

              target.innerText = CurrentLocale.translate('manager.pages.settings.user_settings.community_folder.open_in_explorer_opening');

              setTimeout(() => {
                target.innerText = CurrentLocale.translate('manager.pages.settings.user_settings.community_folder.open_in_explorer');
              }, 2500);

              ElectronRemote.shell.showItemInFolder(getConfigInstance().get(CONFIG_KEYS.settings.package_directory));
            }}
          >
            {CurrentLocale.translate('manager.pages.settings.user_settings.community_folder.open_in_explorer')}
          </Link>
        </Paper>

        <Paper className={classes.settingsItem}>
          <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2">
            {CurrentLocale.translate('manager.pages.settings.user_settings.locale_selection.name')}
          </Typography>

          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="lang-label">{CurrentLocale.translate('manager.pages.settings.user_settings.locale_selection.label')}</InputLabel>
            <Select
              value={CurrentLocale.locale}
              onChange={e => {
                CurrentLocale.updateLocale(e.target.value);
              }}
              label={CurrentLocale.translate('manager.pages.settings.user_settings.locale_selection.label')}
              labelId="lang-label"
            >
              {GetAllLocales().map(locale => (
                <MenuItem value={locale.info.localeId} key={locale.info.localeId}>
                  {locale.info.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {IsAdvancedUser() && (
          <>
            <Paper className={classes.settingsItem}>
              <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2">
                {CurrentLocale.translate('manager.pages.settings.user_settings.cache_clear.name')}
              </Typography>
              <Box mt={1}>
                <Button
                  onClick={async () => {
                    let s = enqueueSnackbar(
                      CurrentLocale.translate('manager.pages.settings.user_settings.cache_clear.clearing_cache_notification'),
                      {
                        variant: 'info',
                      }
                    );

                    const x = await ClearCache();

                    if (x === true) {
                      closeSnackbar(s);
                      enqueueSnackbar(
                        CurrentLocale.translate('manager.pages.settings.user_settings.cache_clear.cache_clear_success_notification'),
                        { variant: 'success' }
                      );
                    } else {
                      closeSnackbar(s);
                      enqueueSnackbar(
                        CurrentLocale.translate('manager.pages.settings.user_settings.cache_clear.cache_clear_error_notification'),
                        { variant: 'error' }
                      );
                    }
                  }}
                >
                  {CurrentLocale.translate('manager.pages.settings.user_settings.cache_clear.purge_cache_button')}
                </Button>
              </Box>
            </Paper>

            <Paper className={classes.settingsItem}>
              <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2">
                {CurrentLocale.translate('manager.pages.settings.user_settings.reset_manager_to_defaults.name')}
              </Typography>
              <Box mt={1}>
                <Button
                  onClick={() => {
                    ResetConfig();

                    if (!IsDev) {
                      ElectronRemote.app.relaunch();
                      ElectronRemote.app.exit();
                    } else {
                      // workaround for reset during dev
                      window.__navigate(AllRoutes.SETUP);
                    }
                  }}
                >
                  {CurrentLocale.translate('manager.pages.settings.user_settings.reset_manager_to_defaults.reset_btn')}
                </Button>
              </Box>
              <Typography className={classes.hintText}>
                {CurrentLocale.translate('manager.pages.settings.user_settings.reset_manager_to_defaults.detail')}
              </Typography>
            </Paper>
          </>
        )}

        <img draggable="false" ref={advancedSettingsToggleRef} className={classes.advancedSettingsToggle} src={AdvancedSettingsToggleImage} />

        <footer className={classes.aboutFooter}>
          <Typography variant="body2" paragraph>
            {CurrentLocale.translate('manager.pages.settings.footer.line1', {
              appName: packageJson.productName,
            })}
          </Typography>
          <Typography variant="body2" paragraph>
            {CurrentLocale.translate('manager.pages.settings.footer.line2', {
              year: new Date().getFullYear(),
            })}{' '}
            <span className={classes.versionNumber}>
              {CurrentLocale.translate('manager.pages.settings.footer.version', {
                version: packageJson.version,
              })}
            </span>
          </Typography>
          <Typography variant="body2" paragraph>
            <Link target="_blank" href={Constants.urls.managerRepo}>
              {CurrentLocale.translate('manager.pages.settings.footer.source_repo_and_license')}
            </Link>
          </Typography>
        </footer>
      </section>

      <Box className={classes.saveButtonContainer}>
        <Paper className={classes.settingsItem} style={{ display: 'flex' }}>
          <Box flex="1">
            <Typography color="textSecondary" variant="body2" style={{ lineHeight: '33px' }}>
              {error
                ? CurrentLocale.translate('manager.pages.settings.errors_in_inputs')
                : saveButtonEnabled
                ? CurrentLocale.translate('manager.pages.settings.save_settings_changes')
                : CurrentLocale.translate('manager.pages.settings.all_changes_saved')}
            </Typography>
          </Box>
          <Button
            onClick={() => {
              setSaveButtonEnabled(false);

              getConfigInstance().setBulk({
                [CONFIG_KEYS.settings.package_directory]: PackagesDirTB.current.value,
              });
            }}
            disabled={!saveButtonEnabled}
          >
            {CurrentLocale.translate('manager.pages.settings.save_button')}
          </Button>
        </Paper>
      </Box>
    </div>
  );
}
