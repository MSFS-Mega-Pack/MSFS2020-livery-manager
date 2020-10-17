import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { IconButton, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import BinIcon from 'mdi-react/TrashCanOutlineIcon';
import UpdateIcon from 'mdi-react/DownloadOutlineIcon';
import { useSnackbar } from 'notistack';

// seconds the button must be help for to remove the liv
const HoldToRemoveTime = 2.0;

const locale = {
  help: {
    tooltip: {
      update: 'Update livery',
      delete: 'Remove livery',
      delete_timer: 'Hold for %0s to remove',
    },
    snackbar: {
      hold_to_remove: 'To remove a livery, click and hold its delete button for %0 seconds',
    },
  },
};

export default function ListRow(props) {
  const { livery, updateAvailable } = props;

  const removeButton = useRef(null);
  const handles = useRef({ timeout: null, interval: null, timeRemaining: HoldToRemoveTime });

  const [deleteTooltipText, setDeleteTooltipText] = useState(locale.help.tooltip.delete);
  const [isDisabled, setIsDisabled] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let startedDeleting = false;

    function RemoveBtnMouseDown() {
      handles.current.timeout = setTimeout(() => {
        if (!startedDeleting) {
          startedDeleting = true;
          alert('2s');
          startedDeleting = false;
        }
      }, 2000);

      handles.current.interval = setInterval(() => {
        handles.current.timeRemaining -= 0.1;
        if (handles.current.timeRemaining < 0) {
          handles.current.timeRemaining = 0;
          clearInterval(handles.current.interval);
          return;
        }

        console.log('update text');
        setDeleteTooltipText(locale.help.tooltip.delete_timer.replace(/%0/, handles.current.timeRemaining.toFixed(1).toString()));
      }, 100);
    }

    function RemoveBtnMouseUp() {
      console.log('Clears');
      clearTimeout(handles.current.timeout);
      clearInterval(handles.current.interval);

      // show help snackbar if user did a normal click
      if (handles.current.timeRemaining > 1.5) {
        enqueueSnackbar(locale.help.snackbar.hold_to_remove.replace(/%0/, HoldToRemoveTime.toFixed(1).toString()), { variant: 'info' });
      }
    }

    if (removeButton && removeButton.current) {
      removeButton.current.addEventListener('mousedown', RemoveBtnMouseDown);
      removeButton.current.addEventListener('mouseup', RemoveBtnMouseUp);
      removeButton.current.addEventListener('mouseleave', RemoveBtnMouseUp);
    }

    return function () {
      removeButton.current.removeEventListener('mousedown', RemoveBtnMouseDown);
      removeButton.current.removeEventListener('mouseup', RemoveBtnMouseUp);
      removeButton.current.removeEventListener('mouseleave', RemoveBtnMouseUp);
    };
  });

  console.log(deleteTooltipText);

  return (
    <>
      <ListItem>
        <ListItemText primary={livery.fileName.substr(livery.fileName.indexOf('/') + 1).split('.zip')[0]} />
        {updateAvailable && (
          <Tooltip title={locale.help.tooltip.update}>
            <IconButton color="primary">
              <UpdateIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={deleteTooltipText}>
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
