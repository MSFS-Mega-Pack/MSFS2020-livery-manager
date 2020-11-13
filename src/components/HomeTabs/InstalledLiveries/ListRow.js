import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, CircularProgress, IconButton, ListItem, ListItemText, makeStyles, Tooltip } from '@material-ui/core';
import BinIcon from 'mdi-react/TrashCanOutlineIcon';
import UpdateIcon from 'mdi-react/CloudDownloadOutlineIcon';

import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import LocaleContext from '../../../locales/LocaleContext';

import InstallAddon from '../../../helpers/AddonInstaller/InstallAddon';

const useStyles = makeStyles({
  root: {
    transition: 'background-color 200ms ease-out',
    '&:not([disabled]):hover': {
      backgroundColor: 'rgba(128, 128, 128, 0.1)',
    },
  },
  deleteButtonProgress: {
    position: 'absolute',
    left: '-50%',
    top: '-50%',
  },
  deleteButtonIcon: {
    position: 'absolute',
    left: 0,
    transition: 'color 200ms ease-out, opacity 200ms ease-out',
  },
  deleteButtonInProgress: {
    color: '#fff',
    opacity: 0.4,
  },
});

// seconds the button must be help for to remove the liv
const HoldToRemoveTime = 1.5;

export default function ListRow(props) {
  const { livery, updateAvailable, deleteLivery, beingDeleted, newLiveryObject, beingUpdated, /*selected,*/ RefreshAllData } = props;

  /**
   * @callback UpdateLiveryData
   * @param {"disabled"|"deleting"|"updating"|"selected"} arrayName Name of liveryData array
   * @param {Object} livery Livery to add/remove
   */

  /** @type {{ add: UpdateLiveryData, remove: UpdateLiveryData }} */
  const { add: AddLiveryToData, remove: RemoveLiveryFromData } = props.liveryDataFuncs;

  const classes = useStyles();

  const removeButton = useRef(null);
  const handles = useRef({ timeout: null, interval: null });

  const [timeRemaining, setTimeRemaining] = useState(HoldToRemoveTime);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const CurrentLocale = React.useContext(LocaleContext);

  useEffect(() => {
    let startedDeleting = false;
    /**
     * @param {MouseEvent} e
     */
    function RemoveBtnMouseDown(e) {
      // ignore non-LMB presses
      if (e.button !== 0) return;

      handles.current.timeout = setTimeout(() => {
        if (!startedDeleting && !beingUpdated) {
          startedDeleting = true;

          console.log(`DELETING LIVERY`, livery.fileName);
          deleteLivery(livery);

          clearTimeout(handles.current.timeout);
          clearInterval(handles.current.interval);
          handles.current.timeout = handles.current.interval = null;

          startedDeleting = false;
        }
      }, 2000);

      setTimeRemaining(t => t - 0.1);

      handles.current.interval = setInterval(() => {
        setTimeRemaining(t => (t >= 0 ? t - 0.1 : 0));

        if (timeRemaining <= 0) {
          clearInterval(handles.current.interval);
          handles.current.interval = null;
          return;
        }
      }, 100);
    }

    function RemoveBtnMouseUp() {
      if (timeRemaining < HoldToRemoveTime) {
        // show help snackbar if user did a normal click
        if (timeRemaining > HoldToRemoveTime - 0.5) {
          enqueueSnackbar(
            CurrentLocale.translate('manager.pages.installed_liveries.components.list_row.help.snackbar.hold_to_remove', {
              time: HoldToRemoveTime.toFixed(1),
            }),
            {
              variant: 'info',
            }
          );
        }

        clearTimeout(handles.current.timeout);
        clearInterval(handles.current.interval);
        handles.current.timeout = handles.current.interval = null;

        setTimeRemaining(HoldToRemoveTime);
      }
    }

    if (!beingDeleted) {
      if (removeButton && removeButton.current) {
        removeButton.current.addEventListener('mousedown', RemoveBtnMouseDown);
        removeButton.current.addEventListener('mouseup', RemoveBtnMouseUp);
        removeButton.current.addEventListener('mouseleave', RemoveBtnMouseUp);
      }
    } else {
      removeButton.current.removeEventListener('mousedown', RemoveBtnMouseDown);
      removeButton.current.removeEventListener('mouseup', RemoveBtnMouseUp);
      removeButton.current.removeEventListener('mouseleave', RemoveBtnMouseUp);
      clearTimeout(handles.current.timeout);
      clearInterval(handles.current.interval);
    }

    return function () {
      removeButton.current.removeEventListener('mousedown', RemoveBtnMouseDown);
      removeButton.current.removeEventListener('mouseup', RemoveBtnMouseUp);
      removeButton.current.removeEventListener('mouseleave', RemoveBtnMouseUp);
    };
  });

  return (
    <>
      <ListItem className={classes.root} disabled={beingDeleted}>
        <ListItemText primary={livery.fileName.substr(livery.fileName.lastIndexOf('/') + 1).split('.zip')[0]} />
        {updateAvailable && (
          <span>
            <Button
              startIcon={<UpdateIcon />}
              disabled={beingUpdated || beingDeleted}
              variant="outlined"
              onClick={async () => {
                AddLiveryToData('updating', livery);

                let s = enqueueSnackbar(
                  CurrentLocale.translate('manager.pages.installed_liveries.progress_notifications.begin_update', { total: 1 }),
                  {
                    variant: 'info',
                    persist: true,
                  }
                );

                let failed = false;

                try {
                  await InstallAddon(newLiveryObject, 0, 1, CurrentLocale, message => {
                    closeSnackbar(s);
                    s = enqueueSnackbar(message, {
                      variant: 'info',
                      persist: true,
                    });
                  });
                } catch (e) {
                  failed = true;
                  console.log('failed!', e);
                }

                closeSnackbar(s);

                if (failed) {
                  enqueueSnackbar(
                    CurrentLocale.translate('manager.pages.installed_liveries.progress_notifications.update_failed', {
                      fails: 1,
                    }),
                    { variant: 'error', persist: false }
                  );
                } else {
                  enqueueSnackbar(
                    CurrentLocale.translate('manager.pages.installed_liveries.progress_notifications.update_complete', {
                      total: 1,
                    }),
                    { variant: 'success', persist: false }
                  );
                }

                RemoveLiveryFromData('updating', livery);
                RefreshAllData();
              }}
              color="primary"
            >
              {CurrentLocale.translate('manager.pages.installed_liveries.components.list_row.update.button')}
            </Button>
          </span>
        )}

        <Tooltip
          title={
            timeRemaining === HoldToRemoveTime
              ? CurrentLocale.translate('manager.pages.installed_liveries.components.list_row.help.tooltip.delete')
              : CurrentLocale.translate('manager.pages.installed_liveries.components.list_row.help.tooltip.delete_timer', {
                  time: timeRemaining <= 0 ? '0.0' : timeRemaining.toFixed(1).toString(),
                })
          }
        >
          <span>
            <IconButton disabled={beingUpdated || beingDeleted} ref={removeButton} color="primary">
              <Box position="relative" width={24} height={24}>
                <CircularProgress
                  className={classes.deleteButtonProgress}
                  size={48}
                  variant={beingDeleted ? 'indeterminate' : 'static'}
                  value={((HoldToRemoveTime - (timeRemaining <= 0 ? 0 : timeRemaining)) / HoldToRemoveTime) * 100}
                />
                <BinIcon
                  className={clsx(classes.deleteButtonIcon, {
                    [classes.deleteButtonInProgress]: timeRemaining < HoldToRemoveTime,
                  })}
                />
              </Box>
            </IconButton>
          </span>
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
  updateAvailable: PropTypes.bool.isRequired,
  beingDeleted: PropTypes.bool.isRequired,
  beingUpdated: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  deleteLivery: PropTypes.func.isRequired,
  newLiveryObject: PropTypes.arrayOf(ListRow.livery),
  liveryDataFuncs: PropTypes.shape({
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }),
  RefreshAllData: PropTypes.func.isRequired,
};

ListRow.defaultProps = {
  updateAvailable: false,
  beingDeleted: false,
};
