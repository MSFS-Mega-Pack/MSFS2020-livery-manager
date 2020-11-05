import React from 'react';
import PropTypes from 'prop-types';

import { Virtuoso } from 'react-virtuoso';
import { List } from '@material-ui/core';

import ListRow from './ListRow';

import GetIndexOfLiveryInArray from '../../../helpers/GetIndexOfLiveryInArray';

export default function LiveryList(props) {
  const { installedLiveries, deleteLivery, liveryData, fileListing } = props;
  return (
    <List dense>
      <Virtuoso
        totalCount={installedLiveries.length}
        style={{ height: 375 }}
        item={i => {
          const livery = installedLiveries[i];

          /* eslint-disable-next-line no-unused-vars */
          const [_, msg] = GetIndexOfLiveryInArray(livery, fileListing.data.fileList);

          return (
            <ListRow
              key={`${livery.fileName}__${livery.checkSum}`}
              livery={livery}
              updateAvailable={msg === 'differentHash'}
              deleteLivery={deleteLivery}
              beingDeleted={GetIndexOfLiveryInArray(livery, liveryData.deleting)[0] !== -1}
              newLiveryObject={fileListing.data.fileList[_]}
            />
          );
        }}
      />
    </List>
  );
}

const CustomPropTypes = {
  Livery: PropTypes.shape({
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
  }),
};

LiveryList.propTypes = {
  installedLiveries: PropTypes.arrayOf(
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
  ).isRequired,
  deleteLivery: PropTypes.func.isRequired,
  liveryData: PropTypes.shape({
    disabled: PropTypes.arrayOf(CustomPropTypes.Livery),
    deleting: PropTypes.arrayOf(CustomPropTypes.Livery),
    updating: PropTypes.arrayOf(CustomPropTypes.Livery),
    selected: PropTypes.arrayOf(CustomPropTypes.Livery),
    RefreshInstalledLiveries: PropTypes.func,
  }),
  fileListing: PropTypes.arrayOf(CustomPropTypes.Livery),
};
