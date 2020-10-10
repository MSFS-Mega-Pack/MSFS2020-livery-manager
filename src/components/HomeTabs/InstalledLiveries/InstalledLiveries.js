import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@material-ui/core';

import { RefreshBox } from '../../RefreshBox';

import GetInstalledAddons from '../../../helpers/AddonInstaller/getInstalledAddons';
import Constants from '../../../data/Constants.json';
import Loading from '../../Loading';

export default function InstalledLiveries(props) {
  const [installedLiveries, setInstalledLiveries] = useState(undefined);
  const [refreshing, setRefreshing] = useState(false);

  const { fileListing, UpdateFileList, justRefreshed, setJustRefreshed } = props;

  if (typeof installedLiveries === 'undefined') {
    setInstalledLiveries(null);
    GetInstalledAddons()
      .then(liveries => setInstalledLiveries(liveries))
      .catch(e => setInstalledLiveries(e));
  }

  if (typeof fileListing === 'undefined') {
    return (
      <>
        <RefreshBox justRefreshed={true} lastCheckedTime={'checking now...'} />
        <Loading />
      </>
    );
  } else if (refreshing) {
    return (
      <>
        <RefreshBox justRefreshed={true} lastCheckedTime={'refreshing...'} />
        <Loading />
      </>
    );
  }

  return (
    <Box>
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
        refreshInterval={Constants.refreshInterval}
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
};
