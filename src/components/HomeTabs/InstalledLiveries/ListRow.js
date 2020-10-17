import React from 'react';
import PropTypes from 'prop-types';

import { IconButton, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import BinIcon from 'mdi-react/TrashCanOutlineIcon';
import UpdateIcon from 'mdi-react/DownloadOutlineIcon';

export default function ListRow(props) {
  const { livery, updateAvailable } = props;

  return (
    <>
      <ListItem>
        <ListItemText primary={livery.fileName.substr(livery.fileName.indexOf('/') + 1).split('.zip')[0]} />
        {updateAvailable && (
          <Tooltip title={'Update'}>
            <IconButton
              color="primary"
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <UpdateIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={'Remove'}>
          <IconButton
            color="primary"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <BinIcon />
          </IconButton>
        </Tooltip>
      </ListItem>
    </>
  );
}

ListRow.propTypes = {
  livery: PropTypes.shape({
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
  }).isRequired,
  updateAvailable: PropTypes.bool,
};
