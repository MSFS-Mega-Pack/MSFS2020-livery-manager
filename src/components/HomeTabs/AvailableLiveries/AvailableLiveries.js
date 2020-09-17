import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, CircularProgress, Fab, IconButton, Paper, Tooltip, Typography, Zoom } from '@material-ui/core';
import FullTable from './FullTable';
import RefreshIcon from 'mdi-react/RefreshIcon';
import DownloadIcon from 'mdi-react/DownloadOutlineIcon';

import dayjs from 'dayjs';
import FetchAndParseManifest from '../../../helpers/Manifest/FetchAndParseManifest';

import ActiveApiEndpoint from '../../../data/ActiveApiEndpoint';
import Constants from '../../../data/Constants.json';
import PlaneNameTable from '../../../data/PlaneNameTable.json';
import InstallAddon from '../../../helpers/AddonInstaller/InstallAddon';
import { useSnackbar } from 'notistack';

const RefreshInterval = 30 * 1000;

export default function AvailableLiveries(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { fileListing, setFileListing } = props;
  let aircraft = [],
    sortedLiveries = {};

  const [refreshing, setRefreshing] = useState(false);
  const [justRefreshed, setJustRefreshed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  /** @type {[object[], Function]} */
  const [selectedLiveries, setSelectedLiveries] = useState(null);

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

  function UpdateFileList(callback) {
    FetchAndParseManifest(`${ActiveApiEndpoint}/${Constants.api.get.cdnFileListing}`)
      .then(d => {
        setFileListing({ checkedAt: new Date().getTime(), ...d });
        typeof callback === 'function' && callback();
      })
      .catch(() => setFileListing(null));
  }

  const loading = (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
      <CircularProgress style={{ margin: 'auto', marginBottom: 24 }} size={64} />
      <Typography variant="body1" style={{ paddingBottom: 2 }}>
        Loading...
      </Typography>
      <Typography variant="body2" color="textSecondary">
        This can take up to a minute
      </Typography>
    </div>
  );

  if (typeof fileListing === 'undefined') {
    UpdateFileList();
    return (
      <>
        <RefreshBox justRefreshed={true} lastCheckedTime={'checking now...'} disabled={isInstalling} />
        {loading}
      </>
    );
  } else if (refreshing) {
    return (
      <>
        <RefreshBox justRefreshed={true} lastCheckedTime={'refreshing...'} disabled={isInstalling} />
        {loading}
      </>
    );
  } else if (fileListing && fileListing.data && fileListing.data.fileList) {
    // Create array of all aircraft with liveries, along with a thumbnail image
    const m = new Map();
    for (const item of fileListing.data.fileList) {
      if (!m.has(item.airplane)) {
        m.set(item.airplane, true);

        let thumb = fileListing.data.fileList.filter(a => a.airplane.toLowerCase() === item.airplane.toLowerCase()).find(a => a.image);
        thumb = thumb.image;

        aircraft.push({
          name: item.airplane.toLowerCase(),
          thumbnail: `${fileListing.data.cdnBaseUrl}/${thumb}`,
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
      />
      {fileListing && (
        <FullTable
          sortedLiveries={sortedLiveries}
          allAircraft={aircraft}
          disabled={isInstalling}
          selectedLiveriesUpdated={livs => setSelectedLiveries(livs)}
        />
      )}
      <Box p={2} />

      <Zoom in={selectedLiveries && selectedLiveries.length > 0 && !isInstalling}>
        <Fab
          onClick={async () => {
            if (isInstalling) return;

            setIsInstalling(true);

            let s = enqueueSnackbar('Installing liveries...', {
              variant: 'success',
              persist: true,
            });

            for (let i = 0; i < selectedLiveries.length; i++) {
              closeSnackbar(s);
              s = enqueueSnackbar(`Installing liveries: ${i + 1} of ${selectedLiveries.length}`, {
                variant: 'success',
                persist: true,
              });
              await InstallAddon(selectedLiveries[i]);
            }
            setIsInstalling(false);
          }}
          style={{ position: 'fixed', bottom: 24, right: 24 }}
          color="primary"
          variant="extended"
        >
          <DownloadIcon style={{ marginRight: 8 }} /> {isInstalling ? 'Installing' : 'Install'}{' '}
          {(selectedLiveries && selectedLiveries.length) || '??'} liveries
        </Fab>
      </Zoom>
    </div>
  );
}

AvailableLiveries.propTypes = {
  setFileListing: PropTypes.func.isRequired,
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

function RefreshBox(props) {
  const { lastCheckedTime, justRefreshed, onRefresh, disabled } = props;

  let toolTipContent = 'Refresh available liveries';
  if (justRefreshed) toolTipContent = `Rate limiting is in effect: you need to wait at least ${RefreshInterval / 1000}s between refreshes`;
  else if (disabled) toolTipContent = `You need to wait until your liveries are installed before refreshing.`;

  return (
    <Paper style={{ marginBottom: 16, marginTop: -8 }} variant="outlined">
      <Box px={2} py={1} display="flex" flexDirection="row">
        <Typography color="textSecondary" variant="body2" style={{ lineHeight: '33px' }}>
          Last updated:{' '}
          {typeof lastCheckedTime === 'string' ? lastCheckedTime : dayjs(lastCheckedTime).format('D MMM YYYY, h:mm A') || 'unknown'}
        </Typography>
        <Box flex={1} />
        <Box>
          <Tooltip title={toolTipContent}>
            <span>
              <IconButton color="primary" size="small" disabled={!!justRefreshed || disabled} onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
}

RefreshBox.propTypes = {
  lastCheckedTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  justRefreshed: PropTypes.bool,
  onRefresh: PropTypes.func,
  disabled: PropTypes.bool,
};
