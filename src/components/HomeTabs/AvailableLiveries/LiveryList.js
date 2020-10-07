import React from 'react';
import PropTypes from 'prop-types';

import { Virtuoso } from 'react-virtuoso';
import { List } from '@material-ui/core';

import ListRow from './ListRow';

import GetIndexOfLiveryInArray from '../../../helpers/GetIndexOfLiveryInArray';

export default function LiveryList(props) {
  const { liveries, GetIndexOfObjectInArray, AddSelectedLivery, RemoveSelectedLivery, disabled, installedLiveries } = props;

  return (
    <List dense>
      <Virtuoso
        totalCount={liveries.length}
        style={{ height: 350 }}
        item={i => {
          const liv = liveries[i];

          const [index, msg] = GetIndexOfLiveryInArray(liv, installedLiveries);

          return (
            <ListRow
              key={`${liv.fileName}__${liv.checkSum}`}
              livery={liv}
              GetIndexOfObjectInArray={GetIndexOfObjectInArray}
              AddSelectedLivery={AddSelectedLivery}
              RemoveSelectedLivery={RemoveSelectedLivery}
              disabled={disabled}
              isInstalled={index !== -1}
              updateAvailable={msg === 'differentHash'}
            />
          );
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
  GetIndexOfObjectInArray: PropTypes.func.isRequired,
  AddSelectedLivery: PropTypes.func.isRequired,
  RemoveSelectedLivery: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
