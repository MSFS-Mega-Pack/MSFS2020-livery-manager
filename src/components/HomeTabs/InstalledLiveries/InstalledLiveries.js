import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Typography } from '@material-ui/core';

import RefreshBox from '../../RefreshBox';
import Loading from '../../Loading';
import FullInstalledTable from './FullInstalledTable';

import GetInstalledAddons from '../../../helpers/AddonInstaller/getInstalledAddons';

import Constants from '../../../data/Constants.json';
import NoImage from '../../../images/no-image-available.png';
import GetIndexOfLiveryInArray from '../../../helpers/GetIndexOfLiveryInArray';

export default function InstalledLiveries(props) {
  const { fileListing, UpdateFileList, justRefreshed, setJustRefreshed, installedLiveries, setInstalledLiveries } = props;

  const [refreshing, setRefreshing] = useState(false);
  const [expandedList, setExpandedList] = useState([]);

  function SetExpanded(aircraftName, expanded) {
    if (expanded) setExpandedList(l => (l.includes(aircraftName) ? l : [...l, aircraftName]));
    else
      setExpandedList(l => {
        const x = [...l];

        const i = x.findIndex(v => v == aircraftName);
        i !== -1 && x.splice(i, 1);

        return x;
      });
  }

  async function RefreshInstalledLiveries() {
    return new Promise((resolve, reject) => {
      setRefreshing(true);
      setInstalledLiveries(null);

      GetInstalledAddons()
        .then(liveries => {
          setInstalledLiveries(liveries);
          setRefreshing(false);
          resolve(true);
        })
        .catch(e => {
          setInstalledLiveries(e);
          setRefreshing(false);
          reject(e);
        });
    });
  }

  const [livData, setLivData] = useState({
    disabled: [],
    deleting: [],
    updating: [],
    selected: [],
    RefreshInstalledLiveries,
  });

  /**
   * @param {"disabled"|"deleting"|"updating"|"selected"} arrayName Name of liveryData array
   * @param {Object} livery Livery to add
   */
  function AddLiveryToData(arrayName, livery) {
    setLivData(ld => {
      // clone livery data
      const x = { ...ld };

      if (GetIndexOfLiveryInArray(livery, x[arrayName])[0] === -1) {
        x[arrayName].push(livery);
      }

      return x;
    });
  }

  /**
   * @param {"disabled"|"deleting"|"updating"|"selected"} arrayName Name of liveryData array
   * @param {Object} livery Livery to add
   */
  function RemoveLiveryFromData(arrayName, livery) {
    setLivData(ld => {
      // clone livery data
      const x = { ...ld };
      const i = GetIndexOfLiveryInArray(livery, x[arrayName])[0];

      if (i !== -1) {
        x[arrayName].splice(i, 1);
      }

      return x;
    });
  }

  if (typeof installedLiveries === 'undefined') {
    setInstalledLiveries(null);
    GetInstalledAddons()
      .then(liveries => {
        setInstalledLiveries(liveries);
        setRefreshing(false);
      })
      .catch(e => setInstalledLiveries(e));
  }

  let allAircraft;

  if (installedLiveries && fileListing) {
    const m = new Map();
    allAircraft = [];

    for (const item of installedLiveries) {
      if (!m.has(item.airplane)) {
        m.set(item.airplane, true);

        let thumb = `${fileListing.data.cdnBaseUrl}/img/${item.airplane}/thumbnail.JPG`;

        allAircraft.push({
          name: item.airplane.toLowerCase(),
          thumbnails: [thumb, NoImage],
        });
      }
    }
  }

  if (typeof fileListing === 'undefined') {
    return (
      <>
        <RefreshBox justRefreshed={true} lastCheckedTime={'checking now...'} refreshInterval={Constants.refreshInterval} />
        <Loading />
      </>
    );
  } else if (refreshing) {
    return (
      <>
        <RefreshBox justRefreshed={true} lastCheckedTime={'refreshing...'} refreshInterval={Constants.refreshInterval} />
        <Loading />
      </>
    );
  }

  return (
    <Box>
      <RefreshBox
        justRefreshed={!!justRefreshed}
        lastCheckedTime={fileListing && fileListing.checkedAt}
        onRefresh={async () => {
          setRefreshing(true);
          await RefreshInstalledLiveries();
          UpdateFileList(() => {
            setRefreshing(false);
            setJustRefreshed(new Date().getTime());
          });
        }}
        refreshInterval={Constants.refreshInterval}
      />

      <Box display="flex">
        <Box flex="1">
          <Typography paragraph variant="body1">
            At the moment, you can&apos;t remove or update multiple liveries at a time. Don&apos;t worry because this will be coming in a future
            update.
          </Typography>
        </Box>
        <Box>
          <Button
            onClick={() => {
              installedLiveries.forEach(async liv => {
                console.log('start deletion');

                if (!livery) {
                  // No livery object passed
                  enqueueSnackbar('Failed to remove livery: no obj passed (#1)', { variant: 'error' });
                  return;
                }

                console.log('a');
                AddLiveryToData('deleting', livery);
                console.log('b');

                if (!livery.installLocation) {
                  // No install location passed
                  enqueueSnackbar('Failed to remove livery: unknown location (#2)', { variant: 'error' });
                  RemoveLiveryFromData('deleting', livery);
                  return;
                }
                console.log('c');

                const liveryPath = livery.installLocation;
                console.log(liveryPath);

                if (!fs.existsSync(liveryPath)) {
                  // Install path doesn't exist
                  enqueueSnackbar('Failed to remove livery: folder not found (#3)', { variant: 'error' });
                  RemoveLiveryFromData('deleting', livery);
                  return;
                }
                console.log('d');

                try {
                  const result = await DeleteAddon(liveryPath);

                  console.log(result);
                  console.log('f');
                  liveryData.RefreshInstalledLiveries();
                  console.log('g');

                  if (result[0] === false) {
                    // Other error
                    enqueueSnackbar(`Failed to remove livery: ${result[1]} (#4)`, { variant: 'error' });
                    RemoveLiveryFromData('deleting', livery);
                    console.error(result[1]);
                  } else {
                    enqueueSnackbar('Successfully removed livery', { variant: 'success' });
                  }
                } catch (err) {
                  // Other error
                  enqueueSnackbar('Failed to remove livery: unknown error (#5)', { variant: 'error' });
                  RemoveLiveryFromData('deleting', livery);
                  console.error(err);
                  return;
                }
              });
            }}
          >
            Remove all
          </Button>
        </Box>
      </Box>

      <FullInstalledTable
        liveries={installedLiveries}
        allAircraft={allAircraft}
        liveryData={livData}
        AddLiveryToData={AddLiveryToData}
        RemoveLiveryFromData={RemoveLiveryFromData}
        SetExpanded={SetExpanded}
        expandedList={expandedList}
      />
    </Box>
  );
}

InstalledLiveries.propTypes = {
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
  installedLiveries: PropTypes.oneOf([
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
