import React, { useState } from 'react';
import PropTypes from 'prop-types';

// 3rd party components
import { Box, Fab, Typography, Zoom } from '@material-ui/core';
import DownloadIcon from 'mdi-react/DownloadOutlineIcon';

// 1st party components
import FullTable from './FullTable';
import ErrorDialog from '../../ErrorDialog';
import RefreshBox from '../../RefreshBox';
import Loading from '../../Loading';

// helpers and data
import InstallAddon from '../../../helpers/AddonInstaller/InstallAddon';
import GetInstalledAddons from '../../../helpers/AddonInstaller/getInstalledAddons';
import PlaneNameTable from '../../../data/PlaneNameTable.json';
import ConfigKeys from '../../../data/config-keys.json';
import Constants from '../../../data/Constants.json';
import NoImage from '../../../images/no-image-available.png';

// support libraries
import { useSnackbar } from 'notistack';
import LocaleContext from '../../../locales/LocaleContext';
import getConfigInstance from '../../../helpers/getConfigInstance';

export default function AvailableLiveries(props) {
  const CurrentLocale = React.useContext(LocaleContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { fileListing, UpdateFileList, justRefreshed, setJustRefreshed, installedLiveries, setInstalledLiveries } = props;
  let aircraft = [],
    sortedLiveries = {};

  const [refreshing, setRefreshing] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  /** @type {[object[], Function]} */
  const [selectedLiveries, setSelectedLiveries] = useState([]);

  if (typeof fileListing === 'undefined') {
    return (
      <>
        <RefreshBox
          justRefreshed={true}
          lastCheckedTime={CurrentLocale.translate('manager.pages.available_liveries.components.refresh_box.refreshing_now')}
          disabled={isInstalling}
          refreshInterval={Constants.refreshInterval}
        />
        <Loading />
      </>
    );
  } else if (refreshing) {
    return (
      <>
        <RefreshBox
          justRefreshed={true}
          lastCheckedTime={CurrentLocale.translate('manager.pages.available_liveries.components.refresh_box.refreshing_now')}
          disabled={isInstalling}
          refreshInterval={Constants.refreshInterval}
        />
        <Loading />
      </>
    );
  } else if (fileListing && fileListing.data && fileListing.data.fileList) {
    // Create array of all aircraft with liveries, along with a thumbnail image
    const m = new Map();
    for (const item of fileListing.data.fileList) {
      if (!m.has(item.airplane)) {
        m.set(item.airplane, true);

        let thumb = `${fileListing.data.cdnBaseUrl}/img/${item.airplane}/thumbnail.JPG`;

        aircraft.push({
          name: item.airplane.toLowerCase(),
          thumbnails: [thumb, NoImage],
        });
      }
    }

    aircraft = aircraft.sort((a, b) =>
      (PlaneNameTable[a.name] || a.name).toLowerCase().localeCompare((PlaneNameTable[b.name] || b.name).toLowerCase())
    );

    let temp = {};

    aircraft.forEach(a => {
      temp[a.name] = [];
    });

    fileListing.data.fileList.forEach(livery => {
      temp[livery.airplane.toLowerCase()].push(livery);
    });

    for (const key in temp) {
      if (Object.prototype.hasOwnProperty.call(temp, key)) {
        /** @type {object[]} */
        const liverySet = temp[key];

        temp[key] = liverySet.sort((a, b) => a.fileName.toLowerCase().localeCompare(b.fileName.toLowerCase()));
      }
    }

    sortedLiveries = temp;
  }

  return (
    <div>
      <RefreshBox
        justRefreshed={!!justRefreshed}
        lastCheckedTime={fileListing && fileListing.checkedAt}
        onRefresh={() => {
          setRefreshing(true);
          UpdateFileList(() => {
            setRefreshing(false);
            setJustRefreshed(new Date().getTime());
          });
        }}
        disabled={isInstalling}
        refreshInterval={Constants.refreshInterval}
      />

      {typeof installedLiveries === 'string' && (
        <ErrorDialog
          dismissable
          title={CurrentLocale.translate('manager.pages.available_liveries.errors.installed_addons_fail.title')}
          error={
            <Typography variant="body2" paragraph>
              {CurrentLocale.translate('manager.pages.available_liveries.errors.installed_addons_fail.error_text')}
            </Typography>
          }
          suggestions={[
            CurrentLocale.translate('manager.pages.available_liveries.errors.installed_addons_fail.suggestion1', {
              path: getConfigInstance().get(ConfigKeys.settings.package_directory),
            }),
            CurrentLocale.translate('manager.pages.available_liveries.errors.installed_addons_fail.suggestion2'),
          ]}
        />
      )}

      {fileListing && installedLiveries && typeof installedLiveries !== 'string' && (
        <FullTable
          sortedLiveries={sortedLiveries}
          allAircraft={aircraft}
          disabled={isInstalling}
          setSelectedLiveries={setSelectedLiveries}
          selectedLiveries={selectedLiveries}
          installedLiveries={installedLiveries}
        />
      )}
      <Box p={2} />

      <Zoom in={selectedLiveries && selectedLiveries.length > 0 && !isInstalling}>
        <Fab
          onClick={async () => {
            if (isInstalling) return;

            setIsInstalling(true);

            let s = enqueueSnackbar(CurrentLocale.translate('manager.pages.available_liveries.progress_notifications.begin_install'), {
              variant: 'info',
              persist: true,
            });

            let failures = 0;

            for (let i = 0; i < selectedLiveries.length; i++) {
              console.log(`Start install ${i}`);

              try {
                await InstallAddon(
                  selectedLiveries[i],
                  i,
                  selectedLiveries.length,
                  CurrentLocale,
                  message => {
                    closeSnackbar(s);
                    s = enqueueSnackbar(message, {
                      variant: 'info',
                      persist: true,
                    });
                  },
                  'fresh'
                );
              } catch (e) {
                failures++;
                console.log('failed!');
                console.log(e);
              }
            }

            setIsInstalling(false);
            setSelectedLiveries([]);

            GetInstalledAddons()
              .then(l => setInstalledLiveries(l))
              .catch(e => setInstalledLiveries(e));

            closeSnackbar(s);
            enqueueSnackbar(
              CurrentLocale.translate('manager.pages.available_liveries.progress_notifications.install_complete', {
                total: selectedLiveries.length,
              }),
              { variant: 'success', persist: false }
            );
            failures > 0 &&
              enqueueSnackbar(
                CurrentLocale.translate('manager.pages.available_liveries.progress_notifications.install_failed', {
                  fails: failures,
                }),
                { variant: 'error' }
              );
          }}
          style={{ position: 'fixed', bottom: 24, right: 24 }}
          color="primary"
          variant="extended"
        >
          <DownloadIcon style={{ marginRight: 8 }} />
          {CurrentLocale.translate(
            isInstalling ? 'manager.pages.available_liveries.fab_currently_installing' : 'manager.pages.available_liveries.fab_install',
            {
              total: selectedLiveries && selectedLiveries.length,
              size: selectedLiveries && selectedLiveries.reduce((prev, curr) => prev + curr.size / 1000000, 0).toFixed(2),
            }
          )}
        </Fab>
      </Zoom>
    </div>
  );
}

AvailableLiveries.propTypes = {
  justRefreshed: PropTypes.any,
  setJustRefreshed: PropTypes.func,
  UpdateFileList: PropTypes.func.isRequired,
  fileListing: PropTypes.shape({
    checkedAt: PropTypes.number.isRequired,
    data: PropTypes.shape({
      cdnBaseUrl: PropTypes.string.isRequired,
      fileList: PropTypes.arrayOf(
        PropTypes.shape({
          airplane: PropTypes.string.isRequired,
          fileName: PropTypes.string.isRequired,
          generation: PropTypes.string.isRequired,
          metaGeneration: PropTypes.string.isRequired,
          lastModified: PropTypes.string.isRequired,
          ETag: PropTypes.string.isRequired,
          size: PropTypes.string.isRequired,
          checkSum: PropTypes.string.isRequired,
          image: PropTypes.string,
          smallImage: PropTypes.string,
        }).isRequired
      ),
    }),
  }),
  installedLiveries: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        airplane: PropTypes.string,
        fileName: PropTypes.string,
        displayName: PropTypes.string,
        generation: PropTypes.string,
        metaGeneration: PropTypes.string,
        lastModified: PropTypes.string,
        ETag: PropTypes.string,
        size: PropTypes.string,
        checkSum: PropTypes.string,
        image: PropTypes.string,
        smallImage: PropTypes.string,
      })
    ),
    PropTypes.string,
  ]),
  setInstalledLiveries: PropTypes.func,
};
