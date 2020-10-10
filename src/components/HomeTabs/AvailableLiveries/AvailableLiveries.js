import React, { useEffect, useState } from 'react';
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
import NoImage from '../../../images/no-image-available.png';

// support libraries
import { useSnackbar } from 'notistack';
import Config from 'electron-json-config';

const RefreshInterval = 30 * 1000;

export default function AvailableLiveries(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { fileListing, UpdateFileList, justRefreshed, setJustRefreshed } = props;
  let aircraft = [],
    sortedLiveries = {};

  const [refreshing, setRefreshing] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  /** @type {[object[], Function]} */
  const [selectedLiveries, setSelectedLiveries] = useState([]);
  /** @type {[object[], Function]} */
  const [installedLiveries, setInstalledLiveries] = useState(undefined);

  if (typeof installedLiveries === 'undefined') {
    setInstalledLiveries(null);
    GetInstalledAddons()
      .then(liveries => setInstalledLiveries(liveries))
      .catch(e => setInstalledLiveries(e));
  }

  useEffect(() => {
    let key;

    if (justRefreshed) {
      key = setInterval(() => {
        let now = new Date().getTime();

        if (now > justRefreshed + RefreshInterval) {
          setJustRefreshed(false);
          clearInterval(key);
        }
      }, 500);
    }

    return () => {
      clearInterval(key);
    };
  }, [justRefreshed, setJustRefreshed]);

  if (typeof fileListing === 'undefined') {
    return (
      <>
        <RefreshBox justRefreshed={true} lastCheckedTime={'checking now...'} disabled={isInstalling} />
        <Loading />
      </>
    );
  } else if (refreshing) {
    return (
      <>
        <RefreshBox justRefreshed={true} lastCheckedTime={'refreshing...'} disabled={isInstalling} />
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
        refreshInterval={RefreshInterval}
      />

      {typeof installedLiveries === 'string' && (
        <ErrorDialog
          dismissable
          title={"Couldn't load available liveries"}
          error={
            <Typography variant="body2" paragraph>
              We couldn&apos;t fetch the list of installed liveries. Have you moved or deleted your Community folder?
            </Typography>
          }
          suggestions={[
            `The path you told us is "${Config.get(ConfigKeys.settings.package_directory)}". Is this correct?`,
            `Update your packages directory in Settings.`,
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

            let s = enqueueSnackbar('Installing liveries...', {
              variant: 'info',
              persist: true,
            });

            let failures = [];

            for (let i = 0; i < selectedLiveries.length; i++) {
              console.log(`Start Install ${i}`);

              try {
                await InstallAddon(selectedLiveries[i], i, selectedLiveries.length, message => {
                  closeSnackbar(s);
                  s = enqueueSnackbar(message, {
                    variant: 'info',
                    persist: true,
                  });
                });
              } catch (e) {
                failures.push(i);
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
            enqueueSnackbar('Installation complete', { variant: 'success', persist: false });
            failures.length > 0 && enqueueSnackbar(`${failures.length} liveries failed to install`, { variant: 'error' });
          }}
          style={{ position: 'fixed', bottom: 24, right: 24 }}
          color="primary"
          variant="extended"
        >
          <DownloadIcon style={{ marginRight: 8 }} /> {isInstalling ? 'Installing ' : 'Install '}
          {(selectedLiveries && selectedLiveries.length) || '??'} liveries (
          {selectedLiveries && Math.round(selectedLiveries.reduce((prev, curr) => prev + curr.size / 1000000, 0) * 10) / 10} MB)
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
};
