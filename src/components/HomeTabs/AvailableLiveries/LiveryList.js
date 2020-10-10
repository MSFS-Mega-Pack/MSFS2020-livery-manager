import React from 'react';
import PropTypes from 'prop-types';

import { Virtuoso } from 'react-virtuoso';
import { List, makeStyles } from '@material-ui/core';

import ListRow from './ListRow';

import GetIndexOfLiveryInArray from '../../../helpers/GetIndexOfLiveryInArray';

const useStyles = makeStyles({
  virtualList: {
    height: 350,
  },
});

export default function LiveryList(props) {
  const { liveries, AddSelectedLivery, RemoveSelectedLivery, disabled, installedLiveries, selectedLiveries } = props;

  const classes = useStyles();

  return (
    <List dense>
      <Virtuoso
        totalCount={liveries.length}
        className={classes.virtualList}
        item={i => {
          const livery = liveries[i];

          const [index, msg] = GetIndexOfLiveryInArray(livery, installedLiveries);

          return (
            <ListRow
              key={`${livery.fileName}__${livery.checkSum}`}
              livery={livery}
              AddSelectedLivery={AddSelectedLivery}
              RemoveSelectedLivery={RemoveSelectedLivery}
              disabled={disabled}
              isInstalled={index !== -1}
              isSelected={GetIndexOfLiveryInArray(livery, selectedLiveries)[0] !== -1}
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
  selectedLiveries: PropTypes.arrayOf(
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
  AddSelectedLivery: PropTypes.func.isRequired,
  RemoveSelectedLivery: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
