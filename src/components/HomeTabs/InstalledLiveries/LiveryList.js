import React from 'react';
import PropTypes from 'prop-types';

import { Virtuoso } from 'react-virtuoso';
import { List } from '@material-ui/core';

import ListRow from './ListRow';

import GetIndexOfLiveryInArray from '../../../helpers/GetIndexOfLiveryInArray';

export default function LiveryList(props) {
  const { liveries, installedLiveries } = props;

  return (
    <List dense>
      <Virtuoso
        totalCount={liveries.length}
        style={{ height: 375 }}
        item={i => {
          const livery = liveries[i];

          const [index, msg] = GetIndexOfLiveryInArray(livery, installedLiveries);

          return <ListRow key={`${livery.fileName}__${livery.checkSum}`} livery={livery} updateAvailable={msg === 'differentHash'} />;
        }}
      />
    </List>
  );
}

LiveryList.propTypes = {
  liveries: PropTypes.arrayOf(
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
};
