import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Checkbox, Collapse, Divider, IconButton, ListItem, ListItemIcon, ListItemText, makeStyles, Tooltip } from '@material-ui/core';
import ExpandMoreIcon from 'mdi-react/ExpandMoreIcon';

import FieldValueDisplay from '../../FieldValueDisplay';
import InstalledBadge from './InstalledBadge';
import UpdateAvailableBadge from './UpdateAvailableBadge';

import Constants from '../../../data/Constants.json';
import NoImagePng from '../../../images/no-image-available.png';

import clsx from 'clsx';
import LocaleContext from '../../../locales/LocaleContext';

const useStyles = makeStyles(theme => ({
  expandIcon: {
    transition: 'transform 200ms ease-out',
  },
  expandIconExpanded: {
    transform: 'rotate(180deg)',
  },
  liveryInfoContainer: {
    padding: theme.spacing(2),
    display: 'flex',
  },
  checksum: {
    borderBottom: '#aaaa dotted 2px',
    cursor: 'help',
  },
  thumbnail: {
    padding: theme.spacing(),
    flexGrow: 1,
    '& img': {
      display: 'block',
      maxHeight: 400,
      width: '100%',
      objectFit: 'contain',
    },
  },
}));

export default function ListRow(props) {
  const { livery, AddSelectedLivery, RemoveSelectedLivery, disabled, isInstalled, isSelected, updateAvailable } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const classes = useStyles();

  async function ToggleCheckbox(e) {
    // Don't edit the list if it's disabled! (Duh!!)
    if (disabled) return;

    e.stopPropagation();
    e.preventDefault();

    if (!isSelected) {
      console.log('Adding livery ', livery.fileName);
      AddSelectedLivery(livery);
    } else {
      console.log('Removing livery ', livery.fileName);
      RemoveSelectedLivery(livery);
    }
  }

  const CurrentLocale = React.useContext(LocaleContext);

  return (
    <>
      <ListItem button disableRipple onClick={isInstalled ? null : ToggleCheckbox}>
        <ListItemIcon>
          <Checkbox
            disabled={disabled || isInstalled}
            color="primary"
            edge="start"
            checked={isSelected || isInstalled}
            onChange={isInstalled ? null : ToggleCheckbox}
          />
        </ListItemIcon>
        <ListItemText primary={livery.fileName.substr(livery.fileName.lastIndexOf('/') + 1).split('.zip')[0]} />
        {isInstalled && (updateAvailable ? <UpdateAvailableBadge /> : <InstalledBadge />)}
        <Tooltip
          title={
            !isExpanded
              ? CurrentLocale.translate('manager.pages.available_liveries.components.livery_row.expand_livery_details_tooltip')
              : CurrentLocale.translate('manager.pages.available_liveries.components.livery_row.shrink_livery_details_tooltip')
          }
        >
          <IconButton
            centerRipple
            onClick={e => {
              e.stopPropagation();
              setIsExpanded(e => !e);
            }}
          >
            <ExpandMoreIcon className={clsx(classes.expandIcon, { [classes.expandIconExpanded]: isExpanded })} />
          </IconButton>
        </Tooltip>
      </ListItem>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box component="article" className={classes.liveryInfoContainer}>
          <FieldValueDisplay
            fieldName={CurrentLocale.translate('manager.pages.available_liveries.components.livery_row.info_fields.version.title')}
            value={
              <Tooltip title={CurrentLocale.translate('manager.pages.available_liveries.components.livery_row.info_fields.version.tooltip')}>
                {/* Display first 8 chars of checksum */}
                <span className={classes.checksum}>{livery.checkSum.substr(0, 8)}</span>
              </Tooltip>
            }
          />
          <FieldValueDisplay
            titleProps={{ style: { textAlign: 'center' } }}
            fieldName={CurrentLocale.translate('manager.pages.available_liveries.components.livery_row.info_fields.thumbnail.title')}
            value={
              <Box component="figure" className={classes.thumbnail}>
                <img
                  draggable="false"
                  src={`${Constants.urls.cdnEndpoint}/${livery.image || livery.smallImage}`}
                  onError={function (e) {
                    // set src to 'no image' image if the thumb fails to load
                    if (e.currentTarget.getAttribute('src') !== NoImagePng) e.currentTarget.setAttribute('src', NoImagePng);
                  }}
                />
              </Box>
            }
          />
        </Box>
        <Divider />
      </Collapse>
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
  AddSelectedLivery: PropTypes.func.isRequired,
  RemoveSelectedLivery: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isInstalled: PropTypes.bool,
  updateAvailable: PropTypes.bool,
  isSelected: PropTypes.bool,
};
