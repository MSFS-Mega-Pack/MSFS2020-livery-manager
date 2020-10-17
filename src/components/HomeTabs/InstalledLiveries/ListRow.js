import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { IconButton, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import BinIcon from 'mdi-react/TrashCanOutlineIcon';
import UpdateIcon from 'mdi-react/DownloadOutlineIcon';
import { useSnackbar } from 'notistack';

export default function ListRow(props) {
  const { livery, updateAvailable } = props;

  const removeButton = useRef(null);
  const [deleteTooltipText, setDeleteTooltipText] = useState('Remove');
  const [isDisabled, setisDisabled] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let timeout,
      interval,
      timeRemaining = 2.0;
    let startedDeleting = false;

    function RemoveBtnMouseDown() {
      timeout = setTimeout(() => {
        if (!startedDeleting) {
          startedDeleting = true;
          alert('2s');
          startedDeleting = false;
        }
      }, 2000);

      interval = setInterval(() => {
        timeRemaining -= 0.1;
        if (timeRemaining < 0) {
          timeRemaining = 0;
          clearInterval(interval);
          return;
        }

        console.log('update text');
        setDeleteTooltipText(`Hold for ${timeRemaining.toFixed(1)}s`);
      }, 100);
    }

    function RemoveBtnMouseUp() {
      clearTimeout(timeout);
      clearInterval(interval);
    }
    function RemoveBtnClick() {
      enqueueSnackbar('To remove a livery, click and hold the button');
    }

    if (removeButton && removeButton.current) {
      removeButton.current.addEventListener('mousedown', RemoveBtnMouseDown);
      removeButton.current.addEventListener('mouseup', RemoveBtnMouseUp);
    }

    return function () {
      removeButton.current.removeEventListener('mousedown', RemoveBtnMouseDown);
      removeButton.current.removeEventListener('mouseup', RemoveBtnMouseUp);
    };
  });

  console.log(deleteTooltipText);

  return (
    <>
      <ListItem>
        <ListItemText primary={livery.fileName.substr(livery.fileName.indexOf('/') + 1).split('.zip')[0]} />
        {updateAvailable && (
          <Tooltip title={deleteTooltipText}>
            <IconButton color="primary">
              <UpdateIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={'Remove'}>
          <IconButton ref={removeButton} color="primary">
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
